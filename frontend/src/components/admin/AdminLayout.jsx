import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext.jsx'
import {
  LayoutDashboard,
  Mail,
  FolderKanban,
  Heart,
  FilePenLine,
  LogOut,
} from 'lucide-react'

const LINKS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/mensajes', label: 'Mensajes', icon: Mail },
  { to: '/admin/proyectos', label: 'Proyectos', icon: FolderKanban },
  { to: '/admin/likes', label: 'Likes', icon: Heart },
  { to: '/admin/contenido', label: 'Contenido', icon: FilePenLine },
]

export default function AdminLayout() {
  const { username, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#eceae4] md:flex-row">
      <aside className="flex shrink-0 flex-col bg-brand-black text-white md:w-64">
        <div className="flex items-center gap-3 border-b border-white/10 p-4 md:p-6">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-brand-yellow font-display text-sm font-bold text-brand-black">
            AZ
          </span>
          <div className="min-w-0 leading-tight">
            <p className="truncate font-display text-sm font-bold uppercase tracking-wide">Álvaro Zamora</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/50">Admin</p>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-2 py-2 md:flex-1 md:flex-col md:space-y-1 md:overflow-visible md:px-4 md:py-4">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-2 px-3 py-2 text-sm font-medium transition md:gap-3 md:px-4 md:py-3 ${
                  isActive ? 'bg-brand-yellow text-brand-black' : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <link.icon size={17} />
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center justify-between gap-3 border-t border-white/10 p-3 md:block md:p-4">
          <p className="hidden px-4 pb-3 text-xs text-white/50 md:block">Sesión: {username}</p>
          <button
            type="button"
            onClick={handleLogout}
            className="flex shrink-0 items-center gap-3 px-4 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white md:w-full md:py-3"
          >
            <LogOut size={17} /> <span className="md:hidden">Salir</span>
            <span className="hidden md:inline">Cerrar sesión</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-x-auto p-4 sm:p-6 lg:p-10">
        <Outlet />
      </main>
    </div>
  )
}
