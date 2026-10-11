import { useEffect, useState } from 'react'
import { api, apiErrorMessage } from '../../api/client.js'
import Spinner from '../../components/ui/Spinner.jsx'

export default function Likes() {
  const [panel, setPanel] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/admin/likes')
      .then(({ data }) => setPanel(data))
      .catch((err) => alert(apiErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner full />
  const max = Math.max(1, ...(panel?.items || []).map((i) => i.likeCount))

  return (
    <div className="grid gap-6">
      <header>
        <p className="label-xs">Estadísticas</p>
        <h1 className="mt-2 font-display text-4xl font-bold">Likes</h1>
        <p className="mt-2 text-sm text-brand-black/60">Total acumulado: {panel?.totalLikes ?? 0}</p>
      </header>

      <ul className="grid gap-3 bg-white p-6">
        {(panel?.items || []).map((item, index) => (
          <li key={item.projectId} className="grid gap-2">
            <div className="flex items-center gap-4">
              <span className="font-display text-sm font-bold text-brand-gray">{String(index + 1).padStart(2, '0')}</span>
              {item.coverImage ? (
                <img src={item.coverImage} alt="" className="h-12 w-12 object-cover" />
              ) : (
                <span className="h-12 w-12 bg-brand-line" />
              )}
              <div className="flex-1">
                <p className="text-sm font-semibold">{item.title}</p>
                <div className="mt-1 h-2 w-full bg-brand-line">
                  <div className="h-full bg-brand-yellow" style={{ width: `${Math.round((item.likeCount / max) * 100)}%` }} />
                </div>
              </div>
              <span className="font-display text-lg font-bold">{item.likeCount}</span>
            </div>
          </li>
        ))}
        {(panel?.items || []).length === 0 && <li className="text-sm text-brand-black/50">Todavía no hay likes.</li>}
      </ul>
    </div>
  )
}
