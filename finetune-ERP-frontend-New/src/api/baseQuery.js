import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import END_POINTS from '../utils/Endpoints';
import { logout, setCredentials } from '../redux/slice/authSlice';

const getCookieJSON = (key) => {
  try {
    const value = Cookies.get(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: END_POINTS.API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token || Cookies.get('token');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken =
      api.getState().auth.refreshToken || Cookies.get('refreshToken');
    if (refreshToken) {
      const refreshResult = await rawBaseQuery(
        {
          url: END_POINTS.REFRESH_TOKEN,
          method: 'POST',
          body: { refresh: refreshToken },
        },
        api,
        extraOptions
      );
      if (refreshResult.data?.access) {
        api.dispatch(
          setCredentials({
            user: api.getState().auth.user || getCookieJSON('user'),
            token: refreshResult.data.access,
            refreshToken,
          })
        );
        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout());
        toast.error('Session expired. Please log in again.');
      }
    } else {
      api.dispatch(logout());
      toast.error('Session expired. Please log in again.');
    }
  }
  if (result.error?.status === 429) {
    toast.error('Too many requests. Please try again later.');
  }
  return result;
};

export default rawBaseQuery;
