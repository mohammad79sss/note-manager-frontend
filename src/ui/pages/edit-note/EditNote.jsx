import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { Bold, Italic, AlignRight, AlignCenter, AlignLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

function EditNote() {
    const { noteId } = useParams();
    const navigate = useNavigate();
    const baseApiUrl = import.meta.env.VITE_BASE_API_URL;

    const [title, setTitle] = useState('');
    const [isShared, setIsShared] = useState(false);
    const [loading, setLoading] = useState(true);

    const editor = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
                defaultAlignment: 'right',
            }),
        ],
        content: '<p dir="rtl" style="text-align: right;">در حال بارگذاری...</p>',
    });

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const res = await axios.get(`${baseApiUrl}/notes/${noteId}`);
                const { title, content, isShared } = res.data;
                setTitle(title);
                setIsShared(isShared);
                editor?.commands.setContent(content || '');
                setLoading(false);
            } catch (error) {
                console.error("Error fetching note:", error);
                toast.error("خطا در دریافت اطلاعات یادداشت");
                setLoading(false);
            }
        };

        if (editor) {
            fetchNote();
        }
    }, [noteId, baseApiUrl, editor]);

    const handleSubmit = async () => {
        const content = editor?.getHTML();

        const payload = {
            title,
            content,
            isShared
        };

        try {
            await axios.put(`${baseApiUrl}/notes/${noteId}`, payload);
            toast.success("یادداشت با موفقیت ویرایش شد");
            navigate("/");
        } catch (error) {
            console.error("Error updating note:", error);
            toast.error("خطا در ویرایش یادداشت");
        }
    };

    const IconButton = ({ onClick, Icon, label, active }) => (
        <button
            onClick={onClick}
            className={`p-2 border rounded-lg transition ${active ? 'bg-blue-100 text-blue-600 border-blue-400' : 'hover:bg-gray-100'}`}
            title={label}
        >
            <Icon className="w-5 h-5" />
        </button>
    );

    if (loading) return <div className="p-6">در حال بارگذاری...</div>;

    return (
        <div className="max-w-3xl mx-auto mt-20 p-4 bg-white rounded-2xl shadow-md border" dir="rtl" style={{ fontFamily: 'B Koodak, sB Nazanin' }}>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="عنوان یادداشت"
                className="w-full mb-4 p-3 border rounded-xl text-right"
            />

            <div className="mb-4 flex gap-4 justify-between p-4 bg-purple-50 rounded">
                <div>نوع دسترسی :</div>
                <div className='flex gap-2'>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="visibility"
                            checked={!isShared}
                            onChange={() => setIsShared(false)}
                        />
                        خصوصی
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="visibility"
                            checked={isShared}
                            onChange={() => setIsShared(true)}
                        />
                        عمومی
                    </label>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4 justify-end">
                <IconButton onClick={() => editor?.chain().focus().toggleBold().run()} Icon={Bold} label="بولد" active={editor?.isActive('bold')} />
                <IconButton onClick={() => editor?.chain().focus().toggleItalic().run()} Icon={Italic} label="ایتالیک" active={editor?.isActive('italic')} />
                <IconButton onClick={() => editor?.chain().focus().setTextAlign('right').run()} Icon={AlignRight} label="راست‌چین" active={editor?.isActive({ textAlign: 'right' })} />
                <IconButton onClick={() => editor?.chain().focus().setTextAlign('center').run()} Icon={AlignCenter} label="وسط‌چین" active={editor?.isActive({ textAlign: 'center' })} />
                <IconButton onClick={() => editor?.chain().focus().setTextAlign('left').run()} Icon={AlignLeft} label="چپ‌چین" active={editor?.isActive({ textAlign: 'left' })} />
            </div>

            <div className="border rounded-xl p-4 min-h-[200px] prose prose-sm prose-slate" dir="rtl">
                <EditorContent editor={editor} />
            </div>

            <button
                onClick={handleSubmit}
                className="mt-6 w-full bg-purple-800 text-white py-2 rounded-xl hover:bg-purple-950 transition"
            >
                ذخیره تغییرات
            </button>
        </div>
    );
}

export default EditNote;
