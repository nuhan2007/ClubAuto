"use client"

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
import { UserPlus, Key } from "lucide-react"
import { useData } from "@/lib/data-context"

interface JoinClubDialogProps {
  onClubJoined: () => void
}

export function JoinClubDialog({ onClubJoined }: JoinClubDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [clubCode, setClubCode] = useState("")
  const [message, setMessage] = useState("")

  const { joinClubWithCode } = useData()

  const handleJoinClub = async () => {
    if (!clubCode.trim()) {
      setMessage("Please enter a club code")
      return
    }

    setLoading(true)
    setMessage("")

    try {
      await joinClubWithCode(clubCode.trim().toUpperCase())
      setMessage("Join request sent! Wait for approval from club officers.")
      setClubCode("")
      setTimeout(() => {
        setOpen(false)
        setMessage("")
        onClubJoined()
      }, 2000)
    } catch (error: any) {
      console.error("Error joining club:", error)
      setMessage(error.message || "Failed to join club. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 bg-transparent">
          <UserPlus className="h-4 w-4 mr-2" />
          Join Club
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Join Club with Code
          </DialogTitle>
          <DialogDescription>
            Enter the club code provided by an existing officer to request to join their club.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="clubCode">Club Code</Label>
            <Input
              id="clubCode"
              value={clubCode}
              onChange={(e) => setClubCode(e.target.value.toUpperCase())}
              placeholder="Enter 8-character club code"
              maxLength={8}
              className="font-mono text-lg tracking-wider text-center"
            />
            <p className="text-xs text-muted-foreground">Ask an existing club officer for the club code</p>
          </div>

          {message && (
            <div
              className={`text-sm p-3 rounded-md ${
                message.includes("sent") || message.includes("approval")
                  ? "text-green-700 bg-green-50 border border-green-200"
                  : "text-red-700 bg-red-50 border border-red-200"
              }`}
            >
              {message}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleJoinClub}
            disabled={loading || !clubCode.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? "Sending Request..." : "Request to Join"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
