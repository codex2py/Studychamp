import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Check,
  CircleCheck,
  Clock3,
  Copy,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { getStorageItem, setStorageItem, STORAGE_KEYS } from "../utils/storage";

function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [courses, setCourses] = useState(() => {
    const saved = getStorageItem(STORAGE_KEYS.courses, []);
    return Array.isArray(saved) ? saved : [];
  });

  const [topicName, setTopicName] = useState("");
  const [topicError, setTopicError] = useState("");
  const [showTopicForm, setShowTopicForm] = useState(false);
  const [topicToDelete, setTopicToDelete] = useState(null);

  const course = courses.find((item) => String(item.id) === String(courseId));

  const topics = Array.isArray(course?.topics) ? course.topics : [];

  const completedCount = topics.filter((topic) => topic.completed).length;

  const progress =
    topics.length > 0 ? Math.round((completedCount / topics.length) * 100) : 0;

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.courses, courses);
  }, [courses]);

  function updateCourseTopics(updatedTopics) {
    setCourses((previousCourses) =>
      previousCourses.map((item) =>
        String(item.id) === String(courseId)
          ? {
              ...item,
              topics: updatedTopics,
              progress:
                updatedTopics.length > 0
                  ? Math.round(
                      (updatedTopics.filter((topic) => topic.completed).length /
                        updatedTopics.length) *
                        100,
                    )
                  : 0,
            }
          : item,
      ),
    );
  }

  function handleAddTopic(event) {
    event.preventDefault();

    const name = topicName.trim();

    if (!name) {
      setTopicError("Enter a topic name first.");
      return;
    }

    if (
      topics.some((topic) => topic.name.toLowerCase() === name.toLowerCase())
    ) {
      setTopicError("That topic already exists in this course.");
      return;
    }

    const newTopic = {
      id: crypto.randomUUID(),
      name,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    updateCourseTopics([...topics, newTopic]);
    setTopicName("");
    setTopicError("");
    setShowTopicForm(false);
  }

  function handleToggleTopic(topicId) {
    const updatedTopics = topics.map((topic) =>
      String(topic.id) === String(topicId)
        ? { ...topic, completed: !topic.completed }
        : topic,
    );

    updateCourseTopics(updatedTopics);
  }

  function handleDeleteTopic() {
    if (!topicToDelete) return;

    updateCourseTopics(
      topics.filter((topic) => String(topic.id) !== String(topicToDelete.id)),
    )

    setTopicToDelete(null)
  }

  if (!course) {
      return (
        <div className="min-h-screen bg-background px-5 py-10 text-text sm:px-8">
          <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-white p-8 text-center sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-primary">
              <BookOpen size={26} />
            </div>
            <h1 className="mt-5 font-serif text-2xl font-semibold">
              Course not found
            </h1>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              The course may have been deleted, or the link may be incorrect.
            </p>
            <button
              type="button"
              onClick={() => navigate('/courses')}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
            >
              <ArrowLeft size={17} />
              Back to My Courses
            </button>
          </div>
        </div>
      )
  }

  return (
    <div className="min-h-screen bg-background px-5 py-7 text-text sm:px-8 sm:py-9 lg:px-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <Link to="/courses" className="transition hover:text-primary">
          My Courses
          </Link>
          <span>/</span>
          <span className="truncate font-medium text-text">
            {course.name}
          </span>
        </div>


        <header className="rounded-2xl border border-border bg-white p-5 sm:p-8">
            <Link 
              to="/courses"
              className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition hover:text-primary"
            >
              <ArrowLeft size={27} />
              Back to courses
            </Link>

            <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-light text-primary">
                  <BookOpen size={27} />
                </div>
                <div className="min-w-0">
                  {course.code && (
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-text-muted">
                      {course.code}
                    </p>
                  )}

                  <h1 className="wrap-break-word font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
                    {course.name}
                  </h1>

                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    {course.description || 
                      'Organize your topics and keep track of your learning.'}
                  </p>
                </div>
              </div>

              <span
                className={`inline-flex shrink-0 items-center gap-2 self-start rounded-full px-3 py-2 text-xs font-semibold ${
                  progress === 100 && topics.length > 0
                    ? 'bg-success-light text-success'
                    : 'bg-primary-light text-primary'
                }`}
              >
                {progress === 100 && topics.length > 0 ? (
                  <CircleCheck size={15} />
                ) : (
                  <Clock3 size={15} />
                )}
                {progress === 100 && topics.length > 0
                  ? 'Completed'
                  : topics.length === 0
                    ? 'Not started'
                    : 'In progress'}
              </span>
            </div>

            <div className="mt-8 border-t border-border pt-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-text-secondary">
                    Course progress
                  </p>
                  <p className="mt-1 text-3xl font-semibold tracking-tight">
                    {progress}%
                  </p>
                </div>
                <p className="text-right text-sm text-text-secondary">
                  {completedCount} of {topics.length} topics completed
                </p>
              </div>

              <div 
              className="mt-4 h-3 overflow-hidden rounded-full bg-surface-muted"
              role="progressbar"
              aria-label="Course completion"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              >
                <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
              </div>
              <p className="mt-3 text-xs text-text-muted">
                {topics.length === 0
                  ? 'Add your first topic to begin tracking your progress.'
                  : progress === 100
                    ? 'Amazing work! You have completed every topic in this course.'
                    : 'Keep going. Every completed topic brings you closer to your goal.'}
              </p>
            </div>
        </header>

        <section className="space-y-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Study topics
              </h2>
              <p className="mt-1 text-sm text-text-secondary">
                Break this subject into manageable pieces.
              </p>
            </div>
            <button
            type="button" 
            onClick={() => {
              setShowTopicForm((previous) => !previous)
              setTopicError('')
            }}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
            >
              {showTopicForm ? <X size={18} /> : <Plus size={18} />}
              {showTopicForm ? 'Cancel' : 'Add topic'}
            </button>
          </div>

          {showTopicForm && (
            <form
              onSubmit={handleAddTopic}
              className="rounded-2xl border border-border bg-white p-5 sm:p-6"
            >
              <label
               htmlFor="topic-name"
               className="mb-2 block text-sm font-semibold"
               >
                Topic name
               </label>
               <div className="flex flex-col gap-3 sm:flex-row">
                  <input 
                    id="topic-name"
                    type="text"
                    autoFocus
                    maxLength={100}
                    value={topicName}
                    onChange={(event) => {
                      setTopicName(event.target.value)
                      setTopicError('')
                    }}
                    placeholder="e.g. Carbohydrate Metabolism"
                    className="min-w-0 flex-1 rounded-xl border border-border bg-white px-4 py-4 text-sm outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />

                  <button 
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
                    >
                    <Plus size={17} />
                    Add topic
                  </button>
               </div>

               {topicError && (
                <p role="alert" className="mt-2 text-sm text-red-600">
                  {topicError}
                </p>
               )}
            </form>
          )}

          {topics.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border-strong bg-white px-6 py-12 text-center sm:py-16">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-primary">
                <BookOpen size={26} />
              </div>
              <h3 className="mt-4 font-semibold">
                No topics added yet
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-text-secondary"> 
                Add the chapters or topics you need to study for this course.
                You can mark each one complete as you go.
              </p>

              {!showTopicForm && (
                <button
                  type="button"
                  onClick={() => setShowTopicForm(true)}
                  className="mt-5 inline-flex items-center"
                >
                  <Plus size={17} />
                  Add your first topic
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-border bg-white">
              <div className="flex items-center justify-between border-b border-border bg-surface-muted/50 px-5 py-4">
                <p className="text-sm font-semibold">
                  All topics
                  <span className="ml-2 font-normal text-text-muted">
                    ({topics.length})
                  </span>
                </p>

                <p className="text-xs font-medium text-text-secondary">
                  {completedCount === topics.length
                    ? 'All completed'
                    : `${topics.length - completedCount} remaining`}
                </p>
              </div>

              <div className="divide-y divide-border">
                {topics.map((topic, index) => (
                  <div
                    key={topic.id}
                    className="flex items-center gap-3 px-4 py-4 transition hover:bg-background/70 sm:px-5"
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleTopic(topic.id)}
                      aria-label={
                        topic.completed
                          ? `Mark ${topic.name} incomplete`
                          : `Mark ${topic.name} complete`
                      }
                      aria-pressed={Boolean(topic.completed)}
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${
                        topic.completed
                          ? 'border-success bg-success text-white'
                          : 'border-border-strong bg-white hover:border-primary'
                      }`}
                    >
                      {topic.completed && <Check size={14} strokeWidth={3} />}
                    </button>

                    <div className="min-w-0 flex-1">
                      <p
                        className={`break-words text-sm font-medium ${
                          topic.completed
                            ? 'text-text-muted line-through'
                            : 'text-text'
                        }`}
                      >
                        {index + 1}. {topic.name}
                      </p>

                      <p className="mt-1 text-xs text-text-muted">
                        {topic.completed ? 'Completed' : 'Not completed'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setTopicToDelete(topic)}
                      aria-label={`Delete ${topic.name}`}
                      title="Delete topic"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-text-muted transition hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
        
        <div className="flex items-start gap-3 rounded-2xl border border-border bg-surface-muted/60 p-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-success">
            <Check size={21} />
          </span>
          <div>
            <h3 className="text-sm font-semibold">
              Small steps still count
            </h3>
            <p>
              Focus on understanding one topic at a time. Your progress will updated as your complete them.
            </p>
          </div>
        </div>
      </div>

      {topicToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-text/40 p-4 backdrop-blur-sm">
          <section 
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-topic-title"
            className="w-full max-w-sm rounded-2xl border border-border bg-white p-6 shadow-xl"
          >
            <h2
              id="delete-topic-title"
              className="text-lg font-semibold"
            >
              Delete this topic
            </h2>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              This will remove "{topicToDelete.name}" from {course.name}.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setTopicToDelete(null)}
                className="flex-1 rounded-xl border border-border px-4 py-3 text-sm font-semibold text-text-secondary transition hover:bg-surface-muted"
              >
                Cancel
              </button>

              <button 
                type="button"
                onClick={handleDeleteTopic}
                className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

export default CourseDetails;
