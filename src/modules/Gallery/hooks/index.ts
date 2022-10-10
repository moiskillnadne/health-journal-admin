import api from '@app/state/api';
import { api as apiGallery } from '../state/api';

export const { useFetchSearchFileQuery } = api;

export const {
  useFetchMedicationsQuery,
  useFetchTriggersQuery,
  useFetchConditionsQuery,
  useFetchGalleryVideoQuery,
  useFetchGalleryRecipeQuery,
  useFetchGalleryArticleQuery,
  useFetchSearchGalleryQuery,
  useAddGalleryVideoMutation,
  useAddGalleryArticleMutation,
  useAddGalleryRecipeMutation,
  usePatchGalleryVideoMutation,
  usePatchGalleryArticleMutation,
  usePatchGalleryRecipeMutation,
} = apiGallery;

export { default as useContentGalleryActions } from './useContentGalleryActions';
