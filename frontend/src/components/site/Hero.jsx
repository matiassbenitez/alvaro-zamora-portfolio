import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Hero({ site }) {
  return (
    <section className="relative overflow-hidden bg-brand-bone">
      <div className="mx-auto grid max-w-7xl gap-0 px-5 lg:grid-cols-2 lg:px-0">
        <div className="flex flex-col justify-center py-16 pl-5 pr-5 lg:py-28 lg:pl-10 lg:pr-16">
          <span className="mb-8 block h-1.5 w-16 bg-brand-yellow" />
          <h1 className="font-display text-6xl font-bold leading-[0.95] tracking-tight text-brand-black sm:text-7xl lg:text-8xl">
            {(site?.hero?.title || 'Ideas que\nse ven.').split('\n').map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-8 max-w-md whitespace-pre-line text-lg leading-relaxed text-brand-black/70">
            {site?.hero?.subtitle || 'Diseño gráfico y comunicación visual para marcas que quieren destacar.'}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/proyectos" className="btn-primary">
              Ver proyectos <ArrowRight size={16} />
            </Link>
            <a href="#contacto" className="btn-dark">
              Trabajemos juntos
            </a>
          </div>
        </div>

        <div className="relative min-h-[420px] lg:min-h-[640px]">
          <div
            className="absolute inset-0 bg-brand-yellow"
            style={{ clipPath: 'polygon(18% 0, 100% 0, 100% 100%, 0% 100%)' }}
          />
          <div className="absolute top-1/2 left-[8%] h-40 w-40 -translate-y-1/2 rounded-full bg-brand-orange" />
          <img
            src={site?.hero?.image || '/placeholder-hero.jpg'}
            alt="Retrato editorial en blanco y negro"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ clipPath: 'polygon(28% 0, 100% 0, 100% 100%, 10% 100%)' }}
          />
        </div>
      </div>
    </section>
  )
}
