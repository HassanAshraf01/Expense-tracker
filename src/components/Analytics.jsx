import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import api from '../api/axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const Analytics = () => {
    const [expenses, setExpenses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchExpenses = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('expenses/');
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

    // Process Data for Charts
    const categoryData = Object.entries(expenses.reduce((acc, ex) => {
        acc[ex.category] = (acc[ex.category] || 0) + ex.amount;
        return acc;
    }, {})).map(([name, value]) => ({ name, value }));

    // Sort top spending categories
    categoryData.sort((a, b) => b.value - a.value);

    // Prepare trend data (expenses by date)
    const trendDataMap = expenses.reduce((acc, ex) => {
        const date = ex.date;
        acc[date] = (acc[date] || 0) + ex.amount;
        return acc;
    }, {});

    // Convert to array and sort by date for the chart
    const trendData = Object.entries(trendDataMap)
        .map(([date, amount]) => ({ date, amount }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    // Colors for Pie Chart - Bright/Neon for Dark Mode
    const COLORS = ['#38bdf8', '#818cf8', '#c084fc', '#f472b6', '#fb7185', '#34d399', '#facc15', '#a78bfa'];

    // Stats
    const totalExpenses = expenses.reduce((sum, ex) => sum + ex.amount, 0);
    const avgExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0;
    const highestCategory = categoryData.length > 0 ? categoryData[0].name : 'N/A';

    return (
        <div className="min-h-screen bg-[#0f172a] font-sans text-slate-300 pb-20 selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-hidden">
            {/* Background Animations - Consistent with Dashboard */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/30 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob"></div>
                <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/30 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob [animation-delay:2s]"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-pink-500/30 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob [animation-delay:4s]"></div>
            </div>

            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 relative z-10">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-white tracking-tight">Analytics & Reports</h1>
                    <p className="text-slate-400 mt-2">Deep dive into your spending habits.</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#334155] rounded-2xl p-6 shadow-lg border border-white/5 hover:border-indigo-500/30 transition-all duration-300">
                        <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Total Expenses</h3>
                        <p className="text-3xl font-bold text-white">${totalExpenses.toFixed(2)}</p>
                    </div>
                    <div className="bg-[#334155] rounded-2xl p-6 shadow-lg border border-white/5 hover:border-indigo-500/30 transition-all duration-300">
                        <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Avg. Transaction</h3>
                        <p className="text-3xl font-bold text-white">${avgExpense.toFixed(2)}</p>
                    </div>
                    <div className="bg-[#334155] rounded-2xl p-6 shadow-lg border border-white/5 hover:border-indigo-500/30 transition-all duration-300">
                        <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Highest Category</h3>
                        <p className="text-3xl font-bold text-white truncate">{highestCategory}</p>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Pie Chart: Expense Breakdown */}
                    <div className="bg-[#334155] rounded-2xl p-6 border border-white/5 shadow-lg min-h-[400px]">
                        <h3 className="text-xl font-bold text-white mb-6">Expense Distribution</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                                        itemStyle={{ color: '#f8fafc' }}
                                    />
                                    <Legend wrapperStyle={{ color: '#cbd5e1' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Bar Chart: Trend Over Time */}
                    <div className="bg-[#334155] rounded-2xl p-6 border border-white/5 shadow-lg min-h-[400px]">
                        <h3 className="text-xl font-bold text-white mb-6">Spending Trend</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={trendData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.5} />
                                    <XAxis dataKey="date" stroke="#cbd5e1" fontSize={12} tickFormatter={(str) => {
                                        const d = new Date(str + 'T00:00:00'); // Force local time handling
                                        return `${d.getMonth() + 1}/${d.getDate()}`;
                                    }} />
                                    <YAxis stroke="#cbd5e1" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                                        cursor={{ fill: '#334155', opacity: 0.2 }}
                                    />
                                    <Bar dataKey="amount" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Top Categories List */}
                <div className="bg-[#334155] rounded-2xl p-6 border border-white/5 shadow-lg">
                    <h3 className="text-xl font-bold text-white mb-4">Top Spending Categories</h3>
                    {categoryData.length > 0 ? (
                        <div className="space-y-4">
                            {categoryData.map((cat, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                        <span className="font-medium text-slate-200">{cat.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="block font-bold text-white">${cat.value.toFixed(2)}</span>
                                        <span className="text-xs text-slate-500">{((cat.value / totalExpenses) * 100).toFixed(1)}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-slate-500">
                            <p>No expense data available.</p>
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
};

export default Analytics;
