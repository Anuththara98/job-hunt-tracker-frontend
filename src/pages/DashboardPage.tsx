import { useAuth } from "../context/useAuth";

export function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
        <h1 className="text-lg font-semibold text-slate-900">Job Hunt Tracker</h1>
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

      <main className="px-6 py-8">
        <p className="text-slate-600">
          Welcome, {user?.firstName}. Companies and job applications are coming next.
        </p>
      </main>
    </div>
  );
}