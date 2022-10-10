import { useMemo } from 'react';

import { selectAuthUser } from '../state';

import useAppSelector from './useAppSelector';

function useAuth() {
  const user = useAppSelector(selectAuthUser);

  return useMemo(() => ({ user }), [user]);
}

export default useAuth;
