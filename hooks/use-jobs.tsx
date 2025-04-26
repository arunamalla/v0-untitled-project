import useSWR from "swr"
import type { Job } from "@/types/job"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useJobs() {
  const { data, error, isLoading } = useSWR<Job[]>("/api/jobs", fetcher, {
    refreshInterval: 60000, // Refresh every minute for real-time updates
    revalidateOnFocus: true,
  })

  return {
    jobs: data,
    isLoading,
    isError: error,
  }
}
