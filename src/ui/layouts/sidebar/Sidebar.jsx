import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
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
    Bars3Icon,
    XMarkIcon,
    DocumentMagnifyingGlassIcon,
    Cog8ToothIcon
} from "@heroicons/react/24/solid";

const groupedMenuItems = [
    {
        title: "خانه",
        items: [
            { name: "خانه", icon: HomeIcon, path: "/" },
        ],
    },
    {
        title: "گفتگوها",
        items: [
            { name: "گفتگو های عمومی", icon: ChatBubbleLeftRightIcon, path: "/public-chatroom" },
            { name: "ساخت گفتگو", icon: PlusCircleIcon, path: "/create-chatroom" },
/*            { name: "ویرایش گفتگو", icon: PencilSquareIcon, path: "/edit-chatroom" },*/
        ],
    },
    {
        title: "یادداشت‌ها",
        items: [
            { name: "یادداشت های عمومی", icon: ChatBubbleLeftRightIcon, path: "/public-note" },
            { name: "ساخت یادداشت", icon: DocumentPlusIcon, path: "/create-note" },
/*            { name: "ویرایش یادداشت", icon: PencilSquareIcon, path: "/edit-note" },*/
        ],
    },
    {
        title: "تنظیمات",
        items: [
            { name: "تنظیمات کاربران", icon: UsersIcon, path: "/all-users" },
            { name: "تنظیمات گفتگوها", icon: Cog8ToothIcon, path: "/all-chatrooms" },
            { name: "تنظیمات یادداشت ها", icon: Cog8ToothIcon, path: "/all-notes" },
        ],
    }
];


export default function Sidebar() {
    const location = useLocation();
    const isLoggedIn = useSelector(state => state.login.isLoggedIn);

    const [isOpen, setIsOpen] = useState(false);

    if (!isLoggedIn && !localStorage.getItem('username')) return null;

    return (
        <>
            {/* Hamburger for mobile */}
            <div className="md:hidden fixed top-26 mt-4  right-4 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-purple-800 bg-white p-2 rounded-lg shadow"
                >
                    {isOpen ? (
                        <XMarkIcon className="w-6 h-6" />
                    ) : (
                        <Bars3Icon className="w-6 h-6" />
                    )}
                </button>
            </div>

            {/* Sidebar */}
            <aside
                className={`custom-sidebar fixed right-0 h-full w-64 bg-white shadow-md p-4 border-l border-gray-200 text-right rtl z-40 transition-transform transform
                ${isOpen ? "translate-x-0" : "translate-x-full"} 
                md:translate-x-0 md:static md:block  md:mt-0 lg:mt-0`}
            >
                <nav className="flex flex-col gap-2 mt-14 md:mt-0">

                    {groupedMenuItems.map((section, index) => (
                        <div key={index} className="mb-4">
                            <h3 className="text-sm font-bold text-purple-800 mb-2">{section.title}</h3>
                            <div className="flex flex-col gap-2">
                                {section.items.map(({ name, icon: Icon, path }) => (
                                    <Link
                                        key={name}
                                        to={path}
                                        className={`flex flex-row-reverse items-center sidebar-item justify-end gap-3 p-2 rounded-lg transition-all ${
                                            location.pathname === path
                                                ? "bg-purple-100 text-purple-600 font-bold"
                                                : "hover:bg-gray-100 text-gray-500"
                                        }`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <span className="text-base">{name}</span>
                                        <Icon className="w-5 h-5" />
                                    </Link>
                                ))}
                            </div>
                            {index !== groupedMenuItems.length - 1 && <hr className="mt-4 border-t border-gray-200" />}
                        </div>
                    ))}

                </nav>
            </aside>
        </>
    );
}
