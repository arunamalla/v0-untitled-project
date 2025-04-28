import { useState, useEffect } from "react"
import ClientListings from "@/components/client-listings"
import type { Client } from "@/types/client" // Assuming you have a type defined for client data

export const metadata = {
  title: "Client Directory | Find Top Companies",
  description: "Browse our directory of client companies across various industries.",
}

export default function ClientsPage() {
  const [clientsData, setClientsData] = useState<Client[]>([]) // Assuming a Client type
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)

  useEffect(() => {
    const loadClientsData = async () => {
      try {
        const response = await fetch("/data/customer_details.json")
        if (!response.ok) {
          throw new Error("Failed to fetch client data")
        }
        const data = await response.json()
        setClientsData(data)
      } catch (error) {
        console.error(error)
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadClientsData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white py-12 md:py-24">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Our <span className="text-emerald-600">Client</span> Directory
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mb-8">
            Browse through our comprehensive directory of client companies across various industries.
          </p>
        </div>
      </div>
      <main className="container mx-auto px-4 py-12">
        <ClientListings clients={clientsData} isLoading={isLoading} isError={isError} />
      </main>
    </div>
  )
}
