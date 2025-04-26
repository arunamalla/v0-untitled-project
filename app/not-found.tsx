import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-emerald-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Job Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          The job listing you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
          <Link href="/">Back to Job Listings</Link>
        </Button>
      </div>
    </div>
  )
}
