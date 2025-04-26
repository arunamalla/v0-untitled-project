import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building, MapPin, TrendingUp } from "lucide-react"
import { StockInfo } from "@/components/stock-info"
import type { Client } from "@/types/client"

interface ClientCardProps {
  client: Client
}

export function ClientCard({ client }: ClientCardProps) {
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
      return "View client details..."
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col h-full transition-all hover:shadow-md">
      <h3 className="text-xl font-semibold mb-2">
        <Link href={`/client/${client.slug}`} className="hover:text-emerald-600 transition-colors">
          {client.title.rendered}
        </Link>
      </h3>

      <div className="flex items-center justify-between text-gray-500 mb-4 text-sm">
        <div className="flex items-center">
          <Building className="h-4 w-4 mr-1" />
          <span>{client.meta?.industry || "Various Industries"}</span>
        </div>

        {client.meta?.stock_symbol && (
          <div className="flex items-center">
            <TrendingUp className="h-4 w-4 mr-1 text-emerald-600" />
            <StockInfo symbol={client.meta.stock_symbol} compact />
          </div>
        )}
      </div>

      <p className="text-gray-600 mb-4 flex-grow">{getExcerpt(client.content.rendered)}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {client.categories_data?.map((category) => (
          <Badge key={category.id} variant="outline" className="bg-gray-100">
            {category.name}
          </Badge>
        ))}
      </div>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
        <div className="flex items-center text-gray-500 text-sm">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{client.meta?.address || "Address not provided"}</span>
        </div>
        <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
          <Link href={`/client/${client.slug}`}>View Client</Link>
        </Button>
      </div>
    </div>
  )
}
