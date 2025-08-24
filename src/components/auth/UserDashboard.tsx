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
      toast.success('Email actualizat cu succes')
      setNewEmail('')
    } catch (err) {
      toast.error('Actualizarea email-ului a eșuat')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPassword || newPassword.length < 6) {
      toast.error('Parola trebuie să aibă cel puțin 6 caractere')
      return
    }

    setLoading(true)
    try {
      await updateUserPassword(newPassword)
      toast.success('Parola a fost actualizată cu succes')
      setNewPassword('')
    } catch (err) {
      console.error(err)
      toast.error('Actualizarea parolei a eșuat. Este posibil să fie nevoie să vă autentificați din nou.')
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
      toast.success('Profil actualizat cu succes')
    } catch (err) {
      toast.error('Actualizarea profilului a eșuat')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyEmail = async () => {
    if (!user) return
    setLoading(true)
    try {
      await sendEmailVerification(user)
      toast.success('Email de verificare trimis')
    } catch (err) {
      toast.error('Trimiterea email-ului de verificare a eșuat')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Deconectare reușită')
    } catch (err) {
      toast.error('Deconectarea a eșuat')
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 space-y-6 p-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Profilul meu</h2>
        <p className="text-muted-foreground">{user?.displayName}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informații cont</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm">Nume afișat</Label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Nume afișat"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm">Email</Label>
              <p className="text-lg">{user?.email}</p>
            </div>
            <div>
              <Label className="text-sm">Status email</Label>
              <p className={user?.emailVerified ? "text-green-600" : "text-red-600"}>
                {user?.emailVerified ? 'Verificat ✓' : 'Neverificat'}
              </p>
            </div>
            <div>
              <Label className="text-sm">Cont creat la</Label>
              <p className="text-sm">
                {user?.metadata?.creationTime ? new Date(user.metadata.creationTime)
                  .toLocaleDateString('ro-RO', {
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
              Salvează modificările
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Securitate</CardTitle>
            <CardDescription>
              Actualizează datele de autentificare
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleEmailUpdate} className="space-y-2">
              <Label>Email nou</Label>
              <Input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="email@exemplu.com"
              />
              <Button
                type="submit"
                disabled={loading || !newEmail}
                className="w-full"
              >
                Actualizează email
              </Button>
            </form>

            <form onSubmit={handlePasswordUpdate} className="space-y-2">
              <Label>Parolă nouă</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minim 6 caractere"
                minLength={6}
              />
              <Button
                type="submit"
                disabled={loading || !newPassword || newPassword.length < 6}
                className="w-full"
              >
                {loading ? 'Se actualizează...' : 'Schimbă parola'}
              </Button>
            </form>

            <Button
              variant="outline"
              disabled={loading || user?.emailVerified}
              onClick={handleVerifyEmail}
              className="w-full"
            >
              {user?.emailVerified ? 'Email verificat ✓' : 'Verifică email-ul'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[{
          title: 'Ultima autentificare',
          value: user?.metadata?.lastSignInTime ?
            new Date(user.metadata.lastSignInTime).toLocaleDateString('ro-RO') :
            'N/A',
          desc: 'data ultimei conectări'
        },
        {
          title: 'Status cont',
          value: user?.emailVerified ? 'Activ' : 'În așteptare',
          desc: user?.emailVerified ? 'Cont verificat' : 'Email neverificat'
        },
        {
          title: 'Sesiune',
          value: 'Activă',
          desc: 'Conectat acum'
        }].map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
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
        Deconectare
      </Button>
    </div>
  )
}