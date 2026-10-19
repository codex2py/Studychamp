
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
  if (typeof session.durationSecconds === "number") {
    return session.durationSecconds;
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
          durationSecconds: getSessionDuration(session),
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

        
      </div>
    </div>
  )
}

export default StudySession