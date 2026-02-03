import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const ExpenseFilterBar = ({
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    dateFilter = '',
    setDateFilter = () => { },
    amountFilter = '',
    setAmountFilter = () => { },
    onClearFilters = () => { }
}) => {
    // Helper to handle date change from DatePicker (Date obj) to parent (string YYYY-MM-DD)
    const handleDateChange = (date) => {
        if (!date) {
            setDateFilter('');
            return;
        }
        // Create YYYY-MM-DD string using local time to avoid timezone shifts
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formatted = `${year}-${month}-${day}`;
        setDateFilter(formatted);
    };

    return (
        <div className="mb-6">
            {/* Top Row: Search and Clear */}
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-slate-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search expenses by title..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2.5 bg-[#0f172a] border border-slate-700/50 rounded-xl leading-5 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all shadow-sm"
                    />
                </div>

                <button
                    onClick={onClearFilters}
                    className="lg:w-auto w-full px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors border border-white/5 font-medium flex items-center justify-center gap-2 cursor-pointer"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear Filters
                </button>
            </div>

            {/* Bottom Row: Detailed Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Date Filter */}
                <div className="relative pt-1 z-20">
                    <label className="absolute -top-1.5 left-3 bg-[#1e293b] px-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider z-10">Date</label>
                    <div className="relative">
                        <DatePicker
                            selected={dateFilter ? new Date(dateFilter) : null}
                            onChange={handleDateChange}
                            placeholderText="Select date"
                            className="block w-full pl-3 pr-10 py-2.5 bg-[#0f172a] border border-slate-700/50 rounded-xl text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all cursor-pointer"
                            wrapperClassName="w-full"
                            dateFormat="yyyy-MM-dd"
                            isClearable
                            showYearDropdown
                            scrollableYearDropdown
                            yearDropdownItemNumber={20}
                            showMonthDropdown
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Amount Filter */}
                <div className="relative pt-1">
                    <label className="absolute -top-1.5 left-3 bg-[#1e293b] px-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider z-10">Amount</label>
                    <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-500 text-sm">$</span>
                        <input
                            type="number"
                            placeholder="Exact amount"
                            value={amountFilter}
                            onChange={(e) => setAmountFilter(e.target.value)}
                            className="block w-full pl-6 pr-3 py-2.5 bg-[#0f172a] border border-slate-700/50 rounded-xl text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                        />
                    </div>
                </div>

                {/* Category Filter */}
                <div className="relative pt-1">
                    <label className="absolute -top-1.5 left-3 bg-[#1e293b] px-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider z-10">Category</label>
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="block w-full px-3 py-2.5 bg-[#0f172a] border border-slate-700/50 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 rounded-xl appearance-none cursor-pointer"
                    >
                        <option value="All">All Categories</option>
                        <option value="Food">Food & Dining</option>
                        <option value="Transportation">Transportation</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Subscription">Subscriptions</option>
                        <option value="Other">Other</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpenseFilterBar;
