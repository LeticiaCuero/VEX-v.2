import Button from '../../components/Button'
import './landing.css'

export default function Landing() {
  return (
    <header className="landing-header">
      <div className="box-header">
        <a className="logo" href="#home">
          <img src="/logo.png" alt="VEX" className="logo-img" />
        </a>
        <div className="navegation">
          <nav aria-label="Navegação principal">
            <ul>
              <li><a href="#problem">Problema</a></li>
              <li><a href="#solution">Solução</a></li>
              <li><a href="#demo">MVP</a></li>
              <li><a href="#team">Equipe</a></li>
            </ul>
          </nav>
        </div>
        <div className="user-acess">
          <Button href="/login">Acessar<img src="/src/assets/icons/arrow.svg" alt="" /></Button>
        </div>
      </div>
    </header>
  )
}
