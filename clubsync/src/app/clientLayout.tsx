"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DataProvider } from "@/lib/data-context"

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [selectedClub, setSelectedClub] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const authStatus = localStorage.getItem("clubManagerAuth")
    const storedClub = localStorage.getItem("selectedClub")

    setIsAuthenticated(authStatus === "true")
    if (storedClub) {
      setSelectedClub(storedClub)
    }
    setIsLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("clubManagerAuth")
    localStorage.removeItem("selectedClub")
    setIsAuthenticated(false)
    setSelectedClub(null)
    router.push("/")
  }

  const handleClubSwitch = () => {
    localStorage.removeItem("selectedClub")
    setSelectedClub(null)
    router.push("/select-club")
  }

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50/30 via-white to-orange-50/30">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Public pages (homepage, login) - no sidebar
  if (!isAuthenticated || pathname === "/" || pathname === "/login") {
    return children
  }

  // Select club page - no sidebar
  if (!selectedClub || pathname === "/select-club") {
    return children
  }

  // Authenticated pages with club selected - show sidebar
  return (
    <DataProvider>
      <SidebarProvider>
        <AppSidebar selectedClub={selectedClub} onClubSwitch={handleClubSwitch} onLogout={handleLogout} />
        <main className="flex-1">{children}</main>
      </SidebarProvider>
    </DataProvider>
  )
}
