import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {useDispatch} from "react-redux";
import {logoutUser} from "../../shared/utils/functions.js";

const EditChatroom = () => {
    const { chatroomId } = useParams();
    const baseApiUrl = import.meta.env.VITE_BASE_API_URL;

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        isShared: true,
    });

    const [allowedUsers, setAllowedUsers] = useState([]);
    const [userSearch, setUserSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchChatroom = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await axios.get(`${baseApiUrl}/chatroom/${chatroomId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const { title, content, isShared, allowedUsers } = res.data;
                setFormData({ title, content, isShared });
                setAllowedUsers(allowedUsers || []);
                setLoading(false);
            } catch (err) {
                if (err.response?.status === 401) {
                    handleLogout();
                } else {
                    toast.error('خطا در دریافت اطلاعات چت‌روم');
                    console.error(err);
                }
                setLoading(false);
            }
        };

        fetchChatroom();
    }, [chatroomId, baseApiUrl]);



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleLogout = () => {
        logoutUser(dispatch, navigate);
    };


    const handleIsSharedChange = (value) => {
        setFormData(prev => ({
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
            const token = localStorage.getItem("token");

            const res = await axios.get(`${baseApiUrl}/users?search=${query}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSearchResults(res.data);
        } catch (error) {
            if (error.response?.status === 401) {
                handleLogout();
            } else {
                console.error('User search error:', error);
            }
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        const token = localStorage.getItem("token");

        const payload = {
            title: formData.title,
            content: formData.content,
            isShared: formData.isShared,
            ...(formData.isShared ? {} : { allowedUsers: allowedUsers.map(u => u._id) })
        };

        try {
            const res = await axios.put(`${baseApiUrl}/chatroom/${chatroomId}`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success('چت‌روم با موفقیت ویرایش شد');
            navigate('/');
        } catch (error) {
            if (error.response?.status === 401) {
                handleLogout();
            } else {
                toast.error('خطا در ویرایش چت‌روم');
                console.error(error);
            }
        } finally {
            setSaving(false);
        }
    };


    if (loading) {
        return <div className="text-center mt-10">در حال بارگذاری...</div>;
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg text-right">
            <h2 className="text-2xl font-bold mb-4">ویرایش چت‌روم</h2>
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
                    disabled={saving}
                    className="w-full bg-purple-800 text-white py-2 rounded-xl hover:bg-purple-950 transition mt-10"
                >
                    {saving ? 'در حال ذخیره...' : 'ویرایش چت‌روم'}
                </button>
            </form>
        </div>
    );
};

export default EditChatroom;
