import Landing from '../pages/Landing/landing'
import Login from '../pages/Login/login'
import Home from '../pages/Home/home'
import Register from '../pages/Register/register'
import History from '../pages/History/history'
import Dashboard from '../pages/Dashboard/dashboard'
import Tariff from '../pages/Tariff/tariff'
import RequireAuth from './RequireAuth'

export default function AppRoutes() {
  if (window.location.pathname === '/login') return <Login />
  if (window.location.pathname === '/home') return <RequireAuth><Home /></RequireAuth>
  if (window.location.pathname === '/register') return <RequireAuth><Register /></RequireAuth>
  if (window.location.pathname === '/historico') return <RequireAuth><History /></RequireAuth>
  if (window.location.pathname === '/dashboard') return <RequireAuth><Dashboard /></RequireAuth>
  if (window.location.pathname === '/tarifa') return <RequireAuth><Tariff /></RequireAuth>
  return <Landing />
}
