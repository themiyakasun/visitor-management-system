import type { Permission } from '@/index';
import { checkPermissions } from '@/lib/check-permissions';
import { useAuthStore } from '@/stores/authStore';
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router';

const ProtectedRoutes = ({
  requiredPermissions,
  children,
}: {
  requiredPermissions?: Permission[];
  children: React.ReactNode;
}) => {
  const { isAuthenticated, permissions } = useAuthStore();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const check = async () => {
      const result = await checkPermissions(
        requiredPermissions ?? [],
        permissions!
      );
      setAllowed(result);
    };
    check();
  }, [requiredPermissions, permissions]);

  if (!isAuthenticated) return <Navigate to='/login' replace />;

  if (allowed === null) return <div>Loading...</div>;

  if (!allowed) return <Navigate to='/unauthorized' replace />;

  return children;
};

export default ProtectedRoutes;
