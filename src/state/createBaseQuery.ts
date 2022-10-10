import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CustomFetchBaseQuery } from '@app/types';
import { RootState } from '.';
import { logout } from './actions';
import store from './store';

function createBaseQuery() {
  const baseQuery = fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.auth?.token;
      headers.set('source', 'WEB_ADMIN');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }) as CustomFetchBaseQuery;

  return async function baseQueryWithReauth(args, api, extraOptions) {
    const result = await baseQuery(args, api, extraOptions);
    if (result.error?.status === 401) {
      store.dispatch(logout());
      location.reload();
      return;
    }

    if (
      result.error &&
      (result.error.originalStatus === 502 || result.error.originalStatus === 503)
    ) {
      result.error.data = {
        message: 'The server is not available.',
        code: result.error.originalStatus.toString(),
        details: {},
        httpCode: result.error.originalStatus,
      };
    }

    return result;
  } as CustomFetchBaseQuery;
}

export default createBaseQuery;
