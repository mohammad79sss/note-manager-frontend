import React, { useEffect, useState } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {logoutUser} from "../../shared/utils/functions.js";
import {useDispatch} from "react-redux";

const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};



const Note = () => {
    const { noteId } = useParams();
    const [note, setNote] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const baseApiUrl = import.meta.env.VITE_BASE_API_URL;

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const handleLogout = () => {
        logoutUser(dispatch, navigate);
    };

    useEffect(() => {
        const fetchNote = async () => {
            try {

                const res = await axios.get(`${baseApiUrl}/notes/${noteId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setNote(res.data);
            } catch (error) {
                if (error.response?.status === 401) {
                    handleLogout();
                } else {
                    console.error('Error fetching note:', error);
                    toast.error('یادداشت پیدا نشد');
                }
            } finally {
                setLoading(false);
            }
        };

        const fetchComments = async () => {
            try {

                const res = await axios.get(`${baseApiUrl}/comment/note/${noteId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setComments(res.data || []);
            } catch (error) {
                if (error.response?.status === 401) {
                    handleLogout();
                } else {
                    console.error('Error fetching comments:', error);
                    toast.error('عدم دریافت نظرات');
                }
            }
        };

        fetchNote();
        fetchComments();
    }, [noteId]);


    if (loading) return <p className="text-center mt-10 text-lg text-gray-500">در حال بارگذاری...</p>;
    if (!note) return <p className="text-center mt-10 text-lg text-red-500">یادداشتی وجود ندارد</p>;

    return (
        <div className="max-w-3xl mx-auto mt-12 space-y-8 px-4">
            {/* Note Box */}
            <div className="bg-yellow-50 shadow-lg rounded-2xl p-8 border border-yellow-200">
                <h1 className="text-3xl font-extrabold text-yellow-800 mb-4 border-b border-yellow-300 pb-2">
                    {note.title}
                </h1>

                <div
                    className="text-gray-700 text-lg leading-relaxed mb-6 prose prose-sm prose-slate max-w-none text-right"
                    dir="rtl"
                    dangerouslySetInnerHTML={{ __html: note.content }}
                />


                <div className="text-sm text-gray-600 space-y-1 bg-white rounded-xl p-4 shadow-inner">
                    <p><strong>✍️ نویسنده:</strong> {note.ownerId?.username} ({note.ownerId?.email})</p>
                    <p><strong>📅 تاریخ ایجاد:</strong> {formatDate(note.createdAt)}</p>
                    <p><strong>📝 آخرین تغییر:</strong> {formatDate(note.updatedAt)}</p>
                    <p><strong>🔓 وضعیت اشتراک‌گذاری:</strong> {note.isShared ? 'عمومی' : 'خصوصی'}</p>
                </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
                <h2 className="text-xl font-bold text-purple-800 mb-4 border-b pb-2">💬 نظرات</h2>

                {comments.length === 0 ? (
                    <p className="text-gray-500 text-sm">هنوز نظری ثبت نشده است.</p>
                ) : (
                    <ul className="space-y-4">
                        {comments.map((comment) => (
                            <li key={comment._id} className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                                <div className="text-sm text-gray-600 mb-2 flex justify-between">
                                    <span className="font-semibold text-purple-900">{comment.senderId?.username || 'کاربر ناشناس'}</span>
                                    {/*<span className="mx-2">|</span>*/}
                                    <span>{formatDate(comment.timestamp)}</span>
                                </div>
                                <p className="text-gray-800 leading-relaxed">{comment.content}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Note;
