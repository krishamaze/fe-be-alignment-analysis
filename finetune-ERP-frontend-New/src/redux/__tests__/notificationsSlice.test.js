import { describe, it, expect } from 'vitest';
import notificationsReducer, {
  addNotification,
  markRead,
  clearNotifications,
} from '../slice/notificationsSlice';

describe('notifications slice', () => {
  it('should handle add and markRead', () => {
    let state = { items: [] };
    state = notificationsReducer(state, addNotification({ id: 1, message: 'Hi', read: false }));
    expect(state.items.length).toBe(1);
    state = notificationsReducer(state, markRead(1));
    expect(state.items[0].read).toBe(true);
    state = notificationsReducer(state, clearNotifications());
    expect(state.items.length).toBe(0);
  });
});
