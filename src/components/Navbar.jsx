import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import api from '../api/axios';

const Navbar = () => {
    const [userProfile, setUserProfile] = useState({
        name: localStorage.getItem('user_name') || '',
        username: '',
        profile_picture: null
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('auth/profile/');
                setUserProfile({
                    name: response.data.name,
                    username: response.data.username,
                    profile_picture: response.data.profile_picture
                });
                localStorage.setItem('user_name', response.data.name);
            } catch (error) {
                console.error("Navbar profile fetch failed", error);
            }
        };
        fetchProfile();
    }, []);

    return (
        <nav className="bg-[#1e293b]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-30 transition-all duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-28">
                    <div className="flex items-center gap-8 -ml-6">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <img src={logo} alt="Expense Tracker" className="h-40 w-auto object-contain hover:scale-105 transition-transform duration-200" />
                            <span className="text-xl font-bold text-white tracking-tight">
                                Expense Tracker
                            </span>
                        </div>

                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center gap-2 mt-2">
                            <NavLink
                                to="/home"
                                className={({ isActive }) => `px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${isActive
                                    ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20 shadow-lg shadow-indigo-500/5'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                                    }`}
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                Home
                            </NavLink>
                            <NavLink
                                to="/dashboard"
                                className={({ isActive }) => `px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${isActive
                                    ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20 shadow-lg shadow-indigo-500/5'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                                    }`}
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                                Dashboard
                            </NavLink>
                            <NavLink
                                to="/analytics"
                                className={({ isActive }) => `px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${isActive
                                    ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20 shadow-lg shadow-indigo-500/5'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                                    }`}
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                Analytics
                            </NavLink>
                            <NavLink
                                to="/budget"
                                className={({ isActive }) => `px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${isActive
                                    ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20 shadow-lg shadow-indigo-500/5'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                                    }`}
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Budget
                            </NavLink>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 -mr-4">
                        {/* User Avatar */}
                        <Link to="/profile" className="flex flex-col items-center gap-1 group">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 border border-white/10 text-white font-bold text-sm tracking-wider select-none transform group-hover:scale-105 transition-transform duration-200 overflow-hidden" title={userProfile.name}>
                                {userProfile.profile_picture ? (
                                    <img
                                        src={userProfile.profile_picture.startsWith('http') ? userProfile.profile_picture : `http://127.0.0.1:8000${userProfile.profile_picture}`}
                                        alt={userProfile.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    (() => {
                                        const name = userProfile.name || 'User';
                                        const parts = name.trim().split(' ');
                                        if (parts.length >= 2) {
                                            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
                                        }
                                        return name.slice(0, 2).toUpperCase();
                                    })()
                                )}
                            </div>
                            <span className="text-[10px] font-medium text-slate-400 group-hover:text-indigo-400 transition-colors tracking-wide max-w-[80px] truncate text-center">
                                {userProfile.username ? `@${userProfile.username}` : userProfile.name.split(' ')[0]}
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
