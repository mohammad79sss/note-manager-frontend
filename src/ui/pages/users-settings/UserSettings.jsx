import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {logoutUser} from "../../shared/utils/functions.js";

function UserSettings() {
    const baseApiUrl = import.meta.env.VITE_BASE_API_URL;
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading]= useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const handleLogout = () => {
        logoutUser(dispatch, navigate);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.get(`${baseApiUrl}/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setUsers(res.data);
            setIsLoading(false);
        } catch (error) {
            if (error.response?.status === 401) {
                handleLogout();
            } else {
                console.error("Error fetching users:", error);
                toast.error("خطا در دریافت لیست کاربران");
            }
            setIsLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        const confirmDelete = window.confirm("آیا مطمئن هستید که می‌خواهید این کاربر را حذف کنید؟");
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("token");

            await axios.delete(`${baseApiUrl}/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
            toast.success("کاربر با موفقیت حذف شد");
        } catch (error) {
            if (error.response?.status === 401) {
                handleLogout();
            } else {
                console.error("Error deleting user:", error);
                toast.error("خطا در حذف کاربر");
            }
        }
    };


    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mx-5 my-8">تنظیمات کاربران</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-4 border-b">نام کاربری</th>
                        <th className="px-4 py-4 border-b">ایمیل</th>
                        <th className="px-4 py-4 border-b">تاریخ عضویت</th>
                        <th className="px-4 py-4 border-b">عملیات</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50 text-center">
                            <td className="px-4 py-2 border-b">{user.username}</td>
                            <td className="px-4 py-2 border-b">{user.email}</td>
                            <td className="px-4 py-2 border-b">
                                {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-2 border-b">
                                <button
                                    onClick={() => handleDelete(user._id)}
                                    className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
                                >
                                    حذف
                                </button>
                            </td>
                        </tr>
                    ))}
                    {users.length === 0 && (
                        <tr>
                            <td colSpan="4" className="text-center py-4 text-gray-500">
                                {isLoading ?
                                    <span>
                             در حال دریافت اطلاعات
                            </span>
                                    :
                                    <span>
                             هیچ کاربری وجود ندارد.
                            </span>
                                }
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default UserSettings;
