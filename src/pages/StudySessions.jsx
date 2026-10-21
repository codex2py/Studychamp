
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Filter,
  History,
  Search,
  Target,
  Trash2,
  X,
} from "lucide-react";
import {
  getStorageItem,
  setStorageItem,
  STORAGE_KEYS,
} from "../utils/storage";


function formatDuration(seconds) {
  const totalSeconds = Math.max(0, Math.floor(Number(seconds) || 0));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;

  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m`;
  return `${remainingSeconds}s`;
}

function getSessionDuration(session) {
  if (typeof session.durationSeconds === "number") {
    return session.durationSeconds;
  } 

  if (typeof session.elapsedSeconds === "number") {
    return session.elapsedSeconds;
  }

  if (typeof session.elapsedTime === "number") {
    return session.elapsedTime;
  } 

  if (typeof session.duration === "number") {
    return session.duration;
  }

  return 0;
}

function getSessionDate(session) {
  const value = 
    session.completedAt ||
    session.endedAt ||
    session.date ||
    session.startedAt ||
    session.createdAt;

  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatSessionDate(date) {
  if (!date) return "Date unavailable";

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatSessionTime(date) {
  if (!date) return "";

  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function getDistractionCount(session) {
  if (Array.isArray(session.distractions)) {
    return session.distractions.length;
  }

  return Number(session.distractionCount) || 0;
}

function StudySession() {
  const [sessions, setSessions] = useState(() => {
    const saved = getStorageItem(STORAGE_KEYS.sessions, []);
    return Array.isArray(saved) ? saved : [];
  });

  const [courses] = useState(() => {
    const saved = getStorageItem(STORAGE_KEYS.courses, []);
    return Array.isArray(saved) ? saved : [];
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [sessionToDelete, setSessionToDelete] = useState(null);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.sessions, sessions);
  }, [sessions]);

  const enrichedSessions = useMemo(() => {
    return sessions.map((session, index) => {
      const course = courses.find(
        (item) => 
          String(item.id) === String(session.courseId) &&
          session.courseId != null,
      );

      const courseName =
        session.courseName ||
        session.course ||
        course?.name ||
        "Independent study";

      const topic = 
        session.topicName ||
        session.topic ||
        course?.topics?.find(
          (item) => String(item.id) === String(session.topicId),
        )?.name ||
          "";

        const date = getSessionDate(session);

        const isCompleted = 
          session.status === "completed" ||
          session.status === "finished" || 
          session.completed === true ||
          Boolean(session.completedAt || session.endedAt);

        
        return {
          ...session,
          displayId: session.id ?? `session-${index}`,
          courseName,
          topicName: topic,
          date,
          durationSeconds: getSessionDuration(session),
          distractionTotal: getDistractionCount(session),
          isCompleted,
        };
    });
  }, [sessions, courses]);

  const filteredSessions = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return [...enrichedSessions]
      .filter((session) => {
        const matchesSearch =
          !query ||
          session.courseName.toLowerCase().includes(query) ||
          session.topicName.toLowerCase().includes(query);

        const matchesFilter = 
          filter === "all" ||
          (filter === "completed" && session.isCompleted) ||
          (filter === "unfinished" && !session.isCompleted);

        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        const firstDate = a.date?.getTime() || 0;
        const secondDate = b.date?.getTime() || 0;
        return secondDate - firstDate;
      });
  }, [enrichedSessions, searchTerm, filter]);

  const totalSeconds = enrichedSessions.reduce(
    (total, session) => total + session.durationSeconds,
    0,
  );

  const completedSessions = enrichedSessions.filter(
    (session) => session.isCompleted,
  );

  const completedSeconds = completedSessions.reduce(
    (total, session) => total + session.durationSeconds,
    0,
  );

  const uniqueStudyDays = new Set(
    completedSessions
      .map((session) => session.date?.toDateString())
      .filter(Boolean),
  ).size;
  
  function handleDeleteSession() {
    if (!sessionToDelete) return;

    setSessions((previous) => 
      previous.filter(
        (session, index) =>
            String(session.id ?? `session-${index}`) !==
            String(sessionToDelete),
      ),
    );

    setSessionToDelete(null);
  }

  return (
    <div className="min-h-screen bg-background px-4 py-6 text-text sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold text-primary">
              YOUR STUDY JOURNEY
            </p>
            <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
              Study Sessions
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-text-secondary sm:text-base">
              Look back at your study sessions and see how you're spending your focus time.
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
          >
          <Clock3 size={18} />
          Start studying
          </Link>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <SummaryCard 
              icon={<Clock3 size={21} />}
              label="Total focus time"
              value={formatDuration(totalSeconds)}
              description="Across all saved sessions"
              iconStyle="bg-primary-light text-primary"
            />

            <SummaryCard 
              icon={<CheckCircle2 size={21} />}
              label="Completed sessions"
              value={completedSessions.length}
              description="Sessions marked as finished"
              iconStyle="bg-success-light text-success"
            />

            <SummaryCard 
              icon={<CalendarDays size={21} />}
              label="Study days"
              value={uniqueStudyDays}
              description="Different days with completed sessions"
              iconStyle="bg-accent-light text-accent"
            />
        </section>

        <section className="overflow-hidden rounded-2xl border border-border bg-white">
          <div className="border-b border-border p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <History size={21} className="text-primary" />
                  <h2 className="text-lg font-semibold">Session history</h2>
                </div>

                <p className="mt-1 text-sm text-text-secondary">
                  {filteredSessions.length}{""}
                  {filteredSessions.length === 1 ? "session" : "sessions"}{" "}
                  found
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative min-w-0 sm:w-64">
                  <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />

                  <input 
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search courses or topics..."
                    aria-label="Search sessions"
                    className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-3 text-sm outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                <div>
                  <Filter 
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
                    />

                    <select
                      value={filter}
                      onChange={(event) => setFilter(event.target.value)}
                      aria-label="Filter sessions"
                      className="w-full appearance-none rounded-xl border border-border bg-white py-2.5 pl-9 pr-8 text-sm outline-none transition focus:border-primary sm:w-auto"
                    >
                      <option value="all">All sessions</option>
                      <option value="completed">Completed</option>
                      <option value="unfinished">Unfinished</option>
                    </select>
                </div>
              </div>
            </div>
          </div>

          {filteredSessions.length > 0 ? (
            <div className="divide-y divide-border">
             {filteredSessions.map((session) => (
               <article
                key={session.displayId}
                className="flex flex-col gap-4 p-5 transition hover:bg-background/60 sm:p-6 md:flex-row md:items-center"
               >
                <div className="flex min-w-0 flex-1 items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
                  <BookOpen size={21} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="wrap-break-word font-semibold text-text">
                      {session.courseName}
                    </h3>
                    <p className="mt-1 wrap-break-word text-sm text-text-secondary">
                      {session.topicName || "General study session"}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-text-muted">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays size={14} />
                        {formatSessionDate(session.date)}
                      </span>
                      {session.date && (
                        <span className="inline-flex items-center gap-1.5">
                          <Clock3 size={14} />
                          {formatSessionTime(session.date)}
                        </span>
                      )}

                      {session.distractionTotal > 0 && (
                        <span>
                          {session.distractionTotal}{" "}
                          {session.distractionTotal === 1
                            ? "distraction"
                            : "distractions"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-border pt-4 md:border-0 md:pt-0">
                  <div>
                    <p className="text-lg font-semibold tabular-nums">
                      {formatDuration(session.durationSeconds)}
                    </p>
                    <span
                      className={`mt-1 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                        session.isCompleted
                          ? "bg-success-light text-success"
                          : "bg-accent-light text-[#A95826]"
                      }`}
                    >
                      {session.isCompleted ? "Completed" : "Unfinished"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSessionToDelete(session.displayId)}
                    aria-label={`Delete session for ${session.courseName}`}
                    title="Delete session"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-text-muted transition hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </article>
             ))}
            </div>
          ) : (
            <div className="flex flex-col items-center px-6 py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light text-primary">
                {searchTerm || filter !== "all" ? (
                  <Search size={28} />
                ) : (
                  <Target size={28} />
                )}
              </div>
              <h3 className="mt-5 text-lg font-semibold">
                {searchTerm || filter !== "all"
                  ? "No matching sessions"
                  : "Your study journey starts here"}
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-text-secondary">
                {searchTerm || filter !== "all"
                  ? "Try a different search term or change the filter."
                  : "Once you finish and save study sessions, you'll find your history and focus time here."}
              </p>

              {searchTerm || filter !== "all" ? (
                <button 
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setFilter("all");
                  }}
                  className="mt-5 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold transition hover:bg-background"
                >
                  Clear filters
                </button>
              ) : (
                <Link
                  to="/"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
                >
                  <Clock3 size={17} />
                  Start a session
                </Link>
              )}
            </div>
          )}
        </section>

        <p className="text-center text-xs leading-5 text-text-muted">
          Your session history is stored locally in this browser.
        </p>
      </div>

      {sessionToDelete !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSessionToDelete(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-session-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <Trash2 size={21} />
              </div>

              <button 
                type="button"
                onClick={() => setSessionToDelete(null)}
                aria-label="Close confirmation"
                className="rounded-lg p-2 text-text-muted transition hover:bg-background"
              >
                <X size={18} />
              </button>
            </div>

            <h2 
              id="delete-session-title"
              className="mt-4 text-lg font-semibold"
            >
              Delete this session?
            </h2>

            <p className="mt-2 text-sm leading-6 text-text-secondary">
              This will permanently remove the session from your saved history in this browser.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button 
                type="button"
                onClick={() => setSessionToDelete(null)}
                className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold transition hover:bg-background"
              >
                Cancel
              </button>
              <button
              type="button"
              onClick={handleDeleteSession}
              className="rounded-2xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Delete session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudySession