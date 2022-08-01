import { createSlice } from '@reduxjs/toolkit';
import Router from "next/router";



const initialState = {
  foldMenu: false,
  reviewInfo: {}
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
    createReview (state, action ){
      console.log(action)
      state.reviewInfo = action.payload.data;
      
    }
  }
})


export default userStateSlice;
export const userStateAction = userStateSlice.actions;
