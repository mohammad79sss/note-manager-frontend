import './Home.css';
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from 'react-hot-toast';
import {deleteNote} from "../../../../../controllers/noteController.js";
import chatroom from "../chatroom/Chatroom.jsx";
import {logoutUser} from "../../shared/utils/functions.js";


export default function Home() {
    const [myNotes, setMyNotes] = useState([]);
    const [sharedNotes, setSharedNotes] = useState([]);
    const [myChatrooms, setMyChatrooms] = useState([]);
    const [sharedChatrooms, setSharedChatrooms] = useState([]);
    const [joinCode, setJoinCode] = useState("");
    const navigate = useNavigate();
    const baseApiUrl = import.meta.env.VITE_BASE_API_URL;
    const userId = localStorage.getItem('userId');
    const [isLoading, setIsLoading]= useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");

                const [resMyNotes, resMyChats, resSharedChats] = await Promise.all([
                    axios.get(`${baseApiUrl}/notes/user/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`${baseApiUrl}/chatroom/by-user/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`${baseApiUrl}/chatroom/access/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                ]);

                setMyNotes(resMyNotes.data);
                setMyChatrooms(resMyChats.data);
                setSharedChatrooms(resSharedChats.data);
                setIsLoading(false);
            } catch (error) {
                if (error.response?.status === 401) {
                    handleLogout();
                } else {
                    console.error("Error fetching dashboard data", error);
                }
                setIsLoading(false);
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


    const handleLogout = () => {
        logoutUser(dispatch, navigate);
    };

    const handleJoinChatroom = async () => {
        if (!joinCode.trim()) return;

        try {
            const token = localStorage.getItem("token");

            const res = await axios.get(`${baseApiUrl}/chatroom/by-share-id/${userId}/${joinCode}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const chatroom = res.data;

            if (chatroom?._id) {
                navigate(`/chatroom/${chatroom._id}`);
            } else {
                toast.error('چت‌روم نامعتبر است', { duration: 6000 });
            }
        } catch (error) {
            const status = error.response?.status;
            if (status === 401) {
                handleLogout();
            } else if (status === 404) {
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
            const token = localStorage.getItem("token");

            const res = await axios.delete(`${baseApiUrl}/notes/${note._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.status === 200 || res.status === 204) {
                setMyNotes((prev) => prev.filter((n) => n._id !== note._id));
                toast.success('یادداشت با موفقیت حذف شد');
            } else {
                toast.error('حذف یادداشت با مشکل مواجه شد');
            }
        } catch (err) {
            if (err.response?.status === 401) {
                handleLogout();
            } else {
                console.error("Delete error:", err);
                toast.error('خطا در ارتباط با سرور.');
            }
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

    const renderTable = (items, tableType) => {
        let isMyChatroom = (tableType === "myChatroom") ? true :  false;
        console.log(isMyChatroom)


        const handleDeleteChatroom = async (e, item) => {
            e.stopPropagation();
            const confirmed = window.confirm('آیا از حذف این گفتگو اطمینان دارید؟');
            if (!confirmed) return;

            try {
                // You should replace this with your actual DELETE request
                // await axios.delete(`${baseApiUrl}/chatroom/${item._id}`);

                toast.success('گفتگو با موفقیت حذف شد');
                // Optionally update state here
            } catch (err) {
                console.error("Delete error:", err);
                toast.error('خطا در حذف گفتگو');
            }
        };

        return (
            <div className="overflow-x-auto shadow mt-3">
                <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="p-3">عنوان</th>
                        <th className="p-3">توضیح</th>
                        <th className="p-3">نویسنده</th>
                        <th className="p-3">تاریخ ایجاد</th>
                        {isMyChatroom && <th className="p-3 text-center">عملیات</th>}
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {items.map((item) => (
                        <tr
                            key={item._id}
                            className="hover:bg-purple-50 transition cursor-pointer"
                            onClick={() => navigate(`/chatroom/${item._id}`)}
                        >
                            <td
                                className="p-3 font-semibold cursor-pointer"
                                onClick={() => navigate(`/${type}/${item._id}`)}
                            >
                                {item.title}
                            </td>
                            <td className="p-3 text-gray-600">{item.content}</td>
                            <td className="p-3">{item.ownerId?.username}</td>
                            <td className="p-3">{formatDate(item.createdAt)}</td>
                            {isMyChatroom && (
                                <td className="p-3 flex gap-2 justify-center">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/edit-chatroom/${item._id}`); // <-- adjust this path as needed
                                        }}
                                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-xl hover:bg-blue-200 text-xs"
                                    >
                                        ✏️ ویرایش
                                    </button>
                                    <button
                                        onClick={(e) => handleDeleteChatroom(e, item)}
                                        className="bg-red-100 text-red-700 px-3 py-1 rounded-xl hover:bg-red-200 text-xs"
                                    >
                                        🗑️ حذف
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    };


    return (
        <div className="p-6 mt-6 space-y-12">

            <div className="w-full h-1 bg-purple-950"></div>

            <section className='custom-size'>
                <h2 className="text-2xl font-bold text-purple-800 mb-4">یادداشت‌های من</h2>
                {myNotes.length > 0 ? (
                    renderNotesGrid(myNotes)
                ) : (
                    <p className="text-gray-600">

                        {isLoading ?
                            <span>
                             در حال دریافت اطلاعات
                            </span>
                            :
                            <span>
                             هیچ یادداشتی وجود ندارد.
                            </span>
                        }

                    </p>
                )}
            </section>

            <section>
                <h2 className="text-xl font-bold text-purple-800 mb-2">گفتگوهای من</h2>
                {renderTable(myChatrooms, "myChatroom")}
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
                {renderTable(sharedChatrooms, "publicChatroom")}
            </section>

        </div>
    );
}
