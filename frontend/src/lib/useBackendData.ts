


interface BackendResponse {
  message: string
  mongoStatus: string
  collectionsCount: number
}

const fetchBackendData = async (): Promise<BackendResponse> => {
  const response = await fetch('/api/daily-tasks/stats')
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}

export { fetchBackendData }

