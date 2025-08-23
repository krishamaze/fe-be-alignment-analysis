import { configureStore } from '@reduxjs/toolkit';
import userSlice from './slice/userSlice';
import storeSlice from './slice/storeSlice';
import authSlice from './slice/authSlice';
import cartSlice from './slice/cartSlice';

const store = configureStore({
  reducer: {
    user: userSlice,
    store: storeSlice,
    auth: authSlice,
    cart: cartSlice,
  },
});

export default store;
