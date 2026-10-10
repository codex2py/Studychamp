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
} from "lucide-react";

const SESSION_LENGTH = 25 * 60;

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function Dashboard() {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [savedElapsed, setSavedElapsed] = useState(0);
  const [startedAt, setStartedAt] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [distractions, setDistractions] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [sessionMessage, setSessionMessage] = useState("");

  const today = new Date();
  const dateLabel = new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(today);

  const hour = today.getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  useEffect(() => {
    if (!isRunning || startedAt === null) return;

    const interval = setInterval(() => {
      const total = savedElapsed + Math.floor((Date.now() - startedAt) / 1000);

      setElapsedSeconds(total);

      if (total >= SESSION_LENGTH) {
        setElapsedSeconds(SESSION_LENGTH);
        setSavedElapsed(SESSION_LENGTH);
        setIsRunning(false);
        setStartedAt(null);
        setSessionMessage("Your 25-minute focus timer is complete!");
      }
    }, 250);

    return () => clearInterval(interval);
  }, [isRunning, startedAt, savedElapsed]);

  const remainingSeconds = Math.max(SESSION_LENGTH - elapsedSeconds, 0);
  const progress = Math.min((elapsedSeconds / SESSION_LENGTH) * 100, 100);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
  };

  function startTimer() {
    if (remainingSeconds <= 0) return;

    setSessionMessage("");
    setStartedAt(Date.now());
    setIsRunning(true);
  }

  function pauseTime() {
    if (startedAt !== null) {
      const total = savedElapsed + Math.floor((Date.now() - startedAt) / 1000);

      setElapsedSeconds(Math.min(total, SESSION_LENGTH));
      setSavedElapsed(Math.min(total, SESSION_LENGTH));
    }

    setStartedAt(null);
    setIsRunning(false);

    function finishTimer() {
      setIsRunning(false);
      setStartedAt(null);
    }

    function finishTimer() {
      setIsRunning(false);
      setStartedAt(null);
      setSavedElapsed(0);
      setElapsedSeconds(0);
      setDistractions(0);
      setSessionMessage(
        "Timer reset. Session history will be saved when storage is connected.",
      );
    }

    function logDistraction() {
      setDistractions((count) => count + 1);
    }

    function logDistraction() {
      setDistractions((count) => count + 1);
    }

    function handleStartStudying() {
      document.getElementById("focus-space")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }

    const stats = [
      {
        label: "Focus time today",
        value: "—",
        note: "Connect session history to track this",
        icon: Clock3,
        iconStyle: "bg-primary-light text-primary",
      },
      {
        label: "Daily goal",
        value: "—",
        note: 'Set your goal in Settings',
        icon: Target,
        iconStyle: 'bg-accent-light text-accent',
      },
      {
        label: 'Study streak',
         value: '—',
         note: 'Your streak starts with saved sessions',
         icon: Flame,
         iconStyle: 'bg-success-light text-success',
      },
    ];

    return (
        
    )
  }
}
