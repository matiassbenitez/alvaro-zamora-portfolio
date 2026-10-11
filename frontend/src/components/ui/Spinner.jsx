export default function Spinner({ full = false }) {
  return (
    <div className={`flex items-center justify-center ${full ? 'min-h-[60vh]' : 'py-10'}`}>
      <span className="h-10 w-10 animate-spin rounded-full border-4 border-brand-line border-t-brand-yellow" />
    </div>
  )
}
