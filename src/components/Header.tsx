import { useEffect, useId, useRef, useState } from 'react'
import './Header.css'

export default function Header({ title }: { title: string }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [darkTheme, setDarkTheme] = useState(() => document.documentElement.dataset.theme === 'dark')
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuId = useId()

  function toggleTheme() {
    const nextTheme = darkTheme ? 'light' : 'dark'
    document.documentElement.dataset.theme = nextTheme
    setDarkTheme(!darkTheme)
    try {
      localStorage.setItem('theme', nextTheme)
    } catch {
      // O tema continua funcionando quando o armazenamento não está disponível.
    }
  }

  useEffect(() => {
    if (!menuOpen) return
    const closeOutside = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', closeOutside)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOutside)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [menuOpen])

  return (
    <header className="app-header">
      <div className="app-header-box">
        <a className="app-logo" href="/home">
          <img src="/logo.png" alt="VEX" />
        </a>
        <p className="app-header-title">{title}</p>
        <div className="header-menu" ref={menuRef}>
        <button className="theme-toggle" type="button" aria-label={darkTheme ? 'Ativar tema claro' : 'Ativar tema escuro'} onClick={toggleTheme}>
          {darkTheme
            ? <img className="theme-icon" src="/src/assets/icons/sun.svg" alt="" />
            : <img className="theme-icon" src="/src/assets/icons/moon.svg" alt="" />}
        </button>
        <button ref={buttonRef} className="hamburger" type="button" aria-label="Menu" aria-expanded={menuOpen} aria-controls={menuId} onClick={() => setMenuOpen(!menuOpen)}>
          <span />
          <span />
          <span />
        </button>
        {menuOpen && <button className="menu-overlay" type="button" aria-label="Fechar menu" onClick={() => setMenuOpen(false)} />}
        <aside id={menuId} className="header-menu-nav" aria-label="Menu lateral" hidden={!menuOpen}>
          <nav aria-label="Navegação do sistema">
          <ul>
            <li><a href="/register">Cadastro</a></li>
            <li><a href="/historico">Histórico</a></li>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/tarifa">Tarifa</a></li>
            <li className="header-menu-exit"><a href="/login">Sair</a></li>
          </ul>
          </nav>
        </aside>
        </div>
      </div>
    </header>
  )
}
