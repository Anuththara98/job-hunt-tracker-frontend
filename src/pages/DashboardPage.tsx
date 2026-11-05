import { useAuth } from "../context/useAuth";
import { AppHeader } from "../components/AppHeader";

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader />

      <main className="px-6 py-8">
        <p className="text-slate-600">
          Welcome, {user?.firstName}. Job applications are coming next.
        </p>
      </main>
    </div>
  );
}