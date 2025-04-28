"use client"

import { useState, useMemo } from "react"
import { useClients } from "@/hooks/use-clients"
import { ClientCard } from "@/components/client-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Filter, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const industries = ["technology", "healthcare", "finance", "education", "manufacturing"]
const locations = ["San Francisco", "Boston", "New York", "Chicago", "Los Angeles"]

export default function ClientListings() {
  const [searchTerm, setSearchTerm] = useState("")
  const [industry, setIndustry] = useState("all")
  const [location, setLocation] = useState("all")
  const { clients, isLoading, isError } = useClients()

  const filteredClients = useMemo(() => {
    return clients?.filter((client) => {
      const matchesSearch =
        client.title.rendered.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.content.rendered.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesIndustry = industry === "all" || client.meta?.industry?.toLowerCase() === industry.toLowerCase()

      const matchesLocation = location === "all" || client.meta?.location?.toLowerCase().includes(location.toLowerCase())

      return matchesSearch && matchesIndustry && matchesLocation
    })
  }, [clients, searchTerm, industry, location])

  return (
    <div id="client-listings">
      <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search clients..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger>
                <SelectValue placeholder="All Industries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                {industries.map((ind) => (
                  <SelectItem key={ind} value={ind}>{ind.charAt(0).toUpperCase() + ind.slice(1)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-48">
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger>
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                ))}
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
              There was a problem loading the client listings. Check if your WordPress API is properly configured.
            </AlertDescription>
          </Alert>
          <Button onClick={() => window.location.reload()} className="mt-6">
            Try Again
          </Button>
        </div>
      ) : !clients || clients.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-4">No Client Listings Found</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Looks like there are no client listings yet. Ensure your WordPress site has the right post types published.
          </p>
        </div>
      ) : (
        <>
          <p className="mb-6 text-gray-600">{filteredClients?.length || 0} clients found</p>
          {filteredClients?.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-xl text-gray-600 mb-4">No clients match your search criteria</p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setIndustry("all")
                  setLocation("all")
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClients.map((client) => (
                <ClientCard key={client.id} client={client} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
