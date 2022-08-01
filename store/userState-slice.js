import { createSlice } from '@reduxjs/toolkit';
import Router from "next/router";



const initialState = {
  foldMenu: false,
  reviewInfo: {},
  snsInfo: {
    provider: null,
    prividerId: null,
  }
};

const userStateSlice = createSlice({
  name: 'userState',
  initialState,
  reducers: {
    fold(state) {
      state.foldMenu = true;
    },
    unfold(state) {
      state.foldMenu = false;
    },
    setReviewInfo (state, action ){
      // console.log(action)
      state.reviewInfo = action.payload.data;
    },
    setSnsInfo (state, action) {
      const data = action.payload.data;
      state.snsInfo = {
        provider: data.provider,
        providerId: data.prividerId,
        ...data // 그 밖에 필수 동의한 내용들 입력
      }
    }
  }
})


export default userStateSlice;
export const userStateAction = userStateSlice.actions;
