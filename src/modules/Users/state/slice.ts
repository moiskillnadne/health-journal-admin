import { createSlice } from '@reduxjs/toolkit';

import store from '@app/state/store';

import { TTableMeta } from '@app/types';
import { TUserFull } from '@app/types';

const initialFilters = {
  hasNextPage: false,
  hasPreviousPage: false,
  pageCount: 0,
  itemCount: 0,
  page: 1,
  take: 10,
};

export type TStore = {
  usersList: TUserFull[] | null;
  usersFilter: TTableMeta;
};

const initialState = {
  usersList: null,
  usersFilter: initialFilters,
};

const slice = createSlice({
  name: 'users',
  initialState: initialState as TStore,
  reducers: {},
  extraReducers: {},
});

store.injectReducer(slice.name, slice.reducer);

export default slice;
