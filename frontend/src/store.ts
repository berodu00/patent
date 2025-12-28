import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import { patentsApi } from './api/patentsApi';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [patentsApi.reducerPath]: patentsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(patentsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
