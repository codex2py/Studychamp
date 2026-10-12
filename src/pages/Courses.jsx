import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  CircleHelp,
  GraduationCap,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { getStorageItem, setStorageItem, STORAGE_KEYS } from "../utils/storage";

const COURSE_COLORS = [
  {
    name: "blue",
    background: "bg-primary-light",
    text: "text-primary",
    bar: "bg-primary",
  },
  {
    name: "orange",
    background: "bg-accent-light",
    text: "text-accent",
    bar: "bg-accent",
  },
  {
    name: "green",
    background: "bg-success-light",
    text: "text-success",
    bar: "bg-success",
  },
];

function getCourseColor(index) {
  return COURSE_COLORS[index % COURSE_COLORS.length];
}

function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

function Courses() {
  const [courses, setCourses] = useState(() => {
    const savedCourses = getStorageItem(STORAGE_KEYS.courses, []);
    return Array.isArray(savedCourses) ? savedCourses : [];
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [formError, setFormError] = useState("");
  const [courseToDelete, setCourseToDelete] = useState(null);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.courses, courses);
  }, [courses]);

  const filteredCourses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const results = courses.filter((course) => {
      const name = (course.name ?? "").toLowerCase();
      const code = (course.code ?? "").toLowerCase();
      const description = (course.description ?? "").toLowerCase();

      return (
        name.includes(query) ||
        code.includes(query) ||
        description.includes(query)
      );
    });

    if (sortBy === "name") {
      return [...results].sort((a, b) =>
        (a.name ?? "").localeCompare(b.name ?? ""),
      );
    }

    if (sortBy === "progress") {
      return [...results].sort((a, b) => (b.progress ?? 0) - (a.progress ?? 0));
    }

    return [...results].sort(
      (a, b) => new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0),
    );
  }, [courses, searchQuery, sortBy]);

  const totalTopics = courses.reduce(
    (total, course) =>
      total + (Array.isArray(course.topics) ? course.topics.length : 0),
    0,
  );

  const completedTopics = courses.reduce(
    (total, course) =>
      total +
      (Array.isArray(course.topics)
        ? course.topics.filter((topic) => topic.completed).length
        : 0),
    0,
  );

  function openModal() {
    setCourseName("");
    setCourseCode("");
    setCourseDescription("");
    setFormError("");
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setFormError("");
  }

  function handleAddCourse(event) {
    event.preventDefault();

    const name = courseName.trim();
    const code = courseCode.trim();
    const description = courseDescription.trim();

    if (!name) {
      setFormError("Please enter a course name.");
      return;
    }

    const duplicate = courses.some(
      (course) => course.name?.toLowerCase() === name.toLowerCase(),
    );

    if (duplicate) {
      setFormError("This course already exists. Try a different name.");
      return;
    }

    const newCourse = {
      id: crypto.randomUUID(),
      name,
      code,
      description,
      topics: [],
      createdAt: new Date().toISOString(),
    };

    setCourses((previousCourses) => [...previousCourses, newCourse]);
    closeModal();
  }

  function handleDeleteCourse() {
    if (!courseToDelete) return;

    setCourses((previousCourses) =>
      previousCourses.filter((course) => course.id !== courseToDelete.id),
    );

    setCourseToDelete(null);
  }

  return (
    <div className="min-h-screen bg-background px-5 py-7 text-text sm:px-8 sm:py-9 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-text-secondary">
              <Link to="/" className="transition hover:text-primary">
                Dashboard
              </Link>
              <span>/</span>
              <span className="font-medium text-text">My Courses</span>
            </div>

            <h1 className="font-serif text-3xl font-semibold tracking-tight text-text sm:text-4xl">
              My Courses
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-text-secondary sm:text-base">
              Keep your subjects organized and make steady progress, one topic
              at a time.
            </p>
          </div>

          <button
            type="button"
            onClick={openModal}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <Plus size={18} />
            Add course
          </button>
        </header>
        <section
          aria-label="Course overview"
          className="grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          <div className="rounded-2xl border border-border bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-text-secondary">
                Total courses
              </p>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary">
                <BookOpen size={20} />
              </span>
            </div>
            <p className="mt-4 text-3xl font-semibold tracking-tight text-text">
              {courses.length}
            </p>
            <p className="mt-1 text-xs text-text-muted">
              {courses.length === 1 ? 'Subject added' : 'Subjects added'}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-text-secondary">
                Total topics
              </p>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-light text-accent">
                <GraduationCap size={21} />
              </span>
            </div>
            <p className="mt-4 text-3xl font-semibold tracking-tight text-text">
              {totalTopics}
            </p>
            <p className="mt-1 text-xs text-text-muted">
              Across all your courses
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-text-secondary">
                Topics completed
              </p>
              <span className="flex-h-10 w-10 items-center justify-center rounded-xl bg-success-light text-success">
                <Check  size={20} />
              </span>
            </div>
            <p className="mt-4 text-3xl font-semibold tracking-tight text-text">
              {completedTopics}
            </p>
            <p className="mt-1 text-xs text-text-muted">
              {totalTopics > 0
                ? `${Math.round((completedTopics / totalTopics) * 100)}% of all topics`
                : 'Your progress starts here'}
            </p>
          </div>
        </section>
        
      </div>
    </div>
  );
}

export default Courses;
