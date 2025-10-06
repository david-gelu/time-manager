import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link, useNavigate } from "react-router"
import { toast } from "sonner"

export function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { signUp, signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error("Parolele nu coincid")
      return
    }

    if (password.length < 6) {
      toast.error("Parola trebuie să aibă cel puțin 6 caractere")
      return
    }

    setIsLoading(true)

    try {
      await signUp(email, password)
      toast.success("Cont creat cu succes!")
      navigate("/")
    } catch (err: any) {
      toast.error(err.message || "Nu s-a putut crea contul")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signInWithGoogle()
      toast.success("Autentificare cu Google reușită!")
      navigate('/')
    } catch (err: any) {
      if (err.message) {
        toast.error(err.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Creează un cont nou</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
          <Input
            type="password"
            placeholder="Parolă"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            disabled={isLoading}
          />
          <Input
            type="password"
            placeholder="Confirmă parola"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            disabled={isLoading}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Se creează..." : "Crează cont"}
          </Button>
        </form>

        <div className="relative my-4">
          <span className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </span>
          <span className="relative flex justify-center text-xs uppercase bg-background px-2 text-muted-foreground">
            Sau continuă cu
          </span>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          {isLoading ? "Se autentifică..." : "Continuă cu Google"}
        </Button>

        <p className="text-center text-sm">
          Ai deja un cont? <Link to="/auth/login" className="text-primary hover:underline">Conectează-te</Link>
        </p>
      </div>
    </div>
  )
}