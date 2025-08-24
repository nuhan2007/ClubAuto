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
  let mounted = true;

  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      setLoading(false);

      // Optionally ensure user profile on sign in
      // if (event === "SIGNED_IN" && session?.user) {
      //   await ensureUserProfile(session.user);
      // }
    }
  );

  // On initial mount, set loading to false if no session
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (mounted) {
      setUser(session?.user ?? null);
      setLoading(false);
    }
  });

  return () => {
    mounted = false;
    subscription.unsubscribe();
  };
}, []);


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
      setUser(null)
      // Clear any cached data
      localStorage.removeItem("clubManagerAuth")
      localStorage.removeItem("selectedClub")
    } catch (error) {
      console.error("Error signing out:", error)
    } finally {
      setLoading(false)
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
