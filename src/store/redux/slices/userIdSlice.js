import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userId:''
};

const userIdSlice= createSlice({
    name:'userId',
    initialState,
    reducers:{
        setUserId: (state, action) => {
            state.userId = action.payload.id;
            localStorage.setItem('userId',action.payload.id)
        },
    }
})

export const {setUserId} = userIdSlice.actions;
export default userIdSlice.reducer;