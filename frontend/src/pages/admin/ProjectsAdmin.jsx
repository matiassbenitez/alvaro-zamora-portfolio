import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, apiErrorMessage } from '../../api/client.js'
import Spinner from '../../components/ui/Spinner.jsx'

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  function load() {
    setLoading(true)
    api
      .get('/admin/projects')
      .then(({ data }) => setProjects(data))
      .catch((err) => alert(apiErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  async function toggleFeatured(project) {
    const { data } = await api.patch(`/admin/projects/${project.id}/featured`, { featured: !project.featured })
    setProjects((prev) => prev.map((p) => (p.id === data.id ? { ...p, featured: data.featured } : p)))
  }

  async function togglePublished(project) {
    const { data } = await api.put(`/admin/projects/${project.id}`, {
      title: project.title,
      category: project.category,
      year: project.year,
      description: project.description,
      featured: project.featured,
      published: !project.published,
      sortOrder: project.sortOrder,
    })
    setProjects((prev) => prev.map((p) => (p.id === data.id ? { ...p, published: data.published } : p)))
  }

  async function remove(project) {
    if (!confirm(`¿Eliminar "${project.title}"?`)) return
    await api.delete(`/admin/projects/${project.id}`)
    setProjects((prev) => prev.filter((p) => p.id !== project.id))
  }

  return (
    <div className="grid gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-xs">Portafolio</p>
          <h1 className="mt-2 font-display text-4xl font-bold">Proyectos</h1>
        </div>
        <Link to="/admin/proyectos/nuevo" className="btn-primary">
          + Nuevo proyecto
        </Link>
      </header>

      {loading ? (
        <Spinner />
      ) : (
        <div className="overflow-x-auto bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-brand-line text-left">
              <tr>
                <th className="p-4">Proyecto</th>
                <th className="p-4">Categoría</th>
                <th className="p-4">Año</th>
                <th className="p-4">Likes</th>
                <th className="p-4">Destacado</th>
                <th className="p-4">Publicado</th>
                <th className="p-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-line">
              {projects.map((project) => (
                <tr key={project.id}>
                  <td className="p-4 font-medium">{project.title}</td>
                  <td className="p-4">{project.category}</td>
                  <td className="p-4">{project.year || '—'}</td>
                  <td className="p-4">{project.likeCount}</td>
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={project.featured}
                      onChange={() => toggleFeatured(project)}
                    />
                  </td>
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={project.published}
                      onChange={() => togglePublished(project)}
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex gap-3">
                      <Link to={`/admin/proyectos/${project.id}`} className="font-semibold underline">
                        Editar
                      </Link>
                      <button type="button" onClick={() => remove(project)} className="text-red-600 underline">
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
