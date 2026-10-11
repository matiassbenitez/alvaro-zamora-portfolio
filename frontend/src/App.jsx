import { Routes, Route } from 'react-router-dom'
import SiteLayout from './components/site/SiteLayout.jsx'
import Home from './pages/public/Home.jsx'
import Projects from './pages/public/Projects.jsx'
import ProjectDetail from './pages/public/ProjectDetail.jsx'
import Login from './pages/admin/Login.jsx'
import AdminLayout from './components/admin/AdminLayout.jsx'
import RequireAuth from './auth/RequireAuth.jsx'
import Dashboard from './pages/admin/Dashboard.jsx'
import Messages from './pages/admin/Messages.jsx'
import ProjectsAdmin from './pages/admin/ProjectsAdmin.jsx'
import ProjectForm from './pages/admin/ProjectForm.jsx'
import Likes from './pages/admin/Likes.jsx'
import ContentEditor from './pages/admin/ContentEditor.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/proyectos" element={<Projects />} />
        <Route path="/proyectos/:slug" element={<ProjectDetail />} />
      </Route>

      <Route path="/admin/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="mensajes" element={<Messages />} />
        <Route path="proyectos" element={<ProjectsAdmin />} />
        <Route path="proyectos/nuevo" element={<ProjectForm />} />
        <Route path="proyectos/:id" element={<ProjectForm />} />
        <Route path="likes" element={<Likes />} />
        <Route path="contenido" element={<ContentEditor />} />
      </Route>

      <Route path="*" element={<Home />} />
    </Routes>
  )
}
