import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { supabase } from '../lib/supabase'

export default function RequireAuth({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!supabase) return
    let active = true
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return
      if (session) setAuthenticated(true)
      else window.location.replace('/login')
    })
    void supabase.auth.getSession().then(({ data: { session }, error: sessionError }) => {
      if (!active) return
      if (sessionError) setError('Não foi possível verificar a sessão. Recarregue a página.')
      else if (session) setAuthenticated(true)
      else window.location.replace('/login')
    }).catch(() => {
      if (active) setError('Não foi possível verificar a sessão. Recarregue a página.')
    })
    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  if (!supabase) return <p role="alert">A conexão com o banco ainda não foi configurada.</p>
  if (error) return <p role="alert">{error}</p>
  if (!authenticated) return <p role="status">Verificando sessão...</p>
  return children
}
