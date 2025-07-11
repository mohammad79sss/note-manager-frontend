import React, { useEffect, useState } from 'react';
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {setLoginFalse} from "../../../store/redux/slices/loginSlice.js";
import {useDispatch} from "react-redux";
import {logoutUser} from "../../shared/utils/functions.js";


const Chatroom = () => {
    const { chatroomId } = useParams();
    console.log('chatroomId from useParams:', chatroomId);
    const userId = localStorage.getItem("userId");
    const baseApiUrl = import.meta.env.VITE_BASE_API_URL;
    const [loading, setLoading] = useState(true);
    const [chatroom,setChatroom]=useState({});
    const [messages, setMessages]=useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [newMessageToggler, setNewMessageToggler] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");


    useEffect(() => {
        async function fetchChatroom() {
            console.log('hit')
            try {
                const res = await axios.get(`${baseApiUrl}/chatroom/${chatroomId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setChatroom(res.data);
                console.log(res.data);
                setLoading(false);
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    handleLogout(); // Call logout function on unauthorized
                } else {
                    toast.error('خطا در دریافت اطلاعات چت‌روم');
                    console.error(err);
                }
                setLoading(false);
            }
        }

        fetchChatroom();
    }, [chatroomId]);





    useEffect(() => {
        async function fetchChatroomMessages() {
            console.log('hit')
            try {
                const res = await axios.get(`${baseApiUrl}/message/chatroom/${chatroomId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setMessages(res.data);
                setLoading(false);
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    handleLogout(); // Logout on unauthorized
                } else {
                    toast.error('خطا در دریافت اطلاعات چت‌روم');
                    console.error(err);
                }
                setLoading(false);
            }
        }

        fetchChatroomMessages();
    }, [chatroomId, newMessageToggler]);





    const handleSendMessage = async () => {
        try {
            const payload = {
                chatroomId: chatroomId,
                senderId: userId,
                content: newMessage,
                system: false,
            };
            const res = await axios.post(`${baseApiUrl}/message`, payload);
            setNewMessage(''); // Clear input
            setNewMessageToggler(!newMessageToggler);
        } catch (err) {
            toast.error('خطا در ارسال پیام');
            console.error(err);
        }
    };

    const handleLogout = () => {
        logoutUser(dispatch, navigate);
    };


    return (
        <div className="max-w-3xl mx-auto mt-10 rounded-2xl shadow-lg overflow-hidden ">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-800 to-purple-600 text-white px-6 py-6 rounded-t-2xl shadow-inner">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-3xl font-extrabold tracking-tight">موضوع: {chatroom.title}</h2>
                    <span className="text-xs bg-white text-purple-800 px-3 py-1 rounded-full font-bold shadow">
                        {chatroom?.isShared ? 'عمومی' : 'خصوصی'}
                    </span>
                </div>

                <div className="flex items-center gap-2 bg-white bg-opacity-10 rounded-xl p-3 mb-3 shadow-inner">
                    <svg className="w-5 h-5 text-white opacity-70" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A3.001 3.001 0 016 16h12a3.001 3.001 0 01.879 1.804M12 14a4 4 0 100-8 4 4 0 000 8z" />
                    </svg>
                    <span className="text-sm font-medium">
                        <span className="font-bold">سازنده: {chatroom?.ownerId?.username}</span>
                    </span>
                </div>

                {/* Add this section for allowed users */}
                {chatroom?.allowedUsers?.length > 0 && (
                    <div className="flex items-center gap-2 bg-white bg-opacity-10 rounded-xl p-3 mb-3 shadow-inner">
                        <svg className="w-5 h-5 text-white opacity-70" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold mb-1">کاربران مجاز:</span>
                            <div className="flex flex-wrap gap-2">
                                {chatroom.allowedUsers.map(user => (
                                    <span
                                        key={user._id}
                                        className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full"
                                    >
                                        {user.username}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex items-start gap-3 bg-white bg-opacity-10 p-4 rounded-xl shadow-inner">
                    <svg
                        className="w-5 h-5 text-white opacity-70 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                    <p className="text-sm leading-relaxed italic flex-1">
                        توضیحات: {chatroom.content}
                    </p>
                </div>
            </div>



            {/* Messages */}
            <div className="p-6 h-96 overflow-y-auto space-y-4 bg-gray-50">
                {messages.map((msg) => {
                    const isOwnMessage = msg?.senderId?._id === userId;
                    // Format the timestamp
                    const formattedTimestamp = new Date(msg.timestamp).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                    });

                    return (
                        <div
                            key={msg._id}
                            className={`flex flex-col ${!isOwnMessage ? 'items-end text-right' : 'items-start text-left'}`}
                        >
                            <div className="text-xs text-gray-500 mb-1">{msg?.senderId?.username}</div>
                            <div
                                className={`px-4 py-2 rounded-xl max-w-xs text-sm ${
                                    isOwnMessage
                                        ? 'bg-blue-100 text-blue-900'
                                        : 'bg-gray-200 text-gray-900'
                                }`}
                            >
                                {msg.content}
                            </div>
                            <div className="text-xs text-gray-400 mt-1" title={new Date(msg.timestamp).toString()}>
                                {formattedTimestamp}
                            </div>
                        </div>
                    );
                })}
            </div>


            {/* Input */}
            <div className="border-t px-4 py-3 bg-white flex items-center gap-2">
                <input
                    type="text"
                    placeholder="پیام خود را بنویسید..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 border px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <button
                    onClick={handleSendMessage}
                    className="bg-green-700 text-white px-5 py-2 rounded-xl hover:bg-green-950 transition"
                >
                    ارسال
                </button>
            </div>
        </div>
    );
};

export default Chatroom;
