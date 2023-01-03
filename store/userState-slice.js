import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  reviewInfo: {},
  snsInfo: {
    provider: null,
    prividerId: null,
  },
  tempMyAccount: {}
};

const userStateSlice = createSlice({
  name: 'userState',
  initialState,
  reducers: {
    setReviewInfo(state, action) {
      state.reviewInfo = action.payload.data;
    },
    setSnsInfo(state, action) {
      const data = action.payload.data;
      state.snsInfo = {
        provider: data.provider,
        providerId: data.prividerId,
        ...data, // 그 밖에 필수 동의한 내용들 입력
      };
    },
    tempMyAccount(state, action) {
      const data = action.payload.data;
      state.tempMyAccount = {
        email: data.email,
        provider: data.provider,
        ...data,
      };
    },
  },
});


export default userStateSlice;
export const userStateAction = userStateSlice.actions;
