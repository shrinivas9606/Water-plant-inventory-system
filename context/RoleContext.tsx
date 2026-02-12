'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type RoleContextType = {
  role: string | null
  loading: boolean
}

const RoleContext = createContext<RoleContextType>({
  role: null,
  loading: true,
})

export function RoleProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRole = async () => {
      const { data: userData } = await supabase.auth.getUser()

      if (!userData.user) {
        setLoading(false)
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userData.user.id)
        .single()

      setRole(profile?.role || null)
      setLoading(false)
    }

    fetchRole()
  }, [])

  return (
    <RoleContext.Provider value={{ role, loading }}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  return useContext(RoleContext)
}
