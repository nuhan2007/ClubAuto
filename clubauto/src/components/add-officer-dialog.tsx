"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { UserPlus } from "lucide-react"
import { useData } from "@/lib/data-context"

interface AddOfficerDialogProps {
  clubId: string
  onOfficerAdded?: () => void
}

export function AddOfficerDialog({ clubId, onOfficerAdded }: AddOfficerDialogProps) {
  const { addOfficerToClub } = useData()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      alert("Please enter an email address")
      return
    }

    setIsLoading(true)

    try {
      await addOfficerToClub(clubId, email.trim())
      setEmail("")
      setIsOpen(false)
      onOfficerAdded?.()
      alert("Officer added successfully!")
    } catch (error) {
      console.error("Error adding officer:", error)
      alert("Failed to add officer. Make sure the email is correct and the user has an account.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Officer
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add Club Officer
          </DialogTitle>
          <DialogDescription>
            Add another officer to this club. They'll have full access to manage club data.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="officer-email">Officer Email Address</Label>
            <Input
              id="officer-email"
              type="email"
              placeholder="officer@school.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">The person must already have an account in the system.</p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Officer Permissions</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Full access to all club data</li>
              <li>• Can add/edit members, events, and tasks</li>
              <li>• Can manage meeting notes and attendance</li>
              <li>• Can add other officers to the club</li>
            </ul>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
              {isLoading ? "Adding Officer..." : "Add Officer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
