import useSWR from "swr"
import type { Job } from "@/types/job"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  const data = await res.json()

  // Check if the response contains an error but also fallback data
  if (data.error && data.fallbackData) {
    console.warn("Using fallback job data:", data.message)
    // Fetch fallback data from the server
    const fallbackRes = await fetch("/api/jobs/fallback")
    return fallbackRes.json()
  }

  return data
}

export function useJobs() {
  const { data, error, isLoading } = useSWR<Job[]>("/api/jobs", fetcher, {
    refreshInterval: 60000, // Refresh every minute for real-time updates
    revalidateOnFocus: true,
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      // Only retry up to 3 times
      if (retryCount >= 3) return

      // Retry after 5 seconds
      setTimeout(() => revalidate({ retryCount }), 5000)
    },
  })

  return {
    jobs: data,
    isLoading,
    isError: error,
  }
}
