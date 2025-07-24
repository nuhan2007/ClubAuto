"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Settings, LogOut, Copy, RefreshCw, Users, Shield, Trash2, AlertTriangle } from "lucide-react"
import { useData } from "@/lib/data-context"

export default function SettingsPage() {
  const {
    currentClub,
    generateClubCode,
    joinRequests,
    approveJoinRequest,
    rejectJoinRequest,
    updateClubSettings,
    deleteAccount,
  } = useData()
  const [message, setMessage] = useState("")
  const [isGeneratingCode, setIsGeneratingCode] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Form state for club settings
  const [formData, setFormData] = useState({
    clubName: "",
    clubDescription: "",
    meetingDay: "",
    meetingTime: "",
    advisorName: "",
    advisorEmail: "",
  })

  // Load settings from current club on mount and when club changes
  useEffect(() => {
    if (currentClub) {
      setFormData({
        clubName: currentClub.name || "",
        clubDescription: currentClub.description || "",
        meetingDay: currentClub.meeting_day || "",
        meetingTime: currentClub.meeting_time || "",
        advisorName: currentClub.advisor_name || "",
        advisorEmail: currentClub.advisor_email || "",
      })
    }
  }, [currentClub])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSaveSettings = async () => {
    if (!currentClub) return

    setIsSaving(true)
    try {
      const updates = {
        name: formData.clubName,
        description: formData.clubDescription,
        meeting_day: formData.meetingDay,
        meeting_time: formData.meetingTime,
        advisor_name: formData.advisorName,
        advisor_email: formData.advisorEmail,
      }

      await updateClubSettings(updates)
      setMessage("Settings saved successfully!")
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      console.error("Error updating settings:", error)
      setMessage("Failed to save settings. Please try again.")
      setTimeout(() => setMessage(""), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCopyClubCode = () => {
    if (currentClub?.club_code) {
      navigator.clipboard.writeText(currentClub.club_code)
      setMessage("Club code copied to clipboard!")
      setTimeout(() => setMessage(""), 3000)
    }
  }

  const handleGenerateNewCode = async () => {
    setIsGeneratingCode(true)
    try {
      await generateClubCode()
      setMessage("New club code generated successfully!")
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      console.error("Error generating club code:", error)
      setMessage("Failed to generate new club code")
      setTimeout(() => setMessage(""), 3000)
    } finally {
      setIsGeneratingCode(false)
    }
  }

  const handleApproveRequest = async (requestId: string) => {
    try {
      await approveJoinRequest(requestId)
      setMessage("Join request approved!")
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      console.error("Error approving request:", error)
      setMessage("Failed to approve request")
      setTimeout(() => setMessage(""), 3000)
    }
  }

  const handleRejectRequest = async (requestId: string) => {
    try {
      await rejectJoinRequest(requestId)
      setMessage("Join request rejected")
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      console.error("Error rejecting request:", error)
      setMessage("Failed to reject request")
      setTimeout(() => setMessage(""), 3000)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE MY ACCOUNT") {
      setMessage("Please type 'DELETE MY ACCOUNT' to confirm")
      setTimeout(() => setMessage(""), 3000)
      return
    }

    setIsDeleting(true)
    try {
      await deleteAccount()
    } catch (error) {
      console.error("Error deleting account:", error)
      setMessage("Failed to delete account")
      setTimeout(() => setMessage(""), 3000)
      setIsDeleting(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("clubManagerAuth")
    localStorage.removeItem("selectedClub")
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
        {/* Status Message */}
        {message && (
          <div
            className={`text-sm p-3 rounded-md ${
              message.includes("Failed") || message.includes("Error")
                ? "text-red-700 bg-red-50 border border-red-200"
                : "text-green-700 bg-green-50 border border-green-200"
            }`}
          >
            {message}
          </div>
        )}

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
                  value={formData.clubName}
                  onChange={(e) => handleInputChange("clubName", e.target.value)}
                  placeholder="Enter club name"
                  className="bg-white/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meetingDay">Meeting Day</Label>
                <Input
                  id="meetingDay"
                  value={formData.meetingDay}
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
                value={formData.clubDescription}
                onChange={(e) => handleInputChange("clubDescription", e.target.value)}
                placeholder="Describe your club's purpose and activities"
                className="bg-white/50"
                rows={3}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="meetingTime">Meeting Time</Label>
                <Input
                  id="meetingTime"
                  type="time"
                  value={formData.meetingTime}
                  onChange={(e) => handleInputChange("meetingTime", e.target.value)}
                  className="bg-white/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="advisorName">Advisor Name</Label>
                <Input
                  id="advisorName"
                  value={formData.advisorName}
                  onChange={(e) => handleInputChange("advisorName", e.target.value)}
                  placeholder="Enter advisor name"
                  className="bg-white/50"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="advisorEmail">Advisor Email</Label>
              <Input
                id="advisorEmail"
                type="email"
                value={formData.advisorEmail}
                onChange={(e) => handleInputChange("advisorEmail", e.target.value)}
                placeholder="Enter advisor email"
                className="bg-white/50"
              />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSaving ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>Irreversible actions that will permanently delete your data</CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-50 bg-transparent">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="h-5 w-5" />
                    Delete Account
                  </DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete your account and remove you from all
                    clubs. Your club data will remain, but you will lose access to it.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="confirmDelete">
                      Type <strong>DELETE MY ACCOUNT</strong> to confirm:
                    </Label>
                    <Input
                      id="confirmDelete"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder="DELETE MY ACCOUNT"
                      className="font-mono"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setShowDeleteDialog(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDeleteAccount}
                    disabled={isDeleting || deleteConfirmText !== "DELETE MY ACCOUNT"}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {isDeleting ? "Deleting..." : "Delete Account"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
