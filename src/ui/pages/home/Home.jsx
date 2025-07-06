import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from 'react-hot-toast';
import {deleteNote} from "../../../../../controllers/noteController.js";

export default function Home() {
    const [myNotes, setMyNotes] = useState([]);
    const [sharedNotes, setSharedNotes] = useState([]);
    const [myChatrooms, setMyChatrooms] = useState([]);
    const [sharedChatrooms, setSharedChatrooms] = useState([]);
    const [joinCode, setJoinCode] = useState("");
    const navigate = useNavigate();
    const baseApiUrl = import.meta.env.VITE_BASE_API_URL;
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resMyNotes, resMyChats, resSharedChats] = await Promise.all([
                    axios.get(`${baseApiUrl}/notes/user/${userId}`),
                    axios.get(`${baseApiUrl}/chatroom/by-user/${userId}`),
                    axios.get(`${baseApiUrl}/chatroom/access/${userId}`),
                ]);

                setMyNotes(resMyNotes.data);
                setMyChatrooms(resMyChats.data);
                setSharedChatrooms(resSharedChats.data);
            } catch (error) {
                console.error("Error fetching dashboard data", error);
            }
        };

        fetchData();
    }, []);

    const formatDate = (date) =>
        new Date(date).toLocaleDateString("fa-IR", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });

    const handleJoinChatroom = async () => {
        if (!joinCode.trim()) return;

        try {
            const res = await axios.get(`${baseApiUrl}/chatroom/by-share-id/${userId}/${joinCode}`);
            const chatroom = res.data;

            if (chatroom?._id) {
                navigate(`/chatroom/${chatroom._id}`);
            } else {
                toast.error('چت‌روم نامعتبر است', { duration: 6000 });
            }
        } catch (error) {
            const status = error.response?.status;
            if (status === 404) {
                toast.error('چت‌روم یافت نشد', { duration: 6000 });
            } else if (status === 403) {
                toast.error('دسترسی غیرمجاز به چت‌روم خصوصی', { duration: 6000 });
            } else {
                toast.error('خطای ناشناخته در ورود به چت‌روم', { duration: 6000 });
            }
        }
    };

    const deleteNoteHandler = async (e, note) => {
        e.stopPropagation();

        const confirmed = window.confirm('آیا مطمئن هستید؟');
        if (!confirmed) return;

        try {
            const res = await axios.delete(`${baseApiUrl}/notes/${note._id}`);

            if (res.status === 200 || res.status === 204) {
                setMyNotes((prev) => prev.filter((n) => n._id !== note._id));
                toast.success('یادداشت با موفقیت حذف شد');
            } else {
                toast.error('حذف یادداشت با مشکل مواجه شد');
            }
        } catch (err) {
            console.error("Delete error:", err);
            toast.error('خطا در ارتباط با سرور.');
        }
    };



    const renderNotesGrid = (notes) => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
                <div
                    key={note._id}
                    className="bg-yellow-50 border border-yellow-200 shadow-md rounded-2xl p-5 hover:shadow-lg transition cursor-pointer"
                    onClick={() => navigate(`/note/${note._id}`)}
                >
                    <h3 className="text-xl font-bold text-yellow-800 mb-2">
                        {note.title}
                    </h3>

                    <p
                        className="text-gray-700 mb-3 line-clamp-4 leading-relaxed"
                        dir="rtl"
                        dangerouslySetInnerHTML={{ __html: note.content }}
                    />

                    <div className="text-sm text-gray-600 mt-2">
                        <p>📅 {formatDate(note.createdAt)}</p>
                        <p
                            className={`text-sm font-medium px-3 mt-3 py-1 rounded-full inline-block ${
                                note.isShared ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'
                            }`}
                        >
                            {note.isShared ? '🌍 عمومی' : '🔒 خصوصی'}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center mt-4 gap-2">
                        <button
                            onClick={(e) => deleteNoteHandler(e, note)}
                            className="bg-red-100 text-red-700 px-4 py-1 rounded-xl hover:bg-red-200 transition text-sm"
                        >
                            🗑️ حذف
                        </button>


                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/edit-note/${note._id}`);
                            }}
                            className="bg-blue-100 text-blue-700 px-4 py-1 rounded-xl hover:bg-blue-200 transition text-sm"
                        >
                            ✏️ ویرایش
                        </button>
                    </div>
                </div>
            ))}
        </div>

    );

    const renderTable = (items, type) => (
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow mt-3">
            <table className="min-w-full text-sm text-right rtl text-gray-700">
                <thead className="bg-purple-900 text-white">
                <tr>
                    <th className="p-3">عنوان</th>
                    <th className="p-3">توضیح</th>
                    <th className="p-3">نویسنده</th>
                    <th className="p-3">تاریخ ایجاد</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                {items.map((item) => (
                    <tr
                        key={item._id}
                        onClick={() => navigate(`/${type}/${item._id}`)}
                        className="cursor-pointer hover:bg-purple-50 transition"
                    >
                        <td className="p-3 font-semibold">{item.title}</td>
                        <td className="p-3 text-gray-600">{item.content}</td>
                        <td className="p-3">{item.ownerId?.username}</td>
                        <td className="p-3">{formatDate(item.createdAt)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="p-6 mt-6 space-y-12">

            <div className="w-full h-1 bg-purple-950"></div>

            <section>
                <h2 className="text-2xl font-bold text-purple-800 mb-4">یادداشت‌های من</h2>
                {myNotes.length > 0 ? (
                    renderNotesGrid(myNotes)
                ) : (
                    <p className="text-gray-600">هیچ یادداشتی وجود ندارد.</p>
                )}
            </section>

            <section>
                <h2 className="text-xl font-bold text-purple-800 mb-2">گفتگوهای من</h2>
                {renderTable(myChatrooms, "chatroom")}
            </section>

            <div className="w-full h-1 bg-purple-950"></div>

            <section>
                <div className="max-w-md mx-auto">
                    <label className="block text-right font-semibold text-purple-800 mb-2">
                        پیوستن به گفتگو از طریق شناسه گفتگو
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="شناسه گفتگو را وارد کنید"
                            className="flex-grow border px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={joinCode}
                            onChange={(e) => setJoinCode(e.target.value)}
                        />
                        <button
                            onClick={handleJoinChatroom}
                            className="bg-purple-800 text-white px-4 py-2 rounded-xl hover:bg-purple-900 transition"
                        >
                            پیوستن
                        </button>
                    </div>
                </div>
            </section>

            <section>
                <h2 className="text-xl font-bold text-purple-800 mb-2">گفتگوهای خصوصی قابل دسترس</h2>
                {renderTable(sharedChatrooms, "chatroom")}
            </section>

        </div>
    );
}
