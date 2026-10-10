import {
  BookOpen,
  ChartNoAxesCombined,
  CircleHelp,
  GraduationCap,
  LayoutDashboard,
  Settings,
  Timer,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

function NavigationLinks({ mobile = false }) {
  return navigation.map(({ label, path, icon: Icon }) => (
    <NavLink
      key={path}
      to={path}
      className={({ isActive }) =>
        `flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
          isActive
            ? "bg-primary-light text-primary"
            : "text-text-secondary hover:bg-surface-muted hover:text-text"
        } ${mobile ? "text-xs" : ""}`
      }
    >
      <Icon size={19} strokeWidth={1.9} />
      {label}
    </NavLink>
  ));
}

export default function Sidebar({ userName }) {
  const navigate = useNavigate();

  const initials = userName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[215px] flex-col border-r border-border bg-surface md:flex">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="flex h-[76px] items-center gap-2.5 px-5 text-left"
          aria-label="Go to StudyChamp dashboard"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-text-inverse">
            <GraduationCap size={22} />
          </span>
          <span className="text-[19px] font-bold tracking-tight">
            StudyChamp
          </span>
        </button>
        <nav
          aria-label="Main navigation"
          className="flex-1 space-y-1 px-3 pt-5"
        >
          <NavigationLinks />
        </nav>

        <div className="px-3 pb-2">
          <button
            type="button"
            onClick={() => navigate("/settings")}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-text-secondary hover:bg-surface-muted hover:text-text"
          >
            <CircleHelp size={19} />
            Help & resources
          </button>
        </div>
        <div className="border-t border-border p-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex-h-10 w-10 shrink-o items-center justify-center rounded-full bg-accent-light text-sm font-semibold text-text">
              {initials || "?"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{userName}</p>
              <p className="text-xs text-text-muted">Your study-space</p>
            </div>
          </div>
        </div>
      </aside>
      <header className="sticky top-0 z-40 border-b border-border bg-surface md:hidden">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 px-4 py-3"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-text-inverse">
            <GraduationCap size={22} />
          </span>
          <span className="text-lg font-bold">StudyChamp</span>
        </button>
        <nav 
            aria-label="Mobile navigation"
            className="flex gap-1 overflow-x-auto px-3 pb-3"   
        >
            <NavigationLinks mobile />
        </nav>
      </header>
    </>
  );
}
