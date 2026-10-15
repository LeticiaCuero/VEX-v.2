import { useState } from 'react'
import type { FormEvent } from 'react'
import { supabase } from '../lib/supabase'

export default function useLogin() {
  const [recoveryOpen, setRecoveryOpen] = useState(false)
  const [recoveryMessage, setRecoveryMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [signingIn, setSigningIn] = useState(false)
  const [loginError, setLoginError] = useState('')

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (signingIn) return
    setLoginError('')
    if (!supabase) {
      setLoginError('A conexão com o banco ainda não foi configurada.')
      return
    }
    const fields = new FormData(event.currentTarget)
    setSigningIn(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: String(fields.get('email') ?? '').trim(),
        password: String(fields.get('password') ?? ''),
      })
      if (error || !data.session) {
        setLoginError(error?.code === 'email_not_confirmed'
          ? 'Confirme seu e-mail antes de acessar.'
          : 'Não foi possível entrar. Confira o e-mail e a senha e tente novamente.')
        return
      }
      window.location.replace('/home')
    } catch {
      setLoginError('Não foi possível conectar. Verifique sua conexão e tente novamente.')
    } finally {
      setSigningIn(false)
    }
  }

  function togglePassword() {
    setShowPassword((visible) => !visible)
  }

  function openRecovery() {
    setRecoveryMessage('')
    setRecoveryOpen(true)
  }

  function closeRecovery() {
    setRecoveryOpen(false)
  }

  function handleRecovery(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setRecoveryMessage('O envio do link estará disponível quando a recuperação de senha for integrada ao sistema.')
  }

  return {
    recoveryOpen, recoveryMessage, showPassword, signingIn, loginError,
    handleLogin, togglePassword, openRecovery, closeRecovery, handleRecovery,
  }
}
