"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Plus, Search, Calendar, Users, Clock } from "lucide-react"

const meetingNotes = [
  {
    id: 1,
    title: "Fall Play Planning",
    date: "December 15, 2024",
    attendees: 18,
    duration: "45 min",
    status: "completed",
    summary: "Discussed casting decisions, rehearsal schedule, and budget allocation for the fall production.",
    actionItems: ["Finalize cast list by December 20", "Book rehearsal space for January", "Order costumes and props"],
  },
  {
    id: 2,
    title: "Budget Review",
    date: "December 10, 2024",
    attendees: 12,
    duration: "30 min",
    status: "completed",
    summary: "Reviewed current budget status and discussed fundraising opportunities.",
    actionItems: ["Submit fundraiser proposal", "Update expense tracking sheet", "Plan bake sale for next month"],
  },
  {
    id: 3,
    title: "Officer Elections",
    date: "December 5, 2024",
    attendees: 24,
    duration: "60 min",
    status: "completed",
    summary: "Conducted elections for next semester's officer positions.",
    actionItems: ["Announce election results", "Schedule officer transition meeting", "Update club roster"],
  },
]

export default function MeetingNotes() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredNotes = meetingNotes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.summary.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold">Meeting Notes</h1>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Meeting
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Meeting Notes</DialogTitle>
              <DialogDescription>Record notes and action items from your club meeting.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Meeting Title</Label>
                  <Input id="title" placeholder="Enter meeting title" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="attendees">Attendees</Label>
                  <Input id="attendees" type="number" placeholder="Number of attendees" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input id="duration" placeholder="e.g., 45 min" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="summary">Meeting Summary</Label>
                <Textarea id="summary" placeholder="Summarize the main topics discussed..." className="min-h-[100px]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="action-items">Action Items</Label>
                <Textarea
                  id="action-items"
                  placeholder="List action items (one per line)..."
                  className="min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsDialogOpen(false)}>Save Meeting Notes</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </header>

      <div className="flex-1 p-6 space-y-6">
        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search meeting notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Meetings</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Meeting Notes List */}
        <div className="space-y-4">
          {filteredNotes.map((note) => (
            <Card key={note.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {note.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {note.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {note.attendees} attendees
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {note.duration}
                      </span>
                    </CardDescription>
                  </div>
                  <Badge variant={note.status === "completed" ? "secondary" : "default"}>{note.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Summary</h4>
                    <p className="text-sm text-muted-foreground">{note.summary}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Action Items</h4>
                    <ul className="space-y-1">
                      {note.actionItems.map((item, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No meeting notes found</h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchTerm ? "Try adjusting your search terms" : "Get started by creating your first meeting notes"}
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Meeting Notes
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
