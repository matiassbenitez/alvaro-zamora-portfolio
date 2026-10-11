export default function StatCard({ label, value, hint, accent = false }) {
  return (
    <div className={`p-6 ${accent ? 'bg-brand-yellow' : 'bg-white'}`}>
      <p className="label-xs">{label}</p>
      <p className="mt-3 font-display text-4xl font-bold">{value}</p>
      {hint && <p className="mt-2 text-xs text-brand-black/55">{hint}</p>}
    </div>
  )
}
