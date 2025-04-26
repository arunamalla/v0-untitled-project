import { type NextRequest, NextResponse } from "next/server"
import type { StockData } from "@/types/client"

// Mock data for demonstration purposes
// In a real application, you would fetch this from a financial API
const MOCK_STOCKS: Record<string, StockData> = {
  AAPL: {
    symbol: "AAPL",
    price: 182.63,
    change: 1.25,
    changePercent: 0.69,
    previousClose: 181.38,
    open: 181.95,
    dayHigh: 183.12,
    dayLow: 181.45,
    marketCap: "2.85T",
    volume: 45678901,
    lastUpdated: new Date().toISOString(),
  },
  MSFT: {
    symbol: "MSFT",
    price: 417.88,
    change: -2.34,
    changePercent: -0.56,
    previousClose: 420.22,
    open: 419.75,
    dayHigh: 421.05,
    dayLow: 416.82,
    marketCap: "3.11T",
    volume: 23456789,
    lastUpdated: new Date().toISOString(),
  },
  GOOGL: {
    symbol: "GOOGL",
    price: 163.45,
    change: 0.87,
    changePercent: 0.54,
    previousClose: 162.58,
    open: 162.75,
    dayHigh: 164.2,
    dayLow: 162.3,
    marketCap: "2.05T",
    volume: 19876543,
    lastUpdated: new Date().toISOString(),
  },
  ORCL: {
    symbol: "ORCL",
    price: 125.78,
    change: 2.34,
    changePercent: 1.89,
    previousClose: 123.44,
    open: 123.65,
    dayHigh: 126.2,
    dayLow: 123.1,
    marketCap: "345.7B",
    volume: 12345678,
    lastUpdated: new Date().toISOString(),
  },
  AMZN: {
    symbol: "AMZN",
    price: 178.75,
    change: -1.15,
    changePercent: -0.64,
    previousClose: 179.9,
    open: 179.5,
    dayHigh: 180.25,
    dayLow: 177.8,
    marketCap: "1.85T",
    volume: 32145678,
    lastUpdated: new Date().toISOString(),
  },
  META: {
    symbol: "META",
    price: 474.99,
    change: 3.45,
    changePercent: 0.73,
    previousClose: 471.54,
    open: 472.1,
    dayHigh: 476.25,
    dayLow: 471.2,
    marketCap: "1.21T",
    volume: 15678901,
    lastUpdated: new Date().toISOString(),
  },
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const symbol = searchParams.get("symbol")?.toUpperCase()

  if (!symbol) {
    return NextResponse.json({ error: "Stock symbol is required" }, { status: 400 })
  }

  try {
    // In a real application, you would fetch this from a financial API like Alpha Vantage or Yahoo Finance
    // For demonstration purposes, we're using mock data

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const stockData = MOCK_STOCKS[symbol]

    if (!stockData) {
      // Generate random stock data for unknown symbols
      const price = Number.parseFloat((50 + Math.random() * 150).toFixed(2))
      const change = Number.parseFloat((Math.random() * 10 - 5).toFixed(2))
      const changePercent = Number.parseFloat(((change / price) * 100).toFixed(2))

      return NextResponse.json({
        symbol,
        price,
        change,
        changePercent,
        previousClose: price - change,
        open: price - change / 2,
        dayHigh: price + Math.random() * 5,
        dayLow: price - Math.random() * 5,
        marketCap: `${(Math.random() * 500 + 10).toFixed(2)}B`,
        volume: Math.floor(Math.random() * 50000000),
        lastUpdated: new Date().toISOString(),
      })
    }

    // Update the lastUpdated timestamp
    stockData.lastUpdated = new Date().toISOString()

    return NextResponse.json(stockData)
  } catch (error) {
    console.error("Error fetching stock data:", error)
    return NextResponse.json({ error: "Failed to fetch stock data" }, { status: 500 })
  }
}
