import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import api from '../api/axios';
import heroImg from '../assets/hero_illustration.png';
import welcomeAvatar from '../assets/welcome_avatar.png';

const Home = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');

    // Summary Data State
    const [summaryStats, setSummaryStats] = useState({
        lastExpense: null,
        mostUsedCategory: 'N/A',
        totalMonthExpenses: 0,
        currencySymbol: '$' // Default to $, change if API/User data has it
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Get User Name
        const storedName = localStorage.getItem('user_name');
        if (storedName) {
            // Take first name
            setUserName(storedName.split(' ')[0]);
        }

        // Fetch Expenses for summary
        const fetchExpenses = async () => {
            try {
                const response = await api.get('expenses/');
                const expenses = response.data.map(ex => ({
                    ...ex,
                    amount: parseFloat(ex.amount),
                    dateObj: new Date(ex.date)
                }));

                // Sort by date descending (newest first)
                expenses.sort((a, b) => b.dateObj - a.dateObj);

                // 1. Last Expense Added
                const lastExpense = expenses.length > 0 ? expenses[0] : null;

                // 2. Total Expenses This Month & Most Used Category
                const now = new Date();
                const currentMonth = now.getMonth();
                const currentYear = now.getFullYear();

                const thisMonthExpenses = expenses.filter(ex =>
                    ex.dateObj.getMonth() === currentMonth &&
                    ex.dateObj.getFullYear() === currentYear
                );

                const totalMonth = thisMonthExpenses.reduce((sum, ex) => sum + ex.amount, 0);

                // Most used category
                const categoryCounts = {};
                thisMonthExpenses.forEach(ex => {
                    categoryCounts[ex.category] = (categoryCounts[ex.category] || 0) + 1;
                });

                let mostUsedCat = 'N/A';
                let maxCount = 0;
                Object.entries(categoryCounts).forEach(([cat, count]) => {
                    if (count > maxCount) {
                        maxCount = count;
                        mostUsedCat = cat;
                    }
                });

                setSummaryStats({
                    lastExpense,
                    mostUsedCategory: mostUsedCat,
                    totalMonthExpenses: totalMonth,
                    currencySymbol: '$' // Logic to detect currency could be added here
                });

            } catch (error) {
                console.error("Failed to fetch expenses", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchExpenses();
    }, []);

    const handleAddExpenseClick = () => {
        navigate('/dashboard', { state: { openAddExpense: true } });
    };

    return (
        <div className="min-h-screen bg-[#0f172a] font-sans text-slate-300 pb-20 selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-hidden">
            {/* Custom Animation Styles */}
            <style>{`
                @keyframes infinite-wave {
                    0% { transform: translateY(0) rotate(0deg) scale(1); }
                    25% { transform: translateY(-4px) rotate(5deg) scale(1.05); }
                    50% { transform: translateY(0) rotate(0deg) scale(1); }
                    75% { transform: translateY(-4px) rotate(-5deg) scale(1.05); }
                    100% { transform: translateY(0) rotate(0deg) scale(1); }
                }
                .welcome-avatar-anim {
                    animation: infinite-wave 3s ease-in-out infinite;
                }
            `}</style>
            {/* Background Animations (Same as Dashboard) */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/30 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob"></div>
                <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/30 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob [animation-delay:2s]"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-pink-500/30 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob [animation-delay:4s]"></div>
            </div>

            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">



                {/* Welcome Section */}
                <div className="mb-12">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-2 flex items-center gap-4">
                        <span>Welcome back, <span className="text-indigo-400">{userName || 'User'}</span></span>
                        <img
                            src={welcomeAvatar}
                            alt="Welcome"
                            className="w-24 h-24 object-contain welcome-avatar-anim inline-block"
                        />
                    </h1>
                    <p className="text-lg text-slate-400 font-medium">
                        Track smarter. Spend better.
                    </p>
                </div>

                {/* Hero Showcase Section */}
                <div className="bg-[#1e293b]/50 backdrop-blur-md rounded-3xl p-8 mb-12 border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col-reverse md:flex-row items-center gap-8">
                        <div className="flex-1 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
                                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                                Smart Tracking
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                                Master Your Money, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Effortlessly.</span>
                            </h2>
                            <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
                                Stop wondering where your money goes. Gain clear insights, set smart budgets, and achieve your financial freedom with our advanced analytics tools.
                            </p>
                            <div className="flex flex-wrap gap-4 pt-2">
                                <button
                                    onClick={() => navigate('/budget')}
                                    className="px-6 py-3 bg-white/5 hover:bg-white/10 text-[#C0C0C0] font-semibold rounded-xl border border-white/10 transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                                >
                                    Budget Manager
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 w-full flex justify-center md:justify-end perspective-1000">
                            <img
                                src={heroImg}
                                alt="Financial Growth"
                                className="w-full max-w-sm md:max-w-md object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500 animate-float"
                            />
                        </div>
                    </div>
                </div>

                {/* Quick Action Cards */}
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Quick Actions
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">

                    {/* Add Expense Card */}
                    <div
                        onClick={handleAddExpenseClick}
                        className="bg-[#475569]/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5 hover:border-indigo-500/50 hover:bg-[#475569] cursor-pointer transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10"
                    >
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300 mb-4">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors">Add Expense</h3>
                        <p className="text-sm text-slate-400">Quickly log a new expense to keep track.</p>
                    </div>

                    {/* Dashboard Card */}
                    <div
                        onClick={() => navigate('/dashboard')}
                        className="bg-[#475569]/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5 hover:border-purple-500/50 hover:bg-[#475569] cursor-pointer transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10"
                    >
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors duration-300 mb-4">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">Dashboard</h3>
                        <p className="text-sm text-slate-400">View, edit and manage all your expenses.</p>
                    </div>

                    {/* Analytics Card */}
                    <div
                        onClick={() => navigate('/analytics')}
                        className="bg-[#475569]/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5 hover:border-emerald-500/50 hover:bg-[#475569] cursor-pointer transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10"
                    >
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300 mb-4">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">Analytics</h3>
                        <p className="text-sm text-slate-400">Analyze your spending patterns and trends.</p>
                    </div>

                    {/* Profile/Settings Card */}
                    <div
                        onClick={() => navigate('/profile')}
                        className="bg-[#475569]/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5 hover:border-orange-500/50 hover:bg-[#475569] cursor-pointer transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/10"
                    >
                        <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300 mb-4">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-orange-300 transition-colors">Profile</h3>
                        <p className="text-sm text-slate-400">Manage account details and preferences.</p>
                    </div>

                </div>

                {/* Light Status Section */}
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    At a Glance
                </h2>

                <div className="bg-[#1e293b]/50 backdrop-blur-md rounded-2xl p-6 border border-white/5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-white/5">

                        {/* Last Expense */}
                        <div className="px-4 py-2 first:pl-0">
                            <p className="text-sm text-slate-400 font-medium mb-1">Last expense added</p>
                            {isLoading ? (
                                <div className="h-6 w-24 bg-slate-700/50 rounded animate-pulse"></div>
                            ) : summaryStats.lastExpense ? (
                                <div>
                                    <div className="text-2xl font-bold text-white">
                                        {summaryStats.currencySymbol}{summaryStats.lastExpense.amount.toFixed(2)}
                                    </div>
                                    <div className="text-sm text-indigo-400 mt-1 flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                        {summaryStats.lastExpense.category}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-slate-500 italic">No expenses yet</div>
                            )}
                        </div>

                        {/* Most Used Category */}
                        <div className="px-4 py-2">
                            <p className="text-sm text-slate-400 font-medium mb-1">Most used category (Month)</p>
                            {isLoading ? (
                                <div className="h-6 w-32 bg-slate-700/50 rounded animate-pulse"></div>
                            ) : (
                                <div className="text-2xl font-bold text-white">
                                    {summaryStats.mostUsedCategory}
                                </div>
                            )}
                        </div>

                        {/* Total This Month */}
                        <div className="px-4 py-2">
                            <p className="text-sm text-slate-400 font-medium mb-1">Total logged this month</p>
                            {isLoading ? (
                                <div className="h-6 w-24 bg-slate-700/50 rounded animate-pulse"></div>
                            ) : (
                                <div className="text-2xl font-bold text-white">
                                    {summaryStats.currencySymbol}{summaryStats.totalMonthExpenses.toFixed(2)}
                                </div>
                            )}
                        </div>

                    </div>
                </div>

            </main>
        </div>
    );
};

export default Home;
