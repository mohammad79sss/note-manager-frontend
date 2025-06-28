import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLoggedIn:false
};


const loginSlice = createSlice({
    name :"login",
    initialState,
    reducers : {
        setLoginTrue : (state)=>{
            console.log("hiiiiii")
            state.isLoggedIn = true;
        },
        setLoginFalse:(state)=>{
            state.isLoggedIn = false;
        }
    }

})

export const {setLoginTrue,setLoginFalse} = loginSlice.actions;

export default loginSlice.reducer;