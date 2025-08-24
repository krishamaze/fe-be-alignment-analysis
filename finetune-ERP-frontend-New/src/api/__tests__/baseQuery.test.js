import { vi, describe, it, expect } from 'vitest';

vi.mock('@reduxjs/toolkit/query/react', () => {
  const fn = vi.fn();
  return { fetchBaseQuery: () => fn, mock: fn };
});
import { mock as mockRaw } from '@reduxjs/toolkit/query/react';

vi.mock('react-hot-toast', () => ({
  __esModule: true,
  default: { error: vi.fn() },
}));
import toast from 'react-hot-toast';

vi.mock('../../redux/slice/authSlice', () => ({
  logout: () => ({ type: 'auth/logout' }),
  setCredentials: (payload) => ({ type: 'auth/setCredentials', payload }),
}));

import { baseQueryWithReauth } from '../baseQuery';

describe('baseQueryWithReauth', () => {
  it('logs out and toasts on refresh failure', async () => {
    mockRaw
      .mockResolvedValueOnce({ error: { status: 401 } })
      .mockResolvedValueOnce({ error: { status: 401 } });
    const dispatch = vi.fn();
    await baseQueryWithReauth({ url: '/x' }, {
      dispatch,
      getState: () => ({ auth: { refreshToken: 'r', user: null } }),
    });
    expect(dispatch).toHaveBeenCalledWith({ type: 'auth/logout' });
    expect(toast.error).toHaveBeenCalledWith(
      'Session expired. Please log in again.'
    );
  });

  it('shows throttle toast on 429', async () => {
    mockRaw.mockResolvedValueOnce({ error: { status: 429 } });
    const dispatch = vi.fn();
    await baseQueryWithReauth({ url: '/x' }, { dispatch, getState: () => ({ auth: {} }) });
    expect(toast.error).toHaveBeenCalledWith(
      'Too many requests. Please try again later.'
    );
  });
});
