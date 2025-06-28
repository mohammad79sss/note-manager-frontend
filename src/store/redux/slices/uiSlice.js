import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    openSidenav: false,
    sidenavColor: "dark",
    sidenavType: "white",
    transparentNavbar: true,
    fixedNavbar: false,
    openConfigurator: false,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setOpenSidenav: (state, action) => {
            state.openSidenav = action.payload;
        },
        setSidenavColor: (state, action) => {
            state.sidenavColor = action.payload;
        },
        setSidenavType: (state, action) => {
            state.sidenavType = action.payload;
        },
        setTransparentNavbar: (state, action) => {
            state.transparentNavbar = action.payload;
        },
        setFixedNavbar: (state, action) => {
            state.fixedNavbar = action.payload;
        },
        setOpenConfigurator: (state, action) => {
            state.openConfigurator = action.payload;
        },
    },
});

export const {
    setOpenSidenav,
    setSidenavColor,
    setSidenavType,
    setTransparentNavbar,
    setFixedNavbar,
    setOpenConfigurator,
} = uiSlice.actions;

export default uiSlice.reducer;
