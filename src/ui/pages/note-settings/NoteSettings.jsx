import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {logoutUser} from "../../shared/utils/functions.js";

function NoteSettings() {
    const baseApiUrl = import.meta.env.VITE_BASE_API_URL;
    const [notes, setNotes] = useState([]);
    const [isLoading, setIsLoading]= useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const handleLogout = () => {
        logoutUser(dispatch, navigate);
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {

            const res = await axios.get(`${baseApiUrl}/notes`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setNotes(res.data);
            setIsLoading(false);
        } catch (error) {
            if (error.response?.status === 401) {
                handleLogout();
            } else {
                console.error("Error fetching notes:", error);
                toast.error("خطا در دریافت لیست یادداشت‌ها");
            }
            setIsLoading(false);
        }
    };

    const handleDelete = async (noteId) => {
        const confirmDelete = window.confirm("آیا مطمئن هستید که می‌خواهید این یادداشت را حذف کنید؟");
        if (!confirmDelete) return;

        try {

            await axios.delete(`${baseApiUrl}/notes/${noteId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setNotes((prev) => prev.filter((note) => note._id !== noteId));
            toast.success("یادداشت با موفقیت حذف شد");
        } catch (error) {
            if (error.response?.status === 401) {
                handleLogout();
            } else {
                console.error("Error deleting note:", error);
                toast.error("خطا در حذف یادداشت");
            }
        }
    };


    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mx-5 my-8">تنظیمات یادداشت‌ها</h2>
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
                    {notes.map((note) => (
                        <tr key={note._id} className="hover:bg-gray-50 text-center">
                            <td className="px-4 py-2 border-b">{note.title}</td>
                            <td className="px-4 py-2 border-b">
                                {/* Render content as plain text without HTML tags */}
                                <div
                                    className="truncate max-w-[300px] mx-auto"
                                    dangerouslySetInnerHTML={{ __html: note.content }}
                                />
                            </td>
                            <td className="px-4 py-2 border-b">
                                {note.isShared ? "بله" : "خیر"}
                            </td>
                            <td className="px-4 py-2 border-b">
                                {note.ownerId?.username || "نامشخص"}
                            </td>
                            <td className="px-4 py-2 border-b">
                                {new Date(note.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-2 border-b">
                                <button
                                    onClick={() => handleDelete(note._id)}
                                    className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
                                >
                                    حذف
                                </button>
                            </td>
                        </tr>
                    ))}
                    {notes.length === 0 && (
                        <tr>
                            <td colSpan="6" className="text-center py-4 text-gray-500">
                                {isLoading ?
                                    <span>
                             در حال دریافت اطلاعات
                            </span>
                                    :
                                    <span>
                             هیچ یادداشتی وجود ندارد.
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

export default NoteSettings;
