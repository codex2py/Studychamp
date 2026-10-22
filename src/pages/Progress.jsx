
import { useEffect, useState } from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Flame,
  Goal,
  TrendingUp,
  Trophy,
} from 'lucide-react'
import { getStorageItem, STORAGE_KEYS } from '../utils/storage'

function getDuration(session) {
  const value =
    session.durationSeconds ??
    session.elapsedSeconds ??
    session.elapsedTime ??
    session.duration ??
    0

    const seconds = Number(value)
    return Number.isFinite(seconds) && seconds > 0 ? seconds : 0
}

function getSessionDate(session) {
  const value = 
    session.completedAt ??
    session.endedAt ?? 
    session.date ??
    session.startedAt ??
    session.createdAt 

  if (!value) return null

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function isCompleted(session) {
  if (typeof session.isCompleted === 'boolean') return session.isCompleted
  if (typeof session.completed === 'boolean') return session.completed

  return Boolean(session.completedAt || session.endedAt)
}

function getDayKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function getStartOfDay(date) {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)
  return result
}

function getMonday(date) {
  const result = getStartOfDay(date)
  const day = result.getDay()

  result.setDate(result.getDate() - (day === 0 ? 6 : day - 1))
  return result
}

function formatDuration(seconds) {
  const safeSeconds = Math.max(0, Math.floor(seconds))
  const hours = Math.floor(safeSeconds / 3600)
  const minutes =Math.floor((safeSeconds % 3600) / 60)

  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
  }
  return `${minutes}m`
}

function formatHours(seconds) {
  return Number((seconds / 3600). toFixed(1)).toString()
}

function getCourseName(session, courses) {
  if (session.courseName) return session.courseName
  if (typeof session.course === 'string') return session.course

  const courseId = session.courseId ?? session.course?.id
  const course = courses.find((item) => item.id === courseId)

  return course?.name ?? 'Unassigned course'
}

function getCourseProgress(course) {
  const topics = Array.isArray(course.topics) ? course.topics : []

  if (topics.length > 0) {
    const completedTopics = topics.filter(
      (topic) => topic.completed || topic.isCompleted
    ).length

    return Math.round((completedTopics / topics.length) * 100)
  }

  const progress = Number(course.progress)

  return Number.isFinite(progress)
    ? Math.max(0, Math.min(100, progress))
    : 0
}

function getDailyGoal(preferences) {
  const values = [
    preferences?.dailyGoalHours,
    preferences?.dailyStudyGoal,
    preferences?.studyGoalHours,
  ]

  for (const value of value) {
    if (value === undefined || value === null ||  value === '') continue

    const goal = Number(value)
    if (Number.isFinite(goal) && goal > 0) return goal * 3600
  }

  return null
}

function StatCard({ icon: Icon, label, value, detail, color, background }) {
  return (
    <div className='rounded-2xl border border-border bg-surface p-5'>
      <div className='flex items-start justify-between gap-3'>
        <div>
          <p className='text-sm font-medium text-text-secondary'>{label}</p>
          <p className='mt-3 text-3xl font-bold tracking-tight text-text'>
            {value}
          </p>
          <p className='mt-2 text-xs leading-5 text-text-muted'>{detail}</p>
        </div>
        <div 
          className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl'
          style={{ backgroundColor: background, color }}
        >
          <Icon size={21} />
        </div>
      </div>
    </div>
  )
}

function SectionHeading({ title, description, action }) {
  return (
    <div className='mb-5 flex flex-wrap items-end justify-between gap-3'>
      <div>
        <h2 className='text-lg font-bold text-text'>{title}</h2>
        {description && (
          <p className='mt-1 text-sm text-text-muted'>{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}

function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className='flex min-h-44 flex-col items-center justify-center px-5 py-8 text-center'>
      <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-primary'>
        <Icon size={23} />
      </div>
      <h3 className='font-semibold text-text'>{title}</h3>
      <p className='mt-2 max-w-sm text-sm leading-6 text-text-muted'>
        {description}
      </p>
    </div>
  )
}

