import { boolean, object, string } from 'yup';

const PredefinedNotificationSchema = object({
  name: string(),
  contentEn: string().max(5000).required(),
  contentSp: string().max(5000),
  isPublished: boolean(),
});

export default PredefinedNotificationSchema;
