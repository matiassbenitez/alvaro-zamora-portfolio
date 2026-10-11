import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const CARDS = [
  { num: '01', label: 'Proyectos', to: '/proyectos', variant: 'yellow' },
  { num: '02', label: 'Sobre mí', to: '#sobre-mi', variant: 'bone' },
  { num: '03', label: 'Servicios', to: '#servicios', variant: 'dark' },
  { num: '04', label: 'Contacto', to: '#contacto', variant: 'bone' },
]

const VARIANTS = {
  yellow: 'bg-brand-yellow text-brand-black',
  dark: 'bg-brand-black text-white',
  bone: 'bg-brand-bone text-brand-black',
}

export default function QuickCards() {
  return (
    <section className="border-t border-brand-line">
      <div className="mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4">
        {CARDS.map((card, index) => (
          <Link
            key={card.num}
            to={card.to}
            className={`group relative flex min-h-[220px] flex-col justify-between p-7 transition lg:min-h-[280px] lg:p-10 ${
              VARIANTS[card.variant]
            } ${index < CARDS.length - 1 ? 'border-r border-brand-line/60' : ''}`}
          >
            <div>
              <span className="font-display text-sm font-semibold">{card.num}</span>
              <span className="mt-4 block h-px w-6 bg-current opacity-60" />
              <span className="mt-5 block font-display text-2xl font-bold lg:text-3xl">{card.label}</span>
            </div>
            <ArrowRight
              size={22}
              className="transition-transform duration-300 group-hover:translate-x-2"
            />
          </Link>
        ))}
      </div>
    </section>
  )
}
