'use client';

import { useAdminAuth } from 'hooks/useAdminAuth';
import Loading from 'components/common/Loading';

export default function AdminDashboard() {
  const { isAdmin, loading } = useAdminAuth();

  if (loading) return <Loading />;

  if (!isAdmin) return <div>Access Denied</div>;

  return (
    <div>
      <h1>Admin Dashboard</h1>
    </div>
  );
}
