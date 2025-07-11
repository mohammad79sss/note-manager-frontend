import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import {useDispatch} from "react-redux";
import {logoutUser} from "../../shared/utils/functions.js";

function EditUser() {
    const userId = localStorage.getItem('userId')
    const baseApiUrl = import.meta.env.VITE_BASE_API_URL;

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await axios.get(`${baseApiUrl}/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const { username, email } = res.data;
                console.log(res.data);
                setForm({ username, email, password: "" });
                setLoading(false);
            } catch (error) {
                if (error.response?.status === 401) {
                    handleLogout();
                } else {
                    console.error("Error fetching user:", error);
                    toast.error("خطا در دریافت اطلاعات کاربر");
                }
                setLoading(false);
            }
        };
        fetchUser();
    }, [userId, baseApiUrl]);




    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        const payload = {
            username: form.username,
            email: form.email,
        };

        if (form.password.trim() !== "") {
            payload.password = form.password;
        }

        try {
            await axios.put(`${baseApiUrl}/users/${userId}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            toast.success("کاربر با موفقیت ویرایش شد");
            localStorage.setItem('username', form.username);
            navigate("/"); // Or wherever you want to redirect
        } catch (error) {
            if (error.response?.status === 401) {
                handleLogout();
            } else {
                console.error("Error updating user:", error);
                toast.error("خطا در ویرایش کاربر");
            }
        }
    };



    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleLogout = () => {
        logoutUser(dispatch, navigate);
    };

    if (loading) return <div className="p-6">در حال بارگذاری...</div>;

    return (
        <div className="p-6 max-w-xl mx-auto mt-6">
            <h2 className="text-2xl font-semibold mb-4">ویرایش کاربر</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">نام کاربری</label>
                    <input
                        type="text"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">ایمیل</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">تغییر رمز عبور (اختیاری)</label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="رمز عبور جدید را وارد کنید"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                    ذخیره تغییرات
                </button>
            </form>
        </div>
    );
}

export default EditUser;
