"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import { useData } from "@/lib/data-context"

interface CreateClubDialogProps {
  onClubCreated: () => void
}

export function CreateClubDialog({ onClubCreated }: CreateClubDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    school: "",
    meeting_day: "",
    meeting_time: "",
    advisor_name: "",
    advisor_email: "",
  })

  const { createClub } = useData()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await createClub(formData)
      setOpen(false)
      setFormData({
        name: "",
        description: "",
        school: "",
        meeting_day: "",
        meeting_time: "",
        advisor_name: "",
        advisor_email: "",
      })
      onClubCreated()
    } catch (error) {
      console.error("Error creating club:", error)
      alert("Failed to create club. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Create Club
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Club</DialogTitle>
          <DialogDescription>
            Create a new club and become an officer. You can invite other officers later.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Club Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Robotics Club"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="school">School *</Label>
              <Input
                id="school"
                value={formData.school}
                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                placeholder="e.g., Lincoln High School"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of your club..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="meeting_day">Meeting Day</Label>
                <Input
                  id="meeting_day"
                  value={formData.meeting_day}
                  onChange={(e) => setFormData({ ...formData, meeting_day: e.target.value })}
                  placeholder="e.g., Wednesdays"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="meeting_time">Meeting Time</Label>
                <Input
                  id="meeting_time"
                  value={formData.meeting_time}
                  onChange={(e) => setFormData({ ...formData, meeting_time: e.target.value })}
                  placeholder="e.g., 3:30 PM"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="advisor_name">Advisor Name</Label>
              <Input
                id="advisor_name"
                value={formData.advisor_name}
                onChange={(e) => setFormData({ ...formData, advisor_name: e.target.value })}
                placeholder="e.g., Ms. Johnson"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="advisor_email">Advisor Email</Label>
              <Input
                id="advisor_email"
                type="email"
                value={formData.advisor_email}
                onChange={(e) => setFormData({ ...formData, advisor_email: e.target.value })}
                placeholder="e.g., advisor@school.edu"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.name || !formData.school}>
              {loading ? "Creating..." : "Create Club"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
