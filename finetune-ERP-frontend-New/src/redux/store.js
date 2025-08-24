import { configureStore } from '@reduxjs/toolkit';
import userSlice from './slice/userSlice';
import storeSlice from './slice/storeSlice';
import authSlice from './slice/authSlice';
import cartSlice from './slice/cartSlice';
import { erpApi } from '../api/erpApi';

const store = configureStore({
  reducer: {
    user: userSlice,
    store: storeSlice,
    auth: authSlice,
    cart: cartSlice,
    [erpApi.reducerPath]: erpApi.reducer,
  },
  middleware: (getDefault) => getDefault().concat(erpApi.middleware),
});

export default store;
