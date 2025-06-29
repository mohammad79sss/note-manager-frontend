import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import loginReducers from './slices/loginSlice.js';
import userIdReducer from './slices/userIdSlice.js'
export const store = configureStore({
    reducer: {
        ui: uiReducer,
        login: loginReducers,
        userId: userIdReducer
    },
});
