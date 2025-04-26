"use client"

import { useState } from "react"
import { useJobs } from "@/hooks/use-jobs"
import { JobCard } from "@/components/job-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Filter, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function JobListings() {
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("all")
  const { jobs, isLoading, isError } = useJobs()

  const filteredJobs = jobs?.filter((job) => {
    const matchesSearch =
      job.title.rendered.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.content.rendered.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = category === "all" || job.categories?.includes(Number.parseInt(category))

    return matchesSearch && matchesCategory
  })

  return (
    <div id="job-listings">
      <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search jobs..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-64">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="1">Technology</SelectItem>
                <SelectItem value="2">Marketing</SelectItem>
                <SelectItem value="3">Design</SelectItem>
                <SelectItem value="4">Finance</SelectItem>
                <SelectItem value="5">Healthcare</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Filter className="h-4 w-4 mr-2" /> Filter
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6">
                <Skeleton className="h-7 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <div className="flex gap-2 mb-4">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <Skeleton className="h-10 w-full mt-4" />
              </div>
            ))}
        </div>
      ) : isError ? (
        <div className="text-center py-12">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              There was a problem loading the job listings. This could be because the WordPress API is not properly
              configured yet.
            </AlertDescription>
          </Alert>
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-4">Sample Job Listings</h3>
            <p className="text-gray-600 mb-6">
              While we're setting up the connection to your WordPress site, here are some sample job listings:
            </p>
            <div className="space-y-4">
              {[
                { title: "Frontend Developer", company: "Tech Solutions", location: "Remote" },
                { title: "Marketing Manager", company: "Growth Co", location: "New York, NY" },
                { title: "UX Designer", company: "Creative Agency", location: "San Francisco, CA" },
              ].map((job, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h4 className="font-medium">{job.title}</h4>
                  <div className="text-sm text-gray-500 mt-1">
                    {job.company} • {job.location}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Button onClick={() => window.location.reload()} className="mt-6">
            Try Again
          </Button>
        </div>
      ) : !jobs || jobs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-4">No Job Listings Found</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            It looks like there are no job listings available yet. This could be because your WordPress site doesn't
            have the jobs custom post type set up, or there are no jobs published.
          </p>
          <div className="bg-emerald-50 p-6 rounded-lg max-w-xl mx-auto">
            <h4 className="font-medium mb-2">WordPress Setup Tips:</h4>
            <ul className="text-left text-sm space-y-2">
              <li>• Ensure you have a custom post type called "jobs" in WordPress</li>
              <li>• Make sure the REST API is enabled for this post type</li>
              <li>• Check that you have published some job posts</li>
              <li>• Verify the WordPress URL in your configuration</li>
            </ul>
          </div>
        </div>
      ) : (
        <>
          <p className="mb-6 text-gray-600">{filteredJobs?.length || 0} jobs found</p>
          {filteredJobs?.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-xl text-gray-600 mb-4">No jobs match your search criteria</p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setCategory("all")
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs?.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
