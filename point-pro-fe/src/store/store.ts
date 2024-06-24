import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';
import reducer from './reducer';
import { socketMiddleware } from './middlewares';

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(socketMiddleware),
  devTools: import.meta.env.VITE_APP_ENV === 'development',
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action<string>>;
