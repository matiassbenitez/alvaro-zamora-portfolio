import axios from 'axios'

export const api = axios.create({
  baseURL: '/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const url = error.config?.url || ''
    if (status === 401 && !url.includes('/auth/login') && window.location.pathname.startsWith('/admin')) {
      localStorage.removeItem('admin_token')
      if (window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(error)
  },
)

export function apiErrorMessage(error, fallback = 'Ocurrió un error inesperado') {
  const data = error.response?.data
  if (!data) {
    // Sin respuesta: backend caído, red caída o timeout.
    return 'No se pudo conectar con el servidor. Intentá de nuevo.'
  }
  if (data.fields && Object.keys(data.fields).length > 0) {
    const details = Object.values(data.fields).join(' · ')
    return data.message ? `${data.message}: ${details}` : details
  }
  return data.message || fallback
}
