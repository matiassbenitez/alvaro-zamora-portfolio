export default function SectionHeading({ index, title, subtitle, light = false }) {
  return (
    <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {index && (
          <span className={`label-xs ${light ? 'text-white/50' : 'text-brand-gray'}`}>{index}</span>
        )}
        <h2
          className={`mt-3 font-display text-4xl font-bold tracking-tight lg:text-5xl ${
            light ? 'text-white' : 'text-brand-black'
          }`}
        >
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className={`max-w-md text-sm leading-relaxed ${light ? 'text-white/70' : 'text-brand-black/60'}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
