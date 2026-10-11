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
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconStyle}`}
                >
                  <Icon size={21} />
                </div>
              </div>

              <p className="mt-4 text-xs leading-5 text-text-seconday">
                {note}
              </p>
            </article>
          ))}
        </section>

        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,1fr)]">
          <div className="min-w-0 space-y-6">
            <section
              id="focus-space"
              className="scroll-mt-6 overflow-hidden rounded-2-xl border border-border bg-surface shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-5 py-5 sm:px-6">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-light text-primary">
                      <Timer size={19} />
                    </div>

                    <h2 className="text-lg font-bold">Your focus space</h2>
                  </div>

                  <p className="mt-2 text-sm text-text-secondary">
                    One thing at a time. You've got this.
                  </p>
                </div>

                {isRunning && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-success-light px-3 py-1.5 text-xs font-semibold text-success">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
                    Session in progress
                  </span>
                )}
              </div>

              <div className="p-5 sm:p-6">
                <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold text-text-secondary">
                      STUDYING
                    </span>

                    <div className="relative">
                      <BookOpen
                        size={17}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
                      />

                      <select
                        value={selectedCourse}
                        onChange={(event) => {
                          setSelectedCourse(event.target.value);
                          setSelectedTopic("");
                        }}
                        className="w-full appearance-none rounded-xl border border-border bg-background py-3 pl-10 pr-9 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                      >
                        <option value="">Choose a course</option>
                      </select>

                      <ChevronDown
                        size={16}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"
                      />
                    </div>
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold text-text-secondary">
                      TOPIC
                    </span>
                    <div className="relative">
                      <select
                        value={selectedTopic}
                        onChange={(event) =>
                          setSelectedTopic(event.target.value)
                        }
                        disabled={!selectedCourse}
                        className="w-full appearance-none rounded-xl border border-border bg-background px-3 py-3 pr-9 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <option value="">
                          {selectedCourse
                            ? "Choose a topic"
                            : "Choose a course first"}
                        </option>
                      </select>

                      <ChevronDown
                        size={16}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"
                      />
                    </div>
                  </label>
                </div>

                <div className="flex flex-col items-center rounded-2xl bg-background px-4 py-7 sm:py-9">
                  <div
                    className="relative flex h-52 w-52 items-center justify-center rounded-full sm:h-60 sm:w-60"
                    style={{
                      background: `conic-gradient(#3F72E8 ${progress}%, #DFE1D9 ${progress}%)`,
                    }}
                    role="timer"
                    aria-label={`${formatTime(remainingSeconds)}
                    remaining`}
                  >
                    <div className="flex h-[calc(100%-12px)] w-[calc(100%-12px)] flex-col items-center justify-center rounded-full bg-surface">
                      <span className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-text-secondary">
                        {isRunning
                          ? "Stay focused"
                          : remainingSeconds === 0
                            ? "Completed"
                            : "Focus session"}
                      </span>

                      <span className="font-serif text-5xl font-semibold tabular-nums tracking-tight sm:text-6xl">
                        {formatTime(remainingSeconds)}
                      </span>
                      <span className="mt-3 text-xs text-text-secondary">
                        {formatTime(elapsedSeconds)} focused
                      </span>
                    </div>
                  </div>

                  <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                    {isRunning ? (
                      <button
                        onClick={startTimer}
                        disabled={remainingSeconds === 0}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Play size={17} fill="currentColor" />
                        {elapsedSeconds > 0 ? "Resume" : "Start focus"}
                      </button>
                    ) : (
                      <button
                        onClick={pauseTimer}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
                      >
                        <Pause size={17} fill="currentColor" />
                        Pause
                      </button>
                    )}
                    <button
                      onClick={finishTimer}
                      disabled={elapsedSeconds === 0 && !isRunning}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-5 py-3 text-sm font-semibold text-text transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <RotateCcw size={16} />
                      Reset
                    </button>
                  </div>

                  <p className="mt-4 text-center text-xs text-text-secondary">
                    25-minute focus session
                  </p>
                </div>

                {sessionMessage && (
                  <p
                    role="status"
                    className="mt-4 rounded-xl bg-primary-light p-3 text-sm text-text"
                  >
                    {sessionMessage}
                  </p>
                )}

                <div className="mt-5 flex flex-col justify-between gap-3 rounded-xl border border-border p-4 sm:flex-row sm:items-center">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-light text-accent">
                      <AlertCircle size={19} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Got distracted?</p>
                      <p className="mt-1 text-xs leading-5 text-text-secondary">
                        Notice it, log it, and get back on track.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={logDistraction}
                    className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-lg border border-border px-3 py-2 text-xs font-semibold transition hover:bg-surface-muted sm:self-auto"
                  >
                    <Plus size={15} />
                    Log distraction ({distractions})
                  </button>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold">Your courses</h2>
                  <p className="mt-1 text-sm text-text-secondary">
                    Keep track of what you're learning.
                  </p>
                </div>
                <a
                  href="/courses"
                  className="shrink-0 text-sm font-semibold text-primary transition hover:text-primary-hover"
                >
                  View all
                </a>
              </div>
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border-strong px-5 py-9 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-primary">
                  <BookOpen size={23} />
                </div>
                <h3 className="text-sm font-semibold">
                  Your learning journey starts here
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-text-secondary">
                  Add your courses and topics to see your learning progress
                  here.
                </p>

                <a
                  href="/courses"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover"
                >
                  <Plus size={16} />
                  Explore courses
                </a>
              </div>
            </section>
          </div>

          <aside className="min-w-0 space-y-6">
            <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold">Your week so far</h2>
                  <p className="mt-1 text-sm text-text-secondary">
                    Your daily focus time
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-light text-success">
                  <TrendingUp size={20} />
                </div>
              </div>
              <div className="mt-7 flex-h-36 items-end justify-between gap-2">
                {WEEKDAYS.map((day) => (
                  <div
                    key={day}
                    className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                  >
                    <div className="flex h-full w-full items-end justify-center">
                      <div className="h-1 w-full max-w-8 rounded-t-md bg-surface-muted" />
                    </div>
                    <span className="text-[11px] text-text-secondary">
                      {day}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-xl bg-background p-4 text-center">
                <p className="text-sm font-semibold">Your chart starts here</p>
                <p className="mt-1 text-xs leading-5 text-text-secondary">
                  Complete and save study sessions to see your weekly totals.
                </p>
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-accent-light p-5 sm:p-6">
              <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full border-[18] border-white/30" />
              <div className="pointer-events-none absolute -bottom-12 -left-8 h-28 w-28 rounded-full border-[16] border-white/30" />
              <div className="relative flex items-start justify-between gap-3">
                <div className="max-w-[230]">
                  <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-xs font-semibold text-text">
                    <Sparkles size={14} className="text-accent" />A little
                    reminder
                  </div>
                  <h2 className="font-serif text-2xl font-semibold leading-tight text-text">
                    You've got this.
                  </h2>
                  <p>
                    You don't have to finish everything today. Just give the 25
                    minutes your best.
                  </p>
                </div>
                <ChampMascot />
              </div>
              <div className="relative mt-5 flex items-center gap-2 text-xs font-semibold text-text">
                <Coffee size={16} className="text-accent" />
                Focus a little. Rest a little. Repeat.
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
                  <Target size={19} />
                </div>
                <div>
                  <h2 className="text-sm font-bold">Today's tiny goal</h2>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    Pick one topic, put your phone away, and focus till the
                    timer ends. Starting is already progress.
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>

        <footer className="pb-4 pt-8 text-center text-xs text-text-muted">
          One focused session at a time.
        </footer>
      </div>
    </main>
  );
}

function ChampMascot() {
  return (
    <svg
      viewBox="0 0 120 130"
      role="img"
      aria-label="Champ, the StudyChamp mascot"
      className="h-28 w-24 shrink-0 sm:h-32 sm:w-28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M37 108 L34 119 Q33 124 42 124 L52 124 L54 109" fill="#3F72E8" />
      <path
        d="M72 109 L75 119 Q76 124 84 124 L94 124 Q99 122 95 117 L87 106"
        fill="#3F72E8"
      />
      <path
        d="M31 63 Q25 78 29 99 Q31 112 45 113 L79 113 Q94 111 95 97 L90 63 Z"
        fill="#E98645"
      />
      <path d="M31 73 L20 91 Q17 97 23 100 Q28 102 32 95 L41 81" fill="#F5B77F" />
      <path d="M90 73 L101 88 Q105 94 100 98 Q95 101 91 94 L82 81" fill="#F5B77F" />
      <path
        d="M29 38 Q29 20 47 17 L75 17 Q93 20 93 39 L91 65 Q88 81 61 83 Q34 81 31 65 Z"
        fill="#FFD1A6"
      />
       <circle cx="29" cy="49" r="7" fill="#FFD1A6" />
      <circle cx="93" cy="49" r="7" fill="#FFD1A6" />

      <ellipse cx="47" cy="49" rx="3.3" ry="4.5" fill="#20242D" />
      <ellipse cx="74" cy="49" rx="3.3" ry="4.5" fill="#20242D" />
      <circle cx="48" cy="48" r="1.2" fill="white" />
      <circle cx="75" cy="48" r="1.2" fill="white" />

      <path
        d="M49 62 Q61 73 73 62"
        stroke="#20242D"
        strokeWidth="2.8"
        strokeLinecap="round"
      />

      <path d="M19 27 L59 8 L103 27 L61 45 Z" fill="#3F72E8" />
      <path d="M34 33 L35 43 Q59 58 84 42 L85 32 L61 43 Z" fill="#2F60D3" />
      <path d="M102 27 L102 43" stroke="#E98645" strokeWidth="3" strokeLinecap="round" />
      <circle cx="102" cy="45" r="3" fill="#E98645" />

      <path d="M49 86 L61 97 L73 86" stroke="#FFF4E8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
