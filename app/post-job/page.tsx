import { JobPostForm } from "@/components/job-post-form"

export const metadata = {
  title: "Post a Job | Job Board",
  description: "Post a new job listing on our job board",
}

export default function PostJobPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white py-12 md:py-24">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Post a <span className="text-emerald-600">Job</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mb-8">
            Reach thousands of qualified candidates by posting your job on our platform.
          </p>
        </div>
      </div>
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <JobPostForm />
        </div>
      </main>
    </div>
  )
}
