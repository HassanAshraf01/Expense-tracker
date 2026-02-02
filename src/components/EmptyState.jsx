import React from 'react';

const EmptyState = ({ onAddExpense }) => {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-[#1e293b] border border-white/5 rounded-xl shadow-sm">
            <div className="w-16 h-16 bg-[#0f172a] text-slate-500 rounded-full flex items-center justify-center mb-4 ring-1 ring-white/10">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">No expenses yet</h3>
            <p className="text-slate-400 mb-6 max-w-sm">
                Start tracking your spending by adding your first expense or subscription.
            </p>
            <button
                onClick={onAddExpense}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors font-medium shadow-lg shadow-indigo-500/20 active:transform active:scale-95 cursor-pointer"
            >
                Add First Expense
            </button>
        </div>
    );
};

export default EmptyState;
