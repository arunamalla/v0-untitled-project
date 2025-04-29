import { NextResponse } from "next/server"

export async function GET() {
  const currentDate = new Date().toISOString()

  // Return fallback job data
  const fallbackJobs = [
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

  return NextResponse.json(fallbackJobs)
}
