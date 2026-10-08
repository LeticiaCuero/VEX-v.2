import { useState } from 'react'
import Modal from '../../components/Modal'
import '../../components/Button.css'
import './login.css'

export default function Login() {
  const [recoveryOpen, setRecoveryOpen] = useState(false)
  const [recoveryMessage, setRecoveryMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  return (
    <main className="login">
        <div className="login-box">
            <a href="/" aria-label="Voltar ao início">
                <img src="/logo.png" alt="VEX" className="login-logo"/>
            </a>
            <h1>Acessar sistema</h1>

            <form onSubmit={(event) => {
              event.preventDefault()
              window.location.href = '/home'
            }}>
                <label htmlFor="email">E-mail</label>
                <input type="email" name="email" id="email" placeholder="Digite seu e-mail" autoComplete="email" required />
                <label htmlFor="password">Senha</label>
                <div className="password-field">
                  <input type={showPassword ? 'text' : 'password'} name="password" id="password" placeholder="Digite sua senha" autoComplete="current-password" required />
                  <button
                    className="password-toggle"
                    type="button"
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    aria-controls="password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <img src="/src/assets/icons/eye.svg" alt="" />
                  </button>
                </div>
                <button className="btn" type="submit">Acessar<img src="/src/assets/icons/arrow.svg" alt="" /></button>
            </form>

            <div className="login-links">
              <button className="forgot-password" type="button" onClick={() => {
                setRecoveryMessage('')
                setRecoveryOpen(true)
              }}>Esqueci a senha</button>
              <a className="register-link" href="/cadastro">Não tenho conta</a>
            </div>

            <Modal open={recoveryOpen} onClose={() => setRecoveryOpen(false)} title="Recuperar senha">
              <form onSubmit={(event) => {
                event.preventDefault()
                setRecoveryMessage('O envio do link estará disponível quando a recuperação de senha for integrada ao sistema.')
              }}>
                <label htmlFor="recovery-email">E-mail</label>
                <input id="recovery-email" name="email" type="email" placeholder="Digite seu e-mail" autoComplete="email" required />
                <button className="btn" type="submit">Enviar link de recuperação</button>
                <p className="recovery-message" role="status">{recoveryMessage}</p>
              </form>
            </Modal>
        </div>
    </main>
  )
}
