import { TFile } from '../ContentStorage/types';
import { TTargetGroup } from '../Tracks/types';
import { CustomNotificationSchema, PredefinedNotificationSchema } from './schemas';
import { InferType } from 'yup';

export type TCustomNotificationForm = InferType<typeof CustomNotificationSchema>;
export type TPredefinedNotificationForm = InferType<typeof PredefinedNotificationSchema>;

export type TPredefinedNotification = {
  notification_type: string;
  name: string;
  contentEn: string;
  contentSp: string;
  isPublished: boolean;
  id: string;
  createAt: string;
};

export type TCustomNotification = {
  id: string;
  status: string;
  notification_type: string;
  createAt: string;
  name: string;
  contentEn: string;
  contentSp: string;
  image: TFile;
  targetGroups: TTargetGroup[];
  link: {
    type: string;
    value: {
      id: string;
      titleEn: string;
      type?: string;
    };
  };
  sending_date: string;
};
