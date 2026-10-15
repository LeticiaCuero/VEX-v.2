import { supabase } from './supabase'

export type CompanyAccount = {
  id: string
  name: string
  cnpj: string
  user_name: string
  email: string
}

export type CompanyInput = Omit<CompanyAccount, 'id'> & { password: string; id?: string }

export async function checkAdmin() {
  if (!supabase) throw new Error('A conexão com o banco não foi configurada.')
  const { data, error } = await supabase.rpc('is_admin')
  if (error) throw new Error('Não foi possível verificar o acesso administrativo. Confira a configuração do banco.')
  return data === true
}

export async function callAdmin<T>(body: Record<string, unknown>): Promise<T> {
  if (!supabase) throw new Error('A conexão com o banco não foi configurada.')
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  if (sessionError || !session) throw new Error('Entre novamente para continuar.')
  const { data, error } = await supabase.functions.invoke('admin-companies', {
    body,
    headers: { Authorization: `Bearer ${session.access_token}` },
  })
  if (error) {
    let message = 'Não foi possível acessar Configurações. Confira a publicação da função admin-companies.'
    if (error.context instanceof Response) {
      const response = await error.context.json().catch(() => null)
      if (typeof response?.error === 'string') message = response.error
    }
    throw new Error(message)
  }
  return data as T
}
