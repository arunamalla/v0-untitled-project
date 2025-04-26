// Schema.org structured data for Google for Jobs
export function generateJobSchema(job: any) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title.rendered,
    description: job.content.rendered,
    datePosted: job.date,
    validThrough: job.meta.valid_through || new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString(),
    employmentType: job.meta.job_type || "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: job.meta.company || "Company Name",
      sameAs: job.meta.company_url || "https://example.com",
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.meta.location || "Remote",
        addressRegion: job.meta.region || "",
        addressCountry: job.meta.country || "",
      },
    },
    baseSalary: job.meta.salary
      ? {
          "@type": "MonetaryAmount",
          currency: job.meta.salary_currency || "USD",
          value: {
            "@type": "QuantitativeValue",
            value: job.meta.salary_value || job.meta.salary,
            unitText: job.meta.salary_unit || "YEAR",
          },
        }
      : undefined,
  }
}
