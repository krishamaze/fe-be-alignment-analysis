import { createAsyncThunk } from '@reduxjs/toolkit';
import { baseQueryWithReauth } from './baseQuery';
import END_POINTS from '../utils/Endpoints';

export const createStore = createAsyncThunk(
  'store/createStore',
  async (requestBody, thunkAPI) => {
    const result = await baseQueryWithReauth(
      { url: `${END_POINTS.MODIFY_STORE}`, method: 'POST', body: requestBody },
      thunkAPI
    );
    if (result.error) {
      return thunkAPI.rejectWithValue(result.error.data || result.error.status);
    }
    return result.data;
  }
);

export const updateStore = createAsyncThunk(
  'store/updateStore',
  async (requestBody, thunkAPI) => {
    const { id } = requestBody;
    const result = await baseQueryWithReauth(
      {
        url: `${END_POINTS.MODIFY_STORE}/${id}`,
        method: 'PUT',
        body: requestBody,
      },
      thunkAPI
    );
    if (result.error) {
      return thunkAPI.rejectWithValue(result.error.data || result.error.status);
    }
    return result.data;
  }
);

export const getStores = createAsyncThunk(
  'store/getStores',
  async (params, thunkAPI) => {
    const result = await baseQueryWithReauth(
      { url: `${END_POINTS.GET_STORES}`, method: 'GET', params },
      thunkAPI
    );
    if (result.error) {
      return thunkAPI.rejectWithValue(result.error.data || result.error.status);
    }
    return result.data;
  }
);

export const modifyStoreStatus = createAsyncThunk(
  'store/modifyStoreStatus',
  async (requestBody, thunkAPI) => {
    const { id } = requestBody;
    const result = await baseQueryWithReauth(
      {
        url: `${END_POINTS.MODIFY_STORE}/${id}`,
        method: 'PATCH',
        body: requestBody,
      },
      thunkAPI
    );
    if (result.error) {
      return thunkAPI.rejectWithValue(result.error.data || result.error.status);
    }
    return result.data;
  }
);

export const softDeleteStore = createAsyncThunk(
  'store/softDeleteStore',
  async (id, thunkAPI) => {
    const result = await baseQueryWithReauth(
      { url: `${END_POINTS.MODIFY_STORE}/${id}`, method: 'DELETE' },
      thunkAPI
    );
    if (result.error) {
      return thunkAPI.rejectWithValue(result.error.data || result.error.status);
    }
    return result.data;
  }
);

export const assignBranchHeadToStore = createAsyncThunk(
  'store/assignBranchHeadToStore',
  async (data, thunkAPI) => {
    const { storeId, userId } = data;
    const result = await baseQueryWithReauth(
      {
        url: `${END_POINTS.MODIFY_STORE}/${storeId}/assign-branch-head`,
        method: 'POST',
        body: { user_id: userId },
      },
      thunkAPI
    );
    if (result.error) {
      return thunkAPI.rejectWithValue(result.error.data || result.error.status);
    }
    return result.data;
  }
);

export const unassignBranchHeadFromStore = createAsyncThunk(
  'store/unassignBranchHeadFromStore',
  async (data, thunkAPI) => {
    const { storeId, userId } = data;
    const result = await baseQueryWithReauth(
      {
        url: `${END_POINTS.MODIFY_STORE}/${storeId}/unassign-branch-head`,
        method: 'POST',
        body: { user_id: userId },
      },
      thunkAPI
    );
    if (result.error) {
      return thunkAPI.rejectWithValue(result.error.data || result.error.status);
    }
    return result.data;
  }
);
