"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { supabase } from "./supabase"
import { useAuth } from "./auth-context"

// Types
export interface Club {
  id: string
  name: string
  description?: string
  school: string
  meeting_day?: string
  meeting_time?: string
  advisor_name?: string
  advisor_email?: string
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

export interface Member {
  id: string
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
  id: string
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
  id: string
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
  id: string
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
  id: string
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
  id: string
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
  loading: boolean

  // Club management
  loadUserClubs: () => Promise<void>
  createClub: (clubData: Partial<Club>) => Promise<Club>
  joinClub: (clubId: string) => Promise<void>
  searchClubs: (query: string) => Promise<Club[]>
  addOfficer: (clubId: string, email: string) => Promise<void>

  // Data management
  addMember: (member: Partial<Member>) => Promise<void>
  updateMember: (id: string, updates: Partial<Member>) => Promise<void>
  deleteMember: (id: string) => Promise<void>

  addMeetingNote: (note: Partial<MeetingNote>) => Promise<void>
  updateMeetingNote: (id: string, updates: Partial<MeetingNote>) => Promise<void>
  deleteMeetingNote: (id: string) => Promise<void>

  addAttendanceRecord: (record: Partial<AttendanceRecord>) => Promise<void>
  updateAttendanceRecord: (id: string, updates: Partial<AttendanceRecord>) => Promise<void>
  deleteAttendanceRecord: (id: string) => Promise<void>

  addHourEntry: (entry: Partial<HourEntry>) => Promise<void>
  updateHourEntry: (id: string, updates: Partial<HourEntry>) => Promise<void>
  deleteHourEntry: (id: string) => Promise<void>

  addEvent: (event: Partial<Event>) => Promise<void>
  updateEvent: (id: string, updates: Partial<Event>) => Promise<void>
  deleteEvent: (id: string) => Promise<void>

  addTask: (task: Partial<Task>) => Promise<void>
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>

  refreshData: () => Promise<void>
}

const DataContext = createContext<DataContextType | undefined>(undefined)

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
  const [loading, setLoading] = useState(false)

  // Load user's clubs
  const loadUserClubs = async () => {
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
  }

  // Load club data when selected club changes
  const loadClubData = async (clubId: string) => {
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
  }

