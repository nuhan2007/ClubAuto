/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Calendar, Star, ChevronRight, LogOut } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { supabase } from "@/lib/supabase"
import { CreateClubDialog } from "@/components/create-club-dialog"
import { JoinClubDialog } from "@/components/join-club-dialog"


export default function SelectClubPage() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { user, signOut } = useAuth()
  const { setCurrentClub, loadUserClubs, userClubs } = useData()

  useEffect(() => {
    if (user) {
      loadUserClubs().finally(() => setLoading(false))
    }
  }, [user])

  const handleClubSelect = async (clubId: string) => {
    const selectedClub = userClubs.find((c) => c.id === clubId)
    if (selectedClub) {
      // Get full club data
      const { data: clubData, error } = await supabase.from("clubs").select("*").eq("id", clubId).single()

      if (error) {
        console.error("Error loading club data:", error)
        return
      }

      setCurrentClub(clubData)
      localStorage.setItem("selectedClub", JSON.stringify(clubData))
      router.push("/dashboard")
    }
  }

  const handleLogout = async () => {
    await signOut()
    
    router.push("/")
  }

  // Generate random colors for clubs
  const getClubColor = (index: number) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-orange-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-red-500",
      "bg-teal-500",
    ]
    return colors[index % colors.length]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-orange-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your clubs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-orange-50/30 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Select a Club</h1>
            <p className="text-gray-600 mt-2">Choose which club you'd like to manage</p>
          </div>
          <div className="flex items-center gap-2">
            <CreateClubDialog onClubCreated={() => loadUserClubs()} />
            <JoinClubDialog onClubJoined={() => loadUserClubs()} />
            <Button variant="outline" onClick={handleLogout} className="border-gray-300 bg-transparent">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {userClubs.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No clubs found</h3>
              <p className="text-muted-foreground text-center mb-6">
                You're not a member of any clubs yet. Create a new club or join an existing one.
              </p>
              <div className="flex gap-3">
                <CreateClubDialog onClubCreated={() => loadUserClubs()} />
                <JoinClubDialog onClubJoined={() => loadUserClubs()} />
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Active Clubs */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Your Clubs
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {userClubs.map((club, index) => (
                  <Card
                    key={club.id}
                    className="hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-blue-300 bg-white/80 backdrop-blur-sm"
                    onClick={() => handleClubSelect(club.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-12 rounded-lg ${getClubColor(index)} flex items-center justify-center text-white font-bold text-lg`}
                          >
                            {club.name.charAt(0)}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{club.name}</CardTitle>
                            <CardDescription>{club.school}</CardDescription>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {club.description || "No description available"}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-blue-600 font-medium">Club Officer</span>
                        <span className="text-xs text-muted-foreground">Active recently</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>--</span>
                          </div>
                          <div className="text-xs text-muted-foreground">Members</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>--</span>
                          </div>
                          <div className="text-xs text-muted-foreground">Events</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-blue-600">{userClubs.length}</div>
                  <div className="text-sm text-muted-foreground">Total Clubs</div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-green-600">{userClubs.length}</div>
                  <div className="text-sm text-muted-foreground">Active Clubs</div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-orange-600">0</div>
                  <div className="text-sm text-muted-foreground">Upcoming Events</div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            All club officers have full access to manage club data and collaborate with other officers.
          </p>
        </div>
      </div>
    </div>
  )
}
