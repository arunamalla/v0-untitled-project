"use server"

import { put } from "@vercel/blob"
import { revalidatePath } from "next/cache"

export async function uploadCompanyLogo(formData: FormData) {
  const file = formData.get("logo") as File

  if (!file || file.size === 0) {
    return { error: "No file selected" }
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    return { error: "File must be an image" }
  }

  // Limit file size (2MB)
  if (file.size > 2 * 1024 * 1024) {
    return { error: "File size must be less than 2MB" }
  }

  try {
    // Generate a unique filename with company name if available
    const companyName = (formData.get("companyName") as string) || "company"
    const sanitizedName = companyName.toLowerCase().replace(/[^a-z0-9]/g, "-")
    const uniqueFilename = `${sanitizedName}-${Date.now()}.${file.name.split(".").pop()}`

    // Upload to Vercel Blob
    const blob = await put(uniqueFilename, file, {
      access: "public",
      contentType: file.type,
    })

    // Return the URL of the uploaded file
    return {
      success: true,
      url: blob.url,
      size: blob.size,
      contentType: blob.contentType,
    }
  } catch (error) {
    console.error("Error uploading file:", error)
    return { error: "Failed to upload file" }
  }
}

export async function uploadJobImage(formData: FormData) {
  const file = formData.get("image") as File

  if (!file || file.size === 0) {
    return { error: "No file selected" }
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    return { error: "File must be an image" }
  }

  // Limit file size (3MB)
  if (file.size > 3 * 1024 * 1024) {
    return { error: "File size must be less than 3MB" }
  }

  try {
    // Generate a unique filename
    const jobTitle = (formData.get("jobTitle") as string) || "job"
    const sanitizedTitle = jobTitle.toLowerCase().replace(/[^a-z0-9]/g, "-")
    const uniqueFilename = `jobs/${sanitizedTitle}-${Date.now()}.${file.name.split(".").pop()}`

    // Upload to Vercel Blob
    const blob = await put(uniqueFilename, file, {
      access: "public",
      contentType: file.type,
    })

    // Revalidate the jobs page to show the new image
    revalidatePath("/")

    // Return the URL of the uploaded file
    return {
      success: true,
      url: blob.url,
    }
  } catch (error) {
    console.error("Error uploading file:", error)
    return { error: "Failed to upload file" }
  }
}
