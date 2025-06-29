import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {setLoginTrue} from "../../../store/redux/slices/loginSlice.js";
import {setUserId} from "../../../store/redux/slices/userIdSlice.js";
import {decodeToken} from "../../shared/utils/functions.js";
const Register = () => {
    const baseApiUrl = import.meta.env.VITE_BASE_API_URL;

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        const payload = {
            username,
            email,
            password,
        };

        try {
            // Register the user
            const registerResponse = await axios.post(`${baseApiUrl}/auth/register`, payload);

            if (registerResponse.status === 201 || registerResponse.status === 200) {
                setSuccessMsg('ثبت‌نام با موفقیت انجام شد!');

                // Auto-login immediately after registration
                const loginPayload = {
                    username,
                    password,
                };
                const loginResponse = await axios.post(`${baseApiUrl}/auth/login`, loginPayload);

                if (loginResponse.status === 200) {
                    // Save user info and token
                    localStorage.setItem('username', loginResponse.data.user.username);
                    localStorage.setItem('token', loginResponse.data.token);
                    const userId = decodeToken(response.data.token);
                    dispatch(setLoginTrue());
                    dispatch(setUserId(userId));
                    navigate('/');
                } else {
                    setErrorMsg('ورود پس از ثبت‌نام با خطا مواجه شد.');
                }

            } else {
                setErrorMsg('ثبت‌نام با خطا مواجه شد.');
            }
        } catch (error) {
            setErrorMsg(error.response?.data?.message || 'خطای سرور.');
        }
    };




    return (
        <div className="mt-56 flex items-center justify-center ">
            <div className="w-full max-w-md bg-white text-gray-900 p-10 rounded-2xl shadow-2xl">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">ثبت‌نام</h2>

                {errorMsg && (
                    <div className="bg-red-100 text-red-800 px-4 py-2 rounded mb-4 text-sm">{errorMsg}</div>
                )}
                {successMsg && (
                    <div className="bg-green-100 text-green-800 px-4 py-2 rounded mb-4 text-sm">{successMsg}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block mb-1 text-base font-medium text-purple-800">نام کاربری</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-900 text-black"
                            placeholder="نام کاربری را وارد کنید"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-base font-medium text-purple-800">ایمیل</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-900 text-black"
                            placeholder="ایمیل را وارد کنید"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-base font-medium text-purple-800">رمز عبور</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-900 text-black"
                            placeholder="رمز عبور را وارد کنید"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-purple-800 hover:bg-purple-900 text-white font-semibold py-2 rounded-lg transition"
                    >
                        ثبت‌نام
                    </button>
                </form>

                <p className="text-center text-gray-500 mt-6">
                     حساب دارید؟{' '}
                    <a href="/login" className="mx-2 text-purple-600 hover:underline">
                         وارد شوید
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Register;
