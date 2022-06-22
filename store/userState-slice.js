import { createSlice } from '@reduxjs/toolkit';



const initialState = {
};


const userStateSlice = createSlice({
  name: 'userState',
  initialState,
  reducers: {

  }
})


export default userStateSlice;
export const userStateAction = userStateSlice.actions;
