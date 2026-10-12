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

    if (sortBy === 'progress') {
      return [...results].sort(
        (a, b) => (b.progress ?? 0) - (a.progress ?? 0),
      )
    }

    return [...results].sort(
      (a, b) => new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0),
    )
  }, [courses, searchQuery, sortBy]);

  const totalTopics = courses.reduce(
    (total, course) =>
      total + (Array.isArray(course.topics) ? course.topics.length : 0),
    0,
  )

  const completedTopics = courses.reduce(
    (total, course) =>
      total +
    (Array.isArray(course.topics)
      ? course.topics.filter((topic) => topic.completed).length
      : 0),
  0,
)

  function openModal() {
    setCourseName('')
    setCourseCode('')
    setCourseDescription('')
    setFormError('')
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setFormError('')
  }

  function handleAddCourse(event) {
    event.preventDefault()

    const name = courseName.trim()
    const code = courseCode.trim()
    const description = courseDescription.trim()

    if (!name) {
      setFormError('Please enter a course name.')
      return
    }

    const duplicate = courses.some(
      (course) => course.name?.toLowerCase() === name.toLowerCase(), 
    )

    if (duplicate) {
      setFormError('This course already exists. Try a different name.')
      return
    }

    const newCourse = {
      id: crypto.randomUUID(),
      name,
      code,
      description,
      topics: [],
      createdAt: new Date().toISOString(),
    }

    setCourses((previousCourses) => [...previousCourses, newCourse])
    closeModal()
  }

  function handleDeleteCourse() {
    if (!courseToDelete) return

    setCourses((previousCourses) => 
      previousCourses.filter((course) => course.id !== courseToDelete.id),
  )

  setCourseToDelete(null)
  }



}
