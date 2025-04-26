import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Building, Globe, Briefcase, TrendingUp } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { StockInfo } from "@/components/stock-info"

export default function OracleClientPreviewPage() {
  const client = {
    id: 1,
    date: new Date().toISOString(),
    slug: "oracle",
    title: {
      rendered: "Oracle Corporation",
    },
    content: {
      rendered: `<p>Oracle Corporation is an American multinational computer technology corporation headquartered in Austin, Texas. The company was formerly headquartered in Redwood Shores, California until December 2020 when it moved its headquarters to Texas.</p>
      <p>Oracle sells database software and technology, cloud engineered systems, and enterprise software products—particularly its own brands of database management systems. The company also develops and builds tools for database development and systems of middle-tier software, enterprise resource planning (ERP) software, Human Capital Management (HCM) software, customer relationship management (CRM) software, and supply chain management (SCM) software.</p>
      <p>Oracle's business strategy is focused on providing products and services that address all aspects of enterprise information technology (IT) environments—applications, platform, and infrastructure. The company's cloud and license business represented 83% of total revenues in fiscal 2021.</p>
      <p>Oracle is one of the largest software companies by revenue and market capitalization. The company has more than 132,000 employees and serves 430,000 customers in 175 countries.</p>`,
    },
    excerpt: {
      rendered: "Oracle Corporation is an American multinational computer technology corporation...",
    },
    categories: [1, 2],
    categories_data: [
      { id: 1, name: "Technology", slug: "technology", count: 2 },
      { id: 2, name: "Enterprise", slug: "enterprise", count: 1 },
    ],
    meta: {
      address: "2300 Oracle Way, Austin, TX 78741, United States",
      careers_url: "https://www.oracle.com/corporate/careers/",
      website: "https://www.oracle.com",
      industry: "Technology",
      logo_url: "https://logo.clearbit.com/oracle.com",
      stock_symbol: "ORCL",
    },
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <Link href="/preview/clients" className="text-emerald-600 hover:text-emerald-700 mb-4 inline-block">
            ← Back to client directory
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {client.meta.logo_url ? (
                <div className="w-16 h-16 relative rounded-lg overflow-hidden border">
                  <Image
                    src={client.meta.logo_url || "/placeholder.svg"}
                    alt={`${client.title.rendered} logo`}
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Building className="h-8 w-8 text-emerald-600" />
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold">{client.title.rendered}</h1>
                <div className="flex items-center text-gray-500 mt-2">
                  <Building className="h-5 w-5 mr-1" />
                  <span>{client.meta.industry || "Various Industries"}</span>
                </div>
              </div>
            </div>

            {client.meta.careers_url && (
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                <a href={client.meta.careers_url} target="_blank" rel="noopener noreferrer">
                  <Briefcase className="mr-2 h-4 w-4" /> View Careers
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-semibold mb-6">About {client.title.rendered}</h2>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: client.content.rendered }} />
            </div>

            {client.meta.stock_symbol && (
              <div className="mt-8">
                <div className="flex items-center mb-4">
                  <TrendingUp className="h-5 w-5 text-emerald-600 mr-2" />
                  <h2 className="text-2xl font-semibold">Stock Information</h2>
                </div>
                <StockInfo symbol={client.meta.stock_symbol} />
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Client Information</h3>

              <div className="space-y-4">
                {client.meta.address && (
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-emerald-600 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium">{client.meta.address}</p>
                    </div>
                  </div>
                )}

                {client.meta.website && (
                  <div className="flex items-start">
                    <Globe className="h-5 w-5 text-emerald-600 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Website</p>
                      <a
                        href={client.meta.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-emerald-600 hover:underline"
                      >
                        {client.meta.website.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  </div>
                )}

                {client.meta.careers_url && (
                  <div className="flex items-start">
                    <Briefcase className="h-5 w-5 text-emerald-600 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Careers</p>
                      <a
                        href={client.meta.careers_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-emerald-600 hover:underline"
                      >
                        View Career Opportunities
                      </a>
                    </div>
                  </div>
                )}

                {client.meta.industry && (
                  <div className="flex items-start">
                    <Building className="h-5 w-5 text-emerald-600 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Industry</p>
                      <p className="font-medium">{client.meta.industry}</p>
                    </div>
                  </div>
                )}

                {client.meta.stock_symbol && (
                  <div className="flex items-start">
                    <TrendingUp className="h-5 w-5 text-emerald-600 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Stock Symbol</p>
                      <p className="font-medium">{client.meta.stock_symbol}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {client.categories_data && client.categories_data.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {client.categories_data.map((category) => (
                    <Badge key={category.id} variant="outline" className="bg-gray-100">
                      {category.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-emerald-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Looking for job opportunities?</h3>
              <p className="text-gray-600 mb-4">Check out the latest job listings from our clients.</p>
              <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
                <Link href="/">Browse Job Listings</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
