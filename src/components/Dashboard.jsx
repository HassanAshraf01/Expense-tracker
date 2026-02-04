import React, { useState, useEffect } from 'react';
import ExpenseTable from './ExpenseTable';
import ExpenseFilterBar from './ExpenseFilterBar';
import EmptyState from './EmptyState';
import AddExpense from './AddExpense';
import logo from '../assets/logo.png';

// Dummy data for initial view
const INITIAL_DATA = [
    { id: 1, title: 'Netflix Subscription', amount: 15.99, category: 'Subscription', date: '2023-11-01' },
    { id: 2, title: 'Grocery Run', amount: 85.50, category: 'Food', date: '2023-11-03' },
    { id: 3, title: 'Uber to Work', amount: 24.00, category: 'Transportation', date: '2023-11-05' },
];

import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();

    // Main source of truth for the app
    // This array stores ALL expenses shown in the app
    const [expenses, setExpenses] = useState(() => {
        try {
            const savedExpenses = localStorage.getItem('expenses');
            const parsed = savedExpenses ? JSON.parse(savedExpenses) : INITIAL_DATA;
            return Array.isArray(parsed) ? parsed : INITIAL_DATA;
        } catch (error) {
            console.error("Failed to load expenses:", error);
            return INITIAL_DATA;
        }
    });

    useEffect(() => {
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }, [expenses]);

    // Controls whether the Add/Edit Expense modal is visible
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Holds the expense object when editing, null when adding
    const [editingExpense, setEditingExpense] = useState(null);

    // Search input value
    const [searchQuery, setSearchQuery] = useState('');

    // Selected category filter
    const [categoryFilter, setCategoryFilter] = useState('All');

    // Selected date filter
    const [dateFilter, setDateFilter] = useState('');
    const [amountFilter, setAmountFilter] = useState('');

    // Resets all filter values back to default
    // Original expenses array remains unchanged
    const handleClearFilters = () => {
        setSearchQuery('');
        setCategoryFilter('All');
        setDateFilter('');
        setAmountFilter('');
    };

    const handleSaveExpense = (savedExpense) => {
        if (editingExpense) {
            setExpenses(expenses.map(ex => ex.id === savedExpense.id ? savedExpense : ex));
        } else {
            setExpenses([savedExpense, ...expenses]);
        }
        setIsAddModalOpen(false);
        setEditingExpense(null);
    };

    // Updates the editingExpense state when an edit button is clicked
    // This triggers the modal to open in edit mode
    const handleEditExpense = (expense) => {
        setEditingExpense(expense);
        setIsAddModalOpen(true);
    };

    // Removes an expense from the array based on its ID
    // Updates the UI by filtering out the deleted expense
    const handleDeleteExpense = (id) => {
        setExpenses(expenses.filter(ex => ex.id !== id));
    };

    // Resets modal state to close the modal and clear any editing data
    const handleCloseModal = () => {
        // Close the modal
        setIsAddModalOpen(false);
        // Clear any expense data that was being edited
        setEditingExpense(null);
    };

    // Logout handler
    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_name');
        navigate('/login');
    };

    // Filters the main expenses array based on the current filter settings
    // Returns a new array containing only the expenses that match all criteria
    const filteredExpenses = expenses.filter(ex => {
        const matchesSearch = ex.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || ex.category === categoryFilter;

        const matchesDate = !dateFilter || ex.date === dateFilter;

        const matchesAmount = !amountFilter || ex.amount === parseFloat(amountFilter);

        return matchesSearch && matchesCategory && matchesDate && matchesAmount;
    });

    const currentMonth = new Date().getMonth();
    const currentMonthExpenses = expenses.filter(ex => new Date(ex.date).getMonth() === currentMonth);
    const totalSpentMonth = currentMonthExpenses.reduce((sum, ex) => sum + ex.amount, 0);

    const categoryTotals = expenses.reduce((acc, ex) => {
        acc[ex.category] = (acc[ex.category] || 0) + ex.amount;
        return acc;
    }, {});

    const highestCategory = Object.keys(categoryTotals).length > 0
        ? Object.keys(categoryTotals).reduce((a, b) => categoryTotals[a] > categoryTotals[b] ? a : b)
        : 'No Data';

    const totalTransactions = expenses.length;

    return (
        <div className="min-h-screen bg-[#0f172a] font-sans text-slate-300 pb-20 selection:bg-indigo-500/30 selection:text-indigo-200">
            {/* Navbar */}
            <nav className="bg-[#1e293b]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-30 transition-all duration-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-28">
                        <div className="flex items-center gap-3 -ml-6">
                            <img src={logo} alt="Expense Tracker" className="h-40 w-auto object-contain hover:scale-105 transition-transform duration-200" />
                            <span className="text-xl font-bold text-white tracking-tight">
                                Expense Tracker
                            </span>
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

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                {/* Summary Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1: Total Expenses */}
                    <div className="relative overflow-hidden bg-[#334155] rounded-2xl p-6 shadow-lg border border-white/5 hover:border-indigo-500/30 transition-all duration-300 cursor-pointer group">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                            <svg className="w-32 h-32 text-indigo-400 transform translate-x-4 -translate-y-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V9h-2.82v9.09h2.82zM12 11c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" /></svg>
                        </div>
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Total Spent</h3>
                                    <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300 shadow-sm">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="text-4xl font-bold text-white tracking-tight flex items-baseline gap-1">
                                    <span className="text-2xl text-slate-500 font-medium">$</span>
                                    {totalSpentMonth.toFixed(2)}
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                    2.5%
                                </span>
                                <span className="text-sm text-slate-500 font-medium">vs last month</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Highest Category */}
                    <div className="relative overflow-hidden bg-[#334155] rounded-2xl p-6 shadow-lg border border-white/5 hover:border-orange-500/30 transition-all duration-300 cursor-pointer group">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                            <svg className="w-32 h-32 text-orange-400 transform translate-x-4 -translate-y-4" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                        </div>
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Top Category</h3>
                                    <div className="p-2.5 bg-orange-500/10 text-orange-400 rounded-xl group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 shadow-sm">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="text-4xl font-bold text-white tracking-tight truncate">
                                    {highestCategory}
                                </div>
                            </div>
                            <div className="mt-4 text-sm text-slate-400 font-medium flex items-center gap-2">
                                <div className="w-full bg-slate-700/50 rounded-full h-1.5 max-w-[100px] overflow-hidden">
                                    <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                                </div>
                                <span className="text-sm text-slate-500 font-medium">Most active</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Total Transactions */}
                    <div className="relative overflow-hidden bg-[#334155] rounded-2xl p-6 shadow-lg border border-white/5 hover:border-purple-500/30 transition-all duration-300 cursor-pointer group">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                            <svg className="w-32 h-32 text-purple-400 transform translate-x-4 -translate-y-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                        </div>
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Transactions</h3>
                                    <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-xl group-hover:bg-purple-500 group-hover:text-white transition-all duration-300 shadow-sm">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="text-4xl font-bold text-white tracking-tight">
                                    {totalTransactions}
                                </div>
                            </div>
                            <div className="mt-4 text-sm">
                                <span className="text-purple-400 bg-purple-500/10 px-2 py-1 rounded-md border border-purple-500/20 text-xs font-medium">
                                    Active Activities
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <section className="bg-[#334155] rounded-2xl shadow-lg border border-white/5 overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight">Recent Transactions</h2>
                            <p className="text-slate-400 text-sm mt-1">Monitor your daily spending and subscriptions.</p>
                        </div>

                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="inline-flex items-center px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-all duration-200 font-semibold shadow-lg shadow-indigo-500/20 active:transform active:scale-95 group cursor-pointer"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                            </svg>
                            Add Expense
                        </button>
                    </div>

                    <div className="p-6 min-h-[400px]">
                        <ExpenseFilterBar
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            categoryFilter={categoryFilter}
                            setCategoryFilter={setCategoryFilter}
                            dateFilter={dateFilter}
                            setDateFilter={setDateFilter}
                            amountFilter={amountFilter}
                            setAmountFilter={setAmountFilter}
                            onClearFilters={handleClearFilters}
                        />

                        {filteredExpenses.length > 0 ? (
                            <ExpenseTable
                                expenses={filteredExpenses}
                                onDelete={handleDeleteExpense}
                                onEdit={handleEditExpense}
                            />
                        ) : (
                            <EmptyState onAddExpense={() => setIsAddModalOpen(true)} />
                        )}
                    </div>
                </section>
            </main>

            {isAddModalOpen && (
                <AddExpense
                    onAdd={handleSaveExpense}
                    onCancel={handleCloseModal}
                    initialData={editingExpense}
                />
            )}
        </div>
    );
};

export default Dashboard;
