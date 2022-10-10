import { baseApi } from '@app/state';
import { TTableMeta } from '@app/types';
import { TUserFull } from '@app/types';

export type TListRequest = {
  page: number;
  take: number;
  order?: string;
};

export type TUsersResponse = {
  data: TUserFull[];
  meta: TTableMeta;
};

export type TChangeStatusRequest = {
  id: string;
  isActive: boolean;
};

export const api = baseApi.injectEndpoints({
  endpoints: builder => ({
    fetchUsers: builder.query<TUsersResponse, TListRequest>({
      query: params => {
        return {
          url: 'admin-users',
          method: 'GET',
          params: params,
        };
      },
    }),
    updateStatusUser: builder.mutation<TUserFull, TChangeStatusRequest>({
      query: ({ id, isActive }) => {
        return {
          url: `admin-users/${id}`,
          method: 'PATCH',
          body: {
            isActive,
          },
        };
      },
    }),
  }),
});
