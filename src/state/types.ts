import api from './api';
import store from './store';

import { ModuleState as AuthenticationState } from '../modules/Authentication';
import { ModuleState as ContentStorage } from '../modules/ContentStorage';
import { ModuleState as Users } from '../modules/Users';

export type RootState = {
  [api.reducerPath]: ReturnType<typeof api.reducer>;
} & AuthenticationState &
  ContentStorage &
  Users;

export type AppDispatch = typeof store.dispatch;
