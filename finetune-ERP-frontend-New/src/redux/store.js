import { configureStore } from '@reduxjs/toolkit';
import userSlice from './slice/userSlice';
import storeSlice from './slice/storeSlice';
import authSlice from './slice/authSlice';
import cartSlice from './slice/cartSlice';
import { publicApi } from './api/publicApi';

const store = configureStore({
  reducer: {
    user: userSlice,
    store: storeSlice,
    auth: authSlice,
    cart: cartSlice,
    [publicApi.reducerPath]: publicApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(publicApi.middleware),
});

export default store;
