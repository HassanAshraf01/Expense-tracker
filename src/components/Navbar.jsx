import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_name');
        navigate('/login');
    };

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
                        </div>
                    </div>

                    <div className="flex items-center gap-4 -mr-4">
                        {/* User Avatar */}
                        {localStorage.getItem('user_name') && (
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 border border-white/10 text-white font-bold text-sm tracking-wider select-none transform hover:scale-105 transition-transform duration-200" title={localStorage.getItem('user_name')}>
                                {(() => {
                                    const name = localStorage.getItem('user_name') || '';
                                    const parts = name.trim().split(' ');
                                    if (parts.length >= 2) {
                                        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
                                    }
                                    return name.slice(0, 2).toUpperCase();
                                })()}
                            </div>
                        )}

                        <button
                            onClick={handleLogout}
                            className="group flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/50 rounded-xl transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-rose-500/10 active:scale-95"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-slate-400 group-hover:text-rose-400 transition-colors duration-300">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                            </svg>
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
