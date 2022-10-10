import { object, string, array, date, mixed } from 'yup';

const CustomNotificationSchema = object({
  name: string().max(128).required(),
  contentEn: string().max(5000).required(),
  contentSp: string().max(5000),
  targetGroups: array().min(1).required(),
  sending_date: mixed().when({
    is: (t: string) => t !== 'now',
    then: date()
      .min(new Date(), 'Please choose future date')
      .typeError('This field is required')
      .required('This field is required'),
  }),
  image: object({
    label: string(),
    id: string(),
  })
    .nullable()
    .notRequired(),
  link: object({
    label: string(),
    id: string(),
  }).nullable(),
});

export default CustomNotificationSchema;
