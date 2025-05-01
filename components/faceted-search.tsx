"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Filter, X } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface FacetOption {
  id: string | number
  name: string
  count: number
}

interface Facet {
  id: string
  name: string
  options: FacetOption[]
}

interface FacetedSearchProps<T> {
  data: T[]
  facets: Facet[]
  onFilterChange: (filteredData: T[]) => void
  searchFields: (keyof T)[]
}

export function FacetedSearch<T>({ data, facets, onFilterChange, searchFields }: FacetedSearchProps<T>) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFacets, setSelectedFacets] = useState<Record<string, Set<string | number>>>({})
  const [activeFacets, setActiveFacets] = useState<Facet[]>(facets)

  // Initialize selected facets
  useEffect(() => {
    const initialFacets: Record<string, Set<string | number>> = {}
    facets.forEach((facet) => {
      initialFacets[facet.id] = new Set()
    })
    setSelectedFacets(initialFacets)
  }, [facets])

  // Apply filters whenever search term or selected facets change
  useEffect(() => {
    const applyFilters = () => {
      let filteredResults = [...data]

      // Apply search term filter
      if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase()
        filteredResults = filteredResults.filter((item) => {
          return searchFields.some((field) => {
            const value = item[field as keyof T]
            if (typeof value === "string") {
              return value.toLowerCase().includes(lowerSearchTerm)
            }
            if (typeof value === "object" && value !== null && "rendered" in value) {
              return (value as any).rendered.toLowerCase().includes(lowerSearchTerm)
            }
            return false
          })
        })
      }

      // Apply facet filters
      Object.entries(selectedFacets).forEach(([facetId, selectedValues]) => {
        if (selectedValues.size > 0) {
          filteredResults = filteredResults.filter((item) => {
            // Handle different data structures based on facet type
            if (facetId === "categories") {
              const itemCategories = (item as any).categories || []
              return Array.from(selectedValues).some((value) => itemCategories.includes(Number(value)))
            } else if (facetId === "industry") {
              const industry = (item as any).meta?.industry?.toLowerCase()
              return Array.from(selectedValues).some((value) => industry === value.toString().toLowerCase())
            }
            return false
          })
        }
      })

      // Update facet counts based on current filters
      updateFacetCounts(filteredResults)

      // Return filtered results
      onFilterChange(filteredResults)
    }

    applyFilters()
  }, [searchTerm, selectedFacets, data, searchFields, onFilterChange])

  // Update facet counts based on current filters
  const updateFacetCounts = (filteredData: T[]) => {
    const updatedFacets = facets.map((facet) => {
      const updatedOptions = facet.options.map((option) => {
        // Count items that would match this option
        let count = 0

        // Create a copy of selected facets without this facet to avoid circular filtering
        const tempSelectedFacets = { ...selectedFacets }
        delete tempSelectedFacets[facet.id]

        // Apply other filters first
        const tempFilteredData = [...filteredData]

        // Count how many items would match this option
        if (facet.id === "categories") {
          count = tempFilteredData.filter((item) => (item as any).categories?.includes(option.id)).length
        } else if (facet.id === "industry") {
          count = tempFilteredData.filter(
            (item) => (item as any).meta?.industry?.toLowerCase() === option.name.toLowerCase(),
          ).length
        }

        return { ...option, count }
      })

      return { ...facet, options: updatedOptions }
    })

    setActiveFacets(updatedFacets)
  }

  // Toggle a facet value selection
  const toggleFacetValue = (facetId: string, value: string | number) => {
    setSelectedFacets((prev) => {
      const newFacets = { ...prev }
      if (!newFacets[facetId]) {
        newFacets[facetId] = new Set()
      }

      if (newFacets[facetId].has(value)) {
        newFacets[facetId].delete(value)
      } else {
        newFacets[facetId].add(value)
      }

      return newFacets
    })
  }

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm("")
    const clearedFacets: Record<string, Set<string | number>> = {}
    facets.forEach((facet) => {
      clearedFacets[facet.id] = new Set()
    })
    setSelectedFacets(clearedFacets)
  }

  // Count total selected filters
  const selectedFiltersCount =
    Object.values(selectedFacets).reduce((count, set) => count + set.size, 0) + (searchTerm ? 1 : 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1 space-y-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Filters</h3>
            {selectedFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-8 text-xs">
                Clear all
              </Button>
            )}
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-7 w-7 p-0"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="space-y-2">
            {selectedFiltersCount > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {searchTerm && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {searchTerm}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchTerm("")} />
                  </Badge>
                )}

                {Object.entries(selectedFacets).map(([facetId, values]) => {
                  return Array.from(values).map((value) => {
                    const facet = facets.find((f) => f.id === facetId)
                    const option = facet?.options.find((o) => o.id === value || o.name === value)
                    return (
                      <Badge key={`${facetId}-${value}`} variant="secondary" className="flex items-center gap-1">
                        {option?.name || value}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => toggleFacetValue(facetId, value)} />
                      </Badge>
                    )
                  })
                })}
              </div>
            )}

            <Accordion type="multiple" className="w-full">
              {activeFacets.map((facet) => (
                <AccordionItem key={facet.id} value={facet.id}>
                  <AccordionTrigger className="text-sm font-medium py-2">{facet.name}</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-1">
                      {facet.options
                        .filter((option) => option.count > 0)
                        .map((option) => (
                          <div key={`${facet.id}-${option.id}`} className="flex items-center space-x-2">
                            <Checkbox
                              id={`${facet.id}-${option.id}`}
                              checked={selectedFacets[facet.id]?.has(option.id)}
                              onCheckedChange={() => toggleFacetValue(facet.id, option.id)}
                            />
                            <label
                              htmlFor={`${facet.id}-${option.id}`}
                              className="text-sm flex items-center justify-between w-full cursor-pointer"
                            >
                              <span>{option.name}</span>
                              <span className="text-gray-500 text-xs">({option.count})</span>
                            </label>
                          </div>
                        ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>

      <div className="md:col-span-3">
        <div className="bg-white p-4 rounded-lg shadow-sm mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <Filter className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-sm text-gray-700">
              {selectedFiltersCount > 0
                ? `${selectedFiltersCount} filter${selectedFiltersCount > 1 ? "s" : ""} applied`
                : "No filters applied"}
            </span>
          </div>
        </div>

        {/* The filtered results will be rendered by the parent component */}
      </div>
    </div>
  )
}
