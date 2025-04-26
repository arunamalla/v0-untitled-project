export interface Client {
  id: number
  date: string
  slug: string
  title: {
    rendered: string
  }
  content: {
    rendered: string
  }
  excerpt: {
    rendered: string
  }
  categories: number[]
  categories_data?: Category[]
  meta: {
    address?: string
    careers_url?: string
    website?: string
    industry?: string
    logo_url?: string
    stock_symbol?: string
    [key: string]: any
  }
  _embedded?: any
}

export interface Category {
  id: number
  name: string
  slug: string
  count: number
}

export interface StockData {
  symbol: string
  price: number
  change: number
  changePercent: number
  previousClose?: number
  open?: number
  dayHigh?: number
  dayLow?: number
  marketCap?: string
  volume?: number
  lastUpdated: string
}
