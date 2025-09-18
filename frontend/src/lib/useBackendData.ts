import { auth } from "@/lib/firebase";

interface BackendResponse {
  message: string
  mongoStatus: string
  collectionsCount: number
}

const fetchBackendData = async (): Promise<BackendResponse> => {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("No user logged in");
  const response = await fetch('/api/daily-tasks/stats', {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}

export { fetchBackendData }

