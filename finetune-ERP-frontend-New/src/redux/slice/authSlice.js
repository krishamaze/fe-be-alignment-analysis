import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { baseQueryWithReauth } from '../../api/baseQuery';
import END_POINTS from '@/utils/Endpoints';

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, thunkAPI) => {
    const result = await baseQueryWithReauth(
      { url: '/api/auth/register', method: 'POST', body: userData },
      thunkAPI
    );
    if (result.error) {
      return thunkAPI.rejectWithValue(
        result.error.data?.message || 'Registration failed'
      );
    }
    return result.data;
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, thunkAPI) => {
    const result = await baseQueryWithReauth(
      { url: END_POINTS.LOGIN, method: 'POST', body: credentials },
      thunkAPI
    );
    if (result.error) {
      return thunkAPI.rejectWithValue(
        result.error.data?.message || 'Login failed'
      );
    }
    const data = result.data || {};
    const user =
      data.user ||
      (data.username && data.role
        ? { username: data.username, role: data.role, store: data.store }
        : null);

    if (!user || !data.access || !data.refresh) {
      return thunkAPI.rejectWithValue('Invalid login response');
    }

    return {
      user,
      token: data.access,
      refreshToken: data.refresh,
    };
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, thunkAPI) => {
    const result = await baseQueryWithReauth(
      { url: END_POINTS.LOGOUT, method: 'POST' },
      thunkAPI
    );
    thunkAPI.dispatch(logout());
    if (result.error) {
      return thunkAPI.rejectWithValue(
        result.error.data?.message || 'Logout failed'
      );
    }
    return result.data;
  }
);

const getCookie = (key) => Cookies.get(key);
const parseCookieJSON = (key) => {
  try {
    const value = getCookie(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

const initialState = {
  user: parseCookieJSON('user'),
  token: getCookie('token') || null,
  refreshToken: getCookie('refreshToken') || null,
  status: 'idle',
  error: null,
  isAuthenticated: !!getCookie('token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      Cookies.remove('token');
      Cookies.remove('refreshToken');
      Cookies.remove('user');
    },
    setCredentials: (state, action) => {
      const { user, token, refreshToken } = action.payload;
      state.user = user;
      state.token = token;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      // NOTE: Consider HttpOnly cookies for enhanced XSS protection
      // Current implementation allows JS access for SPA token refresh
      Cookies.set('token', token, {
        secure: true,
        sameSite: 'strict',
        expires: 1,
        // TODO: Migrate to HttpOnly cookies with refresh endpoint
      });
      Cookies.set('refreshToken', refreshToken, {
        secure: true,
        sameSite: 'strict',
        expires: 7,
      });
      Cookies.set('user', JSON.stringify(user), {
        secure: true,
        sameSite: 'strict',
        expires: 7,
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        // NOTE: Consider HttpOnly cookies for enhanced XSS protection
        // Current implementation allows JS access for SPA token refresh
        Cookies.set('token', action.payload.token, {
          secure: true,
          sameSite: 'strict',
          expires: 1,
          // TODO: Migrate to HttpOnly cookies with refresh endpoint
        });
        Cookies.set('refreshToken', action.payload.refreshToken, {
          secure: true,
          sameSite: 'strict',
          expires: 7,
        });
        Cookies.set('user', JSON.stringify(action.payload.user), {
          secure: true,
          sameSite: 'strict',
          expires: 7,
        });
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(logoutUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearError, logout, setCredentials } = authSlice.actions;

export const selectAuthToken = (state) =>
  state.auth.token || getCookie('token');
export const selectAuthUser = (state) =>
  state.auth.user || parseCookieJSON('user');
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthRole = (state) =>
  (state.auth.user || parseCookieJSON('user'))?.role;

export default authSlice.reducer;
