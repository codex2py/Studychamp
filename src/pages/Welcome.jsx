
import { useState } from 'react'
import { GraduationCap } from 'lucide-react'

export default function Welcome({ onNameSaved }) {
  const [name, setName] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    const trimmedName = name.trim()

    if (!trimmedName) return

    onNameSaved(trimmedName)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-10">
      <div className="w-full max-w-md rounded-3xl border border-border bg-surface p-8 shadow-sm">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white">
          <GraduationCap size={30} />
        </div>

        <h1 className="text-3xl font-bold text-text">
          Welcome to StudyChamp
        </h1>

        <p className="mt-3 leading-6 text-text-secondary">
          Your personal space to organise your courses, stay focused,
          and make the most of your study time.
        </p>

        <form onSubmit={handleSubmit} className="mt-8">
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-text"
          >
            What should we call you?
          </label>

          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter your name"
            autoComplete="given-name"
            autoFocus
            required
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
          />

          <button
            type="submit"
            className="mt-5 w-full rounded-xl bg-primary px-5 py-3 font-medium text-white transition hover:bg-primary-hover"
          >
            Let's get started
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-text-muted">
          Your study journey starts here.
        </p>
      </div>
    </main>
  )
}
