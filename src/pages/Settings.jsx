import { useEffect, useState } from 'react'
import {
  UserRound,
  Target,
  Timer,
  SlidersHorizontal,
  MessageCircle,
  RotateCcw,
  Check,
  Save,
} from 'lucide-react'

import {
  getStorageItem,
  setStorageItem,
  STORAGE_KEYS,
} from '../utils/storage'

const DEFAULT_PREFERENCES = {
    dailyStudyGoal: 2,
    focusDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    soundEnabled: false,
    motivationMessages: true,
}

function SettingsSection({ icon: Icon, title, description, children }) {
  return (
    <section className='overflow-hidden rounded-2xl border border-border bg-surface shadow-sm'> 
      <div className='flex items-start gap-3 border-b border-border px-5 py-5 sm:px-6'>
        <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary'>
          <Icon size={19} />
        </div>

        <div>
          <h2 className='font-semibold text-text'>{title}</h2>
          <p className='mt-1 text-sm leading-relaxed text-text-secondary'>
            {description}
          </p>
        </div>
      </div>
      <div className='divide-y divide-border px-5 sm:px-6'>
        {children}
      </div>
    </section>
  )
}

function SettingRow ({ title, description, children }) {
  return (
    <div className='flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between'>
      <div className='min-w-0'>
        <h3 className='text-sm font-medium text-text'>{title}</h3>
        <p className='mt-1 text-sm leading-relaxed text-text-secondary'>
          {description}
        </p>
      </div>
      <div>
        {children}
      </div>
    </div>
  )
}

function NumberSetting({ value, onChange, min = 1, max = 180, suffix }) {
  return (
    <div className='flex items-center gap-2 sm:justify-end'>
      <input 
        type='number'
        min={min}
        max={max}
        value={value}
        onChange={(event) => onchange(event.target.value)}
        className='w-24 rounded-xl border border-border bg-background px-3 py-2.5 text-center text-sm font-semibold text-text outline-none transition focus:ring-4 focus:ring-primary/10'
      />
      {suffix && (
        <span className='text-sm text-text-secondary'>{suffix}</span>
      )}
    </div>
  )
}

function Toggle ({ checked, onChange }) {
  return (
    <button
      type='button'
      role='switch'
      aria-checked={checked}
      onClick={() => onchange(!checked)}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 ${
        checked
          ? 'border-primary bg-primary'
          : 'border-border-strong bg-surface-muted'
      }`}
    >
      <span 
        className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-sm ring-1 ring-black/5 transition-transform duration-200 ease-in-out ${
          checked ? 'translate-x-5.75' : 'translate-x-0.75'
        }`}
      />
    </button>
  )
}

export default function Settings() {
  const [userName, setUserName] = useState('')
  const [savedName, setSavedName] = useState('')
  const [nameMessage, setNameMessage] = useState('')

  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES)
  const [hasChanges, setHasChanges] = useState(false)
  const [saveMessae, setSaveMessage] = useState('')

    useEffect(() => {
    const storedName = getStorageItem(STORAGE_KEYS.userName, '')
    const storedPreferences = getStorageItem(
      STORAGE_KEYS.preferences,
      {}
    )

    setUserName(storedName)
    setSavedName(storedName)

    setPreferences({
      ...DEFAULT_PREFERENCES,
      ...storedPreferences,
    })
  }, [])

  const handleNameSave = () => {
    const trimmedName = userName.trim()

    if (!trimmedName) {
      setNameMessage('Please enter your name.')
      return
    }

    const successful = setStorageItem(
      STORAGE_KEYS.userName,
      trimmedName
    )

    if (successful) {
      setUserName(trimmedName)
      setSavedName(trimmedName)
      setNameMessage('Your name has been updated.')
    } else {
      setNameMessage('Could not save your name. Please try again.')
    }
  }

  const updatePreferences = (key, value) => {
    setPreferences((current) => ({
      ...current,
      [key]: value,
    }))

    setHasChanges(true)
    setSaveMessage('')
  }

  const handleSavePreferences = () => {
    const valuesToSave = {
      ...preferences,
      dailyStudyGoal: Number(preferences.dailyStudyGoal),
      focusDuration: Number(preferences.focusDuration),
      shortBreakDuration: Number(preferences.shortBreakDuration),
      longBreakDuration: Number(preferences.longBreakDuration)
    }

    const successful = setStorageItem(
      STORAGE_KEYS.preferences,
      valuesToSave
    )

    if (successful) {
      setPreferences(valuesToSave)
      setHasChanges(false)
      setSaveMessage('Your study preferences have been saved.')
    } else {
      setSaveMessage('Could not save your preferences. Please try again.')
    }
  }

  const handleResetPreferences = () => {
    setPreferences({ ...DEFAULT_PREFERENCES })
    setHasChanges(true)
    setSaveMessage("")
  }
}