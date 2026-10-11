import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

export default function Footer({ site }) {
  return (
    <footer className="bg-brand-black text-white">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-10">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-display text-2xl font-bold uppercase tracking-wide">
              {site?.brandName || 'Álvaro Zamora'}
            </p>
            <p className="mt-2 text-sm uppercase tracking-[0.3em] text-white/60">
              {site?.brandTagline || 'Diseño + Comunicación'}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {(site?.socials || []).map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 text-sm text-white/80 transition hover:text-brand-yellow"
              >
                {social.label}
                <ArrowUpRight size={14} />
              </a>
            ))}
          </div>
          <div className="flex flex-col gap-3 text-sm text-white/80">
            {site?.contactEmail && (
              <a href={`mailto:${site.contactEmail}`} className="transition hover:text-brand-yellow">
                {site.contactEmail}
              </a>
            )}
            {site?.contactPhone && <span>{site.contactPhone}</span>}
            {site?.contactLocation && <span>{site.contactLocation}</span>}
            <Link to="/admin/login" className="mt-2 text-xs uppercase tracking-[0.25em] text-white/40 transition hover:text-brand-yellow">
              Admin
            </Link>
          </div>
        </div>
        <p className="mt-12 border-t border-white/10 pt-6 text-xs text-white/40">
          {site?.footerText || '© Álvaro Zamora — Diseño + Comunicación'}
        </p>
      </div>
    </footer>
  )
}
