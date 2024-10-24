import ProtectRoute from './ProtectedRoute';
import UserDashboardLeftbar from './UserDashboardLeftbar';

interface UserDashboardLayoutProps {
  children: React.ReactNode;
}

export default function UserDashboardLayout({
  children
}: UserDashboardLayoutProps) {
  return (
    <ProtectRoute>
      <div className="mx-auto max-w-7xl lg:flex min-h-screen">
        <UserDashboardLeftbar />
        <main className="flex-1 flex flex-col justify-between bg-white">
          <div className="flex-1 overflow-y-auto">{children}</div>
        </main>
      </div>
    </ProtectRoute>
  );
}
