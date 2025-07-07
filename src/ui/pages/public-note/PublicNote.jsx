import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PublicNote = () => {
    const baseApiUrl = import.meta.env.VITE_BASE_API_URL;
    const [notes, setNotes] = useState([]);
    const navigate = useNavigate();
    const [isLoading, setIsLoading]= useState(true);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const res = await axios.get(`${baseApiUrl}/notes/public/all`);
                setNotes(res.data);
                setIsLoading(false);
            } catch (err) {
                console.error("خطا در دریافت یادداشت‌ها:", err);
                setIsLoading(false);
            }
        };

        fetchNotes();
    }, []);

    const formatDate = (date) =>
        new Date(date).toLocaleDateString("fa-IR", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });

    const renderNotesGrid = (notes) => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
                <div
                    key={note._id}
                    className="bg-yellow-50 border border-yellow-200 shadow-md rounded-2xl p-5 hover:shadow-lg transition cursor-pointer"
                    onClick={() => navigate(`/note/${note._id}`)}
                >
                    <h3 className="text-xl font-bold text-yellow-800 mb-2">{note.title}</h3>
                    <p className="text-gray-700 mb-3 line-clamp-4 leading-relaxed"
                       dir="rtl"
                       dangerouslySetInnerHTML={{ __html: note.content }}>
                    </p>
                    <div className="text-sm text-gray-600 space-y-1">
                        <p>📅 {formatDate(note.createdAt)}</p>
                        <p>✍️ {note.ownerId?.username}</p>
                        {/*{note.sharedId && <p>🔗 شناسه اشتراک: {note.sharedId}</p>}*/}
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold text-purple-900 mb-2">یادداشت‌های عمومی</h2>

            {notes.length === 0 ? (
                <p className="text-gray-500">
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
            ) : (
                renderNotesGrid(notes)
            )}
        </div>
    );
};

export default PublicNote;
