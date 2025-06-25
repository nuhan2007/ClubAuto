"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DataProvider } from "@/lib/data-context"
import { ThemeProvider } from "../lib/theme-context"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [selectedClub, setSelectedClub] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const auth = localStorage.getItem("clubManagerAuth")
    const club = localStorage.getItem("selectedClub")

    if (auth && club) {
      setIsAuthenticated(true)
      setSelectedClub(club)
    }
    setIsLoading(false)
  }, [])

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem("clubManagerAuth")
    localStorage.removeItem("selectedClub")
    setIsAuthenticated(false)
    setSelectedClub(null)
  }

  const handleClubSwitch = () => {
    localStorage.removeItem("selectedClub")
    setSelectedClub(null)
  }

  if (isLoading) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          </div>
        </body>
      </html>
    )
  }

  if (!isAuthenticated) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider>{children}</ThemeProvider>
        </body>
      </html>
    )
  }

  if (!selectedClub) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider>{children}</ThemeProvider>
        </body>
      </html>
    )
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <DataProvider>
            <SidebarProvider>
              <AppSidebar onLogout={handleLogout} onClubSwitch={handleClubSwitch} currentClub={selectedClub} />
              <main className="flex-1">{children}</main>
            </SidebarProvider>
          </DataProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
