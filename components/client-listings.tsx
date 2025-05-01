"use client"

import { useState } from "react"
import { useClients } from "@/hooks/use-clients"
import { ClientCard } from "@/components/client-card"
import { FacetedSearch } from "@/components/faceted-search"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import type { Client } from "@/types/client"

export default function ClientListings() {
  const { clients, isLoading, isError } = useClients()
  const [filteredClients, setFilteredClients] = useState<Client[]>([])

  // Generate facets from client data
  const generateFacets = (clientData: Client[] | undefined) => {
    if (!clientData || clientData.length === 0) return []

    // Extract unique industries
    const industries = new Set<string>()
    clientData.forEach((client) => {
      if (client.meta?.industry) {
        industries.add(client.meta.industry)
      }
    })

    // Extract unique categories
    const categoriesMap = new Map<number, { name: string; count: number }>()
    clientData.forEach((client) => {
      if (client.categories_data) {
        client.categories_data.forEach((category) => {
          if (!categoriesMap.has(category.id)) {
            categoriesMap.set(category.id, { name: category.name, count: 0 })
          }
          categoriesMap.get(category.id)!.count++
        })
      }
    })

    return [
      {
        id: "industry",
        name: "Industry",
        options: Array.from(industries).map((industry) => ({
          id: industry.toLowerCase(),
          name: industry,
          count: clientData.filter((client) => client.meta?.industry?.toLowerCase() === industry.toLowerCase()).length,
        })),
      },
      {
        id: "categories",
        name: "Categories",
        options: Array.from(categoriesMap.entries()).map(([id, { name, count }]) => ({
          id,
          name,
          count,
        })),
      },
    ]
  }

  // Handle filter changes
  const handleFilterChange = (filtered: Client[]) => {
    setFilteredClients(filtered)
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Skeleton className="h-[500px] w-full" />
        </div>
        <div className="md:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {Array(4)
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
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            There was a problem loading the client listings. This could be because the data source is not properly
            configured yet.
          </AlertDescription>
        </Alert>
        <Button onClick={() => window.location.reload()} className="mt-6">
          Try Again
        </Button>
      </div>
    )
  }

  if (!clients || clients.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold mb-4">No Client Listings Found</h3>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          It looks like there are no client listings available yet.
        </p>
      </div>
    )
  }

  const facets = generateFacets(clients)

  return (
    <div id="client-listings">
      <FacetedSearch
        data={clients}
        facets={facets}
        onFilterChange={handleFilterChange}
        searchFields={["title", "content", "excerpt"]}
      />

      <div className="mt-6 md:col-start-2 md:col-span-3">
        <p className="mb-6 text-gray-600">{filteredClients.length} clients found</p>

        {filteredClients.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-xl text-gray-600 mb-4">No clients match your search criteria</p>
            <Button onClick={() => handleFilterChange(clients)}>Clear Filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredClients.map((client) => (
              <ClientCard key={client.id} client={client} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
