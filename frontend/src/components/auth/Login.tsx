import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link, useNavigate, useLocation } from "react-router"
import { toast } from "sonner"

export function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { signIn, signInWithGoogle, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || "/"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await signIn(email, password)
      toast.success("Autentificare reușită!")
      navigate(from)
    } catch (err: any) {
      toast.error(err.message || "Autentificare eșuată")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signInWithGoogle()
      toast.success("Autentificare cu Google reușită!")
      navigate(from)
    } catch (err: any) {
      if (err.message) {
        toast.error(err.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (user) {
    navigate(from)
    return null
  }

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-full max-w-md flex flex-col gap-8 p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Conectează-te</h2>
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
            disabled={isLoading}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Connecting..." : "Connect"}
          </Button>
        </form>

        <div className="relative my-4">
          <span className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </span>
          <span className="relative flex justify-center text-xs uppercase bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          {isLoading ? "Authenticating..." : "Connect with Google"}
        </Button>

        <p className="text-center text-sm">
          Don't have an account? <Link to="/auth/register" className="text-primary hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  )
}