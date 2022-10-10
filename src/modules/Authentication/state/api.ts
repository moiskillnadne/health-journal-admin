import { baseApi } from '@app/state';

import type { TLogInForm, TSignUp, TRestorePasswordForm } from '../types';

export type TLoginRequest = TLogInForm;
export type TSignUpRequest = TSignUp;
export type TRestorePasswordRequest = TRestorePasswordForm;

export type TConfirmNewPasswordRequest = {
  email: string;
  newPassword: string;
  code: string;
};

export type TLoginResponse = {
  user: any;
  idToken: string;
  refreshToken: string;
};

export type TSignUpResponse = {
  user: any;
  idToken: string;
};

export type TRestorePasswordResponse = {
  message: string;
};

export const api = baseApi.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation<TLoginResponse, TLoginRequest>({
      query: credentials => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    restorePassword: builder.mutation<TRestorePasswordResponse, TRestorePasswordRequest>({
      query: credentials => ({
        url: 'auth/restore-password',
        method: 'POST',
        body: credentials,
      }),
    }),
    ConfirmNewPasswordRequest: builder.mutation<
      TConfirmNewPasswordRequest,
      TRestorePasswordRequest
    >({
      query: credentials => ({
        url: 'auth/confirm-restore-password',
        method: 'POST',
        body: credentials,
      }),
    }),
    signUp: builder.mutation<TSignUpResponse, TSignUpRequest>({
      query: body => ({
        url: 'auth/signup',
        method: 'POST',
        body,
      }),
    }),
  }),
});
