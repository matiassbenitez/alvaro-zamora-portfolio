import { Link } from 'react-router-dom'

export default function Header({ brandName, brandTagline, logoText }) {
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
      </div>
    </header>
  )
}
