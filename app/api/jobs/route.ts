import { NextResponse } from "next/server"
import { getAllJobs } from "@/lib/wordpress"

export async function GET() {
  try {
    const jobs = await getAllJobs()
    return NextResponse.json(jobs)
  } catch (error) {
    console.error("Error fetching jobs:", error)
    // Return a more helpful error message
    return NextResponse.json(
      {
        error: "Failed to fetch jobs",
        message: "The WordPress API may not be accessible. Check your WORDPRESS_API_URL environment variable.",
        fallbackData: true,
      },
      { status: 200 }, // Return 200 with fallback data flag instead of 500
    )
  }
}
