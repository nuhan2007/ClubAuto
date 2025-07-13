"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Users, Plus, Search, Mail, Phone, Calendar, Edit, Trash2, UserPlus, LogOut } from "lucide-react"
import { useData } from "@/lib/data-context"

export default function MembersPage() {
  const { members, addMember, deleteMember } = useData()
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [filterRole, setFilterRole] = useState("All")
  const [filterGrade, setFilterGrade] = useState("All")

  const [formData, setFormData] = useState({
    name: "",
    grade: "",
    email: "",
    phone: "",
    role: "Member",
  })

  const handleLogout = () => {
    localStorage.removeItem("clubManagerAuth")
    window.location.reload()
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    if (!formData.name || !formData.grade || !formData.email) {
      alert("Please fill in all required fields")
      return
    }

    addMember({
      name: formData.name,
      grade: formData.grade,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      joinDate: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      attendance: 0,
      status: "active",
    })

    // Reset form
    setFormData({
      name: "",
      grade: "",
      email: "",
      phone: "",
      role: "Member",
    })

    setIsDialogOpen(false)
  }

  const handleDeleteMember = (memberId: number) => {
    if (confirm("Are you sure you want to remove this member?")) {
      deleteMember(memberId)
    }
  }

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "All" || member.role === filterRole
    const matchesGrade = filterGrade === "All" || member.grade === filterGrade
    return matchesSearch && matchesRole && matchesGrade
  })

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "President":
        return <Badge className="bg-yellow-500">President</Badge>
      case "Vice President":
        return <Badge className="bg-blue-500">Vice President</Badge>
      case "Secretary":
        return <Badge className="bg-green-500">Secretary</Badge>
      case "Treasurer":
        return <Badge className="bg-purple-500">Treasurer</Badge>
      default:
        return <Badge variant="secondary">{role}</Badge>
    }
  }

  const getAttendanceBadge = (percentage: number) => {
    if (percentage >= 90) return <Badge className="bg-green-500">Excellent</Badge>
    if (percentage >= 80) return <Badge className="bg-yellow-500">Good</Badge>
    return <Badge variant="destructive">Needs Improvement</Badge>
  }

  const activeMembers = members.filter((member) => member.status === "active").length
  const averageAttendance =
    members.length > 0 ? Math.round(members.reduce((sum, member) => sum + member.attendance, 0) / members.length) : 0
  const newThisMonth = members.filter((member) =>
    member.joinDate.includes(new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })),
  ).length
  const officers = members.filter((m) => m.role !== "Member").length

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold">Members</h1>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Member</DialogTitle>
                <DialogDescription>Add a new member to the club roster.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="member-name">Full Name *</Label>
                    <Input
                      id="member-name"
                      placeholder="Enter full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="member-grade">Grade *</Label>
                    <Select value={formData.grade} onValueChange={(value) => handleInputChange("grade", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="9th">9th Grade</SelectItem>
                        <SelectItem value="10th">10th Grade</SelectItem>
                        <SelectItem value="11th">11th Grade</SelectItem>
                        <SelectItem value="12th">12th Grade</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="member-email">Email *</Label>
                    <Input
                      id="member-email"
                      type="email"
                      placeholder="student@school.edu"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="member-phone">Phone</Label>
                    <Input
                      id="member-phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="member-role">Role</Label>
                  <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Member">Member</SelectItem>
                      <SelectItem value="Secretary">Secretary</SelectItem>
                      <SelectItem value="Treasurer">Treasurer</SelectItem>
                      <SelectItem value="Vice President">Vice President</SelectItem>
                      <SelectItem value="President">President</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit}>Add Member</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="flex-1 p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{members.length}</div>
              <p className="text-xs text-muted-foreground">{activeMembers} active members</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New This Month</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{newThisMonth}</div>
              <p className="text-xs text-muted-foreground">Recently joined</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageAttendance}%</div>
              <p className="text-xs text-muted-foreground">Across all members</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Officers</CardTitle>
              <Badge className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{officers}</div>
              <p className="text-xs text-muted-foreground">Leadership positions</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Roles</SelectItem>
              <SelectItem value="President">President</SelectItem>
              <SelectItem value="Vice President">Vice President</SelectItem>
              <SelectItem value="Secretary">Secretary</SelectItem>
              <SelectItem value="Treasurer">Treasurer</SelectItem>
              <SelectItem value="Member">Member</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterGrade} onValueChange={setFilterGrade}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Grades</SelectItem>
              <SelectItem value="9th">9th Grade</SelectItem>
              <SelectItem value="10th">10th Grade</SelectItem>
              <SelectItem value="11th">11th Grade</SelectItem>
              <SelectItem value="12th">12th Grade</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Members List */}
        <div className="space-y-4">
          {filteredMembers.map((member) => (
            <Card key={member.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">{member.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{member.grade}</span>
                        <span className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {member.email}
                        </span>
                        {member.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {member.phone}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Joined {member.joinDate}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right space-y-2">
                      {getRoleBadge(member.role)}
                      {getAttendanceBadge(member.attendance)}
                      <div className="text-sm text-muted-foreground">{member.attendance}% attendance</div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteMember(member.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No members found</h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchTerm ? "Try adjusting your search terms" : "Get started by adding your first member"}
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
