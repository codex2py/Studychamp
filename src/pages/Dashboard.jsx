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

  function pauseTimer() {
    if (startedAt !== null) {
      const total = savedElapsed + Math.floor((Date.now() - startedAt) / 1000);

      setElapsedSeconds(Math.min(total, SESSION_LENGTH));
      setSavedElapsed(Math.min(total, SESSION_LENGTH));
    }

    setStartedAt(null);
    setIsRunning(false);
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
      note: "Set your goal in Settings",
      icon: Target,
      iconStyle: "bg-accent-light text-accent",
    },
    {
      label: "Study streak",
      value: "—",
      note: "Your streak starts with saved sessions",
      icon: Flame,
      iconStyle: "bg-success-light text-success",
    },
  ];

    return (
      <main className="min-h-screen bg-background px-4 py-6 text-text sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-[1500px]">
          <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="mb-2 text-sm font-medium text-text-secondary">
                {dateLabel}
              </p>

              <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
                {greeting}, let's focus.
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-text-secondary">
                Small steps, focused sessions, and a little progress everyday.
              </p>
            </div>

            <button
              onClick={handleStartStudying}
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:self-auto"
            >
              <Play size={17} fill="currentColor" />
              Start studying
            </button>
          </header>

          <section
            aria-label="Study overview"
            className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
          >
            {stats.map(({ label, value, note, icon: Icon, iconStyle }) => (
                <article 
                    key={label}
                    className="rounded-2xl border border-border bg-surface p-5 shadow-sm"
                >
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="text-sm font-medium text-text-secondary">
                                {label}
                            </p>
                            <p className="mt-3 text-3xl font-bold tracking-tight">
                                {value}
                            </p>
                        </div>
                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconStyle}`}>
                            <Icon size={21} />
                        </div>
                    </div>

                    <p className="mt-4 text-xs leading-5 text-text-seconday">
                        {note}
                    </p>
                </article>
            ))}
          </section>

          
        </div>
      </main>
    );
  }
