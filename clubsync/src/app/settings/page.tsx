"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { User, Bell, Shield, Database, Palette, Mail, Download, Upload, Trash2, Save, LogOut } from "lucide-react"
import { useTheme } from "@/lib/theme-context"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [clubName, setClubName] = useState("Drama Club")
  const [clubDescription, setClubDescription] = useState(
    "High school drama and theater club focused on developing performing arts skills and community engagement.",
  )
  const [advisorName, setAdvisorName] = useState("Ms. Sarah Johnson")
  const [advisorEmail, setAdvisorEmail] = useState("s.johnson@school.edu")
  const [meetingDay, setMeetingDay] = useState("tuesday")
  const [meetingTime, setMeetingTime] = useState("15:30")

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [meetingReminders, setMeetingReminders] = useState(true)
  const [hourApprovals, setHourApprovals] = useState(true)

  const handleLogout = () => {
    localStorage.removeItem("clubManagerAuth")
    window.location.reload()
  }

  const handleSaveSettings = () => {
    // Save all settings to localStorage
    const settings = {
      clubName,
      clubDescription,
      advisorName,
      advisorEmail,
      meetingDay,
      meetingTime,
      theme,
      emailNotifications,
      meetingReminders,
      hourApprovals,
      savedAt: new Date().toISOString(),
    }

    localStorage.setItem("clubSettings", JSON.stringify(settings))

    // Show success message
    alert("Settings saved successfully!")
  }

  // Load settings on component mount
  useState(() => {
    const savedSettings = localStorage.getItem("clubSettings")
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      setClubName(settings.clubName || "Drama Club")
      setClubDescription(settings.clubDescription || "")
      setAdvisorName(settings.advisorName || "Ms. Sarah Johnson")
      setAdvisorEmail(settings.advisorEmail || "s.johnson@school.edu")
      setMeetingDay(settings.meetingDay || "tuesday")
      setMeetingTime(settings.meetingTime || "15:30")
      setEmailNotifications(settings.emailNotifications ?? true)
      setMeetingReminders(settings.meetingReminders ?? true)
      setHourApprovals(settings.hourApprovals ?? true)
      if (settings.theme) {
        setTheme(settings.theme)
      }
    }
  })

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleSaveSettings}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="flex-1 p-6 space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Club Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Club Information
              </CardTitle>
              <CardDescription>Basic information about your club</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="club-name">Club Name</Label>
                <Input id="club-name" value={clubName} onChange={(e) => setClubName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="club-description">Description</Label>
                <Textarea
                  id="club-description"
                  value={clubDescription}
                  onChange={(e) => setClubDescription(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="advisor-name">Advisor Name</Label>
                  <Input id="advisor-name" value={advisorName} onChange={(e) => setAdvisorName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="advisor-email">Advisor Email</Label>
                  <Input
                    id="advisor-email"
                    type="email"
                    value={advisorEmail}
                    onChange={(e) => setAdvisorEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="meeting-day">Regular Meeting Day</Label>
                  <Select value={meetingDay} onValueChange={setMeetingDay}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monday">Monday</SelectItem>
                      <SelectItem value="tuesday">Tuesday</SelectItem>
                      <SelectItem value="wednesday">Wednesday</SelectItem>
                      <SelectItem value="thursday">Thursday</SelectItem>
                      <SelectItem value="friday">Friday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meeting-time">Meeting Time</Label>
                  <Input
                    id="meeting-time"
                    type="time"
                    value={meetingTime}
                    onChange={(e) => setMeetingTime(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="email-notifications"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Email Notifications
                  </Label>
                  <p className="text-xs text-muted-foreground">Receive general updates via email</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="meeting-reminders" checked={meetingReminders} onCheckedChange={setMeetingReminders} />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="meeting-reminders"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Meeting Reminders
                  </Label>
                  <p className="text-xs text-muted-foreground">Get reminded about upcoming meetings</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="hour-approvals" checked={hourApprovals} onCheckedChange={setHourApprovals} />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="hour-approvals"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Hour Approval Notifications
                  </Label>
                  <p className="text-xs text-muted-foreground">Get notified when hours need approval</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>Customize the look and feel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select defaultValue="english">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Management
              </CardTitle>
              <CardDescription>Import, export, and manage your data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Button variant="outline" className="justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Export All Data
                </Button>
                <Button variant="outline" className="justify-start">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Member List
                </Button>
                <Button variant="outline" className="justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Bulk Email
                </Button>
              </div>
              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium text-destructive mb-2">Danger Zone</h4>
                <Button variant="destructive" className="justify-start">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Reset All Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security & Privacy
            </CardTitle>
            <CardDescription>Manage access and privacy settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Access Control</h4>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Admin Password</Label>
                  <Input id="admin-password" type="password" placeholder="Enter new password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="member-permissions">Default Member Permissions</Label>
                  <Select defaultValue="view-only">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="view-only">View Only</SelectItem>
                      <SelectItem value="edit-own">Edit Own Data</SelectItem>
                      <SelectItem value="edit-all">Edit All Data</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Privacy Settings</h4>
                <div className="flex items-center space-x-2">
                  <Checkbox id="public-roster" />
                  <Label htmlFor="public-roster" className="text-sm">
                    Make member roster public
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="share-hours" />
                  <Label htmlFor="share-hours" className="text-sm">
                    Share volunteer hours publicly
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="allow-photos" />
                  <Label htmlFor="allow-photos" className="text-sm">
                    Allow photo sharing
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
