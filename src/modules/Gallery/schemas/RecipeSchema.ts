import { object, string, array } from 'yup';
import { trimHTMLTags } from '../../../utils';

const RecipeSchema = object({
  imageId: object().nullable(true).required(),
  titleEn: string().max(128).required(),
  titleSp: string().max(128),
  textEn: string().transform(trimHTMLTags).max(5000).required(),
  textSp: string().transform(trimHTMLTags).max(5000),
  summaryEn: string().max(256).required(),
  summarySp: string().max(256),
  keywordsEn: array().min(1, 'This field is required').required(),
  keywordsSp: array(),
});

export default RecipeSchema;
