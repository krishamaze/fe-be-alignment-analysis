import { createSlice } from '@reduxjs/toolkit';

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: { items: [] },
  reducers: {
    addNotification: (state, action) => {
      state.items.unshift(action.payload);
    },
    markRead: (state, action) => {
      const note = state.items.find((n) => n.id === action.payload);
      if (note) note.read = true;
    },
    clearNotifications: (state) => {
      state.items = [];
    },
  },
});

export const { addNotification, markRead, clearNotifications } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;
