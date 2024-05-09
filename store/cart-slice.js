import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  itemCount: 0,
  orderItemList: [],
  cartList: [],
  subscribeOrder: {},
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: initialState,
  reducers: {
    setOrderItemList(state, action) {
      const curItems = action.payload.items;
      state.orderItemList = curItems;
      state.itemCount = curItems?.length;
    },
    setInfo(state, action) {
      const data = action.payload.data;
      const { deliveryConstant, basketDtoList } = data;
      state.deliveryConstant = {
        price: deliveryConstant.price,
        freeCondition: deliveryConstant.freeCondition,
      };
      state.cartList = basketDtoList;
      state.itemCount = basketDtoList?.length;
    },
    setItemCount(state, action) {
      state.itemCount = action.payload.count;
    },
    setSubscribeOrder(state, action) {
      state.subscribeOrder = action.payload.data;
    },
    changeSubscribeOrder(state, action) {
      state.subscribeOrder = action.payload.data;
    },
  },
});

export const cartAction = cartSlice.actions;
export default cartSlice;
