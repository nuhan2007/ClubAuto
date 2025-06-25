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
import { useData } from "@/lib/data-context"

export default function MeetingNotes() {
  const { meetingNotes, addMeetingNote, updateMeetingNote, deleteMeetingNote } = useData()
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    attendees: "",
    duration: "",
    summary: "",
    actionItems: "",
    status: "completed",
  })

  // Add edit state
  const [editingNote, setEditingNote] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Add edit form data
  const [editFormData, setEditFormData] = useState({
    title: "",
    date: "",
    attendees: "",
    duration: "",
    summary: "",
    actionItems: "",
    status: "completed",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    if (!formData.title || !formData.date || !formData.summary) {
      alert("Please fill in all required fields")
      return
    }

    addMeetingNote({
      title: formData.title,
      date: formData.date,
      attendees: Number.parseInt(formData.attendees) || 0,
      duration: formData.duration,
      status: formData.status,
      summary: formData.summary,
      actionItems: formData.actionItems.split("\n").filter((item) => item.trim()),
    })

    // Reset form
    setFormData({
      title: "",
      date: "",
      attendees: "",
      duration: "",
      summary: "",
      actionItems: "",
      status: "completed",
    })

    setIsDialogOpen(false)
  }

  const handleEdit = (note: any) => {
    setEditingNote(note)
    setEditFormData({
      title: note.title,
      date: note.date,
      attendees: note.attendees.toString(),
      duration: note.duration,
      summary: note.summary,
      actionItems: note.actionItems.join("\n"),
      status: note.status,
    })
    setIsEditDialogOpen(true)
  }

  const handleEditSubmit = () => {
    if (!editFormData.title || !editFormData.date || !editFormData.summary) {
      alert("Please fill in all required fields")
      return
    }

    updateMeetingNote(editingNote.id, {
      title: editFormData.title,
      date: editFormData.date,
      attendees: Number.parseInt(editFormData.attendees) || 0,
      duration: editFormData.duration,
      status: editFormData.status,
      summary: editFormData.summary,
      actionItems: editFormData.actionItems.split("\n").filter((item) => item.trim()),
    })

    setIsEditDialogOpen(false)
    setEditingNote(null)
  }

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this meeting note?")) {
      deleteMeetingNote(id)
    }
  }

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
        <div className="flex items-center gap-2">
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
                    <Input
                      id="title"
                      placeholder="Enter meeting title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="attendees">Attendees</Label>
                    <Input
                      id="attendees"
                      type="number"
                      placeholder="Number of attendees"
                      value={formData.attendees}
                      onChange={(e) => handleInputChange("attendees", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      placeholder="e.g., 45 min"
                      value={formData.duration}
                      onChange={(e) => handleInputChange("duration", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="summary">Meeting Summary</Label>
                  <Textarea
                    id="summary"
                    placeholder="Summarize the main topics discussed..."
                    className="min-h-[100px]"
                    value={formData.summary}
                    onChange={(e) => handleInputChange("summary", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="action-items">Action Items</Label>
                  <Textarea
                    id="action-items"
                    placeholder="List action items (one per line)..."
                    className="min-h-[80px]"
                    value={formData.actionItems}
                    onChange={(e) => handleInputChange("actionItems", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
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
                  <Button onClick={handleSubmit}>Save Meeting Notes</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Meeting Notes</DialogTitle>
                <DialogDescription>Update the meeting notes and action items.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-title">Meeting Title</Label>
                    <Input
                      id="edit-title"
                      placeholder="Enter meeting title"
                      value={editFormData.title}
                      onChange={(e) => setEditFormData((prev) => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-date">Date</Label>
                    <Input
                      id="edit-date"
                      type="date"
                      value={editFormData.date}
                      onChange={(e) => setEditFormData((prev) => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-attendees">Attendees</Label>
                    <Input
                      id="edit-attendees"
                      type="number"
                      placeholder="Number of attendees"
                      value={editFormData.attendees}
                      onChange={(e) => setEditFormData((prev) => ({ ...prev, attendees: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-duration">Duration</Label>
                    <Input
                      id="edit-duration"
                      placeholder="e.g., 45 min"
                      value={editFormData.duration}
                      onChange={(e) => setEditFormData((prev) => ({ ...prev, duration: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-summary">Meeting Summary</Label>
                  <Textarea
                    id="edit-summary"
                    placeholder="Summarize the main topics discussed..."
                    className="min-h-[100px]"
                    value={editFormData.summary}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, summary: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-action-items">Action Items</Label>
                  <Textarea
                    id="edit-action-items"
                    placeholder="List action items (one per line)..."
                    className="min-h-[80px]"
                    value={editFormData.actionItems}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, actionItems: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={editFormData.status}
                    onValueChange={(value) => setEditFormData((prev) => ({ ...prev, status: value }))}
                  >
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
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleEditSubmit}>Update Meeting Notes</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
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
                  {note.actionItems.length > 0 && (
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
                  )}
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(note)}>
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(note.id)}>
                      Delete
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
