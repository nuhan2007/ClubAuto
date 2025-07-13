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
import { Calendar, Plus, Search, MapPin, Clock, Users, Star, AlertCircle } from "lucide-react"

const eventCategories = ["All", "Performance", "Meeting", "Workshop", "Service", "Social", "Fundraiser"]

export default function EventsPage() {
  // Replace the existing events array with state
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Winter Performance",
      date: "January 20, 2025",
      time: "7:00 PM",
      location: "School Auditorium",
      category: "Performance",
      description: "Annual winter theater performance featuring scenes from classic plays.",
      attendees: 45,
      maxAttendees: 50,
      status: "upcoming",
      priority: "high",
      organizer: "Ms. Sarah Johnson",
    },
    {
      id: 2,
      title: "Fundraiser Meeting",
      date: "December 22, 2024",
      time: "3:30 PM",
      location: "Room 204",
      category: "Meeting",
      description: "Planning session for upcoming bake sale and car wash fundraisers.",
      attendees: 12,
      maxAttendees: 20,
      status: "upcoming",
      priority: "medium",
      organizer: "Alice Johnson",
    },
    {
      id: 3,
      title: "Script Reading Workshop",
      date: "January 5, 2025",
      time: "4:00 PM",
      location: "Drama Room",
      category: "Workshop",
      description: "Workshop on script analysis and character development techniques.",
      attendees: 18,
      maxAttendees: 25,
      status: "upcoming",
      priority: "medium",
      organizer: "Bob Smith",
    },
    {
      id: 4,
      title: "Community Service Day",
      date: "December 28, 2024",
      time: "9:00 AM",
      location: "Local Theater",
      category: "Service",
      description: "Volunteer work at the community theater - set building and maintenance.",
      attendees: 8,
      maxAttendees: 15,
      status: "upcoming",
      priority: "low",
      organizer: "Carol Davis",
    },
    {
      id: 5,
      title: "Fall Play Wrap Party",
      date: "December 18, 2024",
      time: "6:00 PM",
      location: "School Cafeteria",
      category: "Social",
      description: "Celebration party for the successful completion of our fall production.",
      attendees: 24,
      maxAttendees: 30,
      status: "completed",
      priority: "low",
      organizer: "Emma Brown",
    },
  ])

  // Add form state
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    date: "",
    time: "",
    priority: "",
    location: "",
    maxAttendees: "",
    description: "",
    organizer: "",
  })

  // Add edit state
  const [editingEvent, setEditingEvent] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Add edit form data
  const [editFormData, setEditFormData] = useState({
    title: "",
    category: "",
    date: "",
    time: "",
    priority: "",
    location: "",
    maxAttendees: "",
    description: "",
    organizer: "",
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [filterCategory, setFilterCategory] = useState("All")
  const [filterStatus, setFilterStatus] = useState("All")

  // Add form handlers
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    if (!formData.title || !formData.date || !formData.location || !formData.organizer) {
      alert("Please fill in all required fields")
      return
    }

    const newEvent = {
      id: Date.now(),
      title: formData.title,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      category: formData.category,
      description: formData.description,
      attendees: 0,
      maxAttendees: Number.parseInt(formData.maxAttendees) || 50,
      status: "upcoming",
      priority: formData.priority,
      organizer: formData.organizer,
    }

    // Add to the beginning of the array
    setEvents((prev) => [newEvent, ...prev])

    // Reset form
    setFormData({
      title: "",
      category: "",
      date: "",
      time: "",
      priority: "",
      location: "",
      maxAttendees: "",
      description: "",
      organizer: "",
    })

    setIsDialogOpen(false)
  }

  const handleEdit = (event: any) => {
    setEditingEvent(event)
    setEditFormData({
      title: event.title,
      category: event.category,
      date: event.date,
      time: event.time,
      priority: event.priority,
      location: event.location,
      maxAttendees: event.maxAttendees.toString(),
      description: event.description,
      organizer: event.organizer,
    })
    setIsEditDialogOpen(true)
  }

  const handleEditSubmit = () => {
    if (!editFormData.title || !editFormData.date || !editFormData.location || !editFormData.organizer) {
      alert("Please fill in all required fields")
      return
    }

    updateEvent(editingEvent.id, {
      title: editFormData.title,
      date: editFormData.date,
      time: editFormData.time,
      location: editFormData.location,
      category: editFormData.category,
      description: editFormData.description,
      maxAttendees: Number.parseInt(editFormData.maxAttendees) || 50,
      priority: editFormData.priority,
      organizer: editFormData.organizer,
    })

    setIsEditDialogOpen(false)
    setEditingEvent(null)
  }

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this event?")) {
      deleteEvent(id)
    }
  }

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "All" || event.category === filterCategory
    const matchesStatus = filterStatus === "All" || event.status === filterStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge>Upcoming</Badge>
      case "completed":
        return <Badge variant="secondary">Completed</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "medium":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "low":
        return <Star className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

  const upcomingEvents = events.filter((event) => event.status === "upcoming").length
  const totalAttendees = events.reduce((sum, event) => sum + event.attendees, 0)
  const thisMonthEvents = events.filter((event) => event.date.includes("December 2024")).length

  const updateEvent = (id: number, updatedEvent: any) => {
    setEvents((prevEvents) => prevEvents.map((event) => (event.id === id ? { ...event, ...updatedEvent } : event)))
  }

  const deleteEvent = (id: number) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id))
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold">Events</h1>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription>Plan and schedule a new club event or activity.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="event-title">Event Title</Label>
                    <Input
                      id="event-title"
                      placeholder="Enter event title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="performance">Performance</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="workshop">Workshop</SelectItem>
                        <SelectItem value="service">Community Service</SelectItem>
                        <SelectItem value="social">Social</SelectItem>
                        <SelectItem value="fundraiser">Fundraiser</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="event-date">Date</Label>
                    <Input
                      id="event-date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-time">Time</Label>
                    <Input
                      id="event-time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => handleInputChange("time", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-priority">Priority</Label>
                    <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="event-location">Location</Label>
                    <Input
                      id="event-location"
                      placeholder="Event location"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-attendees">Max Attendees</Label>
                    <Input
                      id="max-attendees"
                      type="number"
                      placeholder="e.g., 50"
                      value={formData.maxAttendees}
                      onChange={(e) => handleInputChange("maxAttendees", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event-description">Description</Label>
                  <Textarea
                    id="event-description"
                    placeholder="Describe the event..."
                    className="min-h-[100px]"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organizer">Organizer</Label>
                  <Select value={formData.organizer} onValueChange={(value) => handleInputChange("organizer", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select organizer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ms. Sarah Johnson">Ms. Sarah Johnson (Advisor)</SelectItem>
                      <SelectItem value="Alice Johnson">Alice Johnson</SelectItem>
                      <SelectItem value="Bob Smith">Bob Smith</SelectItem>
                      <SelectItem value="Carol Davis">Carol Davis</SelectItem>
                      <SelectItem value="Emma Brown">Emma Brown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit}>Create Event</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Event</DialogTitle>
                <DialogDescription>Update the event details and information.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-event-title">Event Title</Label>
                    <Input
                      id="edit-event-title"
                      placeholder="Enter event title"
                      value={editFormData.title}
                      onChange={(e) => setEditFormData((prev) => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-event-category">Category</Label>
                    <Select
                      value={editFormData.category}
                      onValueChange={(value) => setEditFormData((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="performance">Performance</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="workshop">Workshop</SelectItem>
                        <SelectItem value="service">Community Service</SelectItem>
                        <SelectItem value="social">Social</SelectItem>
                        <SelectItem value="fundraiser">Fundraiser</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-event-date">Date</Label>
                    <Input
                      id="edit-event-date"
                      type="date"
                      value={editFormData.date}
                      onChange={(e) => setEditFormData((prev) => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-event-time">Time</Label>
                    <Input
                      id="edit-event-time"
                      type="time"
                      value={editFormData.time}
                      onChange={(e) => setEditFormData((prev) => ({ ...prev, time: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-event-priority">Priority</Label>
                    <Select
                      value={editFormData.priority}
                      onValueChange={(value) => setEditFormData((prev) => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-event-location">Location</Label>
                    <Input
                      id="edit-event-location"
                      placeholder="Event location"
                      value={editFormData.location}
                      onChange={(e) => setEditFormData((prev) => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-max-attendees">Max Attendees</Label>
                    <Input
                      id="edit-max-attendees"
                      type="number"
                      placeholder="e.g., 50"
                      value={editFormData.maxAttendees}
                      onChange={(e) => setEditFormData((prev) => ({ ...prev, maxAttendees: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-event-description">Description</Label>
                  <Textarea
                    id="edit-event-description"
                    placeholder="Describe the event..."
                    className="min-h-[100px]"
                    value={editFormData.description}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-organizer">Organizer</Label>
                  <Select
                    value={editFormData.organizer}
                    onValueChange={(value) => setEditFormData((prev) => ({ ...prev, organizer: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select organizer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ms. Sarah Johnson">Ms. Sarah Johnson (Advisor)</SelectItem>
                      <SelectItem value="Alice Johnson">Alice Johnson</SelectItem>
                      <SelectItem value="Bob Smith">Bob Smith</SelectItem>
                      <SelectItem value="Carol Davis">Carol Davis</SelectItem>
                      <SelectItem value="Emma Brown">Emma Brown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleEditSubmit}>Update Event</Button>
                </div>
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
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingEvents}</div>
              <p className="text-xs text-muted-foreground">Events scheduled</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAttendees}</div>
              <p className="text-xs text-muted-foreground">Across all events</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{thisMonthEvents}</div>
              <p className="text-xs text-muted-foreground">Events in December</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Event</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Dec 22</div>
              <p className="text-xs text-muted-foreground">Fundraiser Meeting</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {eventCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      {event.title}
                      {getPriorityIcon(event.priority)}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {event.date} at {event.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {event.attendees}/{event.maxAttendees}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{event.category}</Badge>
                    {getStatusBadge(event.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="font-medium">Organizer:</span> {event.organizer}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {Math.round((event.attendees / event.maxAttendees) * 100)}% full
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(event)}>
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(event.id)}>
                      Delete
                    </Button>
                    {event.status === "upcoming" && <Button size="sm">RSVP</Button>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No events found</h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchTerm ? "Try adjusting your search terms" : "Get started by creating your first event"}
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
