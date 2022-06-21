import { configureStore } from '@reduxjs/toolkit';
import authSlice from './auth-slice';
import cartSlice from './cart-slice';
import popupSlice from "./popup-slice";
import userStateSlice from "@store/userState-slice";



const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    cart: cartSlice.reducer,
    popup: popupSlice.reducer,
    userState: userStateSlice.reducer
  },
});

export default store;