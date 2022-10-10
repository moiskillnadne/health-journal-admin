import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import store from '@app/state/store';
import { api, TListResponse } from './api';
import { TFile } from '../types';
import { TTableMeta } from '@app/types';

const initialFilters = {
  hasNextPage: false,
  hasPreviousPage: false,
  pageCount: 0,
  itemCount: 0,
  page: 1,
  take: 10,
};

export type TStore = {
  videoFilter: TTableMeta;
  videos: TFile[] | null;
  imageFilter: TTableMeta;
  images: TFile[] | null;
};

const initialState = {
  videoFilter: initialFilters,
  imageFilter: initialFilters,
  videos: null,
  images: null,
};

const slice = createSlice({
  name: 'contentStorage',
  initialState: initialState as TStore,
  reducers: {},
  extraReducers: {},
});

store.injectReducer(slice.name, slice.reducer);

export default slice;
