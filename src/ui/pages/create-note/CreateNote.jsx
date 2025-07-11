import React, { useEffect, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import { Bold, Italic, AlignRight, AlignCenter, AlignLeft } from 'lucide-react'
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {logoutUser} from "../../shared/utils/functions.js";

function CreateNote() {
    const [editorStateUpdated, setEditorStateUpdated] = useState(false);
    const [title, setTitle] = useState('');
    const [isShared, setIsShared] = useState(false); // false = خصوصی, true = عمومی
    const userId = localStorage.getItem("userId");
    const baseApiUrl = import.meta.env.VITE_BASE_API_URL;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const editor = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
                defaultAlignment: 'right',
            }),
        ],
        content: '<p dir="rtl" style="text-align: right; height: max-content; padding: 5px; border: 1px solid gold">متن خود را اینجا بنویسید...</p>',
    });

    useEffect(() => {
        if (!editor) return;

        const update = () => setEditorStateUpdated(prev => !prev);

        editor.on('selectionUpdate', update);
        editor.on('transaction', update);

        return () => {
            editor.off('selectionUpdate', update);
            editor.off('transaction', update);
        };
    }, [editor]);

    const handleLogout = () => {
        logoutUser(dispatch, navigate);
    };

    const handleSubmit = async () => {
        const content = editor?.getHTML();

        const body = {
            ownerId: userId,
            title,
            content,
            isShared
        };

        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`${baseApiUrl}/notes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            if (response.status === 401) {
                handleLogout();
                return;
            }

            if (response.ok) {
                alert('یادداشت با موفقیت ثبت شد!');
                setTitle('');
                editor?.commands.setContent('');
                setIsShared(false);
            } else {
                alert('خطا در ثبت یادداشت');
            }
        } catch (error) {
            alert('مشکلی در ارتباط با سرور پیش آمد.');
            console.error("Error submitting note:", error);
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
                <div>
                   نوع دسترسی :
                </div>
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
                ذخیره یادداشت
            </button>
        </div>
    );
}

export default CreateNote;
