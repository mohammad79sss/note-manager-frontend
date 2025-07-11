import React, { useState } from 'react';
import { RadioGroup } from '@headlessui/react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import axios from "axios";
import toast from 'react-hot-toast';
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {logoutUser} from "../../shared/utils/functions.js";
const CreateChatroom = () => {
    const baseApiUrl = import.meta.env.VITE_BASE_API_URL;

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        isShared: true,
    });

    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);

    const [userSearch, setUserSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [allowedUsers, setAllowedUsers] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleIsSharedChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            isShared: value === 'public',
        }));
    };


    const handleUserSearch = async (query) => {
        setUserSearch(query);

        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        try {
            const res = await axios.get(`${baseApiUrl}/users?search=${query}`);
            setSearchResults(res.data); // assume array of users
        } catch (error) {
            console.error('User search error:', error);
        }
    };

    const handleAddUser = (user) => {
        if (!allowedUsers.find(u => u._id === user._id)) {
            setAllowedUsers(prev => [...prev, user]);
        }
    };

    const handleRemoveUser = (userId) => {
        setAllowedUsers(prev => prev.filter(u => u._id !== userId));
    };

    const handleLogout = () => {
        logoutUser(dispatch, navigate);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ownerId: '685d96031fa25ccf67b09ed4', // Consider replacing this with dynamic user ID if possible
            title: formData.title,
            content: formData.content,
            isShared: formData.isShared,
            ...(formData.isShared ? {} : { allowedUsers: allowedUsers.map(u => u._id) })
        };

        try {
            const res = await axios.post(`${baseApiUrl}/chatroom`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const result = res.data;

            if (result) {
                toast.success('چت‌روم با موفقیت ایجاد شد', {
                    duration: 6000,
                });
                setFormData({
                    title: '',
                    content: '',
                    isShared: true,
                });
                setResponse(result);
            }
        } catch (error) {
            if (error.response?.status === 401) {
                handleLogout();
            } else {
                console.error('Error submitting form:', error);
                toast.error('خطا در ارسال فرم', {
                    duration: 6000,
                });
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg text-right">
            <h2 className="text-2xl font-bold mb-4">ساخت گفتگوی جدید</h2>
            <form onSubmit={handleSubmit} className="mt-6">
                <div>
                    <label className="block text-base mb-1 mt-4">عنوان</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                </div>

                <div>
                    <label className="block text-base mb-1 mt-4">توضیحات</label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                </div>

                <div className="mt-6">
                    <label className="block text-base mb-2">نوع چت‌روم</label>
                    <div className="flex items-center justify-between gap-4">
                        <button
                            type="button"
                            onClick={() => handleIsSharedChange('private')}
                            className={`flex-1 px-4 py-2 text-center rounded-xl border transition ${
                                !formData.isShared
                                    ? 'bg-red-100 border-red-500 text-red-800 font-bold'
                                    : 'border-gray-300 text-gray-700'
                            }`}
                        >
                            خصوصی
                        </button>
                        <button
                            type="button"
                            onClick={() => handleIsSharedChange('public')}
                            className={`flex-1 px-4 py-2 text-center rounded-xl border transition ${
                                formData.isShared
                                    ? 'bg-green-100 border-green-500 text-green-800 font-bold'
                                    : 'border-gray-300 text-gray-700'
                            }`}
                        >
                            عمومی
                        </button>
                    </div>
                </div>

                {!formData.isShared && (
                    <div className="mt-6">
                        <label className="block text-base mb-1">افزودن کاربران مجاز</label>
                        <input
                            type="text"
                            value={userSearch}
                            onChange={(e) => handleUserSearch(e.target.value)}
                            placeholder="جستجوی کاربر..."
                            className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />

                        {searchResults.length > 0 && (
                            <ul className="mt-2 max-h-40 overflow-y-auto border rounded-xl">
                                {searchResults.map((user) => (
                                    <li
                                        key={user._id}
                                        onClick={() => handleAddUser(user)}
                                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                    >
                                        {user.name || user.username}
                                    </li>
                                ))}
                            </ul>
                        )}

                        {allowedUsers.length > 0 && (
                            <div className="mt-4">
                                <label className="block mb-1 text-sm">کاربران انتخاب شده:</label>
                                <ul className="flex flex-wrap gap-2">
                                    {allowedUsers.map(user => (
                                        <li key={user._id} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-xl text-sm flex items-center gap-2">
                                            {user.name || user.username}
                                            <button onClick={() => handleRemoveUser(user._id)} className="text-red-500 hover:text-red-700 text-xs">✕</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}



                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-purple-800 text-white py-2 rounded-xl hover:bg-purple-950 transition mt-10"
                >
                    {loading ? 'در حال ارسال...' : 'ایجاد چت‌روم'}
                </button>

            </form>
        </div>
    );
};

export default CreateChatroom;
