import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const NAV = [
  { label: 'Proyectos', to: '/proyectos' },
  { label: 'Sobre mí', to: '/#sobre-mi' },
  { label: 'Servicios', to: '/#servicios' },
  { label: 'Contacto', to: '/#contacto' },
]

export default function Header({ brandName, brandTagline, logoText }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  function handleNavClick(event, to) {
    if (to.startsWith('/#')) {
      if (location.pathname !== '/') {
        return // deja que el Link navegue a la home con hash
      }
      event.preventDefault()
      const id = to.replace('/#', '')
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-brand-line/70 bg-brand-bone/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-10">
        <Link to="/" className="flex items-center gap-4">
          <span className="flex h-11 w-11 items-center justify-center bg-brand-black font-display text-lg font-bold text-brand-yellow">
            {logoText || 'AZ'}
          </span>
          <span className="leading-tight">
            <span className="block font-display text-lg font-bold uppercase tracking-wide">{brandName}</span>
            <span className="block text-[11px] font-medium uppercase tracking-[0.3em] text-brand-gray">
              {brandTagline}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) =>
            item.to.startsWith('/#') ? (
              <a
                key={item.label}
                href={item.to}
                onClick={(e) => handleNavClick(e, item.to)}
                className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-brand-black/80 transition hover:text-brand-black"
              >
                {item.label}
              </a>
            ) : (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  `font-display text-xs font-semibold uppercase tracking-[0.2em] transition ${
                    isActive ? 'text-brand-black' : 'text-brand-black/80 hover:text-brand-black'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ),
          )}
        </nav>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center border border-brand-line md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menú"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-brand-line bg-brand-bone px-5 py-4 md:hidden">
          {NAV.map((item) =>
            item.to.startsWith('/#') ? (
              <a
                key={item.label}
                href={item.to}
                onClick={(e) => handleNavClick(e, item.to)}
                className="block border-b border-brand-line/70 py-3 font-display text-sm font-semibold uppercase tracking-[0.2em]"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setOpen(false)}
                className="block border-b border-brand-line/70 py-3 font-display text-sm font-semibold uppercase tracking-[0.2em]"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>
      )}
    </header>
  )
}
