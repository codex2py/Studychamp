import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/Applayout.jsx'
import Welcome from './pages/Welcome.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Courses from './pages/Courses.jsx'
import StudySessions from './pages/StudySessions.jsx'
import Progress from './pages/Progress.jsx'
import Settings from './pages/Settings.jsx'
import CourseDetails from './pages/CourseDetails.jsx'
import { getStorageItem, setStorageItem, STORAGE_KEYS } from './utils/storage'


const STORAGE_KEY = 'studychamp:userName'

export default function App() {
  const [userName, setUserName] = useState(
    () => getStorageItem(STORAGE_KEYS.userName, '')
  )

  function handleNameSaved(name) {
    const saved = setStorageItem(STORAGE_KEY.userName, name)

    if(saved) {
      setUserName(name)
    }
  }

  if (!userName) {
    return <Welcome onNameSaved={handleNameSaved} />
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route element={<AppLayout userName={userName} />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:courseId" element={<CourseDetails />} />
        <Route path="/sessions" element={<StudySessions />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
