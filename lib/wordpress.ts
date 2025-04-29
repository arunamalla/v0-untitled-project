import type { Job, Category } from "@/types/job"
import type { Client } from "@/types/client"

// Update the WP_API_URL to use a placeholder that can be easily updated
const WP_API_URL = process.env.WORDPRESS_API_URL || "https://your-wordpress-site.com/wp-json/wp/v2"

// Update the getAllJobs function to provide fallback data when the API is unavailable

export async function getAllJobs(): Promise<Job[]> {
  try {
    // Use a more robust URL construction
    const url = new URL(`${WP_API_URL}/jobs`)
    url.searchParams.append("_embed", "true")
    url.searchParams.append("per_page", "100")

    // Fetch jobs with better error handling
    const jobsResponse = await fetch(url.toString(), {
      next: { revalidate: 60 }, // Revalidate every minute
    }).catch((error) => {
      console.error("Network error fetching jobs:", error)
      return new Response(null, { status: 404 })
    })

    if (!jobsResponse.ok) {
      console.error(`Failed to fetch jobs: ${jobsResponse.status}`)

      // Return fallback data when API is unavailable
      return getFallbackJobs()
    }

    const jobs: Job[] = await jobsResponse.json()

    // If no jobs are returned or the API doesn't exist yet, return fallback data
    if (!jobs || !Array.isArray(jobs)) {
      console.log("No jobs found or invalid response format")
      return getFallbackJobs()
    }

    // Rest of the function remains the same...
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
    // Return fallback data instead of empty array
    return getFallbackJobs()
  }
}

// Add a new function to provide fallback job data
function getFallbackJobs(): Job[] {
  const currentDate = new Date().toISOString()

  return [
    {
      id: 1001,
      date: currentDate,
      slug: "frontend-developer",
      title: {
        rendered: "Frontend Developer",
      },
      content: {
        rendered: `<p>We are looking for a skilled Frontend Developer to join our team. The ideal candidate should have experience with React, TypeScript, and modern CSS frameworks.</p>
        <h3>Requirements:</h3>
        <ul>
          <li>3+ years of experience with React</li>
          <li>Strong knowledge of TypeScript</li>
          <li>Experience with CSS frameworks like Tailwind</li>
          <li>Understanding of responsive design principles</li>
        </ul>`,
      },
      excerpt: {
        rendered: "We are looking for a skilled Frontend Developer to join our team.",
      },
      categories: [1],
      categories_data: [{ id: 1, name: "Technology", slug: "technology", count: 3 }],
      meta: {
        company: "Tech Solutions Inc.",
        location: "Remote",
        job_type: "Full-time",
        salary: "$80,000 - $120,000",
      },
    },
    {
      id: 1002,
      date: currentDate,
      slug: "ux-designer",
      title: {
        rendered: "UX Designer",
      },
      content: {
        rendered: `<p>Join our creative team as a UX Designer to create beautiful and functional user experiences for our products.</p>
        <h3>Requirements:</h3>
        <ul>
          <li>Portfolio demonstrating UX design skills</li>
          <li>Experience with Figma or similar design tools</li>
          <li>Understanding of user research and testing</li>
          <li>Ability to collaborate with developers</li>
        </ul>`,
      },
      excerpt: {
        rendered: "Join our creative team as a UX Designer to create beautiful and functional user experiences.",
      },
      categories: [3],
      categories_data: [{ id: 3, name: "Design", slug: "design", count: 2 }],
      meta: {
        company: "Creative Agency",
        location: "San Francisco, CA",
        job_type: "Full-time",
        salary: "$90,000 - $110,000",
      },
    },
    {
      id: 1003,
      date: currentDate,
      slug: "marketing-manager",
      title: {
        rendered: "Marketing Manager",
      },
      content: {
        rendered: `<p>We're seeking an experienced Marketing Manager to lead our marketing efforts and drive growth.</p>
        <h3>Requirements:</h3>
        <ul>
          <li>5+ years of marketing experience</li>
          <li>Experience with digital marketing channels</li>
          <li>Strong analytical skills</li>
          <li>Excellent communication abilities</li>
        </ul>`,
      },
      excerpt: {
        rendered: "We're seeking an experienced Marketing Manager to lead our marketing efforts and drive growth.",
      },
      categories: [2],
      categories_data: [{ id: 2, name: "Marketing", slug: "marketing", count: 1 }],
      meta: {
        company: "Growth Co",
        location: "New York, NY",
        job_type: "Full-time",
        salary: "$85,000 - $115,000",
      },
    },
  ]
}

// Update the getJob function to handle 404 errors and provide fallback data
export async function getJob(slug: string): Promise<Job | null> {
  try {
    const url = new URL(`${WP_API_URL}/jobs`)
    url.searchParams.append("slug", slug)
    url.searchParams.append("_embed", "true")

    const response = await fetch(url.toString(), {
      next: { revalidate: 60 }, // Revalidate every minute
    }).catch(() => {
      return new Response(null, { status: 404 })
    })

    if (!response.ok) {
      console.error(`Failed to fetch job: ${response.status}`)

      // For specific job slugs, return fallback data
      const fallbackJobs = getFallbackJobs()
      const fallbackJob = fallbackJobs.find((job) => job.slug === slug)
      return fallbackJob || null
    }

    const jobs = await response.json()

    if (!jobs || !Array.isArray(jobs) || jobs.length === 0) {
      // Check fallback data for this slug
      const fallbackJobs = getFallbackJobs()
      const fallbackJob = fallbackJobs.find((job) => job.slug === slug)
      return fallbackJob || null
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

    // Check fallback data for this slug
    const fallbackJobs = getFallbackJobs()
    const fallbackJob = fallbackJobs.find((job) => job.slug === slug)
    return fallbackJob || null
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
