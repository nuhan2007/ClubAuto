"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { useEffect, useState } from "react"
import LoginPage from "./login/page"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const savedAuth = localStorage.getItem("clubManagerAuth")
      setIsAuthenticated(savedAuth === "true")
      setIsLoading(false)
    }

    checkAuth()

    // Listen for storage changes (for logout from other tabs)
    window.addEventListener("storage", checkAuth)
    return () => window.removeEventListener("storage", checkAuth)
  }, [])

  const handleLogin = () => {
    localStorage.setItem("clubManagerAuth", "true")
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem("clubManagerAuth")
    setIsAuthenticated(false)
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </body>
      </html>
    )
  }

  // If not authenticated, show only the login page
  if (!isAuthenticated) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <LoginPage onLogin={handleLogin} />
        </body>
      </html>
    )
  }

  // If authenticated, show the full app with sidebar
  return (
    <html lang="en">
      <body className={inter.className}>
        <SidebarProvider>
          <AppSidebar onLogout={handleLogout} />
          <main className="flex-1">{children}</main>
        </SidebarProvider>
      </body>
    </html>
  )
}
