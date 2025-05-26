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

export const saveOrderItems = (items) => (dispatch) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('orderItemList', JSON.stringify(items));
  }
  dispatch(cartAction.setOrderItemList({ items }));
};

// 2) 불러오기용: 앱 시작 시 호출하면 localStorage에서 복원
export const loadOrderItems = () => (dispatch) => {
  if (typeof window === 'undefined') return;
  const raw = localStorage.getItem('orderItemList');
  if (!raw) return;

  try {
    const items = JSON.parse(raw);
    dispatch(cartAction.setOrderItemList({ items }));
  } catch {
    // parsing error 시 무시
  }
};

export default cartSlice.reducer;
