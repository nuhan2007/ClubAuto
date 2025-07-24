import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { DataProvider } from "@/lib/data-context"
import { SidebarProvider } from "@/components/ui/sidebar"
import ClientLayout from "./clientLayout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ClubAuto - Manage Your High School Club",
  description:
    "A comprehensive platform for managing high school clubs, tracking attendance, organizing events, and more.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <DataProvider>
            <SidebarProvider>
              <ClientLayout>{children}</ClientLayout>
            </SidebarProvider>
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
