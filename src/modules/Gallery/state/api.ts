import { baseApi } from '@app/state';
import { ListQueryResponse, TMedication, TConditions, TTriggers, TOption } from '@app/types';
import { transformToOptions } from '@app/utils';

import { TArticle, TVideo, TRecipe, TSearchGalleryRequest, SearchResultResponse } from '../types';

export type TListRequest = {
  page: number;
  take: number;
  order?: string;
  type?: 'regular' | 'food';
};

export type TMedicationsResponse = ListQueryResponse<TOption>;

export type TVideoGalleryResponse = ListQueryResponse<TVideo>;

export type TRecipeGalleryResponse = ListQueryResponse<TRecipe>;

export type TArticleGalleryResponse = ListQueryResponse<TArticle>;

export type TSearchRequest = {
  name?: string;
  page?: number;
  take?: number;
};

export type TUploadFile = {
  form: FormData;
  type: 'image' | 'video';
};

export const api = baseApi
  .enhanceEndpoints({
    addTagTypes: ['VideosGallery', 'ArticleGallery', 'RecipeGallery', 'SearchGallery'],
  })
  .injectEndpoints({
    endpoints: builder => ({
      fetchMedications: builder.query<TMedicationsResponse, TSearchRequest>({
        query: params => {
          const { name, page, take } = params;
          return {
            url: 'medications/adminSearch',
            method: 'GET',
            params: name ? { name, page, take } : { page, take },
          };
        },
        transformResponse: ({ data, meta }: ListQueryResponse<TMedication>) => {
          return { data: data.map(transformToOptions('productId', 'name')) || [], meta };
        },
      }),
      fetchConditions: builder.query<TOption[], unknown>({
        query: params => {
          return {
            url: 'conditions',
            method: 'GET',
          };
        },
        transformResponse: (response: TConditions[]) => {
          return response.map(transformToOptions('id', 'name')) || [];
        },
      }),
      fetchTriggers: builder.query<TOption[], unknown>({
        query: params => {
          return {
            url: 'triggers',
            method: 'GET',
          };
        },
        transformResponse: (response: TTriggers[]) => {
          return response.map(transformToOptions('id', 'shortName')) || [];
        },
      }),
      fetchSearchGallery: builder.query<SearchResultResponse, TSearchGalleryRequest>({
        query: params => {
          return {
            url: 'gallery/search',
            method: 'GET',
            params,
          };
        },
        providesTags: ['SearchGallery'],
      }),
      fetchGalleryVideo: builder.query<TVideoGalleryResponse, TListRequest>({
        query: params => {
          return {
            url: 'gallery/video',
            method: 'GET',
            params,
          };
        },
        providesTags: ['VideosGallery'],
      }),
      fetchGalleryRecipe: builder.query<TRecipeGalleryResponse, TListRequest>({
        query: params => {
          return {
            url: 'gallery/recipe',
            method: 'GET',
            params,
          };
        },
        providesTags: ['RecipeGallery'],
      }),
      fetchGalleryArticle: builder.query<TArticleGalleryResponse, TListRequest>({
        query: params => {
          return {
            url: 'gallery/article',
            method: 'GET',
            params,
          };
        },
        providesTags: ['ArticleGallery'],
      }),
      addGalleryVideo: builder.mutation<unknown, TVideo>({
        query: body => {
          return {
            url: 'gallery/video',
            method: 'POST',
            body,
          };
        },
        invalidatesTags: ['VideosGallery', 'SearchGallery'],
      }),
      addGalleryArticle: builder.mutation<unknown, TArticle>({
        query: body => {
          return {
            url: 'gallery/article',
            method: 'POST',
            body,
          };
        },
        invalidatesTags: ['ArticleGallery', 'SearchGallery'],
      }),
      addGalleryRecipe: builder.mutation<unknown, TRecipe>({
        query: body => {
          return {
            url: 'gallery/recipe',
            method: 'POST',
            body,
          };
        },
        invalidatesTags: ['RecipeGallery', 'SearchGallery'],
      }),
      patchGalleryVideo: builder.mutation<TVideo, { id: string; body: Partial<TVideo> }>({
        query: ({ id, body }) => {
          return {
            url: `gallery/video/${id}`,
            method: 'PATCH',
            body,
          };
        },
        invalidatesTags: ['VideosGallery', 'SearchGallery'],
      }),
      patchGalleryArticle: builder.mutation<TArticle, { id: string; body: Partial<TArticle> }>({
        query: ({ id, body }) => {
          return {
            url: `gallery/article/${id}`,
            method: 'PATCH',
            body,
          };
        },
        invalidatesTags: ['ArticleGallery', 'SearchGallery'],
      }),
      patchGalleryRecipe: builder.mutation<TRecipe, { id: string; body: Partial<TRecipe> }>({
        query: ({ id, body }) => {
          return {
            url: `gallery/recipe/${id}`,
            method: 'PATCH',
            body,
          };
        },
        invalidatesTags: ['RecipeGallery', 'SearchGallery'],
      }),
      deleteGalleryVideo: builder.mutation<null, { id: string }>({
        query: ({ id }) => {
          return {
            url: `gallery/video/${id}`,
            method: 'DELETE',
          };
        },
        invalidatesTags: ['VideosGallery', 'SearchGallery'],
      }),
      deleteGalleryArticle: builder.mutation<null, { id: string }>({
        query: ({ id }) => {
          return {
            url: `gallery/article/${id}`,
            method: 'DELETE',
          };
        },
        invalidatesTags: ['ArticleGallery', 'SearchGallery'],
      }),
      deleteGalleryRecipe: builder.mutation<null, { id: string }>({
        query: ({ id }) => {
          return {
            url: `gallery/recipe/${id}`,
            method: 'DELETE',
          };
        },
        invalidatesTags: ['RecipeGallery', 'SearchGallery'],
      }),
    }),
  });
