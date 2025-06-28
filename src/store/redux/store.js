import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import loginReducers from './slices/loginSlice.js';

export const store = configureStore({
    reducer: {
        ui: uiReducer,
        login: loginReducers
    },
});
