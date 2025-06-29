import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PublicNote = () => {
    const baseApiUrl = import.meta.env.VITE_BASE_API_URL;
    const [notes, setNotes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const res = await axios.get(`${baseApiUrl}/notes/public/all`);
                setNotes(res.data);
                console.log(res.data)
            } catch (err) {
                console.error("خطا در دریافت یادداشت‌ها:", err);
            }
        };

        fetchNotes();
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold text-purple-900 mb-6">یادداشت‌های عمومی</h2>

            {notes.length === 0 ? (
                <p className="text-gray-500">هیچ یادداشتی یافت نشد.</p>
            ) : (
                <div className="overflow-x-auto rounded-lg shadow bg-white">
                    <table className="min-w-full divide-y divide-gray-200 text-right">
                        <thead className="bg-purple-800 text-white">
                        <tr>
                            <th className="px-6 py-3 text-sm font-semibold">عنوان</th>
                            <th className="px-6 py-3 text-sm font-semibold">توضیحات</th>
                            <th className="px-6 py-3 text-sm font-semibold">نویسنده</th>
                            <th className="px-6 py-3 text-sm font-semibold">شناسه اشتراک‌گذاری</th>
                            <th className="px-6 py-3 text-sm font-semibold">تاریخ</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                        {notes.map((note) => (
                            <tr
                                key={note._id}
                                className="hover:bg-purple-100 cursor-pointer transition"
                                onClick={() => navigate(`/note/${note._id}`)}
                            >
                                <td className="px-6 py-4 text-sm text-gray-800">{note.title}</td>
                                <td className="px-6 py-4 text-sm text-gray-600 whitespace-pre-wrap">
                                    {note.content.length > 60 ? `${note.content.slice(0, 60)}...` : note.content}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">{note.ownerId?.username}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{note.sharedId || '-'}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {new Date(note.createdAt).toLocaleDateString('fa-IR')}
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

export default PublicNote;
