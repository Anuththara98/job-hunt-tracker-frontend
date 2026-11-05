import { NavLink } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const navLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/companies", label: "Companies" },
  { to: "/job-applications", label: "Job Applications" },
];

export function AppHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
      <div className="flex items-center gap-6">
        <h1 className="text-lg font-semibold text-slate-900">
          Job Hunt Tracker
        </h1>
        <nav className="flex gap-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium ${isActive ? "text-slate-900" : "text-slate-500 hover:text-slate-700"}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-600">
          {user?.firstName} {user?.lastName}
        </span>
        <button
          onClick={logout}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
