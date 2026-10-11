import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { api, apiErrorMessage } from '../../api/client.js'

const EMPTY = {
  title: '',
  slug: '',
  category: '',
  year: new Date().getFullYear(),
  description: '',
  coverImage: '',
  featured: false,
  published: true,
  sortOrder: 0,
}

export default function ProjectForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY)
  const [images, setImages] = useState([])
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    api.get(`/admin/projects/${id}`).then(({ data }) => {
      setForm({
        title: data.title,
        slug: data.slug,
        category: data.category,
        year: data.year || '',
        description: data.description || '',
        coverImage: data.coverImage || '',
        featured: data.featured,
        published: data.published,
        sortOrder: data.sortOrder,
      })
      setImages(data.images || [])
    })
  }, [id])

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function uploadFile(file, onSuccess) {
    setUploading(true)
    setError('')
    try {
      const data = new FormData()
      data.append('file', file)
      const res = await api.post('/admin/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      onSuccess(res.data.url)
    } catch (err) {
      setError(apiErrorMessage(err, 'No se pudo subir la imagen'))
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = { ...form, year: form.year === '' ? null : Number(form.year), sortOrder: Number(form.sortOrder) }
      if (id) {
        await api.put(`/admin/projects/${id}`, payload)
      } else {
        await api.post('/admin/projects', payload)
      }
      navigate('/admin/proyectos')
    } catch (err) {
      setError(apiErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  async function addGalleryImage(event) {
    const file = event.target.files?.[0]
    if (!file || !id) return
    await uploadFile(file, async (url) => {
      const { data } = await api.post(`/admin/projects/${id}/images`, { imageUrl: url })
      setImages(data.images)
    })
    event.target.value = ''
  }

  async function removeImage(imageId) {
    const { data } = await api.delete(`/admin/projects/${id}/images/${imageId}`)
    setImages(data.images)
  }

  return (
    <div className="max-w-3xl">
      <p className="label-xs">
        <Link to="/admin/proyectos" className="underline">
          Proyectos
        </Link>{' '}
        / {id ? 'Editar' : 'Nuevo'}
      </p>
      <h1 className="mt-2 font-display text-4xl font-bold">{id ? form.title || 'Editar proyecto' : 'Nuevo proyecto'}</h1>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-4 bg-white p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="label-xs">Título</span>
            <input className="input-base" value={form.title} onChange={(e) => update('title', e.target.value)} required maxLength={160} />
          </label>
          <label className="grid gap-2">
            <span className="label-xs">Slug (opcional)</span>
            <input className="input-base" value={form.slug} onChange={(e) => update('slug', e.target.value)} maxLength={180} placeholder="se genera del título" />
          </label>
          <label className="grid gap-2">
            <span className="label-xs">Categoría</span>
            <input className="input-base" value={form.category} onChange={(e) => update('category', e.target.value)} required maxLength={80} />
          </label>
          <label className="grid gap-2">
            <span className="label-xs">Año</span>
            <input type="number" className="input-base" value={form.year} onChange={(e) => update('year', e.target.value)} />
          </label>
        </div>
        <label className="grid gap-2">
          <span className="label-xs">Descripción</span>
          <textarea className="input-base min-h-28" value={form.description} onChange={(e) => update('description', e.target.value)} />
        </label>

        <label className="grid gap-2">
          <span className="label-xs">Portada {uploading && '(subiendo…)'}</span>
          <input
            type="file"
            accept="image/*"
            className="input-base"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) uploadFile(file, (url) => update('coverImage', url))
              e.target.value = ''
            }}
          />
          {form.coverImage && <img src={form.coverImage} alt="Portada" className="h-40 w-auto object-cover" />}
        </label>

        {id && (
          <label className="grid gap-2">
            <span className="label-xs">Agregar imagen a la galería</span>
            <input type="file" accept="image/*" className="input-base" onChange={addGalleryImage} />
            <div className="mt-2 grid grid-cols-4 gap-3">
              {images.map((image) => (
                <div key={image.id} className="relative">
                  <img src={image.url} alt="" className="aspect-square w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(image.id)}
                    className="absolute top-1 right-1 bg-brand-black/80 px-2 py-0.5 text-xs text-white"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </label>
        )}

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.featured} onChange={(e) => update('featured', e.target.checked)} />
            Destacado (portada)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.published} onChange={(e) => update('published', e.target.checked)} />
            Publicado
          </label>
          <label className="flex items-center gap-2 text-sm">
            Orden
            <input
              type="number"
              className="input-base w-20 px-2 py-1"
              value={form.sortOrder}
              onChange={(e) => update('sortOrder', e.target.value)}
            />
          </label>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="btn-primary w-fit" disabled={saving || uploading}>
          {saving ? 'Guardando…' : 'Guardar proyecto'}
        </button>
      </form>
    </div>
  )
}
