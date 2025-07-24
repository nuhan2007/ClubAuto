"use client"

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"
import { supabase } from "./supabase"
import { useAuth } from "./auth-context"

// Types matching the database schema
export interface Club {
  id: string
  name: string
  description?: string
  school: string
  meeting_day?: string
  meeting_time?: string
  advisor_name?: string
  advisor_email?: string
  club_code?: string
  created_at: string
  updated_at: string
}

export interface ClubMember {
  id: string
  user_id: string
  club_id: string
  role: string
  joined_at: string
}

export interface JoinRequest {
  id: string
  user_id: string
  club_id: string
  user_email: string
  user_name: string
  status: "pending" | "approved" | "rejected"
  requested_at: string
}

export interface Member {
  id: number
  club_id: string
  name: string
  grade?: string
  email?: string
  phone?: string
  role: string
  join_date: string
  attendance_percentage: number
  status: string
  created_at: string
}

export interface MeetingNote {
  id: number
  club_id: string
  title: string
  date: string
  attendees: number
  duration?: string
  status: string
  summary?: string
  action_items: string[]
  created_at: string
  created_by: string
}

export interface AttendanceRecord {
  id: number
  club_id: string
  event_date: string
  event_name: string
  present_count: number
  absent_count: number
  total_count: number
  created_at: string
  created_by: string
}

export interface HourEntry {
  id: number
  club_id: string
  member_name: string
  date: string
  hours: number
  category?: string
  description?: string
  status: string
  created_at: string
  created_by: string
}

export interface Event {
  id: number
  club_id: string
  title: string
  event_date: string
  event_time?: string
  location?: string
  category?: string
  description?: string
  current_attendees: number
  max_attendees?: number
  status: string
  priority: string
  organizer?: string
  created_at: string
  created_by: string
}

export interface Task {
  id: number
  club_id: string
  title: string
  description?: string
  assignee?: string
  due_date?: string
  priority: string
  status: string
  category?: string
  progress: number
  subtasks: any[]
  created_at: string
  created_by: string
}

interface DataContextType {
  // State
  currentClub: Club | null
  setCurrentClub: (club: Club | null) => void
  userClubs: Club[]
  members: Member[]
  meetingNotes: MeetingNote[]
  attendanceRecords: AttendanceRecord[]
  hourEntries: HourEntry[]
  events: Event[]
  tasks: Task[]
  joinRequests: JoinRequest[]
  loading: boolean

  // Club management
  loadUserClubs: () => Promise<void>
  createClub: (clubData: Partial<Club>) => Promise<Club>
  joinClubWithCode: (clubCode: string) => Promise<void>
  searchClubs: (query: string) => Promise<Club[]>
  addOfficer: (clubId: string, email: string) => Promise<void>
  loadJoinRequests: () => Promise<void>
  approveJoinRequest: (requestId: string) => Promise<void>
  rejectJoinRequest: (requestId: string) => Promise<void>
  generateClubCode: () => Promise<void>

  // Data management
  addMember: (member: Partial<Member>) => Promise<void>
  updateMember: (id: number, updates: Partial<Member>) => Promise<void>
  deleteMember: (id: number) => Promise<void>

  addMeetingNote: (note: Partial<MeetingNote>) => Promise<void>
  updateMeetingNote: (id: number, updates: Partial<MeetingNote>) => Promise<void>
  deleteMeetingNote: (id: number) => Promise<void>

  addAttendanceRecord: (record: Partial<AttendanceRecord>) => Promise<void>
  updateAttendanceRecord: (id: number, updates: Partial<AttendanceRecord>) => Promise<void>
  deleteAttendanceRecord: (id: number) => Promise<void>

  addHourEntry: (entry: Partial<HourEntry>) => Promise<void>
  updateHourEntry: (id: number, updates: Partial<HourEntry>) => Promise<void>
  deleteHourEntry: (id: number) => Promise<void>

