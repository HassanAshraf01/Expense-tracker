import React from 'react';

const ExpenseTable = ({ expenses, onDelete, onEdit }) => {
    return (
        <div className="overflow-hidden bg-[#1e293b] border border-white/5 rounded-xl">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/5">
                    <thead className="bg-[#0f172a]/50">
                        <tr>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                Description
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                Category
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                                Amount
                            </th>
                            <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {expenses.map((expense) => (
                            <tr key={expense.id} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">{expense.title}</div>
                                    {expense.category === 'Subscription' && (
                                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-500/10 text-indigo-400 mt-1 border border-indigo-500/20">
                                            Recurring
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                    ${expense.category === 'Food' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                            expense.category === 'Transportation' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                expense.category === 'Utilities' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                                    expense.category === 'Subscription' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                                        'bg-slate-700/30 text-slate-400 border-slate-600/30'
                                        }`}>
                                        {expense.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                    {new Date(expense.date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-slate-200">
                                    ${expense.amount.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => onEdit(expense)}
                                            className="text-slate-400 hover:text-indigo-400 transition-colors p-1.5 hover:bg-indigo-500/10 rounded-lg cursor-pointer"
                                            title="Edit"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => onDelete(expense.id)}
                                            className="text-slate-400 hover:text-red-400 transition-colors p-1.5 hover:bg-red-500/10 rounded-lg cursor-pointer"
                                            title="Delete"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ExpenseTable;
