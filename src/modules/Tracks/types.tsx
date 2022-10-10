import { InferType } from 'yup';
import { TrackSchema } from './schemas';
import { TOption } from '@app/types';

export type TTrackSchemaForm = InferType<typeof TrackSchema>;

export type TTargetGroup = {
  title: string;
  id: string;
  createAt: string;
};

export type TTrackLine = {
  id?: string;
  order: number;
  video?: string;
  article?: string;
  recipe?: string;
};

export type TTrackGroup = {
  id?: string;
  order?: number;
  schedule: string;
  lines: TTrackLine[];
};

export type TTrack = {
  id?: string;
  titleEn: string;
  titleSp: string;
  targetGroups: string[];
  groups: TTrackGroup[];
  isPublished: boolean;
};

export type TTrackLineForm = {
  id?: string;
  order?: number;
  video: TOption | null;
  article: TOption | null;
  recipe: TOption | null;
};