  // Create club
  const createClub = async (clubData: Partial<Club>): Promise<Club> => {
    if (!user) throw new Error("User not authenticated")

    try {
      console.log("Creating club with data:", clubData)

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
  }

  // Join club
  const joinClub = async (clubId: string): Promise<void> => {
    if (!user) throw new Error("User not authenticated")

    try {
      const { error } = await supabase.from("club_members").insert([
        {
          user_id: user.id,
          club_id: clubId,
          role: "officer",
        },
      ])

      if (error) throw error

      await loadUserClubs()
    } catch (error) {
      console.error("Error joining club:", error)
      throw error
    }
  }

  // Search clubs
  const searchClubs = async (query: string): Promise<Club[]> => {
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
  }

  // Add officer
  const addOfficer = async (clubId: string, email: string): Promise<void> => {
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
  }

  // Generic CRUD operations
  const addMember = async (member: Partial<Member>) => {
    if (!currentClub || !user) return
    const { error } = await supabase
      .from("members")
      .insert([{ ...member, club_id: currentClub.id, created_by: user.id }])
    if (error) throw error
    await loadClubData(currentClub.id)
  }

  const updateMember = async (id: string, updates: Partial<Member>) => {
    const { error } = await supabase.from("members").update(updates).eq("id", id)
    if (error) throw error
    if (currentClub) await loadClubData(currentClub.id)
  }

  const deleteMember = async (id: string) => {
    const { error } = await supabase.from("members").delete().eq("id", id)
    if (error) throw error
    if (currentClub) await loadClubData(currentClub.id)
  }

  const addMeetingNote = async (note: Partial<MeetingNote>) => {
    if (!currentClub || !user) return
    const { error } = await supabase
      .from("meeting_notes")
      .insert([{ ...note, club_id: currentClub.id, created_by: user.id }])
    if (error) throw error
    await loadClubData(currentClub.id)
  }

  const updateMeetingNote = async (id: string, updates: Partial<MeetingNote>) => {
    const { error } = await supabase.from("meeting_notes").update(updates).eq("id", id)
    if (error) throw error
    if (currentClub) await loadClubData(currentClub.id)
  }

  const deleteMeetingNote = async (id: string) => {
    const { error } = await supabase.from("meeting_notes").delete().eq("id", id)
    if (error) throw error
    if (currentClub) await loadClubData(currentClub.id)
  }

  const addAttendanceRecord = async (record: Partial<AttendanceRecord>) => {
    if (!currentClub || !user) return
    const { error } = await supabase
      .from("attendance_records")
      .insert([{ ...record, club_id: currentClub.id, created_by: user.id }])
    if (error) throw error
    await loadClubData(currentClub.id)
  }

  const updateAttendanceRecord = async (id: string, updates: Partial<AttendanceRecord>) => {
    const { error } = await supabase.from("attendance_records").update(updates).eq("id", id)
    if (error) throw error
    if (currentClub) await loadClubData(currentClub.id)
  }

  const deleteAttendanceRecord = async (id: string) => {
    const { error } = await supabase.from("attendance_records").delete().eq("id", id)
    if (error) throw error
    if (currentClub) await loadClubData(currentClub.id)
  }

  const addHourEntry = async (entry: Partial<HourEntry>) => {
    if (!currentClub || !user) return
    const { error } = await supabase
      .from("hour_entries")
      .insert([{ ...entry, club_id: currentClub.id, created_by: user.id }])
    if (error) throw error
    await loadClubData(currentClub.id)
  }

  const updateHourEntry = async (id: string, updates: Partial<HourEntry>) => {
    const { error } = await supabase.from("hour_entries").update(updates).eq("id", id)
    if (error) throw error
    if (currentClub) await loadClubData(currentClub.id)
  }

  const deleteHourEntry = async (id: string) => {
    const { error } = await supabase.from("hour_entries").delete().eq("id", id)
    if (error) throw error
    if (currentClub) await loadClubData(currentClub.id)
  }

  const addEvent = async (event: Partial<Event>) => {
    if (!currentClub || !user) return
    const { error } = await supabase.from("events").insert([{ ...event, club_id: currentClub.id, created_by: user.id }])
    if (error) throw error
    await loadClubData(currentClub.id)
  }

  const updateEvent = async (id: string, updates: Partial<Event>) => {
    const { error } = await supabase.from("events").update(updates).eq("id", id)
    if (error) throw error
    if (currentClub) await loadClubData(currentClub.id)
  }

  const deleteEvent = async (id: string) => {
    const { error } = await supabase.from("events").delete().eq("id", id)
    if (error) throw error
    if (currentClub) await loadClubData(currentClub.id)
  }

  const addTask = async (task: Partial<Task>) => {
    if (!currentClub || !user) return
    const { error } = await supabase.from("tasks").insert([{ ...task, club_id: currentClub.id, created_by: user.id }])
    if (error) throw error
    await loadClubData(currentClub.id)
  }

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const { error } = await supabase.from("tasks").update(updates).eq("id", id)
    if (error) throw error
    if (currentClub) await loadClubData(currentClub.id)
  }

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id)
    if (error) throw error
    if (currentClub) await loadClubData(currentClub.id)
  }

  const refreshData = async () => {
    if (currentClub) {
      await loadClubData(currentClub.id)
    }
    await loadUserClubs()
  }

  // Effects
  useEffect(() => {
    if (user) {
      loadUserClubs()
    } else {
      setUserClubs([])
    }
  }, [user])

  useEffect(() => {
    if (currentClub) {
      loadClubData(currentClub.id)
    }
  }, [currentClub])

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
        loading,
        loadUserClubs,
        createClub,
        joinClub,
        searchClubs,
        addOfficer,
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
