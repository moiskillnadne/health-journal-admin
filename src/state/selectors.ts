import { RootState } from '.';

export const selectAuthUser = (state: RootState) => state.auth.user;
