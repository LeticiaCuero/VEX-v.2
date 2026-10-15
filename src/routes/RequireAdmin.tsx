import type { ReactNode } from 'react'
import useAdminAccess from '../hooks/useAdminAccess'

export default function RequireAdmin({ children }: { children: ReactNode }) {
  const { allowed, loading, error } = useAdminAccess()
  if (loading) return <p role="status">Verificando acesso...</p>
  if (error) return <p role="alert">{error} <a href="/home">Voltar ao início</a></p>
  if (!allowed) return <p role="alert">Acesso exclusivo do administrador. <a href="/home">Voltar ao início</a></p>
  return children
}
