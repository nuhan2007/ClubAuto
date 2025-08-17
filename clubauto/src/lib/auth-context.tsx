/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"


import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase } from "./supabase"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Error getting session:", error)
        }

        if (mounted) {
          setUser(session?.user ?? null)
          setLoading(false)
        }
      } catch (error) {
        console.error("Error in getInitialSession:", error)
        if (mounted) {
          setUser(null)
          setLoading(false)
        }
      }
    }

    getInitialSession()

    return () => {
      mounted = false;
    }

    // Listen for auth changes
    // const {
    //   data: { subscription },
    // } = supabase.auth.onAuthStateChange(async (event, session) => {
    //   console.log("Auth state changed:", event, session?.user?.id)

    //   if (mounted) {
    //     setUser(session?.user ?? null)
    //     setLoading(false)

    //     // Create user profile if it doesn't exist
    //     if (event === "SIGNED_IN" && session?.user) {
    //       await ensureUserProfile(session.user)
    //     }
    //   }
    // })

    // return () => {
    //   mounted = false
    //   subscription.unsubscribe()
    // }
  }, [])

  // const ensureUserProfile = async (user: User) => {
  //   try {
  //     // Check if profile exists
  //     const { data: existingProfile } = await supabase.from("user_profiles").select("id").eq("id", user.id).single()

  //     // Create profile if it doesn't exist
  //     if (!existingProfile) {
  //       const { error } = await supabase.from("user_profiles").insert([
  //         {
  //           id: user.id,
  //           email: user.email!,
  //           full_name: user.user_metadata?.full_name || "",
  //         },
  //       ])

  //       if (error) {
  //         console.error("Error creating user profile:", error)
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error ensuring user profile:", error)
  //   }
  // }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { error }
    } catch (error) {
      return { error }
    } finally {
      // Don't set loading to false here, let the auth state change handle it
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })
      return { error }
    } catch (error) {
      return { error }
    } finally {
      // Don't set loading to false here, let the auth state change handle it
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      await supabase.auth.signOut()
      // Clear any cached data
      localStorage.removeItem("clubManagerAuth")
      localStorage.removeItem("selectedClub")
    } catch (error) {
      console.error("Error signing out:", error)
    } finally {
      window.location.href = "/"
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
