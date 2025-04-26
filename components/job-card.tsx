import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Building } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { Job } from "@/types/job"

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  // Extract plain text from HTML content for the excerpt
  const getExcerpt = (html: string) => {
    try {
      // Only run this on the client side
      if (typeof document !== "undefined") {
        const tempDiv = document.createElement("div")
        tempDiv.innerHTML = html
        const text = tempDiv.textContent || tempDiv.innerText || ""
        return text.substring(0, 120) + (text.length > 120 ? "..." : "")
      }
      // Simple fallback for server-side rendering
      return html.replace(/<[^>]*>/g, "").substring(0, 120) + "..."
    } catch (error) {
      console.error("Error extracting excerpt:", error)
      return "View job details..."
    }
  }

  // Format the date with error handling
  const formattedDate = (() => {
    try {
      return formatDistanceToNow(new Date(job.date), { addSuffix: true })
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Recently"
    }
  })()

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col h-full transition-all hover:shadow-md">
      <h3 className="text-xl font-semibold mb-2">
        <Link href={`/job/${job.slug}`} className="hover:text-emerald-600 transition-colors">
          {job.title.rendered}
        </Link>
      </h3>

      <div className="flex items-center text-gray-500 mb-4 text-sm">
        <Building className="h-4 w-4 mr-1" />
        <span className="mr-4">{job.meta?.company || "Company Name"}</span>
        <MapPin className="h-4 w-4 mr-1" />
        <span>{job.meta?.location || "Remote"}</span>
      </div>

      <p className="text-gray-600 mb-4 flex-grow">{getExcerpt(job.content.rendered)}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {job.meta?.job_type && (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            {job.meta.job_type}
          </Badge>
        )}
        {job.meta?.salary && (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {job.meta.salary}
          </Badge>
        )}
      </div>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
        <div className="flex items-center text-gray-500 text-sm">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{formattedDate}</span>
        </div>
        <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
          <Link href={`/job/${job.slug}`}>View Job</Link>
        </Button>
      </div>
    </div>
  )
}
