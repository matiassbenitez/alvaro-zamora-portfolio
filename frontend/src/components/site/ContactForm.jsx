import { useState } from 'react'
import { api, apiErrorMessage } from '../../api/client.js'

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', body: '' })
  const [status, setStatus] = useState({ state: 'idle', message: '' })
  const [sending, setSending] = useState(false)

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSending(true)
    setStatus({ state: 'idle', message: '' })
    try {
      await api.post('/public/messages', form)
      setStatus({ state: 'success', message: '¡Mensaje enviado! Te responderé lo antes posible.' })
      setForm({ name: '', email: '', subject: '', body: '' })
    } catch (error) {
      setStatus({ state: 'error', message: apiErrorMessage(error, 'No se pudo enviar el mensaje') })
    } finally {
      setSending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="label-xs">Nombre</span>
          <input
            className="input-base"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            required
            maxLength={120}
            placeholder="Tu nombre"
          />
        </label>
        <label className="grid gap-2">
          <span className="label-xs">Email</span>
          <input
            type="email"
            className="input-base"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            required
            maxLength={160}
            placeholder="tu@email.com"
          />
        </label>
      </div>
      <label className="grid gap-2">
        <span className="label-xs">Asunto</span>
        <input
          className="input-base"
          value={form.subject}
          onChange={(e) => update('subject', e.target.value)}
          maxLength={160}
          placeholder="¿En qué puedo ayudarte?"
        />
      </label>
      <label className="grid gap-2">
        <span className="label-xs">Mensaje</span>
        <textarea
          className="input-base min-h-36 resize-y"
          value={form.body}
          onChange={(e) => update('body', e.target.value)}
          required
          maxLength={5000}
          placeholder="Cuéntame sobre tu proyecto..."
        />
      </label>
      {status.message && (
        <p
          className={`text-sm ${
            status.state === 'success' ? 'text-green-700' : 'text-red-600'
          }`}
        >
          {status.message}
        </p>
      )}
      <button type="submit" className="btn-primary w-fit" disabled={sending}>
        {sending ? 'Enviando…' : 'Enviar mensaje'}
      </button>
    </form>
  )
}
