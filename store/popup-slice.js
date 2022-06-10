import { createSlice } from '@reduxjs/toolkit';



const initialState = {
  data: {},
};

const popupSlice = createSlice({
  name: "popup",
  initialState:initialState,
  reducers: {
    setData(state, action) {
      alert(action.payload.address);
      state.data = action.payload;
    }
  }
});

export const popupAction = popupSlice.actions;
export default popupSlice;