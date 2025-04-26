import { getJob } from "@/lib/wordpress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Building, Briefcase, DollarSign, Clock } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { generateJobSchema } from "@/lib/schema"
import Script from "next/script"

interface JobPageProps {
  params: {
    slug: string
  }
}

export default async function JobPage({ params }: JobPageProps) {
  const job = await getJob(params.slug)

  if (!job) {
    notFound()
  }

  const formattedDate = formatDistanceToNow(new Date(job.date), { addSuffix: true })
  const jobSchema = generateJobSchema(job)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Add JSON-LD structured data for Google for Jobs */}
      <Script id="job-schema" type="application/ld+json">
        {JSON.stringify(jobSchema)}
      </Script>

      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <Link href="/" className="text-emerald-600 hover:text-emerald-700 mb-4 inline-block">
            ← Back to listings
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{job.title.rendered}</h1>
              <div className="flex items-center text-gray-500 mt-2">
                <Building className="h-5 w-5 mr-1" />
                <span className="mr-4">{job.meta.company || "Company Name"}</span>
                <MapPin className="h-5 w-5 mr-1" />
                <span>{job.meta.location || "Remote"}</span>
              </div>
            </div>

            <Button className="bg-emerald-600 hover:bg-emerald-700">Apply Now</Button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-semibold mb-6">Job Description</h2>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: job.content.rendered }} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Job Overview</h3>

              <div className="space-y-4">
                <div className="flex items-start">
                  <Briefcase className="h-5 w-5 text-emerald-600 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Job Type</p>
                    <p className="font-medium">{job.meta.job_type || "Full-time"}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <DollarSign className="h-5 w-5 text-emerald-600 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Salary</p>
                    <p className="font-medium">{job.meta.salary || "Competitive"}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-emerald-600 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{job.meta.location || "Remote"}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-emerald-600 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Posted</p>
                    <p className="font-medium">{formattedDate}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {job.categories_data?.map((category) => (
                  <Badge key={category.id} variant="outline" className="bg-gray-100">
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="bg-emerald-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Ready to apply?</h3>
              <p className="text-gray-600 mb-4">Submit your application now and take the next step in your career.</p>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Apply for this job</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
