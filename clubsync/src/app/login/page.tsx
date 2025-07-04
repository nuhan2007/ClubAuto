"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, ArrowLeft } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate login process
    setTimeout(() => {
      localStorage.setItem("clubManagerAuth", "true")
      localStorage.removeItem("selectedClub") // Clear any previous club selection
      setIsLoading(false)
      router.push("/select-club")
    }, 1000)
  }

  const handleSignUp = () => {
    // For now, just do the same as login
    localStorage.setItem("clubManagerAuth", "true")
    localStorage.removeItem("selectedClub")
    router.push("/select-club")
  }

  const handleBackToHome = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-orange-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-orange-600 rounded-lg flex items-center justify-center mr-3">
            <Users className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
            Club Manager
          </h1>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back</CardTitle>
            <CardDescription>Sign in to manage your club</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/50"
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-4">Don't have an account?</p>
              <Button
                variant="outline"
                onClick={handleSignUp}
                className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 bg-transparent"
              >
                Create Account
              </Button>
            </div>

            <div className="mt-6 text-center">
              <Button variant="ghost" onClick={handleBackToHome} className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
