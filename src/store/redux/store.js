import { configureStore } from '@reduxjs/toolkit';
import loginReducers from './slices/loginSlice.js';
import userIdReducer from './slices/userIdSlice.js'
export const store = configureStore({
    reducer: {
        login: loginReducers,
        userId: userIdReducer
    },
});
