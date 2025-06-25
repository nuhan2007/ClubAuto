import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ClientLayout from "./clientLayout"
import { DataProvider } from "@/lib/data-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ClubSync",
  description: "Created by Nuhan Hasan",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientLayout>
            <DataProvider>
              {children}
            </DataProvider>
          </ClientLayout>
}
