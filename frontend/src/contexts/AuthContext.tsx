import { createContext, useContext, useState, useEffect } from 'react'
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updatePassword,
  type User
} from 'firebase/auth'
import { auth } from '@/lib/firebase'

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
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const signUp = async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      return result
    } catch (error: any) {
      console.error('Signup error:', error.code, error.message)

      let errorMessage = 'Nu s-a putut crea contul'
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Acest email este deja folosit'
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email invalid'
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Parola este prea slabă'
      }

      throw new Error(errorMessage)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      return result
    } catch (error: any) {
      console.error('Sign in error:', error.code, error.message)

      let errorMessage = 'Autentificare eșuată'
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Email sau parolă incorectă'
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email invalid'
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'Acest cont a fost dezactivat'
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Email sau parolă incorectă'
      }

      throw new Error(errorMessage)
    }
  }

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({
        prompt: 'select_account'
      })

      const result = await signInWithPopup(auth, provider)

      if (result.user) {
        setUser(result.user)
      }
    } catch (error: any) {
      console.error('Google sign in error:', error.code, error.message)

      let errorMessage = 'Autentificarea cu Google a eșuat'
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Fereastră închisă. Te rugăm să încerci din nou.'
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Pop-up blocat de browser. Te rugăm să permiți pop-up-urile.'
      } else if (error.code === 'auth/cancelled-popup-request') {
        return
      }

      throw new Error(errorMessage)
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }

  const updateUserEmail = async (newEmail: string) => {
    if (!auth.currentUser) throw new Error('Nu ești autentificat')
    return updateEmail(auth.currentUser, newEmail)
  }

  const updateUserPassword = async (newPassword: string) => {
    if (!auth.currentUser) throw new Error('Nu ești autentificat')
    return updatePassword(auth.currentUser, newPassword)
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