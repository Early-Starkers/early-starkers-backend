import {configureStore, combineReducers} from '@reduxjs/toolkit';

import starsReducer from './Reducers/starsSlice';

export const store = configureStore({
  reducer: combineReducers({
    stars: starsReducer,
  }),
});

export type RootState = ReturnType<typeof store.getState>;
