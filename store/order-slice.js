import {createSlice} from '@reduxjs/toolkit';


// ORDER_STATES: order-slice에서만 사용하는 타입.
export const ORDER_STATES = {
  BEFORE_ORDER: 'BEFORE_ORDER',
  ORDERING: 'ORDERING',
  EXIT_ORDER: 'EXIT_ORDER'
};

const initialState = {
  orderState: ORDER_STATES.BEFORE_ORDER,
  orderType: null, // subscribe, general
  orderId: null, // 주문 ID
};


const orderSlice = createSlice( {
  name: 'order Information',
  initialState,
  reducers: {
    saveOrderState (state, action) {
      state.orderState = action.payload.orderState;
      state.orderType = action.payload.orderType;
      state.orderId = action.payload.orderId;
    }
  }
} )


export default orderSlice;
export const orderAction = orderSlice.actions;
