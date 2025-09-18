import { createContext, useContext, useState, useEffect } from 'react'
import {
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updatePassword,
  type User
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { toast } from 'sonner'

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  updateUserEmail: (newEmail: string) => Promise<void>
  updateUserPassword: (newPassword: string) => Promise<void>
  getIdToken: () => Promise<string | null>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth)
        if (result && result.user) {
          setUser(result.user)
          toast.success('Autentificare reușită cu Google')
          localStorage.setItem('user', JSON.stringify(result.user))
        }
      } catch (error: any) {
        console.error('Redirect result error:', error)
        toast.error('Autentificarea cu Google a eșuat')
      } finally {
        setLoading(false)
      }
    }
    handleRedirectResult()
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
      if (currentUser) {
        localStorage.setItem('user', JSON.stringify(currentUser))
      } else {
        localStorage.removeItem('user')
      }
    })
    return () => unsubscribe()
  }, [])

  const signUp = async (email: string, password: string) => {
    try {
      return await createUserWithEmailAndPassword(auth, email, password)
    } catch (error: any) {
      console.error('Signup error:', error.code, error.message)
      toast.error(error.message)
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password)
  }

  const logout = async () => {
    try {
      await signOut(auth)
      localStorage.removeItem('user')
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }

  const updateUserEmail = async (newEmail: string) => {
    if (!auth.currentUser) throw new Error('No user logged in')
    return updateEmail(auth.currentUser, newEmail)
  }

  const updateUserPassword = async (newPassword: string) => {
    if (!auth.currentUser) throw new Error('No user logged in')
    return updatePassword(auth.currentUser, newPassword)
  }

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    provider.addScope('https://www.googleapis.com/auth/userinfo.email')
    provider.addScope('https://www.googleapis.com/auth/userinfo.profile')

    try {
      await signInWithRedirect(auth, provider)
    } catch (error) {
      console.error('Google sign in error:', error)
      throw error
    }
  }

  const getIdToken = async (): Promise<string | null> => {
    if (!auth.currentUser) return null
    return auth.currentUser.getIdToken()
  }

  const value: AuthContextType = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    updateUserEmail,
    updateUserPassword,
    getIdToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
