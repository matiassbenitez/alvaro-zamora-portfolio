import { useEffect, useState } from 'react'
import { api, apiErrorMessage } from '../../api/client.js'
import Spinner from '../../components/ui/Spinner.jsx'
import { formatDateTime } from '../../utils/format.js'

export default function Messages() {
  const [messages, setMessages] = useState([])
  const [unreadOnly, setUnreadOnly] = useState(false)
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  function load() {
    setLoading(true)
    api
      .get('/admin/messages', { params: { unreadOnly } })
      .then(({ data }) => setMessages(data))
      .catch((err) => alert(apiErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(load, [unreadOnly])

  async function toggleRead(message) {
    const { data } = await api.patch(`/admin/messages/${message.id}/read`, { read: !message.read })
    setMessages((prev) => prev.map((m) => (m.id === data.id ? data : m)))
    if (selected?.id === data.id) setSelected(data)
  }

  async function remove(id) {
    if (!confirm('¿Eliminar este mensaje?')) return
    await api.delete(`/admin/messages/${id}`)
    setMessages((prev) => prev.filter((m) => m.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  return (
    <div className="grid gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-xs">Bandeja</p>
          <h1 className="mt-2 font-display text-4xl font-bold">Mensajes</h1>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={unreadOnly} onChange={(e) => setUnreadOnly(e.target.checked)} />
          Solo sin leer
        </label>
      </header>

      {loading ? (
        <Spinner />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <ul className="divide-y divide-brand-line bg-white">
            {messages.map((message) => (
              <li key={message.id}>
                <button
                  type="button"
                  onClick={() => setSelected(message)}
                  className={`w-full px-5 py-4 text-left transition hover:bg-brand-bone ${
                    selected?.id === message.id ? 'bg-brand-bone' : ''
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold">
                      {message.name}
                      {!message.read && <span className="ml-2 inline-block h-2 w-2 rounded-full bg-brand-yellow" />}
                    </p>
                    <span className="text-xs text-brand-black/50">{formatDateTime(message.createdAt)}</span>
                  </div>
                  <p className="mt-1 text-sm text-brand-black/70">{message.subject || '(sin asunto)'}</p>
                  <p className="mt-1 line-clamp-1 text-sm text-brand-black/50">{message.body}</p>
                </button>
              </li>
            ))}
            {messages.length === 0 && <li className="p-5 text-sm text-brand-black/50">No hay mensajes.</li>}
          </ul>

          <div className="bg-white p-6">
            {selected ? (
              <div className="grid gap-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-display text-xl font-bold">{selected.subject || '(sin asunto)'}</h2>
                    <p className="mt-1 text-sm text-brand-black/60">
                      {selected.name} · {selected.email}
                    </p>
                    <p className="text-xs text-brand-black/40">{formatDateTime(selected.createdAt)}</p>
                  </div>
                </div>
                <p className="whitespace-pre-line text-sm leading-relaxed text-brand-black/80">{selected.body}</p>
                <div className="mt-2 flex gap-3">
                  <a href={`mailto:${selected.email}`} className="btn-primary text-xs">
                    Responder
                  </a>
                  <button type="button" onClick={() => toggleRead(selected)} className="btn-dark text-xs">
                    Marcar como {selected.read ? 'no leído' : 'leído'}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(selected.id)}
                    className="border border-red-300 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-red-600 transition hover:bg-red-50"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-brand-black/50">Seleccioná un mensaje para verlo.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
