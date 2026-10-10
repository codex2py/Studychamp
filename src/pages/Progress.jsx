export default function Progress() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-text">
        Your Progress
      </h1>
      <p className="mt-2 text-text-secondary">
        see how far you've come with your studies.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-6">
          <p className="text-sm text-text-secondary">total focus time</p>
          <p className="mt-2 text-2xl font-semibold">0 hours</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6">
          <p className="text-sm text-text-secondary">current streak</p>
          <p className="mt-2 text-2xl font-semibold">0 days</p>
        </div>
      </div>
    </div>
  )
}