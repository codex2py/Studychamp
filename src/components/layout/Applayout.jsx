
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'

export default function AppLayout({ userName }) {
  return (
    <div className="min-h-screen bg-background text-text">
      <Sidebar userName={userName} />

      <main className="min-h-screen min-w-0 md:ml-[215px]">
        <div className="mx-auto w-full max-w-[1600px] p-5 sm:p-7 lg:p-9">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
