import { createAsyncThunk } from '@reduxjs/toolkit';
import { baseQueryWithReauth } from './baseQuery';
import END_POINTS from '../utils/Endpoints';

export const getUsers = createAsyncThunk(
    'user/getUsers',
    async (params, thunkAPI) => {
        const result = await baseQueryWithReauth(
            { url: `${END_POINTS.GET_USERS}`, method: 'GET', params },
            thunkAPI
        );
        if (result.error) {
            return thunkAPI.rejectWithValue(result.error.data || result.error.status);
        }
        return result.data;
    }
);

export const createUser = createAsyncThunk(
    'user/createUser',
    async (requestBody, thunkAPI) => {
        const result = await baseQueryWithReauth(
            { url: `${END_POINTS.MODIFY_USER}`, method: 'POST', body: requestBody },
            thunkAPI
        );
        if (result.error) {
            return thunkAPI.rejectWithValue(result.error.data || result.error.status);
        }
        return result.data;
    }
);

export const updateUser = createAsyncThunk(
    'user/updateUser',
    async (requestBody, thunkAPI) => {
        const { id } = requestBody;
        const result = await baseQueryWithReauth(
            { url: `${END_POINTS.MODIFY_USER}/${id}`, method: 'PUT', body: requestBody },
            thunkAPI
        );
        if (result.error) {
            return thunkAPI.rejectWithValue(result.error.data || result.error.status);
        }
        return result.data;
    }
);

export const modifyUserStatus = createAsyncThunk(
    'store/modifyUserStatus',
    async (requestBody, thunkAPI) => {
        const { id } = requestBody;
        const result = await baseQueryWithReauth(
            { url: `${END_POINTS.MODIFY_USER}/${id}`, method: 'PATCH', body: requestBody },
            thunkAPI
        );
        if (result.error) {
            return thunkAPI.rejectWithValue(result.error.data || result.error.status);
        }
        return result.data;
    }
);

export const softDeleteUser = createAsyncThunk(
    'store/softDeleteUser',
    async (id, thunkAPI) => {
        const result = await baseQueryWithReauth(
            { url: `${END_POINTS.MODIFY_USER}/${id}`, method: 'DELETE' },
            thunkAPI
        );
        if (result.error) {
            return thunkAPI.rejectWithValue(result.error.data || result.error.status);
        }
        return result.data;
    }
);

export const assignStoreToUser = createAsyncThunk(
    'user/assignStoreToUser',
    async (data, thunkAPI) => {
        const { userId, store } = data;
        const result = await baseQueryWithReauth(
            { url: `${END_POINTS.MODIFY_USER}/${userId}`, method: 'PATCH', body: { store } },
            thunkAPI
        );
        if (result.error) {
            return thunkAPI.rejectWithValue(result.error.data || result.error.status);
        }
        return result.data;
    }
);

export const unassignStoreFromUser = createAsyncThunk(
    'user/unassignStoreFromUser',
    async (data, thunkAPI) => {
        const { userId } = data;
        const result = await baseQueryWithReauth(
            { url: `${END_POINTS.MODIFY_USER}/${userId}`, method: 'PATCH', body: { store: null } },
            thunkAPI
        );
        if (result.error) {
            return thunkAPI.rejectWithValue(result.error.data || result.error.status);
        }
        return result.data;
    }
);
