import { object, string, array } from 'yup';
import { trimHTMLTags } from '../../../utils';

const VideoSchema = object({
  videoId: object().nullable(true).required(),
  videoPreviewId: object().nullable(true).required(),
  titleEn: string().max(128).required(),
  titleSp: string().max(128),
  descriptionEn: string().transform(trimHTMLTags).max(5000),
  descriptionSp: string().transform(trimHTMLTags).max(5000),
  keywordsEn: array().min(1, 'This field is required').required(),
  keywordsSp: array(),
  conditions: array(),
  medications: array(),
  triggers: array(),
});

export default VideoSchema;
