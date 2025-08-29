import { render, screen } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import NotificationsPanel from '../common/NotificationsPanel';
import notificationsReducer, {
  addNotification,
} from '@/redux/slice/notificationsSlice';
import { describe, it, expect } from 'vitest';

describe('NotificationsPanel', () => {
  it('renders notifications from store', () => {
    const store = configureStore({
      reducer: { notifications: notificationsReducer },
    });
    store.dispatch(
      addNotification({
        id: 1,
        message: 'hello',
        read: false,
        timestamp: 'now',
      })
    );
    render(
      <Provider store={store}>
        <NotificationsPanel />
      </Provider>
    );
    expect(screen.getByText('hello')).toBeTruthy();
  });
});
