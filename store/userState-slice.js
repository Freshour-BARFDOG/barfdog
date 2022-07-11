import { createSlice } from '@reduxjs/toolkit';
import Router from "next/router";



const initialState = {
  foldMenu: false,
};


const userStateSlice = createSlice({
  name: 'userState',
  initialState,
  reducers: {
    fold(state, action) {
      state.foldMenu = true;
    },
    unfold(state, action) {
      state.foldMenu = false;
    },
  }
})


export default userStateSlice;
export const userStateAction = userStateSlice.actions;
