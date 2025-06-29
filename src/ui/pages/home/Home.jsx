import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {useSelector} from "react-redux";

export default function Home() {
    const [myNotes, setMyNotes] = useState([]);
    const [sharedNotes, setSharedNotes] = useState([]);
    const [myChatrooms, setMyChatrooms] = useState([]);
    const [sharedChatrooms, setSharedChatrooms] = useState([]);
    const navigate = useNavigate();
    const baseApiUrl = import.meta.env.VITE_BASE_API_URL;
    const userId = localStorage.getItem('userId');
    console.log('id=',userId.id);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resMyNotes, resMyChats, resSharedChats] = await Promise.all([
                    axios.get(`${baseApiUrl}/notes/user/${userId}`), // Replace this
                    axios.get(`${baseApiUrl}/chatroom/by-user/${userId}`), // Replace this
                    axios.get(`${baseApiUrl}/chatroom/access/${userId}`), // Replace this
                ]);

                setMyNotes(resMyNotes.data);
                console.log(resMyNotes.data);

                setMyChatrooms(resMyChats.data);
                console.log(resMyChats.data);

                setSharedChatrooms(resSharedChats.data);
                console.log(resSharedChats.data);

            } catch (error) {
                console.error("Error fetching dashboard data", error);
            }
        };

        fetchData();
    }, []);

    const renderTable = (items, type) => (
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow mt-6">
            <table className="min-w-full text-sm text-right rtl text-gray-700">
                <thead className="bg-purple-900 text-white">
                <tr>
                    <th className="p-3">عنوان</th>
                    <th className="p-3">توضیح</th>
                    <th className="p-3">نویسنده</th>
                    <th className="p-3">شناسه اشتراک</th>
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
                        <td className="p-3">{item.sharedId}</td>
                        <td className="p-3">{new Date(item.createdAt).toLocaleDateString("fa-IR")}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="p-6 mt-14 space-y-12">
            <section>
                <h2 className="text-xl font-bold text-purple-800 mb-2">نوت‌های من</h2>
                {renderTable(myNotes, "note")}
            </section>

            <section>
                <h2 className="text-xl font-bold text-purple-800 mb-2">گفتگوهای من</h2>
                {renderTable(myChatrooms, "chatroom")}
            </section>

            <section>
                <h2 className="text-xl font-bold text-purple-800 mb-2">گفتگوهای قابل دسترس</h2>
                {renderTable(sharedChatrooms, "chatroom")}
            </section>
        </div>
    );
}
