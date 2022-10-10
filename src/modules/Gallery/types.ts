import { InferType } from 'yup';
import { VideoSchema, SearchSchema, ArticleSchema, RecipeSchema } from './schemas';

import { TFile, TOption } from '@app/types';

export type TVideoSchemaForm = InferType<typeof VideoSchema> & {
  video?: TFile;
  videoPreview?: TFile;
  isPublished?: boolean;
  id?: string;
};
export type TArticleSchemaForm = InferType<typeof ArticleSchema> & {
  image?: TFile;
  isPublished?: boolean;
  id?: string;
};
export type TRecipeSchemaForm = InferType<typeof RecipeSchema> & {
  image?: TFile;
  isPublished?: boolean;
  id?: string;
};

export type TSearchGalleryRequest = {
  search?: string;
  type?: string;
  isPublished?: boolean | string;
};

export type SearchResultResponse = {
  articles: TArticle[];
  recipes: TRecipe[];
  videos: TVideo[];
};

export type TVideo = {
  id?: string;
  video?: TFile;
  videoPreview?: TFile;
  videoId: string | TFile | TOption;
  videoPreviewId: string | TFile | TOption;
  titleEn: string;
  titleSp?: string;
  descriptionEn?: string;
  descriptionSp?: string;
  keywordsSp?: string[];
  keywordsEn: string[];
  conditions?: string[];
  medications?: string[];
  triggers?: string[];
  isPublished: boolean;
  previewImagePresignedLink?: string;
  createAt?: string;
  type?: string;
  viewsCount?: number;
};

export type TArticle = {
  id?: string;
  videoPreview?: TFile;
  imageId: string;
  titleEn: string;
  titleSp?: string;
  summaryEn: string;
  summarySp?: string;
  keywordsSp?: string[];
  keywordsEn: string[];
  conditions?: string[];
  medications?: string[];
  triggers?: string[];
  textEn: string;
  textSp?: string;
  previewImagePresignedLink?: string;
  createAt?: string;
  isPublished: boolean;
  type?: string;
};

export type TRecipe = {
  id?: string;
  videoPreview?: TFile;
  imageId: string;
  titleEn: string;
  titleSp?: string;
  summaryEn: string;
  summarySp?: string;
  keywordsSp?: string[];
  keywordsEn: string[];
  textEn: string;
  textSp?: string;
  createAt?: string;
  previewImagePresignedLink?: string;
  isPublished: boolean;
  type?: string;
};
