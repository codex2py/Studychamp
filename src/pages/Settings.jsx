
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
  motivationalMessages: true,
}

function SettingsSection({ icon: Icon, title, description, children }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <div className="flex items-start gap-3 border-b border-border px-5 py-5 sm:px-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
          <Icon size={19} />
        </div>

        <div>
          <h2 className="font-semibold text-text">{title}</h2>
          <p className="mt-1 text-sm leading-relaxed text-text-secondary">
            {description}
          </p>
        </div>
      </div>

      <div className="divide-y divide-border px-5 sm:px-6">
        {children}
      </div>
    </section>
  )
}

function SettingRow({ title, description, children }) {
  return (
    <div className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h3 className="text-sm font-medium text-text">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-text-secondary">
          {description}
        </p>
      </div>

      <div className="shrink-0 sm:min-w-[180px] sm:text-right">
        {children}
      </div>
    </div>
  )
}

function NumberSetting({ value, onChange, min = 1, max = 180, suffix }) {
  return (
    <div className="flex items-center gap-2 sm:justify-end">
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-24 rounded-xl border border-border bg-background px-3 py-2.5 text-center text-sm font-semibold text-text outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
      />

      {suffix && (
        <span className="text-sm text-text-secondary">{suffix}</span>
      )}
    </div>
  )
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 ${
        checked
          ? 'border-primary bg-primary'
          : 'border-border-strong bg-surface-muted'
      }`}
    >
      <span
        className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-sm ring-1 ring-black/5 transition-transform duration-200 ease-in-out ${
          checked ? 'translate-x-[23px]' : 'translate-x-[3px]'
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
  const [saveMessage, setSaveMessage] = useState('')

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

  const updatePreference = (key, value) => {
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
      longBreakDuration: Number(preferences.longBreakDuration),
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
    setSaveMessage('')
  }

  const handleNumberChange = (key, value, min, max) => {
    if (value === '') {
      updatePreference(key, '')
      return
    }

    const number = Number(value)

    if (!Number.isFinite(number)) return

    updatePreference(key, Math.min(max, Math.max(min, number)))
  }


  return (
    <div className='min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-4xl'>
        <div className='mb-8'>
          <p className='mb-2 text-xs font-bold uppercase tracking-[0.16em] text-primary'>
            MAKE IT YOURS
          </p>
          <h1 className='font-display text-3xl font-semibold tracking-tight text-text sm:text-4xl'>
            Settings
          </h1>
          <p className='mt-2 max-w-4xl text-sm leading-relaxed text-text-secondary sm:text-base'>
            Adjust your study environment and make StudyChamp work the way you do
          </p>
        </div>

        <div className='space-y-6'>
          <SettingsSection
            icon={UserRound}
            title="Your profile"
            description="A little about the person behind the progress."
          >
            <SettingRow
              title="Your name"
              description="This is the name StudyChamp uses to greet you."
            >
              <div className='flex flex-col gap-2 sm:items-end'>
                <input 
                  type='text'
                  value={userName}
                  onChange={(event) => {
                    setUserName(event.target.value)
                    setNameMessage('')
                  }}
                  placeholder='Enter your name'
                  maxLength={40}
                  className='w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-text outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-4 focus:ring-primary/10 sm:w-52'
                />
                <button 
                  type='button'
                  onClick={handleNameSave}
                  disabled={!userName.trim() || userName.trim() === savedName}
                  className='inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50'
                >
                  <Save size={15} />
                </button>
                {nameMessage && (
                  <p className={`text-xs ${
                    nameMessage.includes('updated')
                      ? 'text-success'
                      : 'text-accent'
                  }`}>
                    {nameMessage}
                  </p>
                )}
              </div>
            </SettingRow>
          </SettingsSection>

          <SettingsSection 
            icon={Target}
            title="Study goals"
            description="Set a daily target that keeps you moving forward."
          >
            <SettingRow
              title="Daily study goal"
              description="How many hours of focused study would you like to complete each day?"
            >
              <NumberSetting
                value={preferences.dailyStudyGoal}
                min={0.5}
                max={24}
                suffix="hours"
                onChange={(value) => 
                  handleNumberChange('dailyStudyGoal', value, 0.5, 24)
                }
              />
            </SettingRow>
          </SettingsSection>

          <SettingsSection
            icon={Timer}
            title="Focus timer"
            description="Set up your focus and break sessions."
          >
            <SettingRow
              title="Focus duration"
              description="How long should each focused study session last?"
            >
              <NumberSetting 
                value={preferences.focusDuration}
                min={1}
                max={180}
                suffix="minutes"
                onChange={(value) =>
                  handleNumberChange('focusDuration', value, 1, 180)
                }
              />
            </SettingRow>

            <SettingRow
              title="Short break"
              description="Your quick recharge between focus sessions."
            >
              <NumberSetting 
                value={preferences.shortBreakDuration}
                min={1}
                max={60}
                suffix="minutes"
                onChange={(value) => 
                  handleNumberChange('shortBreakDuration', value, 1, 60)
                }
              />
            </SettingRow>

            <SettingRow
              title="Long break"
              description="A longer rest after an extended period of studying."
            >
              <NumberSetting
                value={preferences.longBreakDuration}
                min={1}
                max={90}
                suffix="minutes"
                onChange={(value) =>
                  handleNumberChange('longBreakDuration', value, 1, 90)
                }
              />
            </SettingRow>
          </SettingsSection>

          <SettingsSection
            icon={SlidersHorizontal}
            title="Study experience"
            description="Choose the little things that make studying feel better."
          >
            <SettingRow
              title="Timer sound"
              description="Play a sound when a focus or break session ends."
            >
              <div className='flex items-center justify-between sm:justify-end sm:gap-4'>
                <span className='text-sm text-text-secondary'>
                  {preferences.soundEnabled ? 'On' : 'Off'}
                </span>

                <Toggle 
                  checked={Boolean(preferences.soundEnabled)}
                  onChange={(value) => 
                    updatePreference('soundEnabled', value)
                  }
                />
              </div>
            </SettingRow>

            <SettingRow
              title="Motivational messages"
              description="Show encouraging messages as you work towards your goals."
            >
              <div className='flex items-center justify-between sm:justify-end sm:gap-4'>
                <span className='text-sm text-text-secondary'>
                  {preferences.motivationalMessages ? 'On' : 'Off'}
                </span>

                <Toggle 
                  checked={Boolean(preferences.motivationalMessages)}
                  onChange={(value) =>
                    updatePreference('motivationalMessages', value)
                  }
                />
              </div>
            </SettingRow>
          </SettingsSection>

          <div className='flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6'>
            <div>
              <h2 className='font-semibold text-text'>
                Your preferences
              </h2>
              <p className='mt-1 text-sm text-text-secondary'>
                Changes to your study preferences are saved when you press the button.
              </p>
              
              {saveMessage && (
                <p className='mt-2 flex items-center gap-1.5 text-sm text-success'>
                  <Check size={15} />
                  {saveMessage}
                </p>
              )}
            </div>

            <div className='flex flex-col-reverse gap-2 sm:flex-row'>
              <button
                type='button'
                onClick={handleResetPreferences}
                className='inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-text-secondary transition hover:bg-surface-muted hover:text-text'
              >
                <RotateCcw size={15} />
                Reset defaults
              </button>

              <button
                type='button'
                onClick={handleSavePreferences}
                disabled={!hasChanges}
                className='inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50'
              >
                <Check size={16} />
                Save changes
              </button>
            </div>
          </div>

          <div className='flex items-start gap-3 rounded-xl bg-surface-muted p-4'>
            <MessageCircle 
              size={18}
              className='mt-0.5 shrink-0 text-text-secondary'
            />
            <p className='text-xs leading-relaxed text-text-secondary'>
              Your StudyChamp profile and preferences are saved locally in this browser. They are not connected to an online account, so they won't automatically follow you to another device or browser.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}