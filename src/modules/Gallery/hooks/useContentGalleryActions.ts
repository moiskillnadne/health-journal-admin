import { useNavigate } from 'react-router-dom';
import { api } from '../state/api';

import { TArticle, TVideo, TRecipe } from '../types';

export const {
  usePatchGalleryVideoMutation,
  usePatchGalleryArticleMutation,
  usePatchGalleryRecipeMutation,
  useDeleteGalleryVideoMutation,
  useDeleteGalleryArticleMutation,
  useDeleteGalleryRecipeMutation,
} = api;

const useContentGalleryActions = (type: 'video' | 'article' | 'recipe' | 'foodVideo') => {
  const navigate = useNavigate();

  const editAction = (url: string) => (state: TArticle | TVideo | TRecipe) => {
    navigate(url, { state });
  };

  const [publishVideo, { isLoading: PVLoading }] = usePatchGalleryVideoMutation();
  const [publishArticle, { isLoading: PALoading }] = usePatchGalleryArticleMutation();
  const [publishRecipe, { isLoading: PRLoading }] = usePatchGalleryRecipeMutation();

  const [deleteVideo, { isLoading: DVLoading }] = useDeleteGalleryVideoMutation();
  const [deleteArticle, { isLoading: DALoading }] = useDeleteGalleryArticleMutation();
  const [deleteRecipe, { isLoading: DRLoading }] = useDeleteGalleryRecipeMutation();

  const isLoading = PVLoading || PALoading || PRLoading || DVLoading || DALoading || DRLoading;

  switch (type) {
    case 'video':
      return {
        publishAction: publishVideo,
        deleteAction: deleteVideo,
        editAction: editAction('/admin/gallery/videos/edit-video'),
        isLoading,
      };
      break;
    case 'article':
      return {
        publishAction: publishArticle,
        deleteAction: deleteArticle,
        editAction: editAction('/admin/gallery/articles/edit-article'),
        isLoading,
      };
      break;
    case 'recipe':
      return {
        publishAction: publishRecipe,
        deleteAction: deleteRecipe,
        editAction: editAction('/admin/gallery/food-is-medicine/recipes/edit-recipe'),
        isLoading,
      };
      break;
    default:
      return {
        publishAction: publishVideo,
        deleteAction: deleteVideo,
        editAction: editAction('/admin/gallery/food-is-medicine/all-things-food/edit-food-video'),
        isLoading,
      };
      break;
  }
};

export default useContentGalleryActions;
