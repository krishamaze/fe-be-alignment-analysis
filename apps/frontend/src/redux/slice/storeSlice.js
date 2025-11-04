import { createSlice } from '@reduxjs/toolkit';
import {
  assignBranchHeadToStore,
  createStore,
  getStores,
  modifyStoreStatus,
  softDeleteStore,
  unassignBranchHeadFromStore,
  updateStore,
} from '../../api/store';

const initialState = {
  isLoading: false,
  error: null,
  stores: [],
  totalPages: 0,
  currentPage: 0,
  totalElements: 0,
  pageSize: 0,
};

const storeSlice = createSlice({
  name: 'storeSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createStore.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createStore.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createStore.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(updateStore.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateStore.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updateStore.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(getStores.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getStores.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stores = action?.payload.content;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.pageable.pageNumber + 1;
        state.pageSize = action.payload.pageable.pageSize;
        state.totalElements = action.payload.totalElements;
      })
      .addCase(getStores.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(modifyStoreStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(modifyStoreStatus.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(modifyStoreStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(softDeleteStore.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(softDeleteStore.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stores = state.stores.filter(
          (store) => store.id !== action.payload.id
        );
      })
      .addCase(softDeleteStore.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(assignBranchHeadToStore.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(assignBranchHeadToStore.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.stores.findIndex(
          (store) => store.id === action.payload.id
        );
        if (index !== -1) {
          state.stores[index] = action.payload;
        }
      })
      .addCase(assignBranchHeadToStore.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(unassignBranchHeadFromStore.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(unassignBranchHeadFromStore.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.stores.findIndex(
          (store) => store.id === action.payload.id
        );
        if (index !== -1) {
          state.stores[index] = action.payload;
        }
      })
      .addCase(unassignBranchHeadFromStore.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export default storeSlice.reducer;
