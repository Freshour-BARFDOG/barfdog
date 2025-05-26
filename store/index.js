import { configureStore } from '@reduxjs/toolkit';
import authSlice from './auth-slice';
// import cartSlice from './cart-slice';
import popupSlice from './popup-slice';
import userStateSlice from '@store/userState-slice';
import pageSlice from '@store/page-slice';
import orderSlice from '@store/order-slice';
import navigationSlice from '@store/navigation-slice';
import cartReducer from './cart-slice';

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    cart: cartReducer,
    popup: popupSlice.reducer,
    page: pageSlice.reducer,
    userState: userStateSlice.reducer,
    orderState: orderSlice.reducer,
    navigation: navigationSlice.reducer,
  },
});

export default store;
