import { useOutletContext, Link } from 'react-router-dom'
import Hero from '../../components/site/Hero.jsx'
import ProjectCategories from '../../components/site/ProjectCategories.jsx'
import SectionHeading from '../../components/site/SectionHeading.jsx'
import ProjectCard from '../../components/site/ProjectCard.jsx'
import ContactForm from '../../components/site/ContactForm.jsx'
import Spinner from '../../components/ui/Spinner.jsx'

export default function Home() {
  const { site, services, projects, loading } = useOutletContext()

  if (loading) return <Spinner full />

  const featured = projects.filter((p) => p.featured).slice(0, 4)

  return (
    <>
      <Hero site={site} />
      <ProjectCategories />

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-10 lg:py-28">
        <SectionHeading
          index="01 — Proyectos"
          title="Trabajos destacados"
          subtitle="Una selección de identidades, editoriales y piezas de dirección de arte recientes."
        />
        {featured.length === 0 ? (
          <p className="text-brand-black/60">Todavía no hay proyectos publicados.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((project, index) => (
              <ProjectCard key={project.id} project={project} accent={index === 0} />
            ))}
          </div>
        )}
        <div className="mt-10">
          <Link to="/proyectos" className="btn-dark">
            Ver todos los proyectos
          </Link>
        </div>
      </section>

      <section id="sobre-mi" className="bg-brand-black text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:px-10 lg:py-28">
          <div className="relative">
            {site?.about?.image ? (
              <img
                src={site.about.image}
                alt={site.about.title || 'Sobre mí'}
                className="aspect-[4/5] w-full object-cover"
              />
            ) : (
              <div className="aspect-[4/5] w-full bg-white/10" />
            )}
            <span className="absolute -right-4 -bottom-4 h-24 w-24 bg-brand-yellow lg:-right-8 lg:-bottom-8" />
          </div>
          <div>
            <SectionHeading
              index="02 — Sobre mí"
              title={site?.about?.title || 'Sobre mí'}
              light
            />
            <p className="max-w-xl whitespace-pre-line leading-relaxed text-white/75">
              {site?.about?.text}
            </p>
          </div>
        </div>
      </section>

      <section id="servicios" className="mx-auto max-w-7xl px-5 py-20 lg:px-10 lg:py-28">
        <SectionHeading
          index="03 — Servicios"
          title="Qué hago"
          subtitle="Servicios de diseño integral, desde la estrategia de marca hasta la ejecución digital."
        />
        <div className="grid gap-px bg-brand-line sm:grid-cols-2">
          {services.map((service) => (
            <article key={service.id} className="bg-brand-bone p-8 lg:p-10">
              <span className="font-display text-sm font-semibold text-brand-gray">
                {String(service.sortOrder).padStart(2, '0')}
              </span>
              <h3 className="mt-4 font-display text-2xl font-bold">{service.title}</h3>
              {service.description && (
                <p className="mt-3 text-sm leading-relaxed text-brand-black/65">{service.description}</p>
              )}
            </article>
          ))}
        </div>
      </section>

      <section id="contacto" className="border-t border-brand-line bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-2 lg:px-10 lg:py-28">
          <div>
            <SectionHeading
              index="04 — Contacto"
              title="¿Hablamos?"
              subtitle="Cuéntame tu proyecto y te responderé con propuestas y tiempos."
            />
            <ul className="grid gap-3 text-sm text-brand-black/70">
              {site?.contact?.email && (
                <li>
                  <span className="label-xs mr-2">Email</span>
                  {site.contact.email}
                </li>
              )}
              {site?.contact?.phone && (
                <li>
                  <span className="label-xs mr-2">Tel</span>
                  {site.contact.phone}
                </li>
              )}
              {site?.contact?.location && (
                <li>
                  <span className="label-xs mr-2">Ubicación</span>
                  {site.contact.location}
                </li>
              )}
            </ul>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  )
}
