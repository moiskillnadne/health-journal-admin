import slice from './slice';

export * from './api';

export type ModuleState = {
  [slice.name]: ReturnType<typeof slice.reducer>;
};

export const { actions } = slice;
