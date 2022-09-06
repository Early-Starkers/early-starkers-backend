import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

type Star = {
  id: number;
  owner: string;
  name: string;
};

export type StarsState = Record<number, Star>;

const initialState: StarsState = {};

export const starsSlice = createSlice({
  name: 'stars',
  initialState,
  reducers: {
    addStar: (state, action: PayloadAction<{id: number; star: Star}>) => {
      state[action.payload.id] = action.payload.star;
    },

    removeStar: (state, action: PayloadAction<number>) => {
      delete state[action.payload];
    },

    updateStars: (state, action: PayloadAction<StarsState>) => {
      return {...state, ...action.payload};
    },

    replaceStars: (_state, action: PayloadAction<StarsState>) => {
      return action.payload;
    },
  },
});

export const StarsActions = starsSlice.actions;

export default starsSlice.reducer;
