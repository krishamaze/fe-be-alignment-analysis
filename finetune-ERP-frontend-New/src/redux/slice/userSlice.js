import { createSlice } from '@reduxjs/toolkit';
import {
  assignStoreToUser,
  getUsers,
  unassignStoreFromUser,
} from '../../api/user';

const initialState = {
  userData: [],
  isLoading: false,
  error: null,
  totalPages: 0,
  currentPage: 0,
  totalElements: 0,
  pageSize: 0,
};

const UserSlice = createSlice({
  name: 'UserSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.userData = action.payload.content;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.pageable.pageNumber + 1;
        state.pageSize = action.payload.pageable.pageSize;
        state.totalElements = action.payload.totalElements;
        state.isLoading = false;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });

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
