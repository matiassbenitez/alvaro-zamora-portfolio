import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { api } from '../../api/client.js'
import LikeButton from '../../components/site/LikeButton.jsx'
import Spinner from '../../components/ui/Spinner.jsx'

export default function ProjectDetail() {
  const { slug } = useParams()
  const [project, setProject] = useState(null)
  const [error, setError] = useState('')
  const [activeImage, setActiveImage] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    api
      .get(`/public/projects/${slug}`)
      .then(({ data }) => {
        if (cancelled) return
        setProject(data)
        setActiveImage(data.coverImage || data.images?.[0]?.url || null)
      })
      .catch(() => {
        if (!cancelled) setError('Proyecto no encontrado')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [slug])

  if (loading) return <Spinner full />
  if (error || !project) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <p className="font-display text-3xl font-bold">{error || 'Proyecto no encontrado'}</p>
        <Link to="/proyectos" className="btn-primary mt-8 inline-flex">
          Volver a proyectos
        </Link>
      </div>
    )
  }

  const gallery = [project.coverImage, ...(project.images || []).map((i) => i.url)].filter(
    (url, index, arr) => url && arr.indexOf(url) === index,
  )

  return (
    <article className="mx-auto max-w-7xl px-5 py-12 lg:px-10 lg:py-16">
      <Link
        to="/proyectos"
        className="inline-flex items-center gap-2 font-display text-xs font-semibold uppercase tracking-[0.2em] text-brand-black/70 transition hover:text-brand-black"
      >
        <ArrowLeft size={16} /> Volver
      </Link>

      <header className="mt-8 flex flex-col gap-6 border-b border-brand-line pb-10 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="label-xs">{project.category}</span>
          <h1 className="mt-3 font-display text-5xl font-bold leading-none tracking-tight lg:text-6xl">
            {project.title}
          </h1>
          <p className="mt-4 text-brand-black/60">{project.year}</p>
        </div>
        <LikeButton projectId={project.id} likeCount={project.likeCount} />
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div>
          {activeImage && (
            <img src={activeImage} alt={project.title} className="aspect-[4/3] w-full bg-brand-black object-cover" />
          )}
          {gallery.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {gallery.map((url) => (
                <button
                  key={url}
                  type="button"
                  onClick={() => setActiveImage(url)}
                  className={`aspect-square overflow-hidden border-2 transition ${
                    activeImage === url ? 'border-brand-yellow' : 'border-transparent'
                  }`}
                >
                  <img src={url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          {project.description && (
            <p className="whitespace-pre-line leading-relaxed text-brand-black/75">{project.description}</p>
          )}
          <dl className="mt-8 grid gap-4 border-t border-brand-line pt-8 text-sm">
            <div className="flex justify-between">
              <dt className="label-xs">Categoría</dt>
              <dd>{project.category}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="label-xs">Año</dt>
              <dd>{project.year || '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="label-xs">Likes</dt>
              <dd>{project.likeCount}</dd>
            </div>
          </dl>
        </div>
      </div>
    </article>
  )
}
