"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { currentClub } = useData()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!authLoading && isClient) {
      // Public routes that don't require authentication
      const publicRoutes = ["/", "/login"]
      const isPublicRoute = publicRoutes.includes(pathname)

      if (!user && !isPublicRoute) {
        router.push("/login")
        return
      }

      if (user && pathname === "/login") {
        router.push("/select-club")
        return
      }

      // Routes that require club selection
      const clubRoutes = [
        "/dashboard",
        "/members",
        "/meeting-notes",
        "/attendance",
        "/hours",
        "/events",
        "/tasks",
        "/settings",
      ]
      const requiresClub = clubRoutes.some((route) => pathname.startsWith(route))

      if (user && requiresClub && !currentClub) {
        router.push("/select-club")
        return
      }
    }
  }, [user, authLoading, pathname, currentClub, router, isClient])

  if (authLoading || !isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-orange-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show sidebar only when user is authenticated and has selected a club
  const showSidebar = user && currentClub && !["/", "/login", "/select-club"].includes(pathname)

  if (showSidebar) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1">{children}</main>
      </SidebarProvider>
    )
  }

  return <>{children}</>
}
