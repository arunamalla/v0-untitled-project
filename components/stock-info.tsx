"use client"

import { useState, useEffect } from "react"
import { ArrowUp, ArrowDown, RefreshCw } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import type { StockData } from "@/types/client"

interface StockInfoProps {
  symbol: string
  compact?: boolean
}

export function StockInfo({ symbol, compact = false }: StockInfoProps) {
  const [stockData, setStockData] = useState<StockData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!symbol) {
      setLoading(false)
      setError("No stock symbol provided")
      return
    }

    const fetchStockData = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/stock?symbol=${encodeURIComponent(symbol)}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch stock data: ${response.status}`)
        }

        const data = await response.json()
        setStockData(data)
      } catch (err) {
        console.error("Error fetching stock data:", err)
        setError("Failed to load stock data")
      } finally {
        setLoading(false)
      }
    }

    fetchStockData()

    // Refresh stock data every 5 minutes
    const intervalId = setInterval(fetchStockData, 5 * 60 * 1000)

    return () => clearInterval(intervalId)
  }, [symbol])

  if (loading) {
    return compact ? (
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-10" />
      </div>
    ) : (
      <div className="space-y-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    )
  }

  if (error || !stockData) {
    return compact ? (
      <Badge variant="outline" className="text-gray-500">
        Stock data unavailable
      </Badge>
    ) : (
      <div className="text-sm text-gray-500">Stock information unavailable</div>
    )
  }

  const isPositive = stockData.change >= 0
  const changeColor = isPositive ? "text-green-600" : "text-red-600"
  const ArrowIcon = isPositive ? ArrowUp : ArrowDown

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <span className="font-medium">${stockData.price.toFixed(2)}</span>
        <span className={`flex items-center ${changeColor}`}>
          <ArrowIcon className="h-3 w-3 mr-1" />
          {Math.abs(stockData.changePercent).toFixed(2)}%
        </span>
      </div>
    )
  }

  return (
    <div className="bg-white p-4 rounded-lg border">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold">{symbol} Stock</h4>
        <span className="text-xs text-gray-500 flex items-center">
          <RefreshCw className="h-3 w-3 mr-1" />
          Last updated: {new Date(stockData.lastUpdated).toLocaleTimeString()}
        </span>
      </div>

      <div className="flex items-baseline mb-2">
        <span className="text-2xl font-bold mr-2">${stockData.price.toFixed(2)}</span>
        <span className={`flex items-center ${changeColor}`}>
          <ArrowIcon className="h-4 w-4 mr-1" />
          {stockData.change.toFixed(2)} ({Math.abs(stockData.changePercent).toFixed(2)}%)
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-gray-500">Open:</span> ${stockData.open?.toFixed(2) || "N/A"}
        </div>
        <div>
          <span className="text-gray-500">Previous Close:</span> ${stockData.previousClose?.toFixed(2) || "N/A"}
        </div>
        <div>
          <span className="text-gray-500">Day High:</span> ${stockData.dayHigh?.toFixed(2) || "N/A"}
        </div>
        <div>
          <span className="text-gray-500">Day Low:</span> ${stockData.dayLow?.toFixed(2) || "N/A"}
        </div>
        {stockData.marketCap && (
          <div className="col-span-2">
            <span className="text-gray-500">Market Cap:</span> {stockData.marketCap}
          </div>
        )}
      </div>
    </div>
  )
}
