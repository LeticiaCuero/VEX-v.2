import { useEffect, useState } from 'react'
import { checkAdmin } from '../lib/admin'
import { supabase } from '../lib/supabase'

export default function useAdminAccess() {
  const [allowed, setAllowed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    void checkAdmin().then((value) => {
      if (active) setAllowed(value)
    }).catch((reason: unknown) => {
      if (active) setError(reason instanceof Error ? reason.message : 'Não foi possível verificar o acesso.')
    }).finally(() => { if (active) setLoading(false) })
    const listener = supabase?.auth.onAuthStateChange((event) => {
      if (active && event === 'SIGNED_OUT') setAllowed(false)
    })
    return () => {
      active = false
      listener?.data.subscription.unsubscribe()
    }
  }, [])

  return { allowed, loading, error }
}
