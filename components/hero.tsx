import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Hero() {
  return (
    <div className="bg-white py-12 md:py-24">
      <div className="container mx-auto px-4 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Find Your <span className="text-emerald-600">Dream Job</span> Today
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mb-8">
          Browse through hundreds of job listings updated in real-time from our WordPress backend.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
            <Link href="#job-listings">Browse Jobs</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/categories">Explore Categories</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
