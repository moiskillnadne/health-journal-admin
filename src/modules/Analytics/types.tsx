import { InferType } from 'yup';
import { AnalyticsSchema } from './schemas';

export type TAnalyticsForm = InferType<typeof AnalyticsSchema>;
