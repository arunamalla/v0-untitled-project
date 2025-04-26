import useSWR from "swr"
import type { Client } from "@/types/client"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useClients() {
  const { data, error, isLoading } = useSWR<Client[]>("/api/clients", fetcher, {
    refreshInterval: 60000, // Refresh every minute for real-time updates
    revalidateOnFocus: true,
  })

  return {
    clients: data,
    isLoading,
    isError: error,
  }
}
