"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface Member {
  id: number
  name: string
  grade: string
  email: string
  phone: string
  role: string
  joinDate: string
  attendance: number
  status: string
}

interface MeetingNote {
  id: number
  title: string
  date: string
  attendees: number
  duration: string
  status: string
  summary: string
  actionItems: string[]
}

interface AttendanceRecord {
  id: number
  date: string
  event: string
  present: number
  absent: number
  total: number
}

interface HourEntry {
  id: number
  member: string
  date: string
  hours: number
  category: string
  description: string
  status: string
}

interface Event {
  id: number
  title: string
  date: string
  time: string
  location: string
  category: string
  description: string
  attendees: number
  maxAttendees: number
  status: string
  priority: string
  organizer: string
}

interface Task {
  id: number
  title: string
  description: string
  assignee: string
  dueDate: string
  priority: string
  status: string
  category: string
  progress: number
  subtasks: { id: number; title: string; completed: boolean }[]
}

interface DataContextType {
  members: Member[]
  setMembers: (members: Member[]) => void
  addMember: (member: Omit<Member, "id">) => void
  deleteMember: (id: number) => void

  meetingNotes: MeetingNote[]
  setMeetingNotes: (notes: MeetingNote[]) => void
  addMeetingNote: (note: Omit<MeetingNote, "id">) => void
  updateMeetingNote: (id: number, note: Partial<MeetingNote>) => void
  deleteMeetingNote: (id: number) => void

  attendanceRecords: AttendanceRecord[]
  setAttendanceRecords: (records: AttendanceRecord[]) => void
  addAttendanceRecord: (record: Omit<AttendanceRecord, "id">) => void

  hourEntries: HourEntry[]
  setHourEntries: (entries: HourEntry[]) => void
  addHourEntry: (entry: Omit<HourEntry, "id">) => void

  events: Event[]
  setEvents: (events: Event[]) => void
  addEvent: (event: Omit<Event, "id">) => void
  updateEvent: (id: number, event: Partial<Event>) => void
  deleteEvent: (id: number) => void

  tasks: Task[]
  setTasks: (tasks: Task[]) => void
  addTask: (task: Omit<Task, "id">) => void
  updateTask: (id: number, task: Partial<Task>) => void
  deleteTask: (id: number) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  // Initialize with some sample data, but allow it to be overridden
  const [members, setMembersState] = useState<Member[]>([
    {
      id: 1,
      name: "Alice Johnson",
      grade: "12th",
      email: "alice@school.edu",
      phone: "(555) 123-4567",
      role: "President",
      joinDate: "September 2023",
      attendance: 95,
      status: "active",
    },
    {
      id: 2,
      name: "Bob Smith",
      grade: "11th",
      email: "bob@school.edu",
      phone: "(555) 234-5678",
      role: "Member",
      joinDate: "September 2023",
      attendance: 87,
      status: "active",
    },
    {
      id: 3,
      name: "Carol Davis",
      grade: "12th",
      email: "carol@school.edu",
      phone: "(555) 345-6789",
      role: "Vice President",
      joinDate: "September 2023",
      attendance: 92,
      status: "active",
    },
  ])

  const [meetingNotes, setMeetingNotesState] = useState<MeetingNote[]>([])
  const [attendanceRecords, setAttendanceRecordsState] = useState<AttendanceRecord[]>([])
  const [hourEntries, setHourEntriesState] = useState<HourEntry[]>([])
  const [events, setEventsState] = useState<Event[]>([])
  const [tasks, setTasksState] = useState<Task[]>([])

  // Load data from localStorage on mount
  useEffect(() => {
    const savedMembers = localStorage.getItem("clubMembers")
    const savedMeetings = localStorage.getItem("clubMeetings")
    const savedAttendance = localStorage.getItem("clubAttendance")
    const savedHours = localStorage.getItem("clubHours")
    const savedEvents = localStorage.getItem("clubEvents")
    const savedTasks = localStorage.getItem("clubTasks")

    if (savedMembers) setMembersState(JSON.parse(savedMembers))
    if (savedMeetings) setMeetingNotesState(JSON.parse(savedMeetings))
    if (savedAttendance) setAttendanceRecordsState(JSON.parse(savedAttendance))
    if (savedHours) setHourEntriesState(JSON.parse(savedHours))
    if (savedEvents) setEventsState(JSON.parse(savedEvents))
    if (savedTasks) setTasksState(JSON.parse(savedTasks))
  }, [])

