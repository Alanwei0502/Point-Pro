import { configureStore } from '@reduxjs/toolkit';
import reducer from './reducer';
import { socketMiddleware } from './middlewares';

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(socketMiddleware),
  devTools: import.meta.env.VITE_APP_ENV === 'development',
});

