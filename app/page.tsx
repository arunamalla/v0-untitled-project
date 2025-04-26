import JobListings from "@/components/job-listings"
import { Hero } from "@/components/hero"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      <main className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Latest Job Opportunities</h2>
        <JobListings />
      </main>
    </div>
  )
}
