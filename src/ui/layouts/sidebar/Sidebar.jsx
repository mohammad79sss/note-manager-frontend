import React from "react";
import  "./Sidebar.css"
import { Link, useLocation } from "react-router-dom";
import {
    HomeIcon,
    UserCircleIcon,
    TableCellsIcon,
    ChatBubbleLeftRightIcon,
    PlusCircleIcon,
    DocumentPlusIcon,
    PencilSquareIcon,
    DocumentTextIcon,
    UsersIcon,
    Cog6ToothIcon,
} from "@heroicons/react/24/solid";

import {useSelector} from "react-redux";

const menuItems = [
    { name: "خانه", icon: HomeIcon, path: "/" },
    { name: "پروفایل", icon: UserCircleIcon, path: "/profile" },
    { name: "عمومی", icon: TableCellsIcon, path: "/public" },
    { name: "گفتگو", icon: ChatBubbleLeftRightIcon, path: "/chatroom" },
    { name: "ساخت گفتگو", icon: PlusCircleIcon, path: "/create-chatroom" },
    { name: "ساخت یادداشت", icon: DocumentPlusIcon, path: "/create-note" },
    { name: "ویرایش یادداشت", icon: PencilSquareIcon, path: "/edit-note" },
    { name: "یادداشت", icon: DocumentTextIcon, path: "/note" },
    { name: "کاربران", icon: UsersIcon, path: "/all-users" },
    { name: "ویرایش کاربر", icon: Cog6ToothIcon, path: "/edit-user" },
];

export default function Sidebar() {
    const location = useLocation();

    const isLoggedIn = useSelector(state=>state.login.isLoggedIn);

    if (!isLoggedIn && !localStorage.getItem('username')) return null;

    return (

        <aside className="sidebar w-64 h-full shadow-md p-4 border-l border-gray-200 text-right rtl ">
            <nav className="flex flex-col gap-2">
                {menuItems.map(({ name, icon: Icon, path }) => (
                    <Link
                        key={name}
                        to={path}
                        className={`flex flex-row-reverse items-center sidebar-item justify-end gap-3 p-2 rounded-lg transition-all ${
                            location.pathname === path
                                ? "bg-purple-100 text-purple-600 font-bold"
                                : "hover:bg-gray-100 text-gray-500"
                        }`}
                    >
                        <span className="text-base">{name}</span>
                        <Icon className="w-5 h-5" />
                    </Link>

                ))}
            </nav>
        </aside>
    );
}
