import { useEffect, useState } from 'react'
import { api, apiErrorMessage } from '../../api/client.js'
import Spinner from '../../components/ui/Spinner.jsx'

const TABS = ['Marca', 'Hero', 'Sobre mí', 'Contacto', 'Servicios']

export default function ContentEditor() {
  const [tab, setTab] = useState('Marca')
  const [content, setContent] = useState(null)
  const [services, setServices] = useState([])
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    api.get('/admin/content').then(({ data }) => setContent(data))
    api.get('/admin/services').then(({ data }) => setServices(data))
  }, [])

  if (!content) return <Spinner full />

  function update(path, value) {
    setContent((prev) => {
      const next = structuredClone(prev)
      const keys = path.split('.')
      let ref = next
      for (let i = 0; i < keys.length - 1; i++) ref = ref[keys[i]]
      ref[keys[keys.length - 1]] = value
      return next
    })
  }

  async function upload(path, file) {
    const data = new FormData()
    data.append('file', file)
    const res = await api.post('/admin/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } })
    update(path, res.data.url)
  }

  async function save() {
    setSaving(true)
    setMessage('')
    try {
      const payload = {
        brandName: content.brandName,
        brandTagline: content.brandTagline,
        logoText: content.logoText,
        hero: { title: content.hero.title, subtitle: content.hero.subtitle, image: content.hero.image },
        about: { title: content.about.title, text: content.about.text, image: content.about.image },
        contact: { email: content.contact.email, phone: content.contact.phone, location: content.contact.location },
        footerText: content.footerText,
        socials: content.socials.map((s) => ({ id: s.id, label: s.label, url: s.url })),
      }
      const { data } = await api.put('/admin/content', payload)
      setContent(data)
      setMessage('Contenido guardado ✔')
    } catch (err) {
      setMessage(apiErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  async function saveService(service) {
    if (service.id) {
      const { data } = await api.put(`/admin/services/${service.id}`, service)
      setServices((prev) => prev.map((s) => (s.id === data.id ? data : s)))
    } else {
      const { data } = await api.post('/admin/services', service)
      setServices((prev) => [...prev, data])
    }
  }

  async function removeService(id) {
    if (!confirm('¿Eliminar servicio?')) return
    await api.delete(`/admin/services/${id}`)
    setServices((prev) => prev.filter((s) => s.id !== id))
  }

  function updateService(id, field, value) {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
  }

  return (
    <div className="grid gap-6">
      <header>
        <p className="label-xs">Editor</p>
        <h1 className="mt-2 font-display text-4xl font-bold">Contenido del sitio</h1>
      </header>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`border px-4 py-2 font-display text-xs font-semibold uppercase tracking-wider transition ${
              tab === t ? 'border-brand-black bg-brand-black text-white' : 'border-brand-line bg-white hover:border-brand-black'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid gap-4 bg-white p-6">
        {tab === 'Marca' && (
          <>
            <label className="grid gap-2">
              <span className="label-xs">Nombre de marca</span>
              <input className="input-base" value={content.brandName} maxLength={120} onChange={(e) => update('brandName', e.target.value)} />
            </label>
            <label className="grid gap-2">
              <span className="label-xs">Tagline</span>
              <input className="input-base" value={content.brandTagline} maxLength={160} onChange={(e) => update('brandTagline', e.target.value)} />
            </label>
            <label className="grid gap-2">
              <span className="label-xs">Monograma (logo)</span>
              <input className="input-base" value={content.logoText} onChange={(e) => update('logoText', e.target.value)} maxLength={4} />
            </label>
            <label className="grid gap-2">
              <span className="label-xs">Texto del footer</span>
              <input className="input-base" value={content.footerText || ''} maxLength={300} onChange={(e) => update('footerText', e.target.value)} />
            </label>
            <div>
              <span className="label-xs">Redes sociales</span>
              <div className="mt-3 grid gap-3">
                {content.socials.map((social, index) => (
                  <div key={index} className="grid gap-2 sm:grid-cols-[1fr_2fr_auto]">
                    <input
                      className="input-base"
                      placeholder="Label"
                      maxLength={60}
                      value={social.label}
                      onChange={(e) => update(`socials.${index}.label`, e.target.value)}
                    />
                    <input
                      className="input-base"
                      placeholder="https://..."
                      maxLength={300}
                      value={social.url}
                      onChange={(e) => update(`socials.${index}.url`, e.target.value)}
                    />
                    <button
                      type="button"
                      className="px-3 text-red-600"
                      onClick={() => update('socials', content.socials.filter((_, i) => i !== index))}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn-dark w-fit text-xs"
                  onClick={() => update('socials', [...content.socials, { label: '', url: '' }])}
                >
                  + Agregar red
                </button>
              </div>
            </div>
          </>
        )}

        {tab === 'Hero' && (
          <>
            <label className="grid gap-2">
              <span className="label-xs">Título (usar \n para salto de línea)</span>
              <input className="input-base" value={content.hero.title} maxLength={160} onChange={(e) => update('hero.title', e.target.value)} />
            </label>
            <label className="grid gap-2">
              <span className="label-xs">Subtítulo</span>
              <textarea className="input-base" value={content.hero.subtitle} maxLength={300} onChange={(e) => update('hero.subtitle', e.target.value)} />
            </label>
            <label className="grid gap-2">
              <span className="label-xs">Imagen del hero</span>
              <input type="file" accept="image/*" className="input-base" onChange={(e) => e.target.files?.[0] && upload('hero.image', e.target.files[0])} />
              {content.hero.image && <img src={content.hero.image} alt="Hero" className="h-40 w-auto object-cover" />}
            </label>
          </>
        )}

        {tab === 'Sobre mí' && (
          <>
            <label className="grid gap-2">
              <span className="label-xs">Título</span>
              <input className="input-base" value={content.about.title || ''} maxLength={160} onChange={(e) => update('about.title', e.target.value)} />
            </label>
            <label className="grid gap-2">
              <span className="label-xs">Biografía</span>
              <textarea className="input-base min-h-36" value={content.about.text || ''} onChange={(e) => update('about.text', e.target.value)} />
            </label>
            <label className="grid gap-2">
              <span className="label-xs">Foto</span>
              <input type="file" accept="image/*" className="input-base" onChange={(e) => e.target.files?.[0] && upload('about.image', e.target.files[0])} />
              {content.about.image && <img src={content.about.image} alt="Sobre mí" className="h-40 w-auto object-cover" />}
            </label>
          </>
        )}

        {tab === 'Contacto' && (
          <>
            <label className="grid gap-2">
              <span className="label-xs">Email</span>
              <input className="input-base" value={content.contact.email || ''} maxLength={160} onChange={(e) => update('contact.email', e.target.value)} />
            </label>
            <label className="grid gap-2">
              <span className="label-xs">Teléfono</span>
              <input className="input-base" value={content.contact.phone || ''} maxLength={60} onChange={(e) => update('contact.phone', e.target.value)} />
            </label>
            <label className="grid gap-2">
              <span className="label-xs">Ubicación</span>
              <input className="input-base" value={content.contact.location || ''} maxLength={160} onChange={(e) => update('contact.location', e.target.value)} />
            </label>
          </>
        )}

        {tab === 'Servicios' && (
          <div className="grid gap-4">
            {services.map((service) => (
              <div key={service.id} className="grid gap-2 border border-brand-line p-4 sm:grid-cols-[1fr_2fr_auto]">
                <input className="input-base" value={service.title} maxLength={120} onChange={(e) => updateService(service.id, 'title', e.target.value)} />
                <input className="input-base" value={service.description || ''} maxLength={500} onChange={(e) => updateService(service.id, 'description', e.target.value)} />
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1 text-xs">
                    <input type="checkbox" checked={service.active} onChange={(e) => updateService(service.id, 'active', e.target.checked)} />
                    Activo
                  </label>
                  <button type="button" className="btn-dark px-3 py-2 text-xs" onClick={() => saveService(service)}>
                    Guardar
                  </button>
                  <button type="button" className="text-red-600" onClick={() => removeService(service.id)}>
                    ✕
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="btn-primary w-fit text-xs"
              onClick={() => setServices((prev) => [...prev, { title: '', description: '', icon: '', sortOrder: prev.length + 1, active: true }])}
            >
              + Nuevo servicio
            </button>
          </div>
        )}

        {tab !== 'Servicios' && (
          <div className="flex items-center gap-4">
            <button type="button" className="btn-primary" onClick={save} disabled={saving}>
              {saving ? 'Guardando…' : 'Guardar cambios'}
            </button>
            {message && <span className="text-sm text-brand-black/70">{message}</span>}
          </div>
        )}
      </div>
    </div>
  )
}
