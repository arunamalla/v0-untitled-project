import fs from "fs"
import path from "path"
import type { Job, Category } from "@/types/job"
import type { Client } from "@/types/client"

// Function to read JSON data from a file
function readJsonFile<T>(filePath: string): T {
  try {
    const fullPath = path.join(process.cwd(), filePath)
    const fileContents = fs.readFileSync(fullPath, "utf8")
    return JSON.parse(fileContents) as T
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error)
    return [] as unknown as T
  }
}

// Function to format job data to match the expected structure
function formatJobData(job: any): Job {
  return {
    id: job.id,
    date: job.date,
    slug: job.slug,
    title: {
      rendered: job.title,
    },
    content: {
      rendered: `<div>${Object.entries(job.sections)
        .map(([key, value]) => `<h3>${key.charAt(0).toUpperCase() + key.slice(1)}</h3><p>${value}</p>`)
        .join("")}</div>`,
    },
    excerpt: {
      rendered: job.sections.description.substring(0, 150) + "...",
    },
    categories: job.categories || [],
    meta: {
      company: job.company_name || job.meta?.company,
      location: job.location || job.meta?.location,
      job_type: job.job_type || job.meta?.job_type,
      salary: job.salary || job.meta?.salary,
      logo_url: job.meta?.logo_url,
      image_url: job.meta?.image_url,
      ...job.meta,
    },
  }
}

// Replace the entire getAllJobs function with this improved version that uses local JSON
export async function getAllJobs(): Promise<Job[]> {
  try {
    // Read jobs from the JSON file
    const jobs = readJsonFile<any[]>("data/job_details.json")

    // Read categories from the JSON file
    const categories = readJsonFile<Category[]>("data/categories.json")

    // Format jobs and add category data
    return jobs.map((job) => {
      const formattedJob = formatJobData(job)

      // Add category data to the job
      if (job.categories && Array.isArray(job.categories)) {
        formattedJob.categories_data = categories.filter((cat) => job.categories.includes(cat.id))
      }

      return formattedJob
    })
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return []
  }
}

// Replace the getJob function with this improved version
export async function getJob(slug: string): Promise<Job | null> {
  try {
    // Read jobs from the JSON file
    const jobs = readJsonFile<any[]>("data/job_details.json")

    // Find the job with the matching slug
    const job = jobs.find((j) => j.slug === slug)

    if (!job) {
      return null
    }

    // Format the job
    const formattedJob = formatJobData(job)

    // Read categories from the JSON file
    const categories = readJsonFile<Category[]>("data/categories.json")

    // Add category data to the job
    if (job.categories && Array.isArray(job.categories)) {
      formattedJob.categories_data = categories.filter((cat) => job.categories.includes(cat.id))
    }

    return formattedJob
  } catch (error) {
    console.error("Error fetching job:", error)
    return null
  }
}

// Create a sample clients JSON file
const sampleClients = [
  {
    id: 1,
    date: new Date().toISOString(),
    slug: "google",
    title: "Google",
    content: "Google is a multinational technology company specializing in Internet-related services and products.",
    excerpt: "Google is a multinational technology company...",
    categories: [1, 2],
    meta: {
      address: "Mountain View, CA",
      website: "https://google.com",
      industry: "Technology",
      stock_symbol: "GOOGL",
      logo_url: "https://logo.clearbit.com/google.com",
    },
  },
  {
    id: 2,
    date: new Date().toISOString(),
    slug: "microsoft",
    title: "Microsoft",
    content: "Microsoft Corporation is an American multinational technology corporation.",
    excerpt: "Microsoft Corporation is an American multinational...",
    categories: [1, 3],
    meta: {
      address: "Redmond, WA",
      website: "https://microsoft.com",
      industry: "Technology",
      stock_symbol: "MSFT",
      logo_url: "https://logo.clearbit.com/microsoft.com",
    },
  },
]

// Replace the getAllClients function with this version
export async function getAllClients(): Promise<Client[]> {
  try {
    // For now, return sample clients
    // In a real implementation, you would read from a clients.json file
    return sampleClients.map((client) => ({
      id: client.id,
      date: client.date,
      slug: client.slug,
      title: {
        rendered: client.title,
      },
      content: {
        rendered: `<p>${client.content}</p>`,
      },
      excerpt: {
        rendered: client.excerpt,
      },
      categories: client.categories,
      meta: client.meta,
    }))
  } catch (error) {
    console.error("Error fetching clients:", error)
    return []
  }
}

// Replace the getClient function with this version
export async function getClient(slug: string): Promise<Client | null> {
  try {
    // Find the client with the matching slug
    const client = sampleClients.find((c) => c.slug === slug)

    if (!client) {
      return null
    }

    return {
      id: client.id,
      date: client.date,
      slug: client.slug,
      title: {
        rendered: client.title,
      },
      content: {
        rendered: `<p>${client.content}</p>`,
      },
      excerpt: {
        rendered: client.excerpt,
      },
      categories: client.categories,
      meta: client.meta,
    }
  } catch (error) {
    console.error("Error fetching client:", error)
    return null
  }
}
