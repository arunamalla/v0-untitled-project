export interface Job {
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
    company?: string
    location?: string
    job_type?: string
    salary?: string
    logo_url?: string // Company logo URL from Blob storage
    image_url?: string // Job banner image URL from Blob storage
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
