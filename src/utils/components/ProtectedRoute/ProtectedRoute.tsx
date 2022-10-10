import { Outlet, Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '@app/hooks';
import { BLOCKED_ROLE_ROUTE } from '@app/constants';

function ProtectedRoute() {
  const { user } = useAuth();

  const location = useLocation();
  const { pathname } = location;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return user && !BLOCKED_ROLE_ROUTE[user.role].some((el: string) => pathname.includes(el)) ? (
    <Outlet />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
}

export default ProtectedRoute;
