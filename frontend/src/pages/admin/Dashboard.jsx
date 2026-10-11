import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, apiErrorMessage } from '../../api/client.js'
import StatCard from '../../components/admin/StatCard.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import { formatDate } from '../../utils/format.js'

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/admin/dashboard/summary')
      .then(({ data }) => setSummary(data))
      .catch((err) => setError(apiErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner full />
  if (error) return <p className="text-red-600">{error}</p>
  if (!summary) return null

  const maxLikes = Math.max(1, ...summary.topLikes.map((i) => i.likeCount))

  return (
    <div className="grid gap-8">
      <header>
        <p className="label-xs">Resumen</p>
        <h1 className="mt-2 font-display text-4xl font-bold">Dashboard</h1>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Proyectos" value={summary.totalProjects} hint={`${summary.publishedProjects} publicados`} accent />
        <StatCard label="Destacados" value={summary.featuredProjects} hint="En la portada" />
        <StatCard label="Likes totales" value={summary.totalLikes} hint="En todos los proyectos" />
        <StatCard
          label="Mensajes"
          value={summary.totalMessages}
          hint={`${summary.unreadMessages} sin leer`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="bg-white p-6">
          <h2 className="font-display text-lg font-bold">Likes por proyecto</h2>
          <ul className="mt-5 grid gap-4">
            {summary.topLikes.map((item) => (
              <li key={item.projectId} className="grid gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.title}</span>
                  <span className="text-brand-black/60">{item.likeCount}</span>
                </div>
                <div className="h-2 w-full bg-brand-line">
                  <div
                    className="h-full bg-brand-yellow"
                    style={{ width: `${Math.round((item.likeCount / maxLikes) * 100)}%` }}
                  />
                </div>
              </li>
            ))}
            {summary.topLikes.length === 0 && (
              <li className="text-sm text-brand-black/50">Todavía no hay likes.</li>
            )}
          </ul>
        </section>

        <section className="bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Últimos mensajes</h2>
            <Link to="/admin/mensajes" className="text-xs font-semibold uppercase tracking-wider underline">
              Ver todos
            </Link>
          </div>
          <ul className="mt-5 divide-y divide-brand-line">
            {summary.recentMessages.map((message) => (
              <li key={message.id} className="py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">
                    {message.name}
                    {!message.read && <span className="ml-2 inline-block h-2 w-2 rounded-full bg-brand-yellow" />}
                  </p>
                  <span className="text-xs text-brand-black/50">{formatDate(message.createdAt)}</span>
                </div>
                <p className="mt-1 line-clamp-1 text-sm text-brand-black/60">{message.body}</p>
              </li>
            ))}
            {summary.recentMessages.length === 0 && (
              <li className="py-3 text-sm text-brand-black/50">No hay mensajes todavía.</li>
            )}
          </ul>
        </section>
      </div>
    </div>
  )
}
