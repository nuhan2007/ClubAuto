"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Settings, Save, LogOut, Copy, RefreshCw, Users, Shield } from "lucide-react"
import { useData } from "@/lib/data-context"

interface SettingsData {
  clubName: string
  clubDescription: string
  meetingDay: string
  meetingTime: string
  emailNotifications: boolean
  smsNotifications: boolean
  weeklyReports: boolean
  eventReminders: boolean
}

export default function SettingsPage() {
  const { currentClub, generateClubCode, joinRequests, approveJoinRequest, rejectJoinRequest, loadJoinRequests } =
    useData()
  const [settings, setSettings] = useState<SettingsData>({
    clubName: "",
    clubDescription: "",
    meetingDay: "",
    meetingTime: "",
    emailNotifications: true,
    smsNotifications: false,
    weeklyReports: true,
    eventReminders: true,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")
  const [isGeneratingCode, setIsGeneratingCode] = useState(false)

  // Load settings from current club and localStorage on mount
  useEffect(() => {
    if (currentClub) {
      setSettings((prev) => ({
        ...prev,
        clubName: currentClub.name || "",
        clubDescription: currentClub.description || "",
        meetingDay: currentClub.meeting_day || "",
        meetingTime: currentClub.meeting_time || "",
      }))
    }

    const savedSettings = localStorage.getItem("clubSettings")
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings)
      setSettings((prev) => ({
        ...prev,
        emailNotifications: parsed.emailNotifications ?? true,
        smsNotifications: parsed.smsNotifications ?? false,
        weeklyReports: parsed.weeklyReports ?? true,
        eventReminders: parsed.eventReminders ?? true,
      }))
    }
  }, [currentClub])

  // Load join requests when component mounts
  useEffect(() => {
    loadJoinRequests()
  }, [loadJoinRequests])

  const handleInputChange = (field: keyof SettingsData, value: string | boolean) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveMessage("")

    // Simulate save process
    setTimeout(() => {
      localStorage.setItem("clubSettings", JSON.stringify(settings))
      setIsSaving(false)
      setSaveMessage("Settings saved successfully!")

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveMessage("")
      }, 3000)
    }, 1000)
  }

  const handleCopyClubCode = () => {
    if (currentClub?.club_code) {
      navigator.clipboard.writeText(currentClub.club_code)
      setSaveMessage("Club code copied to clipboard!")
      setTimeout(() => setSaveMessage(""), 3000)
    }
  }

  const handleGenerateNewCode = async () => {
    setIsGeneratingCode(true)
    try {
      await generateClubCode()
      setSaveMessage("New club code generated successfully!")
      setTimeout(() => setSaveMessage(""), 3000)
    } catch (error) {
      console.error("Error generating club code:", error)
      setSaveMessage("Failed to generate new club code")
    } finally {
      setIsGeneratingCode(false)
    }
  }

  const handleApproveRequest = async (requestId: string) => {
    try {
      await approveJoinRequest(requestId)
      setSaveMessage("Join request approved!")
      setTimeout(() => setSaveMessage(""), 3000)
    } catch (error) {
      console.error("Error approving request:", error)
      setSaveMessage("Failed to approve request")
    }
  }

  const handleRejectRequest = async (requestId: string) => {
    try {
      await rejectJoinRequest(requestId)
      setSaveMessage("Join request rejected")
      setTimeout(() => setSaveMessage(""), 3000)
    } catch (error) {
      console.error("Error rejecting request:", error)
      setSaveMessage("Failed to reject request")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("clubManagerAuth")
    localStorage.removeItem("selectedClub")
    localStorage.removeItem("clubSettings")
    window.location.href = "/"
  }

  const pendingRequests = joinRequests.filter((req) => req.status === "pending")

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-orange-50/30">
      <header className="flex items-center justify-between px-4 py-3 border-b bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
            Settings
          </h1>
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="border-red-200 text-red-700 hover:bg-red-50 bg-transparent"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </header>

      <div className="flex-1 p-6 space-y-6">
        {/* Club Code Section */}
        <Card className="border-green-100 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Shield className="h-5 w-5" />
              Club Join Code
            </CardTitle>
            <CardDescription>Share this code with officers to let them join your club</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label htmlFor="clubCode">Club Code</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="clubCode"
                    value={currentClub?.club_code || "Loading..."}
                    readOnly
                    className="bg-gray-50 font-mono text-lg tracking-wider"
                  />
                  <Button onClick={handleCopyClubCode} variant="outline" size="icon" disabled={!currentClub?.club_code}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  onClick={handleGenerateNewCode}
                  variant="outline"
                  disabled={isGeneratingCode}
                  className="border-orange-200 text-orange-700 hover:bg-orange-50 bg-transparent"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isGeneratingCode ? "animate-spin" : ""}`} />
                  {isGeneratingCode ? "Generating..." : "New Code"}
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Officers can use this code to request to join your club. You can approve or reject requests below.
            </p>
          </CardContent>
        </Card>

        {/* Join Requests Section */}
        {pendingRequests.length > 0 && (
          <Card className="border-yellow-100 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800">
                <Users className="h-5 w-5" />
                Pending Join Requests ({pendingRequests.length})
              </CardTitle>
              <CardDescription>Review and approve officers wanting to join your club</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-3 border rounded-lg bg-yellow-50/50"
                  >
                    <div>
                      <h4 className="font-medium">{request.user_name}</h4>
                      <p className="text-sm text-muted-foreground">{request.user_email}</p>
                      <p className="text-xs text-muted-foreground">
                        Requested: {new Date(request.requested_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleApproveRequest(request.id)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleRejectRequest(request.id)}
                        variant="outline"
                        size="sm"
                        className="border-red-200 text-red-700 hover:bg-red-50"
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Club Information */}
        <Card className="border-blue-100 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Settings className="h-5 w-5" />
              Club Information
            </CardTitle>
            <CardDescription>Basic information about your club</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="clubName">Club Name</Label>
                <Input
                  id="clubName"
                  value={settings.clubName}
                  onChange={(e) => handleInputChange("clubName", e.target.value)}
                  placeholder="Enter club name"
                  className="bg-white/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meetingDay">Meeting Day</Label>
                <Input
                  id="meetingDay"
                  value={settings.meetingDay}
                  onChange={(e) => handleInputChange("meetingDay", e.target.value)}
                  placeholder="e.g., Every Tuesday"
                  className="bg-white/50"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="clubDescription">Club Description</Label>
              <Textarea
                id="clubDescription"
                value={settings.clubDescription}
                onChange={(e) => handleInputChange("clubDescription", e.target.value)}
                placeholder="Describe your club's purpose and activities"
                className="bg-white/50"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meetingTime">Meeting Time</Label>
              <Input
                id="meetingTime"
                type="time"
                value={settings.meetingTime}
                onChange={(e) => handleInputChange("meetingTime", e.target.value)}
                className="bg-white/50"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card className="border-orange-100 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-orange-800">Notification Preferences</CardTitle>
            <CardDescription>Choose how you want to receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="emailNotifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleInputChange("emailNotifications", checked as boolean)}
              />
              <Label htmlFor="emailNotifications">Email notifications for important updates</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="smsNotifications"
                checked={settings.smsNotifications}
                onCheckedChange={(checked) => handleInputChange("smsNotifications", checked as boolean)}
              />
              <Label htmlFor="smsNotifications">SMS notifications for urgent matters</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="weeklyReports"
                checked={settings.weeklyReports}
                onCheckedChange={(checked) => handleInputChange("weeklyReports", checked as boolean)}
              />
              <Label htmlFor="weeklyReports">Weekly activity reports</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="eventReminders"
                checked={settings.eventReminders}
                onCheckedChange={(checked) => handleInputChange("eventReminders", checked as boolean)}
              />
              <Label htmlFor="eventReminders">Event and meeting reminders</Label>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex items-center justify-between">
          <div>{saveMessage && <p className="text-green-600 font-medium">{saveMessage}</p>}</div>
          <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  )
}
