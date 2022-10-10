import {
  configureStore,
  ReducersMapObject,
  Reducer,
  AnyAction,
  combineReducers,
} from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import api from './api';
import { logout } from './actions';
import { RootState } from '.';
import persistReducer from 'redux-persist/es/persistReducer';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  blacklist: [api.reducerPath],
};

const staticReducers: ReducersMapObject = {
  [api.reducerPath]: api.reducer,
};

function rootReducer(state: RootState, action: AnyAction): RootState {
  if (logout.match(action)) {
    return {} as RootState;
  }

  return state;
}

function combineReducersWithRoot(
  rootReducer: Reducer<RootState>,
  reducers: ReducersMapObject<RootState>,
) {
  return (state: RootState, action: AnyAction) => {
    const newState = rootReducer(state, action);

    const combinedReducer = combineReducers(reducers);

    return combinedReducer(newState, action);
  };
}

function createReducer(asyncReducers: ReducersMapObject<RootState>) {
  return combineReducersWithRoot(rootReducer as Reducer<RootState>, {
    ...asyncReducers,
    ...staticReducers,
  });
}

const combinedReducer = combineReducersWithRoot(rootReducer as Reducer<RootState>, staticReducers);

function createApplicationStore() {
  const store = configureStore({
    reducer: persistReducer(persistConfig, combinedReducer as Reducer<RootState>),
    middleware: getDefaultMiddleware => {
      return getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(api.middleware);
    },
    devTools: process.env.NODE_ENV === 'development',
  });

  return {
    ...store,
    asyncReducers: {} as ReducersMapObject,
    injectReducer: function (key: string, asyncReducer: Reducer) {
      this.asyncReducers[key] = asyncReducer;
      this.replaceReducer(
        persistReducer(persistConfig, createReducer(this.asyncReducers) as Reducer<RootState>),
      );
      persistor.persist();
    },
    getStore: () => store,
  };
}

const store = createApplicationStore();

if (process.env.NODE_ENV === 'development' && module.hot) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  module.hot.accept(() => store.replaceReducer(createReducer(store.asyncReducers)));
}

export const persistor = persistStore(store);

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
setupListeners(store.dispatch);

export default store;