  // Save to localStorage whenever data changes
  const setMembers = (newMembers: Member[]) => {
    setMembersState(newMembers)
    localStorage.setItem("clubMembers", JSON.stringify(newMembers))
  }

  const setMeetingNotes = (newNotes: MeetingNote[]) => {
    const sortedNotes = [...newNotes].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    setMeetingNotesState(sortedNotes)
    localStorage.setItem("clubMeetings", JSON.stringify(sortedNotes))
  }

  const setAttendanceRecords = (newRecords: AttendanceRecord[]) => {
    setAttendanceRecordsState(newRecords)
    localStorage.setItem("clubAttendance", JSON.stringify(newRecords))
  }

  const setHourEntries = (newEntries: HourEntry[]) => {
    setHourEntriesState(newEntries)
    localStorage.setItem("clubHours", JSON.stringify(newEntries))
  }

  const setEvents = (newEvents: Event[]) => {
    const sortedEvents = [...newEvents].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    setEventsState(sortedEvents)
    localStorage.setItem("clubEvents", JSON.stringify(sortedEvents))
  }

  const setTasks = (newTasks: Task[]) => {
    const sortedTasks = [...newTasks].sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())
    setTasksState(sortedTasks)
    localStorage.setItem("clubTasks", JSON.stringify(sortedTasks))
  }

  // Helper functions
  const addMember = (member: Omit<Member, "id">) => {
    const newMember = { ...member, id: Date.now() }
    setMembers([newMember, ...members])
  }

  const deleteMember = (id: number) => {
    setMembers(members.filter((m) => m.id !== id))
  }

  const addMeetingNote = (note: Omit<MeetingNote, "id">) => {
    const newNote = { ...note, id: Date.now() }
    setMeetingNotes([newNote, ...meetingNotes])
  }

  const updateMeetingNote = (id: number, updatedNote: Partial<MeetingNote>) => {
    setMeetingNotes(meetingNotes.map((note) => (note.id === id ? { ...note, ...updatedNote } : note)))
  }

  const deleteMeetingNote = (id: number) => {
    setMeetingNotes(meetingNotes.filter((note) => note.id !== id))
  }

  const addAttendanceRecord = (record: Omit<AttendanceRecord, "id">) => {
    const newRecord = { ...record, id: Date.now() }
    setAttendanceRecords([newRecord, ...attendanceRecords])
  }

  const addHourEntry = (entry: Omit<HourEntry, "id">) => {
    const newEntry = { ...entry, id: Date.now() }
    setHourEntries([newEntry, ...hourEntries])
  }

  const addEvent = (event: Omit<Event, "id">) => {
    const newEvent = { ...event, id: Date.now() }
    setEvents([newEvent, ...events])
  }

  const updateEvent = (id: number, updatedEvent: Partial<Event>) => {
    setEvents(events.map((event) => (event.id === id ? { ...event, ...updatedEvent } : event)))
  }

  const deleteEvent = (id: number) => {
    setEvents(events.filter((event) => event.id !== id))
  }

  const addTask = (task: Omit<Task, "id">) => {
    const newTask = { ...task, id: Date.now() }
    setTasks([newTask, ...tasks])
  }

  const updateTask = (id: number, updatedTask: Partial<Task>) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, ...updatedTask } : task)))
  }

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  return (
    <DataContext.Provider
      value={{
        members,
        setMembers,
        addMember,
        deleteMember,
        meetingNotes,
        setMeetingNotes,
        addMeetingNote,
        updateMeetingNote,
        deleteMeetingNote,
        attendanceRecords,
        setAttendanceRecords,
        addAttendanceRecord,
        hourEntries,
        setHourEntries,
        addHourEntry,
        events,
        setEvents,
        addEvent,
        updateEvent,
        deleteEvent,
        tasks,
        setTasks,
        addTask,
        updateTask,
        deleteTask,
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
