import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  orderItemList: [],
  cartList: [],
  info:{},
  subscribeOrder:{},
  itemCount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    setOrderItemList(state, action) {
      const curItems = action.payload.items
      state.orderItemList = curItems;
      state.itemCount = curItems.length;
    },
    setInfo(state, action){
      const data = action.payload.data;
      const {deliveryConstant, basketDtoList} = data;
      state.deliveryConstant = {
        price: deliveryConstant.price,
        freeCondition: deliveryConstant.freeCondition,
      };
      state.cartList = basketDtoList;
      state.itemCount = basketDtoList?.length;
    },
    setItemCount (state, action) {
      state.itemCount = action.payload.count;
      // console.log(action.payload.count)
    },
    setSubscribeOrder (state, action) {
      // console.log(action.payload.data)
      state.subscribeOrder = action.payload.data
    }
  },
});

export const cartAction = cartSlice.actions;
export default cartSlice;