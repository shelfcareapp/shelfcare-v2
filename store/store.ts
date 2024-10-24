import { configureStore } from '@reduxjs/toolkit';
import ordersReducer from './slices/orders-slice';
import chatReducer from './slices/chat-slice';

export const store = configureStore({
  reducer: {
    orders: ordersReducer,
    chat: chatReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
