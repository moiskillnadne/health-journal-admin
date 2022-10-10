import { baseApi } from '@app/state';
import { ListQueryResponse, TOption } from '@app/types';
import { TPredefinedNotification, TCustomNotification } from '../types';

export type TNotificationsRequestParams = {
  order?: string;
  page?: number;
  take?: number;
  search?: string;
};

export type TNotificationRequest = {
  name: string;
  contentEn: string;
  contentSp?: string;
  imageId?: string | null;
  targetGroups: string[];
  link?: {
    type?: string;
    linkId?: string;
  } | null;
  isPublished: boolean;
  sending_date: string;
};

export type TContent = {
  id: string;
  titleEn: string;
  type?: string;
};

export type TSearchResponse = {
  articles: TContent[];
  recipes: TContent[];
  videos: TContent[];
};

export type TCustomNotificationsResponse = ListQueryResponse<TCustomNotification>;

export type TPredefinedNotificationResponse = ListQueryResponse<TPredefinedNotification>;

export const api = baseApi
  .enhanceEndpoints({ addTagTypes: ['Notifications', 'CustomNotifications'] })
  .injectEndpoints({
    endpoints: builder => ({
      fetchCustomNotifications: builder.query<
        TCustomNotificationsResponse,
        TNotificationsRequestParams
      >({
        query: params => {
          return {
            url: 'notification/custom',
            method: 'GET',
            params,
          };
        },
        providesTags: ['CustomNotifications'],
      }),
      fetchPredefinedNotifications: builder.query<
        TPredefinedNotificationResponse,
        TNotificationsRequestParams
      >({
        query: params => {
          return {
            url: 'notification/predefined',
            method: 'GET',
            params,
          };
        },
        providesTags: ['Notifications'],
      }),
      fetchGalleryLinkOptions: builder.query<TOption[], { search: string }>({
        query: params => {
          return {
            url: 'gallery/search',
            method: 'GET',
            params: {
              ...params,
              isPublished: true,
            },
          };
        },
        transformResponse: (data: TSearchResponse) => {
          function compare(a: TOption, b: TOption) {
            if (a.label < b.label) {
              return -1;
            }
            if (a.label > b.label) {
              return 1;
            }
            return 0;
          }

          const result = [];

          for (const key in data) {
            if (key === 'videos') {
              result.push(
                data[key]?.map(
                  (el): TContent => ({
                    ...el,
                    type: el.type === 'regular' ? 'video' : 'food video',
                  }),
                ),
              );
            } else if (key === 'articles' || key === 'recipes') {
              const type = key.replaceAll('s', '');
              result.push(
                data[key]?.map(
                  (el): TContent => ({
                    ...el,
                    type,
                  }),
                ),
              );
            }
          }
          return result
            .flat()
            .map(({ titleEn, id, type = '' }: TContent) => ({
              label: `${titleEn} (${type})`,
              id,
            }))
            .sort(compare);
        },
      }),
      addCustomNotification: builder.mutation<TCustomNotification, TNotificationRequest>({
        query: body => {
          return {
            url: 'notification/custom',
            method: 'POST',
            body,
          };
        },
        invalidatesTags: ['CustomNotifications'],
      }),
      patchCustomNotification: builder.mutation<
        TCustomNotification,
        { id: string; body: Partial<TNotificationRequest> }
      >({
        query: ({ id, body }) => {
          return {
            url: `notification/custom/${id}`,
            method: 'PATCH',
            body,
          };
        },
        invalidatesTags: ['CustomNotifications'],
      }),
      patchPredefinedNotification: builder.mutation<
        TCustomNotification,
        { id: string; body: Partial<TNotificationRequest> }
      >({
        query: ({ id, body }) => {
          return {
            url: `notification/predefined/${id}`,
            method: 'PATCH',
            body,
          };
        },
        invalidatesTags: ['Notifications'],
      }),
    }),
  });

export default api;
