import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  token: null,
  isAuth: false,
  isAdmin: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    addToken (state, action){
      // ! 추후 추가할 것 --> 로그인에 성공한 경우, isAuth: true로 변경한다
      // if (state.isAuth){
        //   state.token = action.payload.token;
        // }else{
          //   // 토큰이 만료되었다 -> 다시 로그인 필요
          //   // 토큰 갱신 ?
          // }
      state.token = action.payload.token;
    }
  }
});

export const authAction = authSlice.actions;
export default authSlice;