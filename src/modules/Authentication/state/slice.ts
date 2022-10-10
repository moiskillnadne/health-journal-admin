import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import store from '@app/state/store';
import { api } from './api';
import { logout } from '@app/state';
import { TUserFull } from '@app/types';

export type TAuthState = {
  user: TUserFull | null;
  token: string | null;
  refreshToken: string | null;
};

export type LoginPayload = {
  user: TUserFull;
  idToken: string;
  refreshToken: string;
};

const slice = createSlice({
  name: 'auth',
  initialState: { user: null, token: null, refreshToken: null } as TAuthState,
  reducers: {},
  extraReducers: builder => {
    return builder
      .addCase(logout, state => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
      })
      .addMatcher(
        api.endpoints.login.matchFulfilled,
        (state, { payload: { user, refreshToken, idToken } }: PayloadAction<LoginPayload>) => {
          state.user = user;
          state.token = idToken;
          state.refreshToken = refreshToken;
        },
      );
  },
});

store.injectReducer(slice.name, slice.reducer);

export default slice;
