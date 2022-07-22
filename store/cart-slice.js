import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  item: {},
  cartList: []
};

const cartSlice = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    instantPayment(state, action) {
      const data = action.payload.data;
      const itemId = data.itemId.toString();
      state.item[itemId] = data;
      
    }
  }
});

export const cartAction = cartSlice.actions;
export default cartSlice;