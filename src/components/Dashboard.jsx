import React, { useState, useEffect } from 'react';
import ExpenseTable from './ExpenseTable';
import ExpenseFilterBar from './ExpenseFilterBar';
import EmptyState from './EmptyState';
import AddExpense from './AddExpense';
import logo from '../assets/logo.png';
import api from '../api/axios';
import Navbar from './Navbar';

const Dashboard = () => {
    // Main source of truth for the app
    // This array stores ALL expenses shown in the app
    const [expenses, setExpenses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchExpenses = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('expenses/');
            // Ensure amounts are numbers
            const processedExpenses = response.data.map(expense => ({
                ...expense,
                amount: parseFloat(expense.amount)
            }));
            setExpenses(processedExpenses);
        } catch (error) {
            console.error("Failed to load expenses:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

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

    const handleSaveExpense = () => {
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
    const handleDeleteExpense = async (id) => {
        try {
            await api.delete(`expenses/${id}/`);
            setExpenses(expenses.filter(ex => ex.id !== id));
        } catch (error) {
            console.error("Failed to delete expense:", error);
        }
    };

    // Resets modal state to close the modal and clear any editing data
    const handleCloseModal = () => {
        // Close the modal
        setIsAddModalOpen(false);
        // Clear any expense data that was being edited
        setEditingExpense(null);
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

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonthIdx = now.getMonth();

    // Last month calculation
    const prevDate = new Date(currentYear, currentMonthIdx - 1, 1);
    const prevYear = prevDate.getFullYear();
    const prevMonthIdx = prevDate.getMonth();

    const currentMonthExpenses = expenses.filter(ex => {
        const d = new Date(ex.date);
        return d.getMonth() === currentMonthIdx && d.getFullYear() === currentYear;
    });

    const lastMonthExpenses = expenses.filter(ex => {
        const d = new Date(ex.date);
        return d.getMonth() === prevMonthIdx && d.getFullYear() === prevYear;
    });

    const totalSpentMonth = currentMonthExpenses.reduce((sum, ex) => sum + ex.amount, 0);
    const totalSpentLastMonth = lastMonthExpenses.reduce((sum, ex) => sum + ex.amount, 0);

    const hasLastMonthData = totalSpentLastMonth > 0;
    const percentageChange = hasLastMonthData
        ? ((totalSpentMonth - totalSpentLastMonth) / totalSpentLastMonth) * 100
        : 0;
    const isIncrease = percentageChange > 0;

    const categoryTotals = expenses.reduce((acc, ex) => {
        acc[ex.category] = (acc[ex.category] || 0) + ex.amount;
        return acc;
    }, {});

    const highestCategory = Object.keys(categoryTotals).length > 0
        ? Object.keys(categoryTotals).reduce((a, b) => categoryTotals[a] > categoryTotals[b] ? a : b)
        : 'No Data';

    const totalTransactions = expenses.length;

    return (
        <div className="min-h-screen bg-[#0f172a] font-sans text-slate-300 pb-20 selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-hidden">
            {/* Background Animations */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/30 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob"></div>
                <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/30 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob [animation-delay:2s]"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-pink-500/30 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob [animation-delay:4s]"></div>
            </div>

            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 relative z-10">
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
                            {hasLastMonthData && (
                                <div className="mt-4 flex items-center gap-2">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${isIncrease ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                                        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            {isIncrease ? (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                            ) : (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                                            )}
                                        </svg>
                                        {Math.abs(percentageChange).toFixed(1)}%
                                    </span>
                                    <span className="text-sm text-slate-500 font-medium">vs last month</span>
                                </div>
                            )}
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
                    refreshData={fetchExpenses}
                />
            )}
        </div>
    );
};

export default Dashboard;
