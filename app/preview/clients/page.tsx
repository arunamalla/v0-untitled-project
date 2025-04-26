import type { Metadata } from "next"
import { ClientPreview } from "@/components/client-preview"

export const metadata: Metadata = {
  title: "Client Preview | Oracle and Google",
  description: "Preview of Oracle and Google client listings with stock information",
}

export default function ClientPreviewPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white py-12 md:py-24">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Client <span className="text-emerald-600">Preview</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mb-8">
            Preview of Oracle and Google client listings with real-time stock information.
          </p>
        </div>
      </div>
      <main className="container mx-auto px-4 py-12">
        <ClientPreview />
      </main>
    </div>
  )
}
