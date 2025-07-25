/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
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
import { FileText, Plus, Search, Calendar, Users, Clock, CheckSquare, Edit, Trash2, Eye } from "lucide-react"
import { useData } from "@/lib/data-context"

export default function MeetingNotesPage() {
  const { meetingNotes, addMeetingNote, updateMeetingNote, deleteMeetingNote, loading } = useData()
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<any>(null)
  const [viewingNote, setViewingNote] = useState<any>(null)
  const [deletingNote, setDeletingNote] = useState<any>(null)
  const [filterStatus, setFilterStatus] = useState("All")

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    attendees: "",
    duration: "",
    summary: "",
    actionItems: ["", "", ""],
  })

  const [editFormData, setEditFormData] = useState({
    title: "",
    date: "",
    attendees: "",
    duration: "",
    summary: "",
    status: "",
    actionItems: ["", "", ""],
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleEditInputChange = (field: string, value: string) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleActionItemChange = (index: number, value: string) => {
    const newActionItems = [...formData.actionItems]
    newActionItems[index] = value
    setFormData((prev) => ({ ...prev, actionItems: newActionItems }))
  }

  const handleEditActionItemChange = (index: number, value: string) => {
    const newActionItems = [...editFormData.actionItems]
    newActionItems[index] = value
    setEditFormData((prev) => ({ ...prev, actionItems: newActionItems }))
  }

  const handleSubmit = async () => {
    if (!formData.title || !formData.date || !formData.attendees || !formData.summary) {
      alert("Please fill in all required fields")
      return
    }

    const actionItems = formData.actionItems.filter((item) => item.trim())

    try {
      await addMeetingNote({
        title: formData.title,
        date: formData.date,
        attendees: Number.parseInt(formData.attendees),
        duration: formData.duration,
        status: "completed",
        summary: formData.summary,
        action_items: actionItems,
      })

      // Reset form
      setFormData({
        title: "",
        date: "",
        attendees: "",
        duration: "",
        summary: "",
        actionItems: ["", "", ""],
      })

      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error adding meeting note:", error)
      alert("Failed to save meeting notes. Please try again.")
    }
  }

  const handleEdit = (note: any) => {
    setEditingNote(note)
    setEditFormData({
      title: note.title,
      date: note.date,
      attendees: note.attendees?.toString() || "",
      duration: note.duration || "",
      summary: note.summary || "",
      status: note.status,
      actionItems: note.action_items?.length > 0 ? [...note.action_items, "", ""].slice(0, 3) : ["", "", ""],
    })
    setIsEditDialogOpen(true)
  }

  const handleView = (note: any) => {
    setViewingNote(note)
    setIsViewDialogOpen(true)
  }

  const handleDeleteClick = (note: any) => {
    setDeletingNote(note)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingNote) return

    try {
      await deleteMeetingNote(deletingNote.id)
      setIsDeleteDialogOpen(false)
      setDeletingNote(null)
    } catch (error) {
      console.error("Error deleting meeting note:", error)
      alert("Failed to delete meeting note. Please try again.")
    }
  }

  const handleEditSubmit = async () => {
    if (!editFormData.title || !editFormData.date || !editFormData.attendees || !editFormData.summary) {
      alert("Please fill in all required fields")
      return
    }

    const actionItems = editFormData.actionItems.filter((item) => item.trim())

    try {
      await updateMeetingNote(editingNote.id, {
        title: editFormData.title,
        date: editFormData.date,
        attendees: Number.parseInt(editFormData.attendees),
        duration: editFormData.duration,
        status: editFormData.status,
        summary: editFormData.summary,
        action_items: actionItems,
      })

      setIsEditDialogOpen(false)
      setEditingNote(null)
    } catch (error) {
      console.error("Error updating meeting note:", error)
      alert("Failed to update meeting notes. Please try again.")
    }
  }

  const filteredNotes = meetingNotes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (note.summary && note.summary.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = filterStatus === "All" || note.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>
      case "draft":
        return <Badge className="bg-yellow-500">Draft</Badge>
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const totalNotes = meetingNotes.length
  const totalAttendees = meetingNotes.reduce((sum, note) => sum + (note.attendees || 0), 0)
  const averageAttendees = totalNotes > 0 ? Math.round(totalAttendees / totalNotes) : 0

  // Calculate this month meetings
  const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM format
  const thisMonthMeetings = meetingNotes.filter((note) => note.date.startsWith(currentMonth)).length

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold">Meeting Notes</h1>
          </div>
        </header>
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading meeting notes...</p>
          </div>
        </div>
      </div>
    )
  }

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
                New Meeting Notes
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Meeting Notes</DialogTitle>
                <DialogDescription>Document the key points and outcomes from your meeting.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="meeting-title">Meeting Title</Label>
                    <Input
                      id="meeting-title"
                      placeholder="Enter meeting title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meeting-date">Date</Label>
                    <Input
                      id="meeting-date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="attendees">Number of Attendees</Label>
                    <Input
                      id="attendees"
                      type="number"
                      placeholder="e.g., 15"
                      value={formData.attendees}
                      onChange={(e) => handleInputChange("attendees", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      placeholder="e.g., 1 hour 30 minutes"
                      value={formData.duration}
                      onChange={(e) => handleInputChange("duration", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="summary">Meeting Summary</Label>
                  <Textarea
                    id="summary"
                    placeholder="Summarize the key points discussed in the meeting..."
                    className="min-h-[120px]"
                    value={formData.summary}
                    onChange={(e) => handleInputChange("summary", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Action Items</Label>
                  <div className="space-y-2">
                    {formData.actionItems.map((item, index) => (
                      <Input
                        key={index}
                        placeholder={`Action item ${index + 1}`}
                        value={item}
                        onChange={(e) => handleActionItemChange(index, e.target.value)}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit}>Save Notes</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit Meeting Notes Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Meeting Notes</DialogTitle>
                <DialogDescription>Update the meeting notes and details.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-meeting-title">Meeting Title</Label>
                    <Input
                      id="edit-meeting-title"
                      placeholder="Enter meeting title"
                      value={editFormData.title}
                      onChange={(e) => handleEditInputChange("title", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-meeting-date">Date</Label>
                    <Input
                      id="edit-meeting-date"
                      type="date"
                      value={editFormData.date}
                      onChange={(e) => handleEditInputChange("date", e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-attendees">Number of Attendees</Label>
                    <Input
                      id="edit-attendees"
                      type="number"
                      placeholder="e.g., 15"
                      value={editFormData.attendees}
                      onChange={(e) => handleEditInputChange("attendees", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-duration">Duration</Label>
                    <Input
                      id="edit-duration"
                      placeholder="e.g., 1 hour 30 minutes"
                      value={editFormData.duration}
                      onChange={(e) => handleEditInputChange("duration", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <Select
                      value={editFormData.status}
                      onValueChange={(value) => handleEditInputChange("status", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-summary">Meeting Summary</Label>
                  <Textarea
                    id="edit-summary"
                    placeholder="Summarize the key points discussed in the meeting..."
                    className="min-h-[120px]"
                    value={editFormData.summary}
                    onChange={(e) => handleEditInputChange("summary", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Action Items</Label>
                  <div className="space-y-2">
                    {editFormData.actionItems.map((item, index) => (
                      <Input
                        key={index}
                        placeholder={`Action item ${index + 1}`}
                        value={item}
                        onChange={(e) => handleEditActionItemChange(index, e.target.value)}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleEditSubmit}>Update Notes</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* View Meeting Notes Dialog */}
          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {viewingNote?.title}
                </DialogTitle>
                <DialogDescription>
                  Meeting held on {viewingNote && new Date(viewingNote.date).toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>
              {viewingNote && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">Date</h4>
                      <p>{new Date(viewingNote.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">Status</h4>
                      <div className="mt-1">{getStatusBadge(viewingNote.status)}</div>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">Attendees</h4>
                      <p>{viewingNote.attendees} people</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">Duration</h4>
                      <p>{viewingNote.duration || "Not specified"}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">Meeting Summary</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="whitespace-pre-wrap">{viewingNote.summary}</p>
                    </div>
                  </div>

                  {viewingNote.action_items && viewingNote.action_items.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2 flex items-center gap-2">
                        <CheckSquare className="h-4 w-4" />
                        Action Items
                      </h4>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <ul className="space-y-2">
                          {viewingNote.action_items.map((item: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-blue-600 font-bold">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                      Close
                    </Button>
                    <Button
                      onClick={() => {
                        setIsViewDialogOpen(false)
                        handleEdit(viewingNote)
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Notes
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-red-700">
                  <Trash2 className="h-5 w-5" />
                  Delete Meeting Notes
                </DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete "{deletingNote?.title}"? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteConfirm}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="flex-1 p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Meetings</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalNotes}</div>
              <p className="text-xs text-muted-foreground">Documented meetings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{thisMonthMeetings}</div>
              <p className="text-xs text-muted-foreground">Meetings this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAttendees}</div>
              <p className="text-xs text-muted-foreground">Across all meetings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Attendance</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageAttendees}</div>
              <p className="text-xs text-muted-foreground">Per meeting</p>
            </CardContent>
          </Card>
        </div>

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
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Meeting Notes List */}
        <div className="space-y-4">
          {filteredNotes.map((note) => (
            <Card key={note.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {note.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(note.date).toLocaleDateString()}
                      </span>
                      {note.attendees && (
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {note.attendees} attendees
                        </span>
                      )}
                      {note.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {note.duration}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">{getStatusBadge(note.status)}</div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {note.summary && <p className="text-sm text-muted-foreground">{note.summary}</p>}

                  {/* Action Items */}
                  {note.action_items && note.action_items.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <CheckSquare className="h-4 w-4" />
                        Action Items
                      </h4>
                      <ul className="space-y-1">
                        {note.action_items.map((item: string, index: number) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleView(note)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View Full Notes
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(note)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(note)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
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
                {searchTerm ? "Try adjusting your search terms" : "Get started by documenting your first meeting"}
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
