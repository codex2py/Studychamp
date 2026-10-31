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
  const minutes = Math.floor((safeSeconds % 3600) / 60)

  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
  }

  return `${minutes}m`
}

function formatHours(seconds) {
  return Number((seconds / 3600).toFixed(1)).toString()
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

  for (const value of values) {
    if (value === undefined || value === null || value === '') continue

    const goal = Number(value)
    if (Number.isFinite(goal) && goal > 0) return goal * 3600
  }

  return null
}

function StatCard({ icon: Icon, label, value, detail, color, background }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-text-secondary">{label}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-text">
            {value}
          </p>
          <p className="mt-2 text-xs leading-5 text-text-muted">{detail}</p>
        </div>

        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
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
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-lg font-bold text-text">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-text-muted">{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}

function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex min-h-44 flex-col items-center justify-center px-5 py-8 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-primary">
        <Icon size={23} />
      </div>
      <h3 className="font-semibold text-text">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-text-muted">
        {description}
      </p>
    </div>
  )
}

export default function Progress() {
  const [sessions, setSessions] = useState(() => {
    const saved = getStorageItem(STORAGE_KEYS.sessions, [])
    return Array.isArray(saved) ? saved : []
  })

  const [courses, setCourses] = useState(() => {
    const saved = getStorageItem(STORAGE_KEYS.courses, [])
    return Array.isArray(saved) ? saved : []
  })

  const [preferences, setPreferences] = useState(() =>
    getStorageItem(STORAGE_KEYS.preferences, {}) ?? {}
  )

  const [period, setPeriod] = useState('week')

  useEffect(() => {
    function refreshData() {
      const savedSessions = getStorageItem(STORAGE_KEYS.sessions, [])
      const savedCourses = getStorageItem(STORAGE_KEYS.courses, [])
      const savedPreferences = getStorageItem(STORAGE_KEYS.preferences, {})

      setSessions(Array.isArray(savedSessions) ? savedSessions : [])
      setCourses(Array.isArray(savedCourses) ? savedCourses : [])
      setPreferences(savedPreferences ?? {})
    }

    function handleStorage(event) {
      if (
        event.key === null ||
        event.key === STORAGE_KEYS.sessions ||
        event.key === STORAGE_KEYS.courses ||
        event.key === STORAGE_KEYS.preferences
      ) {
        refreshData()
      }
    }

    window.addEventListener('focus', refreshData)
    window.addEventListener('storage', handleStorage)

    return () => {
      window.removeEventListener('focus', refreshData)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  const now = new Date()
  const todayKey = getDayKey(now)
  const weekStart = getMonday(now)

  const validSessions = sessions
    .filter((session) => session && typeof session === 'object')
    .map((session) => ({
      ...session,
      dateObject: getSessionDate(session),
      durationSeconds: getDuration(session),
      completedStatus: isCompleted(session),
      resolvedCourseName: getCourseName(session, courses),
    }))
    .filter((session) => session.dateObject !== null)

  const completedSessions = validSessions.filter(
    (session) => session.completedStatus
  )

  const totalFocusSeconds = completedSessions.reduce(
    (total, session) => total + session.durationSeconds,
    0
  )

  const studiedDays = new Set(
    completedSessions.map((session) => getDayKey(session.dateObject))
  )

  const todaySeconds = completedSessions
    .filter((session) => getDayKey(session.dateObject) === todayKey)
    .reduce((total, session) => total + session.durationSeconds, 0)

  const thisWeekSeconds = completedSessions
    .filter((session) => session.dateObject >= weekStart)
    .reduce((total, session) => total + session.durationSeconds, 0)

  const previousWeekStart = new Date(weekStart)
  previousWeekStart.setDate(previousWeekStart.getDate() - 7)

  const previousWeekSeconds = completedSessions
    .filter(
      (session) =>
        session.dateObject >= previousWeekStart &&
        session.dateObject < weekStart
    )
    .reduce((total, session) => total + session.durationSeconds, 0)

  const weekDifference =
    previousWeekSeconds > 0
      ? Math.round(
          ((thisWeekSeconds - previousWeekSeconds) / previousWeekSeconds) *
            100
        )
      : null

  const chartDays = period === 'week' ? 7 : 30
  const chartData = []

  for (let index = chartDays - 1; index >= 0; index -= 1) {
    const date = getStartOfDay(now)
    date.setDate(date.getDate() - index)

    const key = getDayKey(date)
    const seconds = completedSessions
      .filter((session) => getDayKey(session.dateObject) === key)
      .reduce((total, session) => total + session.durationSeconds, 0)

    chartData.push({
      key,
      seconds,
      label:
        period === 'week'
          ? date.toLocaleDateString('en', { weekday: 'short' })
          : String(date.getDate()),
      fullLabel: date.toLocaleDateString('en', {
        month: 'short',
        day: 'numeric',
      }),
    })
  }

  const chartTotal = chartData.reduce(
    (total, day) => total + day.seconds,
    0
  )

  const chartMax = Math.max(3600, ...chartData.map((day) => day.seconds))

  const calendarData = []

  for (let index = 27; index >= 0; index -= 1) {
    const date = getStartOfDay(now)
    date.setDate(date.getDate() - index)

    const key = getDayKey(date)
    const seconds = completedSessions
      .filter((session) => getDayKey(session.dateObject) === key)
      .reduce((total, session) => total + session.durationSeconds, 0)

    calendarData.push({ date, key, seconds })
  }

  const calendarMax = Math.max(
    1,
    ...calendarData.map((day) => day.seconds)
  )

  const averageSessionSeconds =
    completedSessions.length > 0
      ? totalFocusSeconds / completedSessions.length
      : 0

  const courseProgress = courses
    .filter((course) => course && typeof course === 'object')
    .map((course) => {
      const courseSessions = completedSessions.filter((session) => {
        const sessionCourseId = session.courseId ?? session.course?.id

        if (sessionCourseId != null && course.id != null) {
          return sessionCourseId === course.id
        }

        return session.resolvedCourseName === course.name
      })

      return {
        ...course,
        progressValue: getCourseProgress(course),
        sessionCount: courseSessions.length,
        focusSeconds: courseSessions.reduce(
          (total, session) => total + session.durationSeconds,
          0
        ),
      }
    })
    .sort((a, b) => b.focusSeconds - a.focusSeconds)

  const dailyGoalSeconds = getDailyGoal(preferences)
  const dailyGoalProgress =
    dailyGoalSeconds !== null
      ? Math.min((todaySeconds / dailyGoalSeconds) * 100, 100)
      : 0

  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 6)

  const weekRange = `${weekStart.toLocaleDateString('en', {
    month: 'short',
    day: 'numeric',
  })} – ${weekEnd.toLocaleDateString('en', {
    month: 'short',
    day: 'numeric',
  })}`

  const intensityColors = [
    'var(--color-surface-muted)',
    '#DDE7FF',
    '#B6CAFF',
    '#7FA1F5',
    'var(--color-primary)',
  ]

  return (
    <main className='min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-7xl space-y-8'>
        <header className='flex flex-col justify-between gap-5 sm:flex-row sm:items-end'>
          <div>
            <p className='text-xs font-bold uppercase tracking-[0.18em] text-primary'>
              YOUR GROWTH
            </p>
            <h1 className='mt-2 font-display text-3xl font-semibold tracking-tight text-text sm:text-4xl'>
              Progress
            </h1>
            <p className='mt-3 max-w-xl text-sm leading-6 text-text-secondary'>
              See how your study habits are developing, celebrate your consistency, and find out where your time goes.
            </p>
          </div>

            <div className="flex items-center gap-2 self-start rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text-secondary sm:self-auto">
            <CalendarDays size={17} className="text-primary" />
            {now.toLocaleDateString('en', {
              month: 'long',
              year: 'numeric',
            })}
          </div>
        </header>

        <section className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
          <StatCard 
            icon={Clock3}
            label="Total focus time"
            value={`${formatHours(totalFocusSeconds)}h`}
            detail="From completed study sessions"
            color="var(--color-primary)"
            background="var(--color-primary-light)"
          />
          <StatCard 
            icon={CheckCircle2}
            label="Completed sessions"
            value={completedSessions.length}
            detail={`${formatDuration(averageSessionSeconds)} average per session`}
            color="var(--color-success)"
            background="var(--color-success-light)"
          />
          <StatCard 
            icon={Flame}
            label="Study days"
            value={studiedDays.size}
            detail="Different days with completed sessions "
            color="var(--color-accent)"
            background="var(--color-accent-light)"
          />
          <StatCard 
            icon={BookOpen}
            label="Courses"
            value={courses.length}
            detail="Courses saved in your library"
            color="var(--color-primary)"
            background="var(--color-primary-light)"
          />
        </section>
        <section className='grid grid-cols-1 gap-6 xl:grid-[1.7fr_1fr]'>
          <div className='rounded-2xl border border-border bg-surface p-5 sm:p-6'>
            <SectionHeading 
              title="Focus time"
              description={
                period === 'week'
                  ? `Your study time this week · ${weekRange}`
                  : 'Your daily focus time over the last 30 days'
              }
              action={
                <div className='flex rounded-xl bg-surface-muted p-1'>
                  {[
                    { value: 'week', label: 'Week' },
                    { value: 'month', label: 'Month' },
                  ].map((item) => (
                    <button
                      key={item.value}
                      type='button'
                      onClick={() => setPeriod(item.value)}
                      className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                        period === item.value
                          ? 'bg-surface text-primary shadow-sm'
                          : 'text-text-muted hover:text-text'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              }
            />

            <div className='mb-5 flex items-end justify-between gap-4'> 
              <div>
                <p className='text-3xl font-bold text-text'>
                  {formatHours(chartTotal)}
                  <span className='ml-1 text-base font-medium text-text-muted'>
                    hours
                  </span>
                </p>
                <p className='mt-1 text-xs text-text-muted '>
                  Completed focus time in this period
                </p>
              </div>
              {period === 'week' && weekDifference !== null && (
                <div
                  className={`mb-1 flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold ${
                    weekDifference >= 0
                      ? 'bg-success-light text-success'
                      : 'bg-accent-light text-accent'
                  }`}
                >
                  {weekDifference >= 0 ? (
                    <ArrowUpRight size={14} />
                  ) : (
                    <ArrowDownRight size={14} />
                  )}
                  {Math.abs(weekDifference)}% vs last week
                </div>
              )}
            </div>

            {completedSessions.length === 0 ? (
              <EmptyState   
                icon={TrendingUp}
                title="Your progress starts here"
                description="Complete a study session to see your focus time appear in this chart."
              />
              ) : (
                <>
                  <div className='flex h-48 items-end gap-2 sm:gap-3'>
                    {chartData.map((day) => {
                      const height = 
                        day.seconds > 0
                          ? Math.max((day.seconds / chartMax) * 100, 5)
                          : 2

                      return (
                         <div 
                          key={day.key}
                          className='group flex h-full min-w-0 flex-1 flex-col items-center justify-end'
                         >
                          <div className='relative mb-2 w-full'>
                            {day.seconds > 0 && (
                              <div className='pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-text px-2.5 text-[11px] font-medium text-surface opacity-0 shadow-lg group-hover:opacity-100'>
                                {day.fullLabel}: {formatDuration(day.seconds)}
                              </div>
                            )}
                            <div className='flex h-36 w-full items-end  justify-center'>
                              <div
                                className='w-full max-w-10 rounded-t-lg bg-primary transition-all duration-300 group-hover:opacity-80'
                                style={{
                                  height: `${height}%`,
                                  minHeight: '3px',
                                  opacity: day.seconds > 0 ? 1 : 0.25,
                                }}
                              />
                            </div>
                          </div>
                          <span className='mt-2 text-[10px] text-text-muted sm:text-xs'>
                            {day.label}
                          </span>
                         </div>
                      )
                    })}
                  </div>

                  <div className='mt-5 flex items-center gap-2 border-t border-border pt-4 text-xs text-text-muted'>
                    <span className='h-2 w-2 rounded-full bg-primary' />
                      Focus time
                    <span className='ml-auto'>
                      {chartData.filter((day) => day.seconds > 0).length} active days
                    </span>
                  </div>
                </>
              )}
          </div>
          <div className='flex flex-col rounded-2xl border border-border bg-surface p-5 sm:p-6'>
            <SectionHeading
              title="Daily goal"
              description="How today's study time adds up"
          />
          <div className='flex flex-col items-center'>
            {dailyGoalSeconds !== null ? (
               <>
              <div className='relative flex h-44 w-44 items-center justify-center'>
                <svg>
                  <circle 
                    viewBox='0 0 160 160'
                    className='abslute inset-0 h-full w-full -rotate-90'
                    role='img'
                    aria-label={`${Math.round(dailyGoalProgress)}% of daily goal completed`}
                  />
                  <circle 
                    cx="80"
                    cy="80"
                    r="65"
                    fill='none'
                    stroke='var(--color-surface-muted)'
                    strokeWidth="12"
                  />
                  <circle 
                    cx="80"
                    cy="80"
                    r="65"
                    fill='none'
                    stroke='var(--color-accent)'
                    strokeWidth="12"
                    strokeLinecap='round'
                    strokeDasharray={`${(dailyGoalProgress / 100) * 408.4} 408.4`}
                  />
                </svg>

                <div>
                  <p className='text-3xl font-bold text-text'>
                    {Math.round(dailyGoalProgress)}%
                  </p>
                  <p className='mt-1 text-xs text-text-muted'>completed</p>
                </div>
              </div>
              <p className='mt-5 text-sm text-text-secondary'>
                <span className='font-semibold text-text'>
                  {formatDuration(todaySeconds)}
                </span>{' '}
                studied of{' '}
                <span className='font-semibold text-text'>
                  {formatDuration(dailyGoalSeconds)}
                </span>
              </p>
              <p className='mt-2 text-xs leading-5 text-text-muted'>
                {todaySeconds >= dailyGoalSeconds
                  ? "You've reached your daily study goal. Great work!"
                  : `${formatDuration(dailyGoalSeconds - todaySeconds)} left to reach your goal.`}
              </p>
            </>
            ) : (
              <div className='flex max-w-xs flex-col items-center py-6 text-center'>
                <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-light text-accent'>
                  <Goal size={30} />
                </div>
                <h3 className='mt-5 font-semibold text-text'>
                  Set a daily target
                </h3>
                <p className='mt-2 text-sm leading-6 text-text-muted'>
                  Choose a daily study goal in Settings to track how close you are to reaching it.
                </p>
              </div>
            )}
          </div>
          <div className='mt-4 rounded-xl bg-accent-light p-4'>
            <div className='flex items-start gap-3'>
              <Trophy size={19} className='mt-0.5 shrink-0 text-accent' />
              <div>
                <p className='text-sm font-semibold text-text'>
                  Keep showing up
                </p>
                <p className='mt-1 text-xs leading-5 text-text-secondary'>
                  Small, consistent study sessions can add up over time.
                </p>
              </div>
            </div>
          </div>
          </div>
        </section>

        <section className='rounded-2xl border border-border bg-surface p-5 sm:p-6'>
          <SectionHeading 
            title="Study consistency"
            description="Your last 28 days of completed study sessions"
          />
          {completedSessions.length === 0 ? (
            <EmptyState 
              icon={CalendarDays}
              title="Your calendar is waiting"
              description="Once you complete study sessions, this calendar will show which days you studied."
            />
          ) : (
            <>
              <div className='grid grid-cols-7 gap-2 sm:gap-3 md:grid-cols-14'>
                {calendarData.map((day) => {
                  const ratio = day.seconds / calendarMax
                  const intensity = 
                    day.seconds === 0
                      ? 0
                      : ratio < 0.25
                        ? 1
                        : ratio < 0.5
                          ? 2
                          : ratio < 0.75
                            ? 3
                            : 4
                  return (
                    <div
                     key={day.key}
                     className='group relative flex min-w-0 flex-col items-center gap-2'
                    >
                      <div
                        title={`${day.date.toLocaleDateString('en', {
                          month: 'short',
                          day: 'numeric',
                        })}: ${
                          day.seconds > 0
                            ? formatDuration(day.seconds)
                            : 'No completed study'
                        }`}
                        className={`aspect-square w-full max-w-10 rounded-lg transition ${
                          day.key === todayKey
                            ? 'ring-2 ring-accent ring-offset-2'
                            : ''
                        }`}
                        style={{
                          backgroundColor: intensityColors[intensity],
                        }}
                      />
                      <span className='text-[10px] text-text-muted'>
                        {day.date.getDate()}  
                      </span>  
                      <div className='pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-text px-3 py-2 text-xs text-surface shadow-lg group-hover:block'>
                        {day.date.toLocaleDateString('en', {
                          month: 'short',
                          day: 'numeric',
                        })}
                        <br />
                        {day.seconds > 0
                          ? formatDuration(day.seconds)
                          : 'No completed study'}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className='mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4'>
                <p className='text-sm text-text-secondary'>
                  <span className='font-semibold text-text'>
                    {calendarData.filter((day) => day.seconds > 0).length} of 28 days
                  </span>{' '} with completed study
                </p>
                <div className='flex items-center gap-2'>
                  <span className='text-xs text-text-muted'>Less</span>
                  {intensityColors.map((color) => (
                    <span 
                      key={color}
                      className='h-3 w-3 rounded-sm'
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <span className='text-xs text-text-muted'>More</span>
                </div>
              </div>
            </>
          )}
        </section>

        <section className='rounded-2xl border border-border bg-surface p-5 sm:p-6'>
          <SectionHeading 
            title="Course progress"
            description="See how far you've progressed through your courses"
            action={
              <span className='rounded-lg bg-primary-light px-3 py-1.5 text-xs font-semibold text-primary'>
                {courses.length} {courses.length === 1 ? 'course' : 'courses'}
              </span>
            }
          />

          {courseProgress.length === 0 ? (
            <EmptyState 
              icon={BookOpen}
              title="No courses yet"
              description="Add a course in My Courses to start tracking your learning progress here."
            />
          ) : (
            <div className='space-y-5'>
              {courseProgress.map((course, index) => (
                <div
                  key={course.id ?? course.name ?? index}
                  className='space-y-3'
                >
                  <div className='flex items-center gap-3'>
                    <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary'>
                      <BookOpen size={19} />
                    </div>

                    <div className='min-w-0 flex-1'>
                      <h3 className='truncate text-sm font-semibold text-text'>
                        {course.name ?? 'Untitled course'}
                      </h3>
                      <p className='mt-1 text-xs text-text-muted'>
                        {course.sessionCount} {' '}
                        {course.sessionCount === 1 ? 'session' : 'sessions'}
                        {' · '}
                        {formatDuration(course.focusSeconds)} focused
                      </p>
                    </div>
                    <span className='text-sm font-bold text-text'>
                      [course.progressValue]%
                    </span>
                  </div>
                  <div className='h-2.5 overflow-hidden rounded-full bg-surface-muted'>
                    <div 
                      className='h-full rounded-full bg-primary transition-all duration-500'
                      style={{ width: `${course.progressValue}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className='mt-6 rounded-xl bg-surface-muted p-4'>
            <div className='flex items-start gap-3'>
              <TrendingUp size={19} className='mt-0.5 shrink-0 text-success' />
              <p className='text-xs leading-5 text-text-secondary'>
                Course completion is calculated from completed topics when available. Otherwise, the page uses the course's saved progress value.
              </p>
            </div>
          </div>
        </section>

        
      </div>
    </main>
  )
}