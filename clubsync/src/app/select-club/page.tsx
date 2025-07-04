"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, Clock, Star, ChevronRight, LogOut } from "lucide-react"

const userClubs = [
  {
    id: "drama-club",
    name: "Drama Club",
    school: "Lincoln High School",
    role: "President",
    members: 24,
    upcomingEvents: 3,
    description: "High school drama and theater club focused on developing performing arts skills.",
    lastActivity: "2 hours ago",
    color: "bg-blue-500",
    isActive: true,
  },
  {
    id: "debate-team",
    name: "Debate Team",
    school: "Lincoln High School",
    role: "Vice President",
    members: 18,
    upcomingEvents: 2,
    description: "Competitive debate team participating in regional and state tournaments.",
    lastActivity: "1 day ago",
    color: "bg-green-500",
    isActive: true,
  },
  {
    id: "robotics-club",
    name: "Robotics Club",
    school: "Lincoln High School",
    role: "Member",
    members: 32,
    upcomingEvents: 1,
    description: "Building and programming robots for FIRST Robotics competitions.",
    lastActivity: "3 days ago",
    color: "bg-purple-500",
    isActive: true,
  },
  {
    id: "chess-club",
    name: "Chess Club",
    school: "Lincoln High School",
    role: "Secretary",
    members: 15,
    upcomingEvents: 0,
    description: "Weekly chess meetings and tournament preparation.",
    lastActivity: "1 week ago",
    color: "bg-orange-500",
    isActive: false,
  },
]

export default function SelectClubPage() {
  const [selectedClub, setSelectedClub] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const authStatus = localStorage.getItem("clubManagerAuth")
    if (authStatus !== "true") {
      router.push("/login")
    }
  }, [router])

  const handleClubSelect = (clubId: string) => {
    const club = userClubs.find((c) => c.id === clubId)
    if (club) {
      localStorage.setItem("selectedClub", club.name)
      setSelectedClub(club.name)
      router.push("/dashboard")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("clubManagerAuth")
    localStorage.removeItem("selectedClub")
    router.push("/")
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "President":
        return <Badge className="bg-yellow-500 text-white">President</Badge>
      case "Vice President":
        return <Badge className="bg-blue-500 text-white">Vice President</Badge>
      case "Secretary":
        return <Badge className="bg-green-500 text-white">Secretary</Badge>
      case "Treasurer":
        return <Badge className="bg-purple-500 text-white">Treasurer</Badge>
      default:
        return <Badge variant="secondary">{role}</Badge>
    }
  }

  const activeClubs = userClubs.filter((club) => club.isActive)
  const inactiveClubs = userClubs.filter((club) => !club.isActive)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-orange-50/30 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Select a Club</h1>
            <p className="text-gray-600 mt-2">Choose which club you'd like to manage</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="border-gray-300 bg-transparent">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Active Clubs */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Active Clubs
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeClubs.map((club) => (
              <Card
                key={club.id}
                className="hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-blue-300 bg-white/80 backdrop-blur-sm"
                onClick={() => handleClubSelect(club.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-lg ${club.color} flex items-center justify-center text-white font-bold text-lg`}
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
                  <p className="text-sm text-muted-foreground line-clamp-2">{club.description}</p>

                  <div className="flex items-center justify-between">
                    {getRoleBadge(club.role)}
                    <span className="text-xs text-muted-foreground">Active {club.lastActivity}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{club.members}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">Members</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{club.upcomingEvents}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">Events</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Inactive Clubs */}
        {inactiveClubs.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-400" />
              Inactive Clubs
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {inactiveClubs.map((club) => (
                <Card
                  key={club.id}
                  className="opacity-60 hover:opacity-80 transition-opacity cursor-pointer bg-white/60 backdrop-blur-sm"
                  onClick={() => handleClubSelect(club.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-lg ${club.color} flex items-center justify-center text-white font-bold text-lg opacity-70`}
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
                    <p className="text-sm text-muted-foreground line-clamp-2">{club.description}</p>

                    <div className="flex items-center justify-between">
                      {getRoleBadge(club.role)}
                      <span className="text-xs text-muted-foreground">Last active {club.lastActivity}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{club.members}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">Members</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{club.upcomingEvents}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">Events</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">{userClubs.length}</div>
              <div className="text-sm text-muted-foreground">Total Clubs</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600">{activeClubs.length}</div>
              <div className="text-sm text-muted-foreground">Active Clubs</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {userClubs.reduce((sum, club) => sum + club.upcomingEvents, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Upcoming Events</div>
            </CardContent>
          </Card>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">Don't see your club? Contact your club advisor to get access.</p>
        </div>
      </div>
    </div>
  )
}
