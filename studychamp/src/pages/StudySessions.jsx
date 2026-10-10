export default function StudySessions() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-text">
        Study Sessions
      </h1>
      <p className="mt-2 text-text-secondary">
        focus on your studies, one session at a time.
      </p>

      <div className="mt-6 rounded-2xl border border-border bg-surface p-6">
        <p className="text-text-secondary">study timer coming here.</p>

        <div className="mt-4 text-4xl font-semibold text-primary">
          25:00
        </div>

        <button className="mt-4 rounded-xl bg-primary px-5 py-3 text-white hover:bg-primary-hover">
          Start studying
        </button>
      </div>
    </div>
  )
}