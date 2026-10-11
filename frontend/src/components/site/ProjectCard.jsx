import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import LikeButton from './LikeButton.jsx'

export default function ProjectCard({ project, accent = false }) {
  return (
    <Link
      to={`/proyectos/${project.slug}`}
      className={`group flex flex-col overflow-hidden transition ${
        accent ? 'bg-brand-yellow' : 'bg-white'
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-black">
        {project.coverImage ? (
          <img
            src={project.coverImage}
            alt={project.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-white/40">Sin imagen</div>
        )}
        <span className="absolute top-4 left-4 bg-brand-yellow px-3 py-1 font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-black">
          {project.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-2xl font-bold leading-tight">{project.title}</h3>
          <ArrowUpRight size={20} className="mt-1 shrink-0 transition group-hover:translate-x-1" />
        </div>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-sm text-brand-black/60">{project.year}</span>
          <LikeButton projectId={project.id} likeCount={project.likeCount} />
        </div>
      </div>
    </Link>
  )
}
