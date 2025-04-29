"use client"

import { useState } from "react"
import { uploadJobImage } from "@/lib/blob-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LogoUpload } from "@/components/logo-upload"
import { Upload, ImageIcon } from "lucide-react"
import Image from "next/image"

export function JobPostForm() {
  const [jobTitle, setJobTitle] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [companyLogo, setCompanyLogo] = useState("")
  const [jobImage, setJobImage] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  async function handleImageUpload(formData: FormData) {
    setIsUploading(true)

    // Add job title to form data
    formData.append("jobTitle", jobTitle)

    const result = await uploadJobImage(formData)

    setIsUploading(false)

    if (result.success && result.url) {
      setJobImage(result.url)
    }
  }

  function handleLogoUploadComplete(url: string) {
    setCompanyLogo(url)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Post a New Job</h2>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input
              id="jobTitle"
              placeholder="e.g. Frontend Developer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              placeholder="e.g. Acme Inc."
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobType">Job Type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select job type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="freelance">Freelance</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" placeholder="e.g. Remote, New York, NY" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Job Description</Label>
          <Textarea
            id="description"
            placeholder="Describe the job role, responsibilities, and requirements..."
            className="min-h-[200px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <LogoUpload onUploadComplete={handleLogoUploadComplete} companyName={companyName} />

            {companyLogo && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Uploaded Logo:</p>
                <div className="relative w-24 h-24 border rounded-md overflow-hidden">
                  <Image src={companyLogo || "/placeholder.svg"} alt="Company logo" fill className="object-contain" />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="jobImage">Job Banner Image (Optional)</Label>
              <form action={handleImageUpload} className="space-y-2">
                <Input id="jobImage" name="image" type="file" accept="image/*" className="cursor-pointer" />
                <p className="text-sm text-gray-500">Upload an image to make your job posting stand out (max 3MB)</p>

                <Button type="submit" variant="outline" disabled={isUploading} className="mt-2">
                  {isUploading ? (
                    "Uploading..."
                  ) : (
                    <>
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Upload Image
                    </>
                  )}
                </Button>
              </form>
            </div>

            {jobImage && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Uploaded Banner:</p>
                <div className="relative h-40 w-full border rounded-md overflow-hidden">
                  <Image src={jobImage || "/placeholder.svg"} alt="Job banner" fill className="object-cover" />
                </div>
              </div>
            )}
          </div>
        </div>

        <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
          <Upload className="mr-2 h-4 w-4" />
          Post Job
        </Button>
      </div>
    </div>
  )
}
