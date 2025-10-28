import { useAuth } from "@/contexts/AuthContext"

export function useApi() {
  const { getIdToken } = useAuth()
  debugger
  const callProtectedApi = async () => {
    const token = await getIdToken()
    if (!token) throw new Error("No token found")

    const API_URL = import.meta.env.VITE_API_URL

    const response = await fetch(`${API_URL}/api/protected`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Unauthorized")
    }

    return response.json()
  }

  return { callProtectedApi }
}
