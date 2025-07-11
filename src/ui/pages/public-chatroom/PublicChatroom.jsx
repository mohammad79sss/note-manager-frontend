import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {useDispatch} from "react-redux";
import {logoutUser} from "../../shared/utils/functions.js";

const PublicChatroom = () => {
    const baseApiUrl = import.meta.env.VITE_BASE_API_URL;
    const [chatrooms, setChatrooms] = useState([]);
    const [isLoading, setIsLoading]= useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const handleLogout = () => {
        logoutUser(dispatch, navigate);
    };

    useEffect(() => {
        const getAllPublicChatrooms = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await axios.get(`${baseApiUrl}/chatroom/public/all`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setChatrooms(response.data);
                console.log(response.data);
                setIsLoading(false);
            } catch (e) {
                if (e.response?.status === 401) {
                    handleLogout();
                } else {
                    console.error("Error fetching public-chatroom chatrooms:", e);
                }
                setIsLoading(false);
            }
        };

        getAllPublicChatrooms();
    }, []);


    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold text-purple-900 mb-6">گفتگوهای عمومی</h2>

            {chatrooms.length === 0 ? (
                <p className="text-gray-500">
                    {isLoading ?
                        <span>
                             در حال دریافت اطلاعات
                            </span>
                        :
                        <span>
                             هیچ گفت و گویی وجود ندارد.
                            </span>
                    }
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-sm font-semibold">عنوان</th>
                            <th className="px-6 py-3 text-sm font-semibold">توضیحات</th>
                            <th className="px-6 py-3 text-sm font-semibold">سازنده</th>
                            <th className="px-6 py-3 text-sm font-semibold">شناسه اشتراک‌گذاری</th>
                            <th className="px-6 py-3 text-sm font-semibold">تاریخ ساخت</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                        {chatrooms.map((room) => (
                            <tr
                                key={room._id}
                                className="hover:bg-purple-100 cursor-pointer transition"
                                onClick={() => navigate(`/chatroom/${room._id}`)}
                            >
                                <td className="px-6 py-4 text-sm font-medium text-gray-800">{room.title}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{room.content}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{room.ownerId?.username}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{room.sharedId || '-'}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {new Date(room.createdAt).toLocaleDateString('fa-IR')}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PublicChatroom;
