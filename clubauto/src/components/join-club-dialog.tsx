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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Users } from "lucide-react"
import { useData, type Club } from "@/lib/data-context"

interface JoinClubDialogProps {
  onClubJoined: () => void
}

export function JoinClubDialog({ onClubJoined }: JoinClubDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Club[]>([])
  const [searching, setSearching] = useState(false)

  const { searchClubs, joinClub } = useData()

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setSearching(true)
    try {
      const results = await searchClubs(searchQuery)
      setSearchResults(results)
    } catch (error) {
      console.error("Error searching clubs:", error)
      alert("Failed to search clubs. Please try again.")
    } finally {
      setSearching(false)
    }
  }

  const handleJoinClub = async (clubId: string) => {
    setLoading(true)
    try {
      await joinClub(clubId)
      setOpen(false)
      setSearchQuery("")
      setSearchResults([])
      onClubJoined()
    } catch (error) {
      console.error("Error joining club:", error)
      alert("Failed to join club. You may already be a member.")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-gray-300 bg-transparent">
          <Users className="h-4 w-4 mr-2" />
          Join Club
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Join Existing Club</DialogTitle>
          <DialogDescription>Search for clubs by name or school to join as an officer.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="search">Search Clubs</Label>
              <Input
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter club name or school..."
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleSearch} disabled={searching || !searchQuery.trim()}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {searching && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-muted-foreground mt-2">Searching clubs...</p>
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              <Label>Search Results</Label>
              {searchResults.map((club) => (
                <Card key={club.id} className="cursor-pointer hover:bg-gray-50">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-sm">{club.name}</CardTitle>
                        <CardDescription className="text-xs">{club.school}</CardDescription>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleJoinClub(club.id)}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {loading ? "Joining..." : "Join"}
                      </Button>
                    </div>
                  </CardHeader>
                  {club.description && (
                    <CardContent className="pt-0">
                      <p className="text-xs text-muted-foreground line-clamp-2">{club.description}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}

          {searchQuery && searchResults.length === 0 && !searching && (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">No clubs found matching your search.</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
