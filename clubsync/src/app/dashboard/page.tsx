"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { CalendarDays, Users, FileText, TrendingUp, Clock, AlertCircle, LogOut } from "lucide-react"
import { useData } from "@/lib/data-context"
import { QuickAddMember } from "@/components/quick-add-member"

export default function Dashboard() {
  const { members, meetingNotes, events, hourEntries, attendanceRecords, tasks } = useData()

  const handleLogout = () => {
    localStorage.removeItem("clubManagerAuth")
    window.location.reload() // This will trigger the auth check in ClientLayout
  }

  // Calculate real stats
  const totalMembers = members.length
  const activeMembers = members.filter((m) => m.status === "active").length
  const averageAttendance =
    members.length > 0 ? Math.round(members.reduce((sum, member) => sum + member.attendance, 0) / members.length) : 0

  // Get current month meetings
  const currentMonth = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })
  const thisMonthMeetings = meetingNotes.filter((note) =>
    note.date.includes(new Date().getFullYear().toString()),
  ).length

  // Get upcoming events
  const upcomingEvents = events.filter((event) => event.status === "upcoming")
  const nextEvent = upcomingEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]

  // Get pending tasks
  const pendingTasks = tasks.filter((task) => task.status === "pending").length

  // Get recent meetings (last 3)
  const recentMeetings = meetingNotes.slice(0, 3)

  // Get upcoming events (next 3)
  const nextEvents = upcomingEvents.slice(0, 3)

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <QuickAddMember />
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="flex-1 p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMembers}</div>
              <p className="text-xs text-muted-foreground">{activeMembers} active members</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Meetings This Month</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{thisMonthMeetings}</div>
              <p className="text-xs text-muted-foreground">{upcomingEvents.length} upcoming events</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageAttendance}%</div>
              <p className="text-xs text-muted-foreground">Across all members</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingTasks}</div>
              <p className="text-xs text-muted-foreground">Tasks to complete</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Meetings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Meetings
              </CardTitle>
              <CardDescription>Latest meeting notes and summaries</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentMeetings.length > 0 ? (
                recentMeetings.map((meeting) => (
                  <div key={meeting.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{meeting.title}</h4>
                      <p className="text-sm text-muted-foreground">{meeting.date}</p>
                    </div>
                    <Badge variant={meeting.status === "completed" ? "secondary" : "default"}>{meeting.status}</Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">No meetings recorded yet</div>
              )}
              <Button variant="outline" className="w-full">
                View All Meetings
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Upcoming Events
              </CardTitle>
              <CardDescription>Important dates and deadlines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {nextEvents.length > 0 ? (
                nextEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{event.title}</h4>
                      <p className="text-sm text-muted-foreground">{event.date}</p>
                    </div>
                    <Badge variant={event.priority === "high" ? "destructive" : "outline"}>{event.category}</Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">No upcoming events scheduled</div>
              )}
              <Button variant="outline" className="w-full">
                View Calendar
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <Button className="h-20 flex-col gap-2">
                <FileText className="h-5 w-5" />
                New Meeting Notes
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Users className="h-5 w-5" />
                Take Attendance
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <CalendarDays className="h-5 w-5" />
                Schedule Event
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Clock className="h-5 w-5" />
                Log Hours
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
