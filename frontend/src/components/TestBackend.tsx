import { useBackendData } from "../lib/queries"

export function TestBackend() {
  const { data, isLoading, isError, error } = useBackendData()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error: {error instanceof Error ? error.message : 'Unknown error'}</div>
  }

  return (
    <div className="p-4 rounded-lg bg-background">
      <h2 className="text-xl font-bold mb-4">Backend Connection Test</h2>
      <div className="space-y-2">
        <p>Status: {data?.message}</p>
        <p>MongoDB: {data?.mongoStatus}</p>
        <div className="bg-muted p-4 rounded">
          <h3 className="font-semibold mb-2">Database Statistics</h3>
          <ul className="space-y-1">
            <li>Collections: {data?.collectionsCount}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}