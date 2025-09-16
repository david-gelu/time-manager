

interface DatabaseStats {
  collections: number
  documents: number
  dataSize: number
}

interface BackendResponse {
  message: string
  mongoStatus: string
  databaseStats: DatabaseStats
}

const fetchBackendData = async (): Promise<BackendResponse> => {
  const response = await fetch('/api/test')
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}

export { fetchBackendData }

