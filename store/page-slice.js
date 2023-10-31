import { createSlice } from '@reduxjs/toolkit';



const initialState = {
  pageTitle: ''
};


const pageSlice = createSlice({
  name: 'pageInformation',
  initialState,
  reducers: {
    saveCurrentPageInfo(state, action){
      // // console.log(action.payload.pageTitle);
      state.pageTitle= action.payload.pageTitle;
    }
  }
})


export default pageSlice;
export const pageAction = pageSlice.actions;
