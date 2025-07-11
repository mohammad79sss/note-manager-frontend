import { setLoginFalse } from "../../../store/redux/slices/loginSlice";

export function decodeToken(token) {
    try {
        const payload = token.split('.')[1];
        console.log(payload);
        return JSON.parse(atob(payload));
    } catch (e) {
        return null;
    }
}


export const logoutUser = (dispatch, navigate) => {
    console.log("logoutUser");
    localStorage.clear();
    dispatch(setLoginFalse());
    navigate("/login");
};