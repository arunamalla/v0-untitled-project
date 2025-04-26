import type { Job, Category } from "@/types/job"
import type { Client } from "@/types/client"

// Update the WP_API_URL to use a placeholder that can be easily updated
const WP_API_URL = process.env.WORDPRESS_API_URL || "https://your-wordpress-site.com/wp-json/wp/v2"

// Replace the entire getAllJobs function with this improved version that handles errors better
export async function getAllJobs(): Promise<Job[]> {
  try {
    // Use a more robust URL construction
    const url = new URL(`${WP_API_URL}/job-listings`)
    url.searchParams.append("_embed", "true")
    url.searchParams.append("per_page", "100")

    // Fetch jobs with better error handling
    const jobsResponse = await fetch(url.toString(), {
      next: { revalidate: 60 }, // Revalidate every minute
    })

    if (!jobsResponse.ok) {
      throw new Error(`Failed to fetch jobs: ${jobsResponse.status}`)
    }

    const jobs: Job[] = await jobsResponse.json()

    // If no jobs are returned or the API doesn't exist yet, return an empty array
    if (!jobs || !Array.isArray(jobs)) {
      console.log("No jobs found or invalid response format")
      return []
    }

    // Safely extract category IDs
    const categoryIds = new Set<number>()
    jobs.forEach((job) => {
      if (job.categories && Array.isArray(job.categories)) {
        job.categories.forEach((id) => categoryIds.add(id))
      }
    })

    // Only fetch categories if we have any
    let categories: Category[] = []
    if (categoryIds.size > 0) {
      try {
        const categoriesUrl = new URL(`${WP_API_URL}/categories`)
        categoriesUrl.searchParams.append("include", Array.from(categoryIds).join(","))

        const categoriesResponse = await fetch(categoriesUrl.toString())

        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json()
          if (Array.isArray(categoriesData)) {
            categories = categoriesData
          }
        }
      } catch (categoryError) {
        console.error("Error fetching categories:", categoryError)
        // Continue without categories rather than failing completely
      }
    }

    // Add category data to jobs
    return jobs.map((job) => ({
      ...job,
      categories_data: categories.filter(
        (cat) => job.categories && Array.isArray(job.categories) && job.categories.includes(cat.id),
      ),
    }))
  } catch (error) {
    console.error("Error fetching jobs:", error)
    // Return empty array instead of failing
    return []
  }
}

// Replace the getJob function with this improved version
export async function getJob(slug: string): Promise<Job | null> {
  try {
    const url = new URL(`${WP_API_URL}/job-listings`)
    url.searchParams.append("slug", slug)
    url.searchParams.append("_embed", "true")

    const response = await fetch(url.toString(), {
      next: { revalidate: 60 }, // Revalidate every minute
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch job: ${response.status}`)
    }

    const jobs = await response.json()

    if (!jobs || !Array.isArray(jobs) || jobs.length === 0) {
      return null
    }

    const job = jobs[0]

    // Fetch categories
    if (job.categories && Array.isArray(job.categories) && job.categories.length > 0) {
      try {
        const categoriesUrl = new URL(`${WP_API_URL}/categories`)
        categoriesUrl.searchParams.append("include", job.categories.join(","))

        const categoriesResponse = await fetch(categoriesUrl.toString())

        if (categoriesResponse.ok) {
          const categories = await categoriesResponse.json()
          if (Array.isArray(categories)) {
            job.categories_data = categories
          }
        }
      } catch (categoryError) {
        console.error("Error fetching categories:", categoryError)
        // Continue without categories
      }
    }

    return job
  } catch (error) {
    console.error("Error fetching job:", error)
    return null
  }
}

// Replace the getAllClients function with this improved version
export async function getAllClients(): Promise<Client[]> {
  try {
    // Check if the clients endpoint exists first
    const checkResponse = await fetch(`${WP_API_URL}`, {
      method: "HEAD",
      next: { revalidate: 60 },
    })

    if (!checkResponse.ok) {
      console.warn("WordPress API may not be accessible")
      return []
    }

    // Use a more robust URL construction
    const url = new URL(`${WP_API_URL}/clients`)
    url.searchParams.append("_embed", "true")
    url.searchParams.append("per_page", "100")

    // Fetch clients with better error handling
    const clientsResponse = await fetch(url.toString(), {
      next: { revalidate: 60 },
    }).catch((error) => {
      console.log("Clients endpoint may not exist yet:", error)
      return new Response(JSON.stringify([]), { status: 200 })
    })

    // If endpoint doesn't exist yet, return empty array
    if (!clientsResponse.ok) {
      console.log("Clients endpoint returned error, may not be set up yet")
      return []
    }

    let clients: Client[] = []
    try {
      const data = await clientsResponse.json()
      if (Array.isArray(data)) {
        clients = data
      }
    } catch (parseError) {
      console.error("Error parsing clients response:", parseError)
      return []
    }

    // Rest of the function remains similar but with better error handling
    const categoryIds = new Set<number>()
    clients.forEach((client) => {
      if (client.categories && Array.isArray(client.categories)) {
        client.categories.forEach((id) => categoryIds.add(id))
      }
    })

    let categories: Category[] = []
    if (categoryIds.size > 0) {
      try {
        const categoriesUrl = new URL(`${WP_API_URL}/categories`)
        categoriesUrl.searchParams.append("include", Array.from(categoryIds).join(","))

        const categoriesResponse = await fetch(categoriesUrl.toString())

        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json()
          if (Array.isArray(categoriesData)) {
            categories = categoriesData
          }
        }
      } catch (categoryError) {
        console.error("Error fetching categories:", categoryError)
      }
    }

    return clients.map((client) => ({
      ...client,
      categories_data: categories.filter(
        (cat) => client.categories && Array.isArray(client.categories) && client.categories.includes(cat.id),
      ),
    }))
  } catch (error) {
    console.error("Error fetching clients:", error)
    return []
  }
}

// Replace the getClient function with this improved version
export async function getClient(slug: string): Promise<Client | null> {
  try {
    const url = new URL(`${WP_API_URL}/clients`)
    url.searchParams.append("slug", slug)
    url.searchParams.append("_embed", "true")

    const response = await fetch(url.toString(), {
      next: { revalidate: 60 },
    }).catch(() => {
      console.log("Clients endpoint may not exist yet")
      return new Response(JSON.stringify([]), { status: 200 })
    })

    if (!response.ok) {
      console.log("Client endpoint returned error, may not be set up yet")
      return null
    }

    let clients
    try {
      clients = await response.json()
    } catch (parseError) {
      console.error("Error parsing client response:", parseError)
      return null
    }

    if (!clients || !Array.isArray(clients) || clients.length === 0) {
      return null
    }

    const client = clients[0]

    // Fetch categories with better error handling
    if (client.categories && Array.isArray(client.categories) && client.categories.length > 0) {
      try {
        const categoriesUrl = new URL(`${WP_API_URL}/categories`)
        categoriesUrl.searchParams.append("include", client.categories.join(","))

        const categoriesResponse = await fetch(categoriesUrl.toString())

        if (categoriesResponse.ok) {
          const categories = await categoriesResponse.json()
          if (Array.isArray(categories)) {
            client.categories_data = categories
          }
        }
      } catch (categoryError) {
        console.error("Error fetching categories:", categoryError)
      }
    }

    return client
  } catch (error) {
    console.error("Error fetching client:", error)
    return null
  }
}
