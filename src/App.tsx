import Landing from './pages/Landing/landing'
import Login from './pages/Login/login'
import Home from './pages/Home/home'
import Register from './pages/Register/register'
import History from './pages/History/history'
import Dashboard from './pages/Dashboard/dashboard'
import Tariff from './pages/Tariff/tariff'

export default function App() {
  if (window.location.pathname === '/login') return <Login />
  if (window.location.pathname === '/home') return <Home />
  if (window.location.pathname === '/register') return <Register />
  if (window.location.pathname === '/historico') return <History />
  if (window.location.pathname === '/dashboard') return <Dashboard />
  if (window.location.pathname === '/tarifa') return <Tariff />
  return <Landing />
}
