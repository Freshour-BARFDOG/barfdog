import { createSlice } from '@reduxjs/toolkit';



const initialState = {
  // topBannerVisibility : true,
};


const userStateSlice = createSlice({
  name: 'userState',
  initialState,
  reducers: {
    // hideTopBanner(state, action){
    //   console.log('Hide Top Banner');
    //   state.topBannerVisibility= false;
    // },
    // showTopBanner(state, action){
    //   console.log('Show Top Banner');
    //   state.topBannerVisibility= true;
    // }

  }
})


export default userStateSlice;
export const userStateAction = userStateSlice.actions;
