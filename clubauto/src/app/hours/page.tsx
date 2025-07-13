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
import { Clock, Plus, Search, Calendar, TrendingUp, Award, Users } from "lucide-react"

export default function HourTracking() {
  const [hourEntries, setHourEntries] = useState([
    {
      id: 1,
      member: "Alice Johnson",
      date: "December 15, 2024",
      hours: 3.5,
      category: "Rehearsal",
      description: "Fall play rehearsal - Act 1 scenes",
      status: "approved",
    },
    {
      id: 2,
      member: "Bob Smith",
      date: "December 14, 2024",
      hours: 2.0,
      category: "Fundraising",
      description: "Bake sale preparation and setup",
      status: "pending",
    },
    {
      id: 3,
      member: "Carol Davis",
      date: "December 13, 2024",
      hours: 4.0,
      category: "Event Planning",
      description: "Winter performance venue coordination",
      status: "approved",
    },
    {
      id: 4,
      member: "David Wilson",
      date: "December 12, 2024",
      hours: 1.5,
      category: "Meeting",
      description: "Officer meeting - budget discussion",
      status: "approved",
    },
    {
      id: 5,
      member: "Emma Brown",
      date: "December 11, 2024",
      hours: 5.0,
      category: "Community Service",
      description: "Local theater volunteer work",
      status: "approved",
    },
  ])

  const [formData, setFormData] = useState({
    member: "",
    date: "",
    hours: "",
    category: "",
    description: "",
  })

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [filterCategory, setFilterCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    if (!formData.member || !formData.date || !formData.hours || !formData.category || !formData.description) {
      alert("Please fill in all fields")
      return
    }

    const newEntry = {
      id: Date.now(),
      member: formData.member,
      date: formData.date,
      hours: Number.parseFloat(formData.hours),
      category: formData.category,
      description: formData.description,
      status: "pending",
    }

    // Add to the beginning of the array
    setHourEntries((prev) => [newEntry, ...prev])

    // Reset form
    setFormData({
      member: "",
      date: "",
      hours: "",
      category: "",
      description: "",
    })

    setIsDialogOpen(false)
  }

  const memberStats = [
    { name: "Alice Johnson", totalHours: 45.5, rank: 1 },
    { name: "Emma Brown", totalHours: 42.0, rank: 2 },
    { name: "Carol Davis", totalHours: 38.5, rank: 3 },
    { name: "Bob Smith", totalHours: 35.0, rank: 4 },
    { name: "David Wilson", totalHours: 32.5, rank: 5 },
  ]

  const filteredEntries = hourEntries.filter((entry) => {
    const matchesSearch =
      entry.member.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || entry.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const totalHours = hourEntries.reduce((sum, entry) => sum + entry.hours, 0)
  const approvedHours = hourEntries
    .filter((entry) => entry.status === "approved")
    .reduce((sum, entry) => sum + entry.hours, 0)

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold">Hour Tracking</h1>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Log Hours
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Log Volunteer Hours</DialogTitle>
                <DialogDescription>Record hours spent on club activities and community service.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="member">Member</Label>
                    <Select value={formData.member} onValueChange={(value) => handleInputChange("member", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select member" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Alice Johnson">Alice Johnson</SelectItem>
                        <SelectItem value="Bob Smith">Bob Smith</SelectItem>
                        <SelectItem value="Carol Davis">Carol Davis</SelectItem>
                        <SelectItem value="David Wilson">David Wilson</SelectItem>
                        <SelectItem value="Emma Brown">Emma Brown</SelectItem>
                      </SelectContent>
                    </Select>
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
                    <Label htmlFor="hours">Hours</Label>
                    <Input
                      id="hours"
                      type="number"
                      step="0.5"
                      placeholder="e.g., 2.5"
                      value={formData.hours}
                      onChange={(e) => handleInputChange("hours", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Rehearsal">Rehearsal</SelectItem>
                        <SelectItem value="Meeting">Meeting</SelectItem>
                        <SelectItem value="Fundraising">Fundraising</SelectItem>
                        <SelectItem value="Event Planning">Event Planning</SelectItem>
                        <SelectItem value="Community Service">Community Service</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the activity..."
                    className="min-h-[80px]"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit}>Log Hours</Button>
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
              <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalHours}</div>
              <p className="text-xs text-muted-foreground">All logged hours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved Hours</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedHours}</div>
              <p className="text-xs text-muted-foreground">Verified volunteer hours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">16</div>
              <p className="text-xs text-muted-foreground">Hours logged in December</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average/Member</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">38.7</div>
              <p className="text-xs text-muted-foreground">Hours per active member</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Hour Entries */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Hour Entries
                </CardTitle>
                <CardDescription>Latest volunteer hour submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Search and Filters */}
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search entries..."
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
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="Rehearsal">Rehearsal</SelectItem>
                        <SelectItem value="Meeting">Meeting</SelectItem>
                        <SelectItem value="Fundraising">Fundraising</SelectItem>
                        <SelectItem value="Event Planning">Event Planning</SelectItem>
                        <SelectItem value="Community Service">Community Service</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Entries List */}
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredEntries.map((entry) => (
                      <div key={entry.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium">{entry.member}</h4>
                            <p className="text-sm text-muted-foreground">{entry.date}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold">{entry.hours}h</span>
                            {getStatusBadge(entry.status)}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Badge variant="outline" className="text-xs">
                            {entry.category}
                          </Badge>
                          <p className="text-sm text-muted-foreground">{entry.description}</p>
                        </div>
                        <div className="flex justify-end gap-2 mt-3">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          {entry.status === "pending" && (
                            <>
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                Approve
                              </Button>
                              <Button variant="destructive" size="sm">
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Member Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Hour Leaderboard
              </CardTitle>
              <CardDescription>Top contributors this semester</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {memberStats.map((member) => (
                  <div key={member.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                        {member.rank}
                      </div>
                      <div>
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-muted-foreground">{member.totalHours} hours</p>
                      </div>
                    </div>
                    {member.rank <= 3 && (
                      <Award
                        className={`h-5 w-5 ${
                          member.rank === 1 ? "text-yellow-500" : member.rank === 2 ? "text-gray-400" : "text-amber-600"
                        }`}
                      />
                    )}
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  View Full Rankings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
