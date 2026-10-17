import { useMemo } from 'react'
import { useOutletContext, useSearchParams } from 'react-router-dom'
import SectionHeading from '../../components/site/SectionHeading.jsx'
import ProjectCard from '../../components/site/ProjectCard.jsx'
import Spinner from '../../components/ui/Spinner.jsx'

export default function Projects() {
  const { projects, loading } = useOutletContext()
  const [searchParams, setSearchParams] = useSearchParams()

  const categories = useMemo(() => {
    const set = new Set(projects.map((p) => p.category))
    return ['Todas', ...Array.from(set)]
  }, [projects])

  const param = searchParams.get('categoria')
  const category = !loading && param && categories.includes(param) ? param : 'Todas'

  const filtered = useMemo(
    () => (category === 'Todas' ? projects : projects.filter((p) => p.category === category)),
    [projects, category],
  )

  function selectCategory(cat) {
    setSearchParams(cat === 'Todas' ? {} : { categoria: cat })
  }

  if (loading) return <Spinner full />

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 lg:px-10 lg:py-24">
      <SectionHeading
        index="Archivo"
        title="Proyectos"
        subtitle="Todos los trabajos publicados, ordenados por relevancia."
      />

      <div className="mb-10 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => selectCategory(cat)}
            className={`border px-4 py-2 font-display text-xs font-semibold uppercase tracking-[0.18em] transition ${
              category === cat
                ? 'border-brand-black bg-brand-black text-white'
                : 'border-brand-line bg-white text-brand-black hover:border-brand-black'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-brand-black/60">No hay proyectos en esta categoría.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </section>
  )
}
