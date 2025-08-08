import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import boardsReducer from './slices/boardsSlice';
import cardsReducer from './slices/cardsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    boards: boardsReducer,
    cards: cardsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;