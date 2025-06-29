import React, {useState} from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {setLoginTrue} from "../../../store/redux/slices/loginSlice.js";
import {setUserId} from "../../../store/redux/slices/userIdSlice.js";
import {decodeToken} from "../../shared/utils/functions.js";

const Login = () => {
    const baseApiUrl = import.meta.env.VITE_BASE_API_URL;

    const [username, setUsername]  = useState('');
    const [password, setPassword ] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = { username, password };
            const response = await axios.post(`${baseApiUrl}/auth/login`, data);

            if (response.status === 200) {
                localStorage.setItem('username', response.data.user.username);
                localStorage.setItem('token', response.data.token);
                const userId = decodeToken(response.data.token);
                console.log(userId)
                dispatch(setLoginTrue());
                dispatch(setUserId(userId));
                navigate('/');
            } else {
                console.error('Unexpected response format:', response.data);
            }
        } catch (error) {
            console.error('Login failed:', error.response?.data || error.message);
        }
    };




    return (
        <div className="mt-56 flex items-center justify-center ">
            <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
                    ورود به حساب
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-base font-medium text-purple-800 mb-1">
                            نام کاربری
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-800"
                            placeholder="نام کاربری را وارد کنید"
                            required
                            onChange={(e)=>{setUsername(e.target.value)}}
                        />
                    </div>

                    <div>
                        <label className="block text-base font-medium text-purple-800 mb-1">
                            رمز عبور
                        </label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-800"
                            placeholder="رمز عبور را وارد کنید"
                            required
                            onChange={(e)=>{setPassword(e.target.value)}}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-purple-800 text-white font-semibold py-2 rounded-lg hover:bg-purple-950 transition"
                    >
                        ورود
                    </button>
                </form>

                <p className="text-center text-base text-gray-500 mt-6">
                     حساب ندارید؟<button onClick={()=>navigate('/register')} className="text-purple-600 font-medium hover:underline mx-2">  ثبت‌نام </button>
                </p>
            </div>
        </div>
    );
};

export default Login;
