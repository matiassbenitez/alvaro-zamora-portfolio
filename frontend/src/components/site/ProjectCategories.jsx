import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AudiovisualIcon,
  BrandingIcon,
  EditorialIcon,
  InfografiaIcon,
  RedesIcon,
} from './CategoryIcons.jsx'

const OPTIONS = [
  { label: 'Sobre mí', href: '#sobre-mi', hoverLight: true },
  { label: 'Servicios', href: '#servicios', hoverLight: true },
  { label: 'Contacto', href: '#contacto' },
]

const CATEGORIES = [
  { num: '01', label: 'Branding', Icon: BrandingIcon, delay: '0s' },
  { num: '02', label: 'Editorial', Icon: EditorialIcon, delay: '0.5s' },
  { num: '03', label: 'Infografía', Icon: InfografiaIcon, delay: '1s' },
  { num: '04', label: 'Audiovisual', Icon: AudiovisualIcon, delay: '1.5s' },
  { num: '05', label: 'Redes Sociales', Icon: RedesIcon, delay: '2s' },
]

export default function ProjectCategories() {
  const [hovering, setHovering] = useState(false)

  return (
    <section id="proyectos" className="border-t border-brand-line">
      <div
        className="mx-auto grid max-w-7xl lg:grid-cols-[minmax(0,25%)_1fr]"
        onMouseLeave={() => setHovering(false)}
      >
        <Link
          to="/proyectos"
          onMouseEnter={() => setHovering(true)}
          className="opt-card flex flex-col justify-center bg-brand-yellow px-8 py-12 lg:px-10 lg:py-16"
        >
          <div className="relative">
            <span className="opt-dash mb-5 block h-0.5 w-6 bg-current origin-left" />
            <h2 className="font-display text-2xl font-bold tracking-tight lg:text-3xl">Proyectos</h2>
            <p
              className={`pointer-events-none absolute left-0 top-full mt-4 max-w-[16rem] text-sm leading-relaxed text-brand-black/70 transition-opacity duration-500 ease-out ${
                hovering ? 'opacity-100' : 'opacity-0'
              }`}
            >
              Ideas, conceptos y piezas que comunican, conectan y generan valor.
            </p>
          </div>
        </Link>

        <div className="relative">
          <div className="grid grid-cols-1 divide-y divide-brand-line/70 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
            {OPTIONS.map(({ label, href, hoverLight }) => (
              <a
                key={label}
                href={href}
                className={`opt-card flex min-h-[300px] flex-col justify-center bg-brand-bone p-6 text-brand-black transition-colors duration-300 ease-out lg:min-h-[380px] lg:p-7 ${
                  hoverLight
                    ? 'hover:bg-white hover:text-brand-black'
                    : 'hover:bg-brand-black hover:text-white'
                }`}
              >
                <span className="opt-dash block h-0.5 w-6 bg-current origin-left" />
                <h3 className="mt-5 font-display text-2xl font-bold lg:text-3xl">{label}</h3>
              </a>
            ))}
          </div>

          <div
            onMouseEnter={() => setHovering(true)}
            className={`cat-deploy-layer grid grid-cols-1 divide-y divide-brand-line/70 lg:grid-cols-5 lg:divide-x lg:divide-y-0 ${
              hovering ? 'lg:absolute lg:inset-0 lg:z-10' : 'lg:hidden'
            }`}
          >
            {CATEGORIES.map(({ num, label, Icon, delay }) => (
              <Link
                key={label}
                to={`/proyectos?categoria=${encodeURIComponent(label)}`}
                style={{ '--cat-delay': delay }}
                className="group flex min-h-[300px] flex-col bg-brand-bone p-6 text-brand-black transition-colors duration-300 ease-out hover:bg-brand-black hover:text-white lg:min-h-[380px] lg:p-7"
              >
                <span className="font-display text-xs font-semibold">{num}</span>
                <span className="mt-3 block h-px w-5 bg-current opacity-70" />
                <div className="my-8 flex flex-1 items-center">
                  <div className="h-20 w-20 lg:h-24 lg:w-24">
                    <Icon />
                  </div>
                </div>
                <h3 className="font-display text-lg font-bold lg:text-xl">{label}</h3>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
