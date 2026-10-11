import { useEffect, useState } from 'react'
import { api } from '../../api/client.js'

export default function SiteProvider({ children }) {
  const [site, setSite] = useState(null)
  const [services, setServices] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [siteRes, servicesRes, projectsRes] = await Promise.all([
          api.get('/public/site'),
          api.get('/public/services'),
          api.get('/public/projects'),
        ])
        if (cancelled) return
        setSite(siteRes.data)
        setServices(servicesRes.data)
        setProjects(projectsRes.data)
      } catch (error) {
        console.error('Error cargando el sitio', error)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  return children({ site, services, projects, loading })
}
