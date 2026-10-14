import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
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
              {courses.length === 1 ? "Subject added" : "Subjects added"}
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
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-light text-success">
                <Check size={20} />
              </span>
            </div>
            <p className="mt-4 text-3xl font-semibold tracking-tight text-text">
              {completedTopics}
            </p>
            <p className="mt-1 text-xs text-text-muted">
              {totalTopics > 0
                ? `${Math.round((completedTopics / totalTopics) * 100)}% of all topics`
                : "Your progress starts here"}
            </p>
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-text">Your subjects</h2>
              <p className="mt-1 text-sm text-text-secondary">
                {courses.length === 0
                  ? "Add your first course to get started."
                  : `${courses.length} ${courses.length === 1 ? "course" : "courses"} in your library`}
              </p>
            </div>

            {courses.length > 0 && (
              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="relative block sm:w-64">
                  <Search
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
                  />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search courses..."
                    aria-label="Search courses"
                    className="w-full rounded-xl border border-border bg-white py-3 pl-10 pr-4 text-sm text-text outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </label>

                <label className="relative block">
                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                    aria-label="Sort courses"
                    className="w-full appearance-none rounded-xl border border-border bg-white py-3 pl-4 pr-10 text-sm font-medium text-text outline-none transition focus:border-primary sm:w-44"
                  >
                    <option value="newest">Recently added</option>
                    <option value="name">Course name</option>
                    <option value="progress">Highest progress</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted"
                  />
                </label>
              </div>
            )}
          </div>

          {courses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border-strong bg-white px-6 py-14 text-center sm:py-20">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light text-primary">
                <BookOpen size={30} strokeWidth={1.7} />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-text">
                Your learning journey starts here
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-secondary">
                Create your first course to organize your subjects. You can
                start with Biochemistry, Embryology, or whatever you are
                currently studying.
              </p>
              <button
                type="button"
                onClick={openModal}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
              >
                <Plus size={18} />
                Create your first course
              </button>
              <p className="mt-4 text-xs text-text-muted">
                Your courses are saved in this browser.
              </p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="rounded-2xl border border-border bg-white px-6 py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-muted text-text-secondary">
                <Search size={24} />
              </div>
              <h3 className="mt-4 font-semibold text-text">No courses found</h3>
              <p className="mt-2 text-sm text-text-secondary">
                Try another search term or clear your search
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-4 text-sm font-semibold text-primary hover:text-primary-hover"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredCourses.map((course) => {
                const originalIndex = courses.findIndex(
                  (item) => item.id === course.id,
                );
                const color = getCourseColor(
                  originalIndex < 0 ? 0 : originalIndex,
                );
                const topics = Array.isArray(course.topics)
                  ? course.topics
                  : [];
                const finished = topics.filter(
                  (topic) => topic.completed,
                ).length;
                const progress =
                  topics.length > 0
                    ? Math.round((finished / topics.length) * 100)
                    : Number(course.progress) || 0;

                return (
                  <article
                    key={course.id}
                    className="group flex min-w-0 flex-col rounded-2xl border border-border bg-white p-5 transition duration-200 hover:translate-y-0.5 hover:border-border-strong hover:shadow-md sm:p-6"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${color.background} ${color.text}`}
                      >
                        <BookOpen size={23} strokeWidth={1.8} />
                      </div>
                      <button
                        type="button"
                        onClick={() => setCourseToDelete(course)}
                        aria-label={`Delete ${course.name}`}
                        title="Delete course"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-text-muted transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-200"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>

                    <div className="mt-5 min-w-0 flex-1">
                      {course.code && (
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-text-muted">
                          {course.code}
                        </p>
                      )}

                      <Link
                        to={"/courses/${course.id}"}
                        className="wrap-break-word text-lg font-semibold text-text transition hover:text-primary"
                      >
                        {course.name}
                      </Link>
                      <p className="mt-2 min-h-10 text-sm leading-5 text-text-secondary">
                        {course.description ||
                          "Build your understanding, one topic at a time."}
                      </p>
                    </div>
                    <div className="mt-6">
                      <div className="mb-2 flex items-center justify-between gap-3 text-xs">
                        <span className="text-text-secondary">
                          {topics.length}{" "}
                          {topics.length === 1 ? "topic" : "topics"}
                        </span>
                        <span className="font-semibold text-text">
                          {progress}% complete
                        </span>
                      </div>
                      <div
                        className="h-2 overflow-hidden rounded-full bg-surface-muted"
                        role="progressbar"
                        aria-label={`${course.name} progress`}
                        aria-valuenow={progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${color.bar}`}
                          style={{
                            width: `${Math.min(100, Math.max(0, progress))}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                      <span className="text-xs text-text-muted">
                        {topics.length > 0
                          ? `${finished} of ${topics.length} completed`
                          : "Ready to organize"}
                      </span>
                      <Link
                        to={`/courses/${course.id}`}
                        className={`inline-flex items-center gap-1 text-sm font-semibold transition hover:underline ${color.text}`}
                      >
                        {progress === 100 && topics.length > 0
                         ? 'Completed'
                        :  topics.length === 0
                          ? 'Get started'
                          : 'In progress'}
                          <ArrowUpRight size={15} />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="flex flex-col gap-4 rounded-2xl border border-border bg-surface-muted/60 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-primary">
              <CircleHelp size={21} />
            </span>
            <div>
              <h3 className="font-semibold text-text">
                A little organization goes a long way
              </h3>
              <p className="mt-1 text-sm leading-6 text-text-secondary">
                Break large subjects into smaller topics to make studying easier
                to manage.
              </p>
            </div>
          </div>
          <Link
            to="/"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-primary transition hover:text-primary-hover"
          >
            Back to dashboard
            <ArrowRight size={16} />
          </Link>
        </section>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-text/40 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-course-title"
            className="my-auto w-full max-w-lg rounded-2xl border border-border bg-white p-6 shadow-xl sm:py-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary">
                  <GraduationCap size={23} />
                </span>
                <h2
                  id="add-course-title"
                  className="mt-4 text-xl font-semibold text-text"
                >
                  Add a new course
                </h2>
                <p className="mt-1 text-sm leading-6 text-text-secondary">
                  Set up a subject you want to study
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Close dialog"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-text-secondary transition hover:bg-surface-muted hover:text-text"
              >
                <X size={19} />
              </button>
            </div>
            <form onSubmit={handleAddCourse} className="mt-7 space-y-5">
              <div>
                <label
                  htmlFor="course-name"
                  className="mb-2 block text-sm font-medium text-text"
                >
                  Course name <span className="text-accent">*</span>
                </label>
                <input
                  id="course-name"
                  type="text"
                  autoFocus
                  required
                  maxLength={80}
                  value={courseName}
                  onChange={(event) => {
                    setCourseName(event.target.value);
                    setFormError("");
                  }}
                  placeholder="e.g. Biochemistry"
                  className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-text outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>
              <div>
                <label
                  htmlFor="course-code"
                  className="mb-2 block text-sm font-medium text-text"
                >
                  Course code{" "}
                  <span className="text-text-muted">(optional)</span>
                </label>
                <input
                  id="course-code"
                  type="text"
                  maxLength={30}
                  value={courseCode}
                  onChange={(event) => setCourseCode(event.target.value)}
                  placeholder="e.g BCH 301"
                  className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-text outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>
              <div>
                <label
                  htmlFor="course-description"
                  className="mb-2 block text-sm font-medium text-text"
                >
                  Description{" "}
                  <span className="text-text-muted">(optional)</span>
                </label>
                <textarea
                  id="course-description"
                  rows={3}
                  maxLength={200}
                  value={courseDescription}
                  onChange={(event) => setCourseDescription(event.target.value)}
                  placeholder="What are you studying in this course"
                  className="w-full resize-y rounded-xl border border-border bg-white px-4 py-3 text-sm leading-6 text-text outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>
              {formError && (
                <p role="alert" className="text-sm font-medium text-red-600">
                  {formError}
                </p>
              )}
              <div className="flex flex-col reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-xl border border-border px-5 py-3 text-sm font-semibold text-text-secondary transition hover:bg-surface-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
                  >
                    <Plus size={17} />
                    Create course
                  </button>
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {courseToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-text/40 p-4 backdrop-blur-sm">
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-course-title"
            className="w-full max-w-sm rounded-2xl border border-border bg-white p-6 shadow-xl"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-50">
              <Trash2 size={21} />
            </span>
            <h2
              id="delete-course-title"
              className="mt-4 text-lg font-semibold text-text"
            >
              Delete this course?
            </h2>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-text">
                {courseToDelete.name}
              </span>
              ? This removes the course and its stored topics from this browser.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setCourseToDelete(null)}
                className="flex-1 rounded-xl border border-border px-4 py-3 text-sm font-semibold text-text-secondary transition hover:bg-surface-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteCourse}
                className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default Courses;
