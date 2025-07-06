import './App.css';
import Header from './ui/layouts/header/Header.jsx';
import Sidebar from "./ui/layouts/sidebar/Sidebar.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useEffect } from 'react';
import PublicChatroom from "../src/ui/pages/public-chatroom/PublicChatroom.jsx";
import EditUser from "../src/ui/pages/edit-user/EditUser.jsx";
import Home from "../src/ui/pages/home/Home.jsx";
import Login from "../src/ui/pages/login/Login.jsx";
import Chatroom from "../src/ui/pages/chatroom/Chatroom.jsx";
import CreateChatroom from "../src/ui/pages/create-chatroom/CreateChatroom.jsx";
import CreateNote from "../src/ui/pages/create-note/CreateNote.jsx";
import EditNote from "../src/ui/pages/edit-note/EditNote.jsx";
import Note from "../src/ui/pages/note/Note.jsx";
import Register from "../src/ui/pages/resgister/Register.jsx";
import UserPage from "../src/ui/pages/user-page/UserPage.jsx";
import EditChatroom from "./ui/pages/edit-chatroom/EditChatroom.jsx";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import PublicNote from "./ui/pages/public-note/PublicNote.jsx";
import { Toaster } from 'react-hot-toast';
import UserSettings from "./ui/pages/users-settings/UserSettings.jsx";
import ChatroomSettings from "./ui/pages/chatroom-settings/ChatroomSettings.jsx";
import NoteSettings from "./ui/pages/note-settings/NoteSettings.jsx";
function App() {

    const isLoggedIn = useSelector(state => state.login.isLoggedIn);
    const navigate = useNavigate();

    useEffect(()=>{
        if (!isLoggedIn && !localStorage.getItem("username")){
            navigate('/login');
        }
    }, [isLoggedIn]);

    return (

            <div className="app-container" dir="rtl">
                <Header />
                <div className="main-content">
                    <Sidebar />
                    <div className="page-content">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/profile" element={<UserPage />} />
                            <Route path="/public-chatroom" element={<PublicChatroom />} />
                            <Route path="/chatroom/:chatroomId" element={<Chatroom />} />
                            <Route path="/create-chatroom" element={<CreateChatroom />} />
                            <Route path="/public-note" element={<PublicNote />} />
                            <Route path="/edit-chatroom/:chatroomId" element={<EditChatroom />} />
                            <Route path="/create-note" element={<CreateNote />} />
                            <Route path="/edit-note/:noteId" element={<EditNote />} />
                            <Route path="/note/:noteId" element={<Note />} />
                            <Route path="/all-users" element={<UserSettings />} />
                            <Route path="/all-chatrooms" element={<ChatroomSettings />} />
                            <Route path="/all-notes" element={<NoteSettings />} />
                            <Route path="/edit-user" element={<EditUser />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                        </Routes>
                    </div>
                </div>

                <Toaster position="bottom-right" reverseOrder={false} />
            </div>

    );
}


export default App;
