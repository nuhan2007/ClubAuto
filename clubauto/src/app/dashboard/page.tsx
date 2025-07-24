"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { CalendarDays, Users, FileText, TrendingUp, AlertCircle } from "lucide-react"
import { useData } from "@/lib/data-context"
import { QuickAddMember } from "@/components/quick-add-member"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  
  const { members, meetingNotes, events, hourEntries, attendanceRecords, tasks } = useData()

  // Calculate real stats
  const totalMembers = members.length
  const activeMembers = members.filter((m) => m.status === "active").length
  const averageAttendance =
    members.length > 0 ? Math.round(members.reduce((sum, member) => sum + member.attendance_percentage, 0) / members.length) : 0

  // Get current month meetings
  const thisMonthMeetings = meetingNotes.filter((note) =>
    note.date.includes(new Date().getFullYear().toString()),
  ).length

  // Get upcoming events
  const upcomingEvents = events.filter((event) => event.status === "upcoming")

  // Get pending tasks
  const pendingTasks = tasks.filter((task) => task.status === "pending").length

  // Get recent meetings (last 3)
  const recentMeetings = meetingNotes.slice(0, 3)

  // Get upcoming events (next 3)
  const nextEvents = upcomingEvents.slice(0, 3)

  const router = useRouter();

  const handleViewMeetings = () => {
    router.push("/meeting-notes")
  }

  const handleViewCalendar = () => {
    router.push("/events");
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-orange-50/30">
      <header className="flex items-center justify-between px-4 py-3 border-b bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <QuickAddMember />
        </div>
      </header>

      <div className="flex-1 p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Total Members</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{totalMembers}</div>
              <p className="text-xs text-blue-600">{activeMembers} active members</p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-800">Meetings This Month</CardTitle>
              <CalendarDays className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">{thisMonthMeetings}</div>
              <p className="text-xs text-orange-600">{upcomingEvents.length} upcoming events</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800">Average Attendance</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{averageAttendance}%</div>
              <p className="text-xs text-green-600">Across all members</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-800">Pending Tasks</CardTitle>
              <AlertCircle className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">{pendingTasks}</div>
              <p className="text-xs text-purple-600">Tasks to complete</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Meetings */}
          <Card className="border-blue-100 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <FileText className="h-5 w-5" />
                Recent Meetings
              </CardTitle>
              <CardDescription>Latest meeting notes and summaries</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentMeetings.length > 0 ? (
                recentMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="flex items-center justify-between p-3 border border-blue-100 rounded-lg bg-blue-50/50"
                  >
                    <div>
                      <h4 className="font-medium text-blue-900">{meeting.title}</h4>
                      <p className="text-sm text-blue-600">{meeting.date}</p>
                    </div>
                    <Badge
                      variant={meeting.status === "completed" ? "secondary" : "default"}
                      className="bg-blue-100 text-blue-800"
                    >
                      {meeting.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">No meetings recorded yet</div>
              )}
              <Button
                onClick={handleViewMeetings}
                variant="outline"
                className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 bg-transparent"
              >
                View All Meetings
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="border-orange-100 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <CalendarDays className="h-5 w-5" />
                Upcoming Events
              </CardTitle>
              <CardDescription>Important dates and deadlines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {nextEvents.length > 0 ? (
                nextEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-3 border border-orange-100 rounded-lg bg-orange-50/50"
                  >
                    <div>
                      <h4 className="font-medium text-orange-900">{event.title}</h4>
                      <p className="text-sm text-orange-600">{event.date}</p>
                    </div>
                    <Badge
                      variant={event.priority === "high" ? "destructive" : "outline"}
                      className="bg-orange-100 text-orange-800"
                    >
                      {event.category}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">No upcoming events scheduled</div>
              )}
              <Button
                onClick={handleViewCalendar}
                variant="outline"
                className="w-full border-orange-200 text-orange-700 hover:bg-orange-50 bg-transparent"
              >
                View Events
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
