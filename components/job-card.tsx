import Link from "next/link"
import Image from "next/image"
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

  // Check if job has an image from blob storage
  const hasJobImage = job.meta?.image_url && job.meta.image_url.includes("vercel-blob.com")

  // Check if job has a company logo from blob storage
  const hasCompanyLogo = job.meta?.logo_url && job.meta.logo_url.includes("vercel-blob.com")

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-full transition-all hover:shadow-md">
      {/* Show job image if available */}
      {hasJobImage && (
        <div className="relative h-40 w-full">
          <Image
            src={job.meta.image_url || "/placeholder.svg"}
            alt={job.title.rendered}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      <div className="p-6 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-2">
          {/* Show company logo if available */}
          {hasCompanyLogo ? (
            <div className="relative w-10 h-10 rounded-full overflow-hidden border">
              <Image
                src={job.meta.logo_url || "/placeholder.svg"}
                alt={job.meta?.company || "Company logo"}
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <Building className="h-10 w-10 text-emerald-600 p-2 bg-emerald-50 rounded-full" />
          )}

          <h3 className="text-xl font-semibold">
            <Link href={`/job/${job.slug}`} className="hover:text-emerald-600 transition-colors">
              {job.title.rendered}
            </Link>
          </h3>
        </div>

        <div className="flex items-center text-gray-500 mb-4 text-sm">
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
    </div>
  )
}
