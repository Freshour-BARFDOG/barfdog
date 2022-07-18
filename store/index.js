import { configureStore } from '@reduxjs/toolkit';
import authSlice from './auth-slice';
import cartSlice from './cart-slice';
import popupSlice from "./popup-slice";
import userStateSlice from "@store/userState-slice";
import pageSlice from "@store/page-slice";



const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    cart: cartSlice.reducer,
    popup: popupSlice.reducer,
    page: pageSlice.reducer,
    userState: userStateSlice.reducer
  },
});

export default store;
export {subscribeStatus} from "@store/TYPE/subscribeStatus";