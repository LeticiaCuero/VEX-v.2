import useLogin from '../../hooks/useLogin'
import Modal from '../../components/Modal'
import '../../components/Button.css'
import './login.css'

export default function Login() {
  const {
    recoveryOpen, recoveryMessage, showPassword, signingIn, loginError,
    handleLogin, togglePassword, openRecovery, closeRecovery, handleRecovery,
  } = useLogin()

  return (
    <main className="login">
        <div className="login-box">
            <a href="/" aria-label="Voltar ao início">
                <img src="/logo.png" alt="VEX" className="login-logo"/>
            </a>
            <h1>Acessar sistema</h1>

            <form onSubmit={handleLogin} aria-busy={signingIn}>
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
                    onClick={togglePassword}
                  >
                    <span className="icon-eye" aria-hidden="true" />
                  </button>
                </div>
                {loginError && <p className="login-message" role="alert">{loginError}</p>}
                <button className="btn" type="submit" disabled={signingIn}>{signingIn ? 'Entrando...' : 'Acessar'}<span className="icon-arrow" aria-hidden="true" /></button>
            </form>

            <div className="login-links">
              <button className="forgot-password" type="button" onClick={openRecovery}>Esqueci a senha</button>
              <a className="register-link" href="/cadastro">Não tenho conta</a>
            </div>

            <Modal open={recoveryOpen} onClose={closeRecovery} title="Recuperar senha">
              <form onSubmit={handleRecovery}>
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
