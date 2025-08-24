
"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

interface QuickAddMemberProps {
  trigger?: React.ReactNode
  onSuccess?: () => void
}

export function QuickAddMember({ trigger, onSuccess }: QuickAddMemberProps) {
  const { addMember } = useData()
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    grade: "",
    email: "",
    phone: "",
    role: "Member",
  })

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

    setIsOpen(false)
    onSuccess?.()
  }

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <UserPlus className="h-4 w-4 mr-1" />
      Add Member
    </Button>
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Quick Add Member</DialogTitle>
          <DialogDescription>Quickly add a new member to the club roster.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quick-member-name">Full Name *</Label>
              <Input
                id="quick-member-name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quick-member-grade">Grade *</Label>
              <Select value={formData.grade} onValueChange={(value) => handleInputChange("grade", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent side="bottom" className="bg-white">
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
              <Label htmlFor="quick-member-email">Email *</Label>
              <Input
                id="quick-member-email"
                type="email"
                placeholder="student@school.edu"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quick-member-phone">Phone</Label>
              <Input
                id="quick-member-phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="quick-member-role">Role</Label>
            <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent side="bottom" className="bg-white">
                <SelectItem value="Member">Member</SelectItem>
                <SelectItem value="Secretary">Secretary</SelectItem>
                <SelectItem value="Treasurer">Treasurer</SelectItem>
                <SelectItem value="Vice President">Vice President</SelectItem>
                <SelectItem value="President">President</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Add Member</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
