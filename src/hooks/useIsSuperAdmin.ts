import { ROLE_SUPER_ADMIN } from '@app/constants';
import { useMemo } from 'react';
import useAuth from './useAuth';

function useIsSuperAdmin() {
  const { user } = useAuth();
  return useMemo(() => user?.role === ROLE_SUPER_ADMIN, [user]);
}

export default useIsSuperAdmin;
