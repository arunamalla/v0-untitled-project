"use client"

import { useState } from "react"
import { ClientCard } from "@/components/client-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"
import type { Client } from "@/types/client"

// Mock client data for Oracle and Google
const mockClients: Client[] = [
  {
    id: 1,
    date: new Date().toISOString(),
    slug: "oracle",
    title: {
      rendered: "Oracle Corporation",
    },
    content: {
      rendered: `<p>Oracle Corporation is an American multinational computer technology corporation headquartered in Austin, Texas. The company was formerly headquartered in Redwood Shores, California until December 2020 when it moved its headquarters to Texas.</p>
      <p>Oracle sells database software and technology, cloud engineered systems, and enterprise software products—particularly its own brands of database management systems. The company also develops and builds tools for database development and systems of middle-tier software, enterprise resource planning (ERP) software, Human Capital Management (HCM) software, customer relationship management (CRM) software, and supply chain management (SCM) software.</p>`,
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
  },
  {
    id: 2,
    date: new Date().toISOString(),
    slug: "google",
    title: {
      rendered: "Google LLC",
    },
    content: {
      rendered: `<p>Google LLC is an American multinational technology company that specializes in Internet-related services and products, which include online advertising technologies, a search engine, cloud computing, software, and hardware.</p>
      <p>Google was founded in September 1998 by Larry Page and Sergey Brin while they were Ph.D. students at Stanford University in California. Together they own about 14% of its publicly-listed shares and control 56% of the stockholder voting power through super-voting stock.</p>
      <p>Google was led by Eric Schmidt from 2001 to 2011, before Page became CEO. In 2015, Google was reorganized as a wholly owned subsidiary of Alphabet Inc. Sundar Pichai was appointed CEO of Google on October 24, 2015, replacing Page, who became CEO of Alphabet. On December 3, 2019, Pichai also became CEO of Alphabet.</p>`,
    },
    excerpt: {
      rendered:
        "Google LLC is an American multinational technology company that specializes in Internet-related services and products...",
    },
    categories: [1, 3],
    categories_data: [
      { id: 1, name: "Technology", slug: "technology", count: 2 },
      { id: 3, name: "Internet", slug: "internet", count: 1 },
    ],
    meta: {
      address: "1600 Amphitheatre Parkway, Mountain View, CA 94043, United States",
      careers_url: "https://careers.google.com/",
      website: "https://www.google.com",
      industry: "Technology",
      logo_url: "https://logo.clearbit.com/google.com",
      stock_symbol: "GOOGL",
    },
  },
]

export function ClientPreview() {
  const [searchTerm, setSearchTerm] = useState("")
  const [industry, setIndustry] = useState("all")

  const filteredClients = mockClients.filter((client) => {
    const matchesSearch =
      client.title.rendered.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.content.rendered.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesIndustry = industry === "all" || client.meta?.industry?.toLowerCase() === industry.toLowerCase()

    return matchesSearch && matchesIndustry
  })

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
          <div className="w-full md:w-64">
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger>
                <SelectValue placeholder="All Industries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Filter className="h-4 w-4 mr-2" /> Filter
          </Button>
        </div>
      </div>

      <p className="mb-6 text-gray-600">{filteredClients.length} clients found</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <ClientCard key={client.id} client={client} />
        ))}
      </div>
    </div>
  )
}
