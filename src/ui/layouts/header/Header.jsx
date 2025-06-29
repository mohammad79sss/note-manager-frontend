import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {useSelector} from "react-redux";
import {useDispatch} from "react-redux";
import {setLoginFalse} from "../../../store/redux/slices/loginSlice.js";
import {
    UserCircleIcon,
} from "@heroicons/react/24/solid";

export default function Header() {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const isLoggedIn = useSelector(state=>state.login.isLoggedIn);
    const dispatch = useDispatch();
    const handleLogout = () => {
        localStorage.clear();
        dispatch(setLoginFalse());
        navigate("/login");
    };

    const handleEditProfile = () => {
        navigate("/edit-user");
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    if (!isLoggedIn && !localStorage.getItem('username')) return null

    return (
        <header className="w-full bg-white border-b border-gray-200 shadow-sm" dir="rtl">
            <div className="mx-auto px-4 py-3 max-w-full">
                <div className="flex items-center justify-between">
                    {/* Logo/Brand */}
                    <a href="/" className="text-lg flex font-bold text-gray-900 hover:text-gray-700 w-60 h-12 ">
                        <img className="w-10 h-12" src="src/assets/images/logo.png" alt=""/>
                        <span className='mr-8 mt-2'>
                            پنل کاربری
                        </span>
                    </a>

                    {/* Desktop Navigation */}
                    <div className=" md:flex items-center gap-4">
                        {/* User Dropdown */}
                        <div className="relative group ml-3 border rounded w-36" >
                            <button className="flex items-center gap-1 text-base font-medium text-gray-800 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100 w-full justify-between">

                                <span>
                                    کاربر
                                </span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            <div className="absolute right-0 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                <div className="py-1">
                                    <button
                                        onClick={handleEditProfile}
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-right"
                                    >
{/*                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495" />
                                        </svg>*/}
                                        <UserCircleIcon className='w-4 h-4'/> &nbsp;

                                        حساب کاربری
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-right"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-2 text-red-500">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                                        </svg>
                                        خروج
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile menu button */}

                </div>

                {/* Mobile menu */}
                <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
                    <div className="pt-4 pb-3 border-t border-gray-200">
                        <div className="mt-3 space-y-1">
                            <button
                                onClick={handleEditProfile}
                                className="flex items-center w-full px-4 py-2 text-base text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495" />
                                </svg>
                                حساب کاربری
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex items-center w-full px-4 py-2 text-base text-red-600 hover:bg-gray-100 rounded-md"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-2 text-red-500">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                                </svg>
                                خروج
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}