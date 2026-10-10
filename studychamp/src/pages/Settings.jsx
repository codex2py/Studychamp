export default function Settings() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-text">
        Settings
      </h1>
      <p className="mt-2 text-text-secondary">
        customise your StudyChamp experience.
      </p>

      <div className="mt-6 rounded-2xl border border-border bg-surface p-6">
        <h2 className="font-medium">study preferences</h2>
        <p className="mt-2 text-sm text-text-secondary">
          your timer, daily goal and other preferences will go here.
        </p>
      </div>
    </div>
  )
}