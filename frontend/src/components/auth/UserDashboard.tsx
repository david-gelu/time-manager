import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Label } from '../ui/label'
import { toast } from 'sonner'
import {
  sendEmailVerification,
  updateProfile,
  type User
} from 'firebase/auth'

export function UserDashboard() {
  const { user, updateUserEmail, updateUserPassword, logout } = useAuth()
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [displayName, setDisplayName] = useState(user?.displayName || '')
  const [loading, setLoading] = useState(false)

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await updateUserEmail(newEmail)
      toast.success('Email successfully updated')
      setNewEmail('')
    } catch (err) {
      toast.error('Email update failed')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      await updateUserPassword(newPassword)
      toast.success('Password successfully updated')
      setNewPassword('')
    } catch (err) {
      console.error(err)
      toast.error('Password update failed. You may need to sign in again.')
    } finally {
      setLoading(false)
    }
  }

  const handleProfileUpdate = async () => {
    setLoading(true)
    try {
      await updateProfile(user as User, {
        displayName: displayName
      })
      toast.success('Profile successfully updated')
    } catch (err) {
      toast.error('Profile update failed')
    } finally {
      window.location.reload()
      setLoading(false)
    }
  }

  const handleVerifyEmail = async () => {
    if (!user) return
    setLoading(true)
    try {
      await sendEmailVerification(user)
      toast.success('Verification email sent')
    } catch (err) {
      toast.error('Sending verification email failed')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Successfully logged out')
    } catch (err) {
      toast.error('Logout failed')
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8  flex flex-col gap-6 p-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Profile</h2>
        <p className="text-muted-foreground">{user?.displayName}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm">Display Name</Label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Display name"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm">Email</Label>
              <p className="text-lg">{user?.email}</p>
            </div>
            <div>
              <Label className="text-sm">Email status</Label>
              <p className={user?.emailVerified ? "text-green-600" : "text-red-600"}>
                {user?.emailVerified ? '✅ Verified' : '❌ Not verified'}
              </p>
            </div>
            <div>
              <Label className="text-sm">Account created at</Label>
              <p className="text-sm">
                {user?.metadata?.creationTime ? new Date(user.metadata.creationTime)
                  .toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : 'N/A'}
              </p>
            </div>
            <Button
              onClick={handleProfileUpdate}
              disabled={loading}
              className="w-full"
            >
              Save changes
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>
              Update your login details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleEmailUpdate} className="space-y-2">
              <Label>New Email</Label>
              <Input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="email@example.com"
              />
              <Button
                type="submit"
                disabled={loading || !newEmail}
                className="w-full"
              >
                Update email
              </Button>
            </form>

            <form onSubmit={handlePasswordUpdate} className="space-y-2">
              <Label>New Password</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                minLength={6}
              />
              <Button
                type="submit"
                disabled={loading || !newPassword || newPassword.length < 6}
                className="w-full"
              >
                {loading ? 'Updating...' : 'Change password'}
              </Button>
            </form>

            <Button
              variant="outline"
              disabled={loading || user?.emailVerified}
              onClick={handleVerifyEmail}
              className="w-full"
            >
              {user?.emailVerified ? 'Email verified ✓' : 'Verify email'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[{
          title: 'Last sign-in',
          value: user?.metadata?.lastSignInTime ?
            new Date(user.metadata.lastSignInTime).toLocaleDateString('en-US') :
            'N/A',
          desc: 'date of last login'
        },
        {
          title: 'Account status',
          value: user?.emailVerified ? 'Active' : 'Pending',
          desc: user?.emailVerified ? 'Account verified' : 'Email not verified'
        },
        {
          title: 'Session',
          value: 'Active',
          desc: 'Logged in now'
        }].map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-2">
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </p>
              <p className="text-xs text-muted-foreground">{stat.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        onClick={handleLogout}
        variant="destructive"
        className="w-full"
        disabled={loading}
      >
        Logout
      </Button>
    </div>
  )
}
