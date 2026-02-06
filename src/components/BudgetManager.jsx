import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import api from '../api/axios';

const BudgetManager = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [budgetData, setBudgetData] = useState(null);
    const [formData, setFormData] = useState({
        total_balance: '',
        alert_limit: ''
    });
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [totalSpent, setTotalSpent] = useState(0);

    useEffect(() => {
        fetchBudgetAndExpenses();
    }, []);

    const fetchBudgetAndExpenses = async () => {
        setIsLoading(true);
        try {
            // Get current date for default view
            const now = new Date();
            const yearStr = now.getFullYear();
            const monthStr = String(now.getMonth() + 1).padStart(2, '0');
            const dateStr = `${yearStr}-${monthStr}-01`;

            // 1. Fetch Budget
            const budgetRes = await api.get(`expenses/budget/?month=${dateStr}`);
            const budget = budgetRes.data;

            if (budget && budget.id) {
                setBudgetData(budget);
                setFormData({
                    total_balance: budget.total_balance,
                    alert_limit: budget.alert_limit
                });
            }

            // 2. Fetch Expenses for this month to calculate "Total Spent"
            const expensesRes = await api.get('expenses/');
            // Filter expenses for this month in frontend (ideally backend should filter)
            const thisMonthExpenses = expensesRes.data.filter(ex => {
                const exDate = new Date(ex.date);
                return exDate.getMonth() === now.getMonth() && exDate.getFullYear() === now.getFullYear();
            });
            const spent = thisMonthExpenses.reduce((sum, ex) => sum + parseFloat(ex.amount), 0);
            setTotalSpent(spent);

        } catch (err) {
            console.error("Failed to fetch budget data:", err);
            // Ignore 404 or empty object if just no budget set yet
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setIsSaving(true);

        // Validation
        const balance = parseFloat(formData.total_balance);
        const limit = parseFloat(formData.alert_limit);

        if (isNaN(balance) || isNaN(limit) || balance < 0 || limit < 0) {
            setError("Please enter valid positive numbers.");
            setIsSaving(false);
            return;
        }

        if (limit > balance) {
            setError("Alert limit cannot be greater than total monthly budget.");
            setIsSaving(false);
            return;
        }

        try {
            const now = new Date();
            const yearStr = now.getFullYear();
            const monthStr = String(now.getMonth() + 1).padStart(2, '0');
            const dateStr = `${yearStr}-${monthStr}-01`;

            const payload = {
                month: dateStr,
                total_balance: balance,
                alert_limit: limit
            };

            const response = await api.post('expenses/budget/', payload);
            setBudgetData(response.data);
            setSuccessMsg("Budget updated successfully!");
        } catch (err) {
            console.error(err);
            if (err.response?.data?.alert_limit) {
                setError(err.response.data.alert_limit[0]);
            } else if (err.response?.data?.non_field_errors) {
                setError(err.response.data.non_field_errors[0]);
            } else {
                setError("Failed to save budget.");
            }
        } finally {
            setIsSaving(false);
        }
    };

    const calculateProgress = () => {
        if (!budgetData) return 0;
        const limit = parseFloat(budgetData.alert_limit);
        if (limit === 0) return 0;
        const progress = (totalSpent / limit) * 100;
        return Math.min(progress, 100);
    };

    const getProgressColor = () => {
        const progress = calculateProgress();
        if (progress >= 100) return 'bg-red-500';
        if (progress >= 80) return 'bg-orange-500';
        return 'bg-indigo-500';
    };

    const remainingSafe = budgetData ? parseFloat(budgetData.alert_limit) - totalSpent : 0;
    const isExceeded = remainingSafe < 0;

    return (
        <div className="min-h-screen bg-[#0f172a] font-sans text-slate-300 pb-20 selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-hidden">

            {/* Custom Animations */}
            <style>{`
                @keyframes fade-in-up {
                    0% { opacity: 0; transform: translateY(20px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-enter {
                    animation: fade-in-up 0.6s ease-out forwards;
                }
                .delay-100 { animation-delay: 100ms; }
                .delay-200 { animation-delay: 200ms; }
            `}</style>

            {/* Background Animations - More exposed/visible */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/30 rounded-full mix-blend-screen filter blur-[80px] opacity-60 animate-blob"></div>
                <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/30 rounded-full mix-blend-screen filter blur-[80px] opacity-60 animate-blob [animation-delay:2s]"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-purple-500/30 rounded-full mix-blend-screen filter blur-[80px] opacity-60 animate-blob [animation-delay:4s]"></div>
                <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-pink-500/20 rounded-full mix-blend-screen filter blur-[80px] opacity-50 animate-blob [animation-delay:6s]"></div>
            </div>

            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 animate-enter">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white tracking-tight">Budget Manager</h1>
                    <p className="text-slate-400 mt-2">Set your monthly limits and get notified before you overspend.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Budget Setup Form */}
                    <div className="lg:col-span-1 animate-enter delay-100">
                        <div className="bg-[#1e293b]/50 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-xl">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Configure Budget
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Monthly Wallet Balance</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-slate-500">$</span>
                                        </div>
                                        <input
                                            type="number"
                                            name="total_balance"
                                            value={formData.total_balance}
                                            onChange={handleInputChange}
                                            className="w-full pl-8 pr-4 py-3 bg-[#0f172a] border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors"
                                            placeholder="30000"
                                            required
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">Total money you have for this month.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Spending Alert Limit</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-slate-500">$</span>
                                        </div>
                                        <input
                                            type="number"
                                            name="alert_limit"
                                            value={formData.alert_limit}
                                            onChange={handleInputChange}
                                            className="w-full pl-8 pr-4 py-3 bg-[#0f172a] border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors"
                                            placeholder="22000"
                                            required
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">We'll email you when you cross this amount.</p>
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
                                        {error}
                                    </div>
                                )}
                                {successMsg && (
                                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-sm text-emerald-400">
                                        {successMsg}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSaving ? 'Saving...' : 'Save Budget'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Status & Visualization */}
                    <div className="lg:col-span-2 space-y-6 animate-enter delay-200">
                        {/* Status Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-[#1e293b]/50 border border-white/5 p-5 rounded-2xl">
                                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Total Budget</p>
                                <p className="text-2xl font-bold text-white">${budgetData?.total_balance || '0.00'}</p>
                            </div>
                            <div className="bg-[#1e293b]/50 border border-white/5 p-5 rounded-2xl">
                                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Alert Limit</p>
                                <p className="text-2xl font-bold text-indigo-400">${budgetData?.alert_limit || '0.00'}</p>
                            </div>
                            <div className="bg-[#1e293b]/50 border border-white/5 p-5 rounded-2xl">
                                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Total Spent</p>
                                <p className="text-2xl font-bold text-white">${totalSpent.toFixed(2)}</p>
                            </div>
                        </div>

                        {/* Progress Section */}
                        <div className="bg-[#1e293b]/50 backdrop-blur-md rounded-2xl p-8 border border-white/5 shadow-xl">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                Budget Status
                            </h2>

                            {!budgetData ? (
                                <div className="text-center py-12 text-slate-500">
                                    <p>No budget configured for this month.</p>
                                    <p className="text-sm mt-1">Use the form to set up your budget.</p>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    <div className="relative pt-6">
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="text-sm font-medium text-slate-300">Spending Progress</span>
                                            <span className={`text-sm font-bold ${isExceeded ? 'text-red-400' : 'text-slate-300'}`}>
                                                {calculateProgress().toFixed(1)}% of Alert Limit
                                            </span>
                                        </div>
                                        <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-slate-700/50">
                                            <div
                                                style={{ width: `${calculateProgress()}%` }}
                                                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${getProgressColor()} ${calculateProgress() > 100 ? 'animate-pulse' : ''}`}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between text-xs text-slate-500 font-medium">
                                            <span>$0</span>
                                            <span className="text-indigo-400 font-bold">Alert Limit: ${budgetData.alert_limit}</span>
                                        </div>
                                    </div>

                                    <div className={`p-4 rounded-xl border ${isExceeded ? 'bg-red-500/10 border-red-500/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
                                        <div className="flex items-start gap-3">
                                            <div className={`mt-0.5 p-1.5 rounded-full ${isExceeded ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    {isExceeded ? (
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                    ) : (
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    )}
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className={`font-bold ${isExceeded ? 'text-red-400' : 'text-emerald-400'}`}>
                                                    {isExceeded ? 'Spending Alert Limit Exceeded' : 'You are within your safe limit'}
                                                </h3>
                                                <p className="text-slate-300 text-sm mt-1">
                                                    {isExceeded
                                                        ? `You have exceeded your alert limit by $${Math.abs(remainingSafe).toFixed(2)}. An email alert has been triggered.`
                                                        : `You have $${remainingSafe.toFixed(2)} remaining before reaching your alert limit.`
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default BudgetManager;