  addEvent: (event: Partial<Event>) => Promise<void>
  updateEvent: (id: number, updates: Partial<Event>) => Promise<void>
  deleteEvent: (id: number) => Promise<void>

  addTask: (task: Partial<Task>) => Promise<void>
  updateTask: (id: number, updates: Partial<Task>) => Promise<void>
  deleteTask: (id: number) => Promise<void>

  refreshData: () => Promise<void>
}

const DataContext = createContext<DataContextType | undefined>(undefined)

// Generate random club code
const generateRandomCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [currentClub, setCurrentClub] = useState<Club | null>(null)
  const [userClubs, setUserClubs] = useState<Club[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [meetingNotes, setMeetingNotes] = useState<MeetingNote[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [hourEntries, setHourEntries] = useState<HourEntry[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([])
  const [loading, setLoading] = useState(false)

  // Load user's clubs
  const loadUserClubs = useCallback(async () => {
    if (!user) {
      console.log("No user found, cannot load clubs")
      setUserClubs([])
      return
    }

    try {
      console.log("Loading clubs for user:", user.id)

      const { data: clubMembers, error } = await supabase
        .from("club_members")
        .select(`
          club_id,
          role,
          clubs (
            id,
            name,
            description,
            school,
            meeting_day,
            meeting_time,
            advisor_name,
            advisor_email,
            club_code,
            created_at,
            updated_at
          )
        `)
        .eq("user_id", user.id)

      if (error) {
        console.error("Error loading user clubs:", error)
        return
      }

      console.log("Raw club memberships:", clubMembers)

      const clubs =
        clubMembers
          ?.map((cm: any) => ({
            ...cm.clubs,
            role: cm.role,
          }))
          .filter((club: any) => club.id) || []

      console.log("Formatted clubs:", clubs)
      setUserClubs(clubs)
    } catch (error) {
      console.error("Error loading user clubs:", error)
    }
  }, [user])

  // Load club data when selected club changes
  const loadClubData = useCallback(async (clubId: string) => {
    if (!clubId) return

    setLoading(true)
    try {
      // Load all club data in parallel
      const [membersResult, meetingNotesResult, attendanceResult, hoursResult, eventsResult, tasksResult] =
        await Promise.all([
          supabase.from("members").select("*").eq("club_id", clubId).order("created_at", { ascending: false }),
          supabase.from("meeting_notes").select("*").eq("club_id", clubId).order("date", { ascending: false }),
          supabase
            .from("attendance_records")
            .select("*")
            .eq("club_id", clubId)
            .order("event_date", { ascending: false }),
          supabase.from("hour_entries").select("*").eq("club_id", clubId).order("date", { ascending: false }),
          supabase.from("events").select("*").eq("club_id", clubId).order("event_date", { ascending: true }),
          supabase.from("tasks").select("*").eq("club_id", clubId).order("created_at", { ascending: false }),
        ])

      if (membersResult.error) console.error("Error loading members:", membersResult.error)
      if (meetingNotesResult.error) console.error("Error loading meeting notes:", meetingNotesResult.error)
      if (attendanceResult.error) console.error("Error loading attendance:", attendanceResult.error)
      if (hoursResult.error) console.error("Error loading hours:", hoursResult.error)
      if (eventsResult.error) console.error("Error loading events:", eventsResult.error)
      if (tasksResult.error) console.error("Error loading tasks:", tasksResult.error)

      setMembers(membersResult.data || [])
      setMeetingNotes(meetingNotesResult.data || [])
      setAttendanceRecords(attendanceResult.data || [])
      setHourEntries(hoursResult.data || [])
      setEvents(eventsResult.data || [])
      setTasks(tasksResult.data || [])
    } catch (error) {
      console.error("Error loading club data:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Load join requests for current club
  const loadJoinRequests = useCallback(async () => {
    if (!currentClub) {
      setJoinRequests([])
      return
    }

    try {
      // For now, we'll store join requests in localStorage since we don't want to modify Supabase
      const storedRequests = localStorage.getItem(`join_requests_${currentClub.id}`)
      if (storedRequests) {
        setJoinRequests(JSON.parse(storedRequests))
      } else {
        setJoinRequests([])
      }
    } catch (error) {
      console.error("Error loading join requests:", error)
      setJoinRequests([])
    }
  }, [currentClub])

  // Create club with unique code
  const createClub = useCallback(
    async (clubData: Partial<Club>): Promise<Club> => {
      if (!user) throw new Error("User not authenticated")

      try {
        console.log("Creating club with data:", clubData)

        // Generate unique club code
        let clubCode = generateRandomCode()
        let isUnique = false

        // Check if code is unique (simple check for now)
        while (!isUnique) {
          const { data: existingClub } = await supabase.from("clubs").select("id").eq("club_code", clubCode).single()

          if (!existingClub) {
            isUnique = true
          } else {
            clubCode = generateRandomCode()
          }
        }

        // Create the club
        const { data: club, error: clubError } = await supabase
          .from("clubs")
          .insert([
            {
              name: clubData.name,
              description: clubData.description,
              school: clubData.school,
              meeting_day: clubData.meeting_day,
              meeting_time: clubData.meeting_time,
              advisor_name: clubData.advisor_name,
              advisor_email: clubData.advisor_email,
              club_code: clubCode,
            },
          ])
          .select()
          .single()

        if (clubError) {
          console.error("Error creating club:", clubError)
          throw clubError
        }

        console.log("Club created:", club)

        // Add user as club member
        const { error: memberError } = await supabase.from("club_members").insert([
          {
            user_id: user.id,
            club_id: club.id,
            role: "officer",
          },
        ])

        if (memberError) {
          console.error("Error adding user to club:", memberError)
          throw memberError
        }

        console.log("User added to club as officer")

        // Refresh user clubs
        await loadUserClubs()

        return club
      } catch (error) {
        console.error("Error in createClub:", error)
        throw error
      }
    },
    [user, loadUserClubs],
  )

  // Join club with code
  const joinClubWithCode = useCallback(
    async (clubCode: string): Promise<void> => {
      if (!user) throw new Error("User not authenticated")

      try {
        // Find club by code
        const { data: club, error: clubError } = await supabase
          .from("clubs")
          .select("*")
          .eq("club_code", clubCode.toUpperCase())
          .single()

        if (clubError || !club) {
          throw new Error("Invalid club code")
        }

        // Check if user is already a member
        const { data: existingMember } = await supabase
          .from("club_members")
          .select("id")
          .eq("user_id", user.id)
          .eq("club_id", club.id)
          .single()

        if (existingMember) {
          throw new Error("You are already a member of this club")
        }

        // Get user profile for join request
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("email, full_name")
          .eq("id", user.id)
          .single()

        // Create join request (stored in localStorage for now)
        const joinRequest: JoinRequest = {
          id: Date.now().toString(),
          user_id: user.id,
          club_id: club.id,
          user_email: profile?.email || user.email || "",
          user_name: profile?.full_name || "Unknown User",
          status: "pending",
          requested_at: new Date().toISOString(),
        }

        // Store in localStorage
        const existingRequests = JSON.parse(localStorage.getItem(`join_requests_${club.id}`) || "[]")

        // Check if request already exists
        const existingRequest = existingRequests.find((req: JoinRequest) => req.user_id === user.id)
        if (existingRequest) {
          throw new Error("You have already requested to join this club")
        }

        existingRequests.push(joinRequest)
        localStorage.setItem(`join_requests_${club.id}`, JSON.stringify(existingRequests))

        console.log("Join request created successfully")
      } catch (error) {
        console.error("Error joining club:", error)
        throw error
      }
    },
    [user],
  )

  // Approve join request
  const approveJoinRequest = useCallback(
    async (requestId: string): Promise<void> => {
      if (!currentClub) return

      try {
        // Get join requests from localStorage
        const existingRequests: JoinRequest[] = JSON.parse(
          localStorage.getItem(`join_requests_${currentClub.id}`) || "[]",
        )
        const request = existingRequests.find((req) => req.id === requestId)

        if (!request) {
          throw new Error("Join request not found")
        }

        // Add user to club in Supabase
        const { error } = await supabase.from("club_members").insert([
          {
            user_id: request.user_id,
            club_id: currentClub.id,
            role: "officer",
          },
        ])

        if (error) throw error

        // Update request status and save back to localStorage
        const updatedRequests = existingRequests.map((req) =>
          req.id === requestId ? { ...req, status: "approved" as const } : req,
        )
        localStorage.setItem(`join_requests_${currentClub.id}`, JSON.stringify(updatedRequests))

        // Refresh join requests
        setJoinRequests(updatedRequests)
      } catch (error) {
        console.error("Error approving join request:", error)
        throw error
      }
    },
    [currentClub],
  )

  // Reject join request
  const rejectJoinRequest = useCallback(
    async (requestId: string): Promise<void> => {
      if (!currentClub) return

      try {
        // Get join requests from localStorage
        const existingRequests: JoinRequest[] = JSON.parse(
          localStorage.getItem(`join_requests_${currentClub.id}`) || "[]",
        )

        // Update request status and save back to localStorage
        const updatedRequests = existingRequests.map((req) =>
          req.id === requestId ? { ...req, status: "rejected" as const } : req,
        )
        localStorage.setItem(`join_requests_${currentClub.id}`, JSON.stringify(updatedRequests))

        // Refresh join requests
        setJoinRequests(updatedRequests)
      } catch (error) {
        console.error("Error rejecting join request:", error)
        throw error
      }
    },
    [currentClub],
  )

  // Generate new club code
  const generateClubCode = useCallback(async (): Promise<void> => {
    if (!currentClub) return

    try {
      let clubCode = generateRandomCode()
      let isUnique = false

      // Check if code is unique
      while (!isUnique) {
        const { data: existingClub } = await supabase.from("clubs").select("id").eq("club_code", clubCode).single()

        if (!existingClub) {
          isUnique = true
        } else {
          clubCode = generateRandomCode()
        }
      }

      // Update club with new code
      const { error } = await supabase.from("clubs").update({ club_code: clubCode }).eq("id", currentClub.id)

      if (error) throw error

      // Update current club state
      setCurrentClub({ ...currentClub, club_code: clubCode })

      // Refresh user clubs
      await loadUserClubs()
    } catch (error) {
      console.error("Error generating club code:", error)
      throw error
    }
  }, [currentClub, loadUserClubs])

  // Search clubs (keeping for compatibility)
  const searchClubs = useCallback(async (query: string): Promise<Club[]> => {
    try {
      const { data, error } = await supabase
        .from("clubs")
        .select("*")
        .or(`name.ilike.%${query}%,school.ilike.%${query}%`)
        .limit(10)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error searching clubs:", error)
      throw error
    }
  }, [])

  // Add officer (keeping for compatibility)
  const addOfficer = useCallback(async (clubId: string, email: string): Promise<void> => {
    try {
      // Find user by email
      const { data: profile, error: profileError } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("email", email)
        .single()

      if (profileError) throw new Error("User not found")

      // Add to club
      const { error } = await supabase.from("club_members").insert([
        {
          user_id: profile.id,
          club_id: clubId,
          role: "officer",
        },
      ])

      if (error) throw error
    } catch (error) {
      console.error("Error adding officer:", error)
      throw error
    }
  }, [])

  // Member CRUD operations
  const addMember = useCallback(
    async (memberData: Partial<Member>) => {
      if (!currentClub || !user) return

      try {
        const { data, error } = await supabase
          .from("members")
          .insert([
            {
              club_id: currentClub.id,
              name: memberData.name,
              grade: memberData.grade,
              email: memberData.email,
              phone: memberData.phone,
              role: memberData.role || "Member",
              join_date: memberData.join_date || new Date().toISOString().split("T")[0],
              attendance_percentage: memberData.attendance_percentage || 0,
              status: memberData.status || "active",
              created_by: user.id,
            },
          ])
          .select()
          .single()

        if (error) {
          console.error("Error adding member:", error)
          throw error
        }

        await loadClubData(currentClub.id)
      } catch (error) {
        console.error("Error in addMember:", error)
        throw error
      }
    },
    [currentClub, user, loadClubData],
  )

  const updateMember = useCallback(
    async (id: number, updates: Partial<Member>) => {
      try {
        const { error } = await supabase.from("members").update(updates).eq("id", id)

        if (error) {
          console.error("Error updating member:", error)
          throw error
        }

        if (currentClub) await loadClubData(currentClub.id)
      } catch (error) {
        console.error("Error in updateMember:", error)
        throw error
      }
    },
    [currentClub, loadClubData],
  )

  const deleteMember = useCallback(
    async (id: number) => {
      try {
        const { error } = await supabase.from("members").delete().eq("id", id)

        if (error) {
          console.error("Error deleting member:", error)
          throw error
        }

        if (currentClub) await loadClubData(currentClub.id)
      } catch (error) {
        console.error("Error in deleteMember:", error)
        throw error
      }
    },
    [currentClub, loadClubData],
  )

  // Meeting Notes CRUD operations
  const addMeetingNote = useCallback(
    async (noteData: Partial<MeetingNote>) => {
      if (!currentClub || !user) return

      try {
        const { data, error } = await supabase
          .from("meeting_notes")
          .insert([
            {
              club_id: currentClub.id,
              title: noteData.title,
              date: noteData.date,
              attendees: noteData.attendees || 0,
              duration: noteData.duration,
              status: noteData.status || "completed",
              summary: noteData.summary,
              action_items: noteData.action_items || [],
              created_by: user.id,
            },
          ])
          .select()
          .single()

        if (error) {
          console.error("Error adding meeting note:", error)
          throw error
        }

        await loadClubData(currentClub.id)
      } catch (error) {
        console.error("Error in addMeetingNote:", error)
        throw error
      }
    },
    [currentClub, user, loadClubData],
  )

  const updateMeetingNote = useCallback(
    async (id: number, updates: Partial<MeetingNote>) => {
      try {
        const { error } = await supabase.from("meeting_notes").update(updates).eq("id", id)

        if (error) {
          console.error("Error updating meeting note:", error)
          throw error
        }

        if (currentClub) await loadClubData(currentClub.id)
      } catch (error) {
        console.error("Error in updateMeetingNote:", error)
        throw error
      }
    },
    [currentClub, loadClubData],
  )

  const deleteMeetingNote = useCallback(
    async (id: number) => {
      try {
        const { error } = await supabase.from("meeting_notes").delete().eq("id", id)

        if (error) {
          console.error("Error deleting meeting note:", error)
          throw error
        }

        if (currentClub) await loadClubData(currentClub.id)
      } catch (error) {
        console.error("Error in deleteMeetingNote:", error)
        throw error
      }
    },
    [currentClub, loadClubData],
  )

  // Attendance CRUD operations
  const addAttendanceRecord = useCallback(
    async (recordData: Partial<AttendanceRecord>) => {
      if (!currentClub || !user) return

      try {
        const { data, error } = await supabase
          .from("attendance_records")
          .insert([
            {
              club_id: currentClub.id,
              event_date: recordData.event_date || recordData.date,
              event_name: recordData.event_name || recordData.event,
              present_count: recordData.present_count || recordData.present,
              absent_count: recordData.absent_count || recordData.absent,
              total_count: recordData.total_count || recordData.total,
              created_by: user.id,
            },
          ])
          .select()
          .single()

        if (error) {
          console.error("Error adding attendance record:", error)
          throw error
        }

        await loadClubData(currentClub.id)
      } catch (error) {
        console.error("Error in addAttendanceRecord:", error)
        throw error
      }
    },
    [currentClub, user, loadClubData],
  )

  const updateAttendanceRecord = useCallback(
    async (id: number, updates: Partial<AttendanceRecord>) => {
      try {
        const { error } = await supabase.from("attendance_records").update(updates).eq("id", id)

        if (error) {
          console.error("Error updating attendance record:", error)
          throw error
        }

        if (currentClub) await loadClubData(currentClub.id)
      } catch (error) {
        console.error("Error in updateAttendanceRecord:", error)
        throw error
      }
    },
    [currentClub, loadClubData],
  )

  const deleteAttendanceRecord = useCallback(
    async (id: number) => {
      try {
        const { error } = await supabase.from("attendance_records").delete().eq("id", id)

        if (error) {
          console.error("Error deleting attendance record:", error)
          throw error
        }

        if (currentClub) await loadClubData(currentClub.id)
      } catch (error) {
        console.error("Error in deleteAttendanceRecord:", error)
        throw error
      }
    },
    [currentClub, loadClubData],
  )

  // Hour Entry CRUD operations
  const addHourEntry = useCallback(
    async (entryData: Partial<HourEntry>) => {
      if (!currentClub || !user) return

      try {
        const { data, error } = await supabase
          .from("hour_entries")
          .insert([
            {
              club_id: currentClub.id,
              member_name: entryData.member_name || entryData.member,
              date: entryData.date,
              hours: entryData.hours,
              category: entryData.category,
              description: entryData.description,
              status: entryData.status || "pending",
              created_by: user.id,
            },
          ])
          .select()
          .single()

        if (error) {
          console.error("Error adding hour entry:", error)
          throw error
        }

        await loadClubData(currentClub.id)
      } catch (error) {
        console.error("Error in addHourEntry:", error)
        throw error
      }
    },
    [currentClub, user, loadClubData],
  )

  const updateHourEntry = useCallback(
    async (id: number, updates: Partial<HourEntry>) => {
      try {
        const { error } = await supabase.from("hour_entries").update(updates).eq("id", id)

        if (error) {
          console.error("Error updating hour entry:", error)
          throw error
        }

        if (currentClub) await loadClubData(currentClub.id)
      } catch (error) {
        console.error("Error in updateHourEntry:", error)
        throw error
      }
    },
    [currentClub, loadClubData],
  )

  const deleteHourEntry = useCallback(
    async (id: number) => {
      try {
        const { error } = await supabase.from("hour_entries").delete().eq("id", id)

        if (error) {
          console.error("Error deleting hour entry:", error)
          throw error
        }

        if (currentClub) await loadClubData(currentClub.id)
      } catch (error) {
        console.error("Error in deleteHourEntry:", error)
        throw error
      }
    },
    [currentClub, loadClubData],
  )

  // Event CRUD operations
  const addEvent = useCallback(
    async (eventData: Partial<Event>) => {
      if (!currentClub || !user) return

      try {
        const { data, error } = await supabase
          .from("events")
          .insert([
            {
              club_id: currentClub.id,
              title: eventData.title,
              event_date: eventData.event_date || eventData.date,
              event_time: eventData.event_time || eventData.time,
              location: eventData.location,
              category: eventData.category,
              description: eventData.description,
              current_attendees: eventData.current_attendees || eventData.attendees || 0,
              max_attendees: eventData.max_attendees || eventData.maxAttendees,
              status: eventData.status || "upcoming",
              priority: eventData.priority || "medium",
              organizer: eventData.organizer,
              created_by: user.id,
            },
          ])
          .select()
          .single()

        if (error) {
          console.error("Error adding event:", error)
          throw error
        }

        await loadClubData(currentClub.id)
      } catch (error) {
        console.error("Error in addEvent:", error)
        throw error
      }
    },
    [currentClub, user, loadClubData],
  )

  const updateEvent = useCallback(
    async (id: number, updates: Partial<Event>) => {
      try {
        const { error } = await supabase.from("events").update(updates).eq("id", id)

        if (error) {
          console.error("Error updating event:", error)
          throw error
        }

        if (currentClub) await loadClubData(currentClub.id)
      } catch (error) {
        console.error("Error in updateEvent:", error)
        throw error
      }
    },
    [currentClub, loadClubData],
  )

  const deleteEvent = useCallback(
    async (id: number) => {
      try {
        const { error } = await supabase.from("events").delete().eq("id", id)

        if (error) {
          console.error("Error deleting event:", error)
          throw error
        }

        if (currentClub) await loadClubData(currentClub.id)
      } catch (error) {
        console.error("Error in deleteEvent:", error)
        throw error
      }
    },
    [currentClub, loadClubData],
  )

  // Task CRUD operations
  const addTask = useCallback(
    async (taskData: Partial<Task>) => {
      if (!currentClub || !user) return

      try {
        const { data, error } = await supabase
          .from("tasks")
          .insert([
            {
              club_id: currentClub.id,
              title: taskData.title,
              description: taskData.description,
              assignee: taskData.assignee,
              due_date: taskData.due_date || taskData.dueDate,
              priority: taskData.priority || "medium",
              status: taskData.status || "pending",
              category: taskData.category,
              progress: taskData.progress || 0,
              subtasks: taskData.subtasks || [],
              created_by: user.id,
            },
          ])
          .select()
          .single()

        if (error) {
          console.error("Error adding task:", error)
          throw error
        }

        await loadClubData(currentClub.id)
      } catch (error) {
        console.error("Error in addTask:", error)
        throw error
      }
    },
    [currentClub, user, loadClubData],
  )

  const updateTask = useCallback(
    async (id: number, updates: Partial<Task>) => {
      try {
        const { error } = await supabase.from("tasks").update(updates).eq("id", id)

        if (error) {
          console.error("Error updating task:", error)
          throw error
        }

        if (currentClub) await loadClubData(currentClub.id)
      } catch (error) {
        console.error("Error in updateTask:", error)
        throw error
      }
    },
    [currentClub, loadClubData],
  )

  const deleteTask = useCallback(
    async (id: number) => {
      try {
        const { error } = await supabase.from("tasks").delete().eq("id", id)

        if (error) {
          console.error("Error deleting task:", error)
          throw error
        }

        if (currentClub) await loadClubData(currentClub.id)
      } catch (error) {
        console.error("Error in deleteTask:", error)
        throw error
      }
    },
    [currentClub, loadClubData],
  )

  const refreshData = useCallback(async () => {
    if (currentClub) {
      await loadClubData(currentClub.id)
      await loadJoinRequests()
    }
    await loadUserClubs()
  }, [currentClub, loadClubData, loadJoinRequests, loadUserClubs])

  // Effects
  useEffect(() => {
    if (user) {
      loadUserClubs()
    } else {
      setUserClubs([])
    }
  }, [user, loadUserClubs])

  useEffect(() => {
    if (currentClub) {
      loadClubData(currentClub.id)
      loadJoinRequests()
    }
  }, [currentClub, loadClubData, loadJoinRequests])

  return (
    <DataContext.Provider
      value={{
        currentClub,
        setCurrentClub,
        userClubs,
        members,
        meetingNotes,
        attendanceRecords,
        hourEntries,
        events,
        tasks,
        joinRequests,
        loading,
        loadUserClubs,
        createClub,
        joinClubWithCode,
        searchClubs,
        addOfficer,
        loadJoinRequests,
        approveJoinRequest,
        rejectJoinRequest,
        generateClubCode,
        addMember,
        updateMember,
        deleteMember,
        addMeetingNote,
        updateMeetingNote,
        deleteMeetingNote,
        addAttendanceRecord,
        updateAttendanceRecord,
        deleteAttendanceRecord,
        addHourEntry,
        updateHourEntry,
        deleteHourEntry,
        addEvent,
        updateEvent,
        deleteEvent,
        addTask,
        updateTask,
        deleteTask,
        refreshData,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
