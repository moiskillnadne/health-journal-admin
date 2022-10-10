import { baseApi } from '@app/state';
import { ListQueryResponse } from '@app/types';
import { TTrack } from '../types';
import { TOption } from '@app/types';

export type TListRequest = {
  page: number;
  take: number;
  search?: string;
  order?: string;
};

export type TContent = {
  id: string;
  titleEn: string;
};

export type TSearchResponse = {
  articles: TContent[];
  recipes: TContent[];
  videos: TContent[];
};

export type TTracksResponse = ListQueryResponse<TTrack>;

export const api = baseApi.enhanceEndpoints({ addTagTypes: ['Tracks'] }).injectEndpoints({
  endpoints: builder => ({
    fetchTargetGroup: builder.query<TOption[], unknown>({
      query: params => {
        return {
          url: 'target-group',
          method: 'GET',
        };
      },
      transformResponse: (response: { id: string; title: string }[]) => {
        return response.map(({ id, title }) => {
          return { id, label: title };
        });
      },
    }),
    fetchSearchGalleryOptions: builder.query<
      TOption[],
      { search: string; type: 'article' | 'video' | 'recipe' }
    >({
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
      transformResponse: (response: TSearchResponse, _, { type }) => {
        return response[`${type}s`]?.map(({ titleEn, id }) => ({ label: titleEn, id }));
      },
    }),
    fetchTracks: builder.query<TTracksResponse, TListRequest>({
      query: params => {
        return {
          url: 'track',
          method: 'GET',
          params,
        };
      },
      providesTags: ['Tracks'],
    }),
    addTrack: builder.mutation<TTrack, Partial<TTrack>>({
      query: body => {
        return {
          url: 'track',
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['Tracks'],
    }),
    patchTracks: builder.mutation<TTrack, { id: string; body: Partial<TTrack> }>({
      query: ({ id, body }) => {
        return {
          url: `track/${id}`,
          method: 'PATCH',
          body,
        };
      },
      invalidatesTags: ['Tracks'],
    }),
  }),
});

export default api;
