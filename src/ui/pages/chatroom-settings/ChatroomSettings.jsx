import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function ChatroomSettings() {
    const baseApiUrl = import.meta.env.VITE_BASE_API_URL;
    const [chatrooms, setChatrooms] = useState([]);

    useEffect(() => {
        fetchChatrooms();
    }, []);

    const fetchChatrooms = async () => {
        try {
            const res = await axios.get(`${baseApiUrl}/chatroom`);
            setChatrooms(res.data);
        } catch (error) {
            console.error("Error fetching chatrooms:", error);
            toast.error("خطا در دریافت لیست چت‌روم‌ها");
        }
    };

    const handleDelete = async (chatroomId) => {
        const confirmDelete = window.confirm("آیا مطمئن هستید که می‌خواهید این چت‌روم را حذف کنید؟");
        if (!confirmDelete) return;

        try {
            await axios.delete(`${baseApiUrl}/chatroom/${chatroomId}`);
            setChatrooms((prev) => prev.filter((room) => room._id !== chatroomId));
            toast.success("چت‌روم با موفقیت حذف شد");
        } catch (error) {
            console.error("Error deleting chatroom:", error);
            toast.error("خطا در حذف چت‌روم");
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mx-5 my-8">تنظیمات چت‌روم‌ها</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-4 border-b">عنوان</th>
                        <th className="px-4 py-4 border-b">محتوا</th>
                        <th className="px-4 py-4 border-b">عمومی</th>
                        <th className="px-4 py-4 border-b">مالک</th>
                        <th className="px-4 py-4 border-b">تاریخ ایجاد</th>
                        <th className="px-4 py-4 border-b">عملیات</th>
                    </tr>
                    </thead>
                    <tbody>
                    {chatrooms.map((room) => (
                        <tr key={room._id} className="hover:bg-gray-50 text-center">
                            <td className="px-4 py-2 border-b">{room.title}</td>
                            <td className="px-4 py-2 border-b">{room.content}</td>
                            <td className="px-4 py-2 border-b">
                                {room.isShared ? "بله" : "خیر"}
                            </td>
                            <td className="px-4 py-2 border-b">
                                {room.ownerId?.username || "نامشخص"}
                            </td>
                            <td className="px-4 py-2 border-b">
                                {new Date(room.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-2 border-b">
                                <button
                                    onClick={() => handleDelete(room._id)}
                                    className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
                                >
                                    حذف
                                </button>
                            </td>
                        </tr>
                    ))}
                    {chatrooms.length === 0 && (
                        <tr>
                            <td colSpan="6" className="text-center py-4 text-gray-500">
                                هیچ چت‌رومی یافت نشد.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ChatroomSettings;
