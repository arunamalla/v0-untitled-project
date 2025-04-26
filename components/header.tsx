"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Briefcase } from "lucide-react"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="bg-white border-b sticky top-0 z-40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Briefcase className="h-6 w-6 text-emerald-600" />
          <span>JobBoard</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-gray-600 hover:text-emerald-600 transition-colors">
            Home
          </Link>
          <Link href="/categories" className="text-gray-600 hover:text-emerald-600 transition-colors">
            Categories
          </Link>
          <Link href="/clients" className="text-gray-600 hover:text-emerald-600 transition-colors">
            Clients
          </Link>
          <Link href="/about" className="text-gray-600 hover:text-emerald-600 transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-gray-600 hover:text-emerald-600 transition-colors">
            Contact
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button variant="outline">Sign In</Button>
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <nav className="flex flex-col gap-4 mt-8">
              <Link
                href="/"
                className="text-lg font-medium hover:text-emerald-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/categories"
                className="text-lg font-medium hover:text-emerald-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Categories
              </Link>
              <Link
                href="/clients"
                className="text-lg font-medium hover:text-emerald-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Clients
              </Link>
              <Link
                href="/about"
                className="text-lg font-medium hover:text-emerald-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-lg font-medium hover:text-emerald-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>

              <div className="flex flex-col gap-2 mt-4 pt-4 border-t">
                <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
                  Sign In
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
    )
}
