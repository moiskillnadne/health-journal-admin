import { string, date, object, ref } from 'yup';
const maxDate = new Date(8640000000000000);

const AnalyticsSchema = object({
  report_date: date().max(maxDate).nullable(true),
  signedup_from: date().nullable(true),
  signedup_to: date().max(maxDate).nullable(true),
  company_code: string(),
});

export default AnalyticsSchema;
