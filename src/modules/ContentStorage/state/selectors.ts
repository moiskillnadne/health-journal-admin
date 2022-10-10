import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '@app/state';

const selectContentStorage = (state: RootState) => state.contentStorage;
