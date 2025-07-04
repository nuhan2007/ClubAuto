"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Settings, Save, LogOut } from "lucide-react"

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

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("clubSettings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

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

  const handleLogout = () => {
    localStorage.removeItem("clubManagerAuth")
    localStorage.removeItem("selectedClub")
    localStorage.removeItem("clubSettings")
    window.location.href = "/"
  }

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
