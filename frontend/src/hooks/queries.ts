import { useQuery } from '@tanstack/react-query'
import { fetchBackendData } from './useBackendData'

export function useBackendData() {
  return useQuery({
    queryKey: ['backendData'],
    queryFn: fetchBackendData,
  })
}