"use client"

import type React from "react"

import { useState } from "react"
import { uploadCompanyLogo } from "@/lib/blob-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Check, AlertCircle } from "lucide-react"
import Image from "next/image"

interface LogoUploadProps {
  onUploadComplete?: (url: string) => void
  companyName?: string
}

export function LogoUpload({ onUploadComplete, companyName = "" }: LogoUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsUploading(true)
    setError(null)
    setSuccess(false)

    // Add company name to form data
    if (companyName) {
      formData.append("companyName", companyName)
    }

    const result = await uploadCompanyLogo(formData)

    setIsUploading(false)

    if (result.error) {
      setError(result.error)
      return
    }

    setSuccess(true)

    if (onUploadComplete && result.url) {
      onUploadComplete(result.url)
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    setError(null)

    if (!file) {
      setPreview(null)
      return
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      setPreview(null)
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-4">
      <form action={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="logo">Company Logo</Label>
          <Input
            id="logo"
            name="logo"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="cursor-pointer"
          />
          <p className="text-sm text-gray-500">Upload a square logo image (PNG or JPG, max 2MB)</p>
        </div>

        {preview && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Preview:</p>
            <div className="relative w-24 h-24 border rounded-md overflow-hidden">
              <Image src={preview || "/placeholder.svg"} alt="Logo preview" fill className="object-contain" />
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <Check className="h-4 w-4" />
            <span>Logo uploaded successfully!</span>
          </div>
        )}

        <Button type="submit" disabled={isUploading} className="bg-emerald-600 hover:bg-emerald-700">
          {isUploading ? (
            <>Uploading...</>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Logo
            </>
          )}
        </Button>
      </form>
    </div>
  )
}
