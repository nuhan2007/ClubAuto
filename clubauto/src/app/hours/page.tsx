/* eslint-disable @typescript-eslint/no-explicit-any */
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
import {
  Clock,
  Plus,
  Search,
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  XCircle,
  Edit,
  Trophy,
  Users,
} from "lucide-react"
import { useData } from "@/lib/data-context"

const hourCategories = [
  "All",
  "Volunteering",
  "Fundraising",
  "Event Planning",
  "Training",
  "Other",
]
const hourStatuses = ["All", "pending", "approved", "rejected"]

export default function HoursPage() {
  const { hourEntries, addHourEntry, updateHourEntry, members, loading } = useData()
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewAllHoursDialogOpen, setIsViewAllHoursDialogOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<any>(null)
  const [filterCategory, setFilterCategory] = useState("All")
  const [filterStatus, setFilterStatus] = useState("All")

  const [formData, setFormData] = useState({
    memberName: "",
    date: "",
    hours: "",
    category: "",
    description: "",
  })

  const [editFormData, setEditFormData] = useState({
    memberName: "",
    date: "",
    hours: "",
    category: "",
    description: "",
    status: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleEditInputChange = (field: string, value: string) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (!formData.memberName || !formData.date || !formData.hours || !formData.category) {
      alert("Please fill in all required fields")
      return
    }

    const hours = Number.parseFloat(formData.hours)
    if (isNaN(hours) || hours <= 0) {
      alert("Please enter a valid number of hours")
      return
    }

    try {
      await addHourEntry({
        member_name: formData.memberName,
        date: formData.date,
        hours: hours,
        category: formData.category,
        description: formData.description,
        status: "approved",
      })

      // Reset form
      setFormData({
        memberName: "",
        date: "",
        hours: "",
        category: "",
        description: "",
      })

      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error adding hour entry:", error)
      alert("Failed to log hours. Please try again.")
    }
  }

  const handleEdit = (entry: any) => {
    setEditingEntry(entry)
    setEditFormData({
      memberName: entry.member_name,
      date: entry.date,
      hours: entry.hours?.toString() || "",
      category: entry.category || "",
      description: entry.description || "",
      status: entry.status,
    })
    setIsEditDialogOpen(true)
  }

  const handleEditSubmit = async () => {
    if (!editFormData.memberName || !editFormData.date || !editFormData.hours || !editFormData.category) {
      alert("Please fill in all required fields")
      return
    }

    const hours = Number.parseFloat(editFormData.hours)
    if (isNaN(hours) || hours <= 0) {
      alert("Please enter a valid number of hours")
      return
    }

    try {
      await updateHourEntry(editingEntry.id, {
        member_name: editFormData.memberName,
        date: editFormData.date,
        hours: hours,
        category: editFormData.category,
        description: editFormData.description,
        status: editFormData.status,
      })

      setIsEditDialogOpen(false)
      setEditingEntry(null)
    } catch (error) {
      console.error("Error updating hour entry:", error)
      alert("Failed to update hour entry. Please try again.")
    }
  }

  const filteredEntries = hourEntries.filter((entry) => {
    const matchesSearch =
      entry.member_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.description && entry.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (entry.category && entry.category.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = filterCategory === "All" || entry.category === filterCategory
    const matchesStatus = filterStatus === "All" || entry.status === filterStatus
    return matchesSearch && matchesCategory && matchesStatus
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  // Calculate member hours more accurately
  const memberHours = hourEntries.reduce(
    (acc, entry) => {
      if (entry.status === "approved") {
        // Only count approved hours
        if (!acc[entry.member_name]) {
          acc[entry.member_name] = 0
        }
        acc[entry.member_name] += entry.hours || 0
      }
      return acc
    },
    {} as Record<string, number>,
  )

  // Get top 5 members by approved hours only
  const topMembers = Object.entries(memberHours)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  // Get all members with hours for the view all dialog (approved hours only)
  const allMembersWithHours = Object.entries(memberHours).sort(([, a], [, b]) => b - a)

  const totalHours = hourEntries.reduce((sum, entry) => sum + (entry.hours || 0), 0)
  const approvedHours = hourEntries
    .filter((entry) => entry.status === "approved")
    .reduce((sum, entry) => sum + (entry.hours || 0), 0)
  const pendingHours = hourEntries
    .filter((entry) => entry.status === "pending")
    .reduce((sum, entry) => sum + (entry.hours || 0), 0)

  // Calculate this month hours
  const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM format
  const thisMonthHours = hourEntries
    .filter((entry) => entry.date.startsWith(currentMonth))
    .reduce((sum, entry) => sum + (entry.hours || 0), 0)

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold">Hour Tracking</h1>
          </div>
        </header>
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading hour entries...</p>
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
                <DialogTitle>Log Service Hours</DialogTitle>
                <DialogDescription>Record volunteer hours for club members.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="member-name">Member Name</Label>
                    <Select
                      value={formData.memberName}
                      onValueChange={(value) => handleInputChange("memberName", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select member" />
                      </SelectTrigger>
                      <SelectContent side="bottom" className="bg-white">
                        {members.map((member) => (
                          <SelectItem key={member.id} value={member.name}>
                            {member.name}
                          </SelectItem>
                        ))}
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
                      min="0"
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
                      <SelectContent side="bottom" className="bg-white">
                        <SelectItem value="Volunteering">Volunteering</SelectItem>
                        <SelectItem value="Fundraising">Fundraising</SelectItem>
                        <SelectItem value="Event Planning">Event Planning</SelectItem>
                        <SelectItem value="Training">Training</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the volunteer activity..."
                    className="min-h-[100px]"
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

          {/* Edit Hour Entry Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Hour Entry</DialogTitle>
                <DialogDescription>Update the hour entry details and status.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-member-name">Member Name</Label>
                    <Select
                      value={editFormData.memberName}
                      onValueChange={(value) => handleEditInputChange("memberName", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select member" />
                      </SelectTrigger>
                      <SelectContent side="bottom" className="bg-white">
                        {members.map((member) => (
                          <SelectItem key={member.id} value={member.name}>
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-date">Date</Label>
                    <Input
                      id="edit-date"
                      type="date"
                      value={editFormData.date}
                      onChange={(e) => handleEditInputChange("date", e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-hours">Hours</Label>
                    <Input
                      id="edit-hours"
                      type="number"
                      step="0.5"
                      min="0"
                      placeholder="e.g., 2.5"
                      value={editFormData.hours}
                      onChange={(e) => handleEditInputChange("hours", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-category">Category</Label>
                    <Select
                      value={editFormData.category}
                      onValueChange={(value) => handleEditInputChange("category", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent side="bottom" className="bg-white">
                        <SelectItem value="Volunteering">Volunteering</SelectItem>
                        <SelectItem value="Fundraising">Fundraising</SelectItem>
                        <SelectItem value="Event Planning">Event Planning</SelectItem>
                        <SelectItem value="Training">Training</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
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
                      <SelectContent side="bottom" className="bg-white">
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    placeholder="Describe the volunteer activity..."
                    className="min-h-[100px]"
                    value={editFormData.description}
                    onChange={(e) => handleEditInputChange("description", e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleEditSubmit}>Update Entry</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* View All Member Hours Dialog */}
          <Dialog open={isViewAllHoursDialogOpen} onOpenChange={setIsViewAllHoursDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  All Member Hours
                </DialogTitle>
                <DialogDescription>Complete breakdown of hours by member</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {allMembersWithHours.map(([memberName, hours], index) => (
                  <div key={memberName} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium">{memberName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {hourEntries.filter((entry) => entry.member_name === memberName).length} entries
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{hours.toFixed(1)}</div>
                      <div className="text-sm text-muted-foreground">hours</div>
                    </div>
                  </div>
                ))}
                {allMembersWithHours.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">No hours logged yet</div>
                )}
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
              <div className="text-2xl font-bold">{totalHours.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">All logged hours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved Hours</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedHours.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">Verified service hours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Hours</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingHours.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{thisMonthHours.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">Hours this month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Hour Entries List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search and Filters */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search hour entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent side="bottom" className="bg-white">
                  {hourCategories.map((category) => (
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
                <SelectContent side="bottom" className="bg-white">
                  {hourStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status === "All" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Hour Entries */}
            <div className="space-y-4">
              {filteredEntries.map((entry) => (
                <Card key={entry.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          <Clock className="h-5 w-5" />
                          {entry.hours} hours - {entry.member_name}
                          {getStatusIcon(entry.status)}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(entry.date).toLocaleDateString()}
                          </span>
                          {entry.category && (
                            <span className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {entry.category}
                            </span>
                          )}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {entry.category && <Badge variant="outline">{entry.category}</Badge>}
                        {getStatusBadge(entry.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {entry.description && <p className="text-sm text-muted-foreground">{entry.description}</p>}

                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(entry)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredEntries.length === 0 && (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No hour entries found</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      {searchTerm
                        ? "Try adjusting your search terms"
                        : "Get started by logging your first service hours"}
                    </p>
                    <Button onClick={() => setIsDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Log Hours
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Top Members Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Top 5 Members
                </CardTitle>
                <CardDescription>Members with the most volunteer hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topMembers.map(([memberName, hours], index) => (
                    <div key={memberName} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === 0
                              ? "bg-yellow-500 text-white"
                              : index === 1
                                ? "bg-gray-400 text-white"
                                : index === 2
                                  ? "bg-orange-600 text-white"
                                  : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <span className="font-medium text-sm">{memberName}</span>
                      </div>
                      <span className="text-sm font-bold">{hours.toFixed(1)}h</span>
                    </div>
                  ))}
                  {topMembers.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground text-sm">No hours logged yet</div>
                  )}
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4 bg-transparent"
                  onClick={() => setIsViewAllHoursDialogOpen(true)}
                >
                  <Users className="h-4 w-4 mr-2" />
                  View All Members
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
