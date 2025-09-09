import { createSlice } from '@reduxjs/toolkit';
import { assignStoreToUser, unassignStoreFromUser } from '../../api/user';

const initialState = {
  isLoading: false,
  error: null,
};

const UserSlice = createSlice({
  name: 'UserSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(assignStoreToUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(assignStoreToUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(assignStoreToUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(unassignStoreFromUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(unassignStoreFromUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(unassignStoreFromUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export default UserSlice.reducer;
