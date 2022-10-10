import { object, string, array } from 'yup';
import { trimHTMLTags } from '../../../utils';

const ArticleSchema = object({
  imageId: object().nullable(true).required(),
  titleEn: string().max(128).required(),
  titleSp: string().max(128),
  textEn: string().transform(trimHTMLTags).max(5000).required(),
  textSp: string().transform(trimHTMLTags).max(5000),
  summaryEn: string().max(256).required(),
  summarySp: string().max(256),
  keywordsSp: array(),
  keywordsEn: array().min(1, 'This field is required').required(),
  conditions: array(),
  medications: array(),
  triggers: array(),
});

export default ArticleSchema;
