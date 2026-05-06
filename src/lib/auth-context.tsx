import { createContext, useContext, useEffect, useState } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase, supabaseConfigured } from './supabase'

interface AuthContextValue {
  user: User | null
  session: Session | null
  loading: boolean
  displayName: string
  isAdmin: boolean
  hasListings: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  loading: true,
  displayName: '',
  isAdmin: false,
  hasListings: false,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [hasListings, setHasListings] = useState(false)

  useEffect(() => {
    if (!supabaseConfigured) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s)
      setUser(s?.user ?? null)
      checkAdmin(s?.user?.id)
      checkListings(s?.user?.id)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
      setUser(s?.user ?? null)
      checkAdmin(s?.user?.id)
      checkListings(s?.user?.id)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function checkAdmin(userId: string | undefined) {
    if (!userId) {
      setIsAdmin(false)
      return
    }
    try {
      const { data } = await supabase
        .from('admins')
        .select('user_id')
        .eq('user_id', userId)
        .maybeSingle()
      setIsAdmin(!!data)
    } catch {
      setIsAdmin(false)
    }
  }

  async function checkListings(userId: string | undefined) {
    if (!userId) {
      setHasListings(false)
      return
    }
    try {
      const { count } = await supabase
        .from('businesses')
        .select('id', { count: 'exact', head: true })
        .eq('owner_id', userId)
      setHasListings((count ?? 0) > 0)
    } catch {
      setHasListings(false)
    }
  }

  const displayName = user?.user_metadata?.full_name
    || user?.user_metadata?.first_name
    || user?.email?.split('@')[0]
    || ''

  async function signOut() {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, displayName, isAdmin, hasListings, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
