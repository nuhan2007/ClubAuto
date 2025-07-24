"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, CheckCircle, XCircle, ArrowLeft, RefreshCw } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import type { JoinRequest } from "@/lib/data-context"

export default function PendingApprovalPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [pendingRequests, setPendingRequests] = useState<JoinRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    loadPendingRequests()
  }, [user, router])

  const loadPendingRequests = () => {
    if (!user) return

    setLoading(true)
    try {
      // Get all pending requests for this user from localStorage
      const allRequests: JoinRequest[] = []

      // Check localStorage for all club requests
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith("join_requests_")) {
          const requests = JSON.parse(localStorage.getItem(key) || "[]")
          const userRequests = requests.filter((req: JoinRequest) => req.user_id === user.id)
          allRequests.push(...userRequests)
        }
      }

      setPendingRequests(allRequests)
    } catch (error) {
      console.error("Error loading pending requests:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Pending</span>
      case "approved":
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Approved</span>
      case "rejected":
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Rejected</span>
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Unknown</span>
    }
  }

  const handleBackToHome = () => {
    router.push("/")
  }

  const handleGoToClubs = () => {
    router.push("/select-club")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-orange-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your requests...</p>
        </div>
      </div>
    )
  }

  const hasPendingRequests = pendingRequests.some((req) => req.status === "pending")
  const hasApprovedRequests = pendingRequests.some((req) => req.status === "approved")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-orange-50/30 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Join Requests</h1>
            <p className="text-gray-600 mt-2">Track your club join request status</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={loadPendingRequests}
              variant="outline"
              size="sm"
              className="border-gray-300 bg-transparent"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={handleBackToHome} variant="outline" className="border-gray-300 bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-600">
                {pendingRequests.filter((req) => req.status === "pending").length}
              </div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {pendingRequests.filter((req) => req.status === "approved").length}
              </div>
              <div className="text-sm text-muted-foreground">Approved</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600">
                {pendingRequests.filter((req) => req.status === "rejected").length}
              </div>
              <div className="text-sm text-muted-foreground">Rejected</div>
            </CardContent>
          </Card>
        </div>

        {/* Requests List */}
        {pendingRequests.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Clock className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No join requests found</h3>
              <p className="text-muted-foreground text-center mb-6">
                You haven't requested to join any clubs yet. Use a club code to request access.
              </p>
              <Button onClick={handleBackToHome}>Go Back to Home</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <Card key={request.id} className="bg-white/80 backdrop-blur-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(request.status)}
                      <div>
                        <CardTitle className="text-lg">Club Join Request</CardTitle>
                        <CardDescription>
                          Requested on {new Date(request.requested_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Request ID:</span>
                      <span className="font-mono">{request.id}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Club ID:</span>
                      <span className="font-mono">{request.club_id}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="capitalize">{request.status}</span>
                    </div>
                  </div>

                  {request.status === "pending" && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="text-sm text-yellow-800">
                        <Clock className="h-4 w-4 inline mr-1" />
                        Your request is pending approval from club officers. You'll be notified once it's reviewed.
                      </p>
                    </div>
                  )}

                  {request.status === "approved" && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-sm text-green-800 mb-2">
                        <CheckCircle className="h-4 w-4 inline mr-1" />
                        Congratulations! Your request has been approved.
                      </p>
                      <Button
                        onClick={handleGoToClubs}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Go to My Clubs
                      </Button>
                    </div>
                  )}

                  {request.status === "rejected" && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-800">
                        <XCircle className="h-4 w-4 inline mr-1" />
                        Your request was not approved. You may contact the club officers for more information.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        {hasApprovedRequests && (
          <div className="mt-8 text-center">
            <Button onClick={handleGoToClubs} className="bg-blue-600 hover:bg-blue-700 text-white">
              Go to My Clubs
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
