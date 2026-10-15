import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Check,
  CircleCheck,
  Clock3,
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
      
    )
  }
}

export default CourseDetails;
