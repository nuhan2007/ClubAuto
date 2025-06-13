import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { CalendarDays, Users, FileText, TrendingUp, Clock, AlertCircle } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center gap-2 px-4 py-3 border-b">
        <SidebarTrigger />
        <h1 className="text-2xl font-bold">Dashboard</h1>
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
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Meetings This Month</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">4 completed, 4 upcoming</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground">+5% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">2 due this week</p>
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
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Fall Play Planning</h4>
                  <p className="text-sm text-muted-foreground">December 15, 2024</p>
                </div>
                <Badge variant="secondary">Completed</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Budget Review</h4>
                  <p className="text-sm text-muted-foreground">December 10, 2024</p>
                </div>
                <Badge variant="secondary">Completed</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Officer Elections</h4>
                  <p className="text-sm text-muted-foreground">December 5, 2024</p>
                </div>
                <Badge variant="secondary">Completed</Badge>
              </div>
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
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Winter Performance</h4>
                  <p className="text-sm text-muted-foreground">January 20, 2025</p>
                </div>
                <Badge>Event</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Fundraiser Meeting</h4>
                  <p className="text-sm text-muted-foreground">December 22, 2024</p>
                </div>
                <Badge variant="outline">Meeting</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Script Deadline</h4>
                  <p className="text-sm text-muted-foreground">December 30, 2024</p>
                </div>
                <Badge variant="destructive">Deadline</Badge>
              </div>
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
                Send Reminder
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
