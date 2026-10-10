import { useEffect, useState } from "react";
import {
     Clock3,
  Target,
  Flame,
  Play,
  Pause,
  Check,
  BookOpen,
  ChevronDown,
  TrendingUp,
  Plus,
  Coffee,
  Sparkles,
  Timer,
  AlertCircle,
  RotateCcw,
} from 'lucide-react'

const SESSION_LENGTH = 25 * 60

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function Dashboard() {
    const [elapsedSeconds, setElapsedSeconds] = useState(0)
    const [savedElapsed, setSavedElapsed] = useState(0)
    const [startedAt, setStartedAt] = useState(null)
    const [isRunning, setIsRunning] = useState(false)
    const [distractions, setDistractions] = useState(0)
    const [selectedCourse, setSelectedCourse] = useState('')
    const [selectedTopic, setSelectedTopic] = useState('')
    const [sessionMessage, setSessionMessage] = useState('')

    const today = new Date()
    const dateLabel = new Intl.DateTimeFormat('en', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    }).format(today)

    const hour = today.getHours()
    const greeting =
        hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

    useEffect(() => {
        if (!isRunning || startedAt === null) return

        const interval = setInterval(() => {
            const total = 
                savedElapsed + Math.floor((Date.now() -startedAt) / 1000)

            setElapsedSeconds(total)

            if (total >= SESSION_LENGTH) {
                setElapsedSeconds(SESSION_LENGTH)
                setSavedElapsed(SESSION_LENGTH)
                setIsRunning(false)
                setStartedAt(null)
                setSessionMessage('Your 25-minute focus timer is complete!')
            }
        }, 250)

        return () => clearInterval(interval)
    }, [isRunning, startedAt, savedElapsed])
    
    const remainingSeconds = Math.max(SESSION_LENGTH - elapsedSeconds, 0)
    const progress = Math.min((elapsedSeconds / SESSION_LENGTH) * 100, 100)
}