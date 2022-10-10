import { BaseQueryFn, FetchArgs } from '@reduxjs/toolkit/query/react';

export type ApiError = {
  code: string;
  details: Record<string, any>;
  httpCode: number;
  message: string;
};

export type ValidationError = {
  type?: string;
  params?: Record<string, any>;
  message: string;
};

export type CustomFetchBaseQueryError = {
  originalStatus: number;
  data: ApiError;
  status: number;
};

export type CustomFetchBaseQuery = BaseQueryFn<
  string | FetchArgs,
  unknown,
  CustomFetchBaseQueryError,
  any
>;

export type TUserFull = {
  id: string;
  email: string;
  cognitoId: string;
  firstName: string;
  lastName: string;
  username: string;
  role: 'content_manager' | 'super_admin';
  isActive: boolean;
  lastLoginAt?: string | null;
  createAt: string;
};

export type TTableMeta = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  itemCount: number;
  page: number;
  pageCount: number;
  take: number;
  order?: {
    field: string;
    sort: string;
  };
};

export type TFile = {
  bucketKey: string;
  bucketName: string;
  contentType: 'image' | 'videos';
  fileName: string;
  format: string;
  id: string;
  isPosted: boolean;
  location: string;
  size: number;
};

export type TTriggers = {
  shortName: string;
  description: string;
  id: string;
};

export type TConditions = {
  id: string;
  description: string;
  name: string;
};

export type TMedication = {
  productId: string;
  name: string;
};
export interface ListQueryResponse<T = any> {
  data: T[];
  meta: {
    page: number;
    take: number;
    itemCount: number;
    pageCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export type TOption = {
  id: string;
  label: string;
};
