import { api } from './state/api';

export const {
  useAddCustomNotificationMutation,
  useFetchCustomNotificationsQuery,
  useFetchPredefinedNotificationsQuery,
  usePatchCustomNotificationMutation,
  usePatchPredefinedNotificationMutation,
  useFetchGalleryLinkOptionsQuery,
} = api;
