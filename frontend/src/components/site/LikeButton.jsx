import { useState } from 'react'
import { Heart } from 'lucide-react'
import { api, apiErrorMessage } from '../../api/client.js'
import { getVisitorToken } from '../../utils/visitorToken.js'

export default function LikeButton({ projectId, likeCount, onChange, dark = false }) {
  const [count, setCount] = useState(likeCount || 0)
  const [busy, setBusy] = useState(false)
  const [voted, setVoted] = useState(() =>
    Boolean(localStorage.getItem(`liked_project_${projectId}`)),
  )

  async function handleClick(event) {
    event.preventDefault()
    event.stopPropagation()
    if (voted || busy) return
    setBusy(true)
    try {
      const { data } = await api.post(`/public/projects/${projectId}/like`, {
        visitorToken: getVisitorToken(),
      })
      setCount(data.likeCount)
      setVoted(true)
      localStorage.setItem(`liked_project_${projectId}`, '1')
      onChange?.(data.likeCount)
    } catch (error) {
      alert(apiErrorMessage(error, 'No se pudo registrar el like'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={voted || busy}
      aria-label={voted ? 'Ya diste like a este proyecto' : 'Dar like'}
      className={`inline-flex items-center gap-2 border px-4 py-2 text-sm font-medium transition ${
        dark
          ? 'border-white/30 text-white hover:border-brand-yellow hover:text-brand-yellow'
          : 'border-brand-line bg-white text-brand-black hover:border-brand-black'
      } ${voted ? 'cursor-default opacity-80' : 'cursor-pointer'} disabled:opacity-70`}
    >
      <Heart size={16} className={voted ? 'fill-brand-yellow text-brand-yellow' : ''} />
      {count}
    </button>
  )
}
