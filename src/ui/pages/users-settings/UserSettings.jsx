import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function UserSettings() {
    const baseApiUrl = import.meta.env.VITE_BASE_API_URL;
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${baseApiUrl}/users`);
            setUsers(res.data);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("خطا در دریافت لیست کاربران");
        }
    };

    const handleDelete = async (userId) => {
        const confirmDelete = window.confirm("آیا مطمئن هستید که می‌خواهید این کاربر را حذف کنید؟");
        if (!confirmDelete) return;

        try {
            await axios.delete(`${baseApiUrl}/users/${userId}`);
            setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
            toast.success("کاربر با موفقیت حذف شد");
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("خطا در حذف کاربر");
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
                                هیچ کاربری یافت نشد.
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
