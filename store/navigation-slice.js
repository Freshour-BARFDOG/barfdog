import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  previousPath: '/',
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setPreviousPath(state, action) {
      state.previousPath = action.payload;
    },
  },
});

export default navigationSlice;
export const { setPreviousPath } = navigationSlice.actions;
