import { api } from '../state';

export const {
  useUploadFileMutation,
  useDeleteFileMutation,
  useFetchImagesQuery,
  useFetchVideosQuery,
} = api;

export { default as useDeleteFile } from './useDeleteFile';
