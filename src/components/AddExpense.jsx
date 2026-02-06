import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import api from '../api/axios';

const AddExpense = ({ onAdd, onCancel, initialData, refreshData }) => {
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0]
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [budgetError, setBudgetError] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const validateForm = () => {
        const newErrors = {};

        // Description Validation
        if (!formData.title || !formData.title.trim()) {
            newErrors.title = "Description is required";
        } else if (!/^[A-Za-z\s]+$/.test(formData.title)) {
            newErrors.title = "Description must contain only alphabets and spaces";
        }

        // Date Validation
        const todayStr = new Date().toISOString().split('T')[0];
        if (formData.date > todayStr) {
            newErrors.date = "Future dates are not allowed";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        if (!formData.amount) return;

        setLoading(true);

        try {
            let response;
            if (initialData) {
                // Update existing expense
                response = await api.put(`expenses/${initialData.id}/`, {
                    ...formData,
                    amount: parseFloat(formData.amount)
                });
            } else {
                // Create new expense
                response = await api.post('expenses/', {
                    ...formData,
                    amount: parseFloat(formData.amount)
                });
            }
            if (refreshData) {
                await refreshData();
            }
            onAdd();
        } catch (err) {
            console.error("Failed to save expense:", err);

            // Check for Budget Limit Exceeded Error
            if (err.response?.data?.budget_limit_exceeded) {
                setBudgetError(true);
                return;
            }

            alert("Failed to save expense: " + (err.response?.data?.detail || JSON.stringify(err.response?.data) || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (date) => {
        if (!date) return;
        const formatted = date.toISOString().split('T')[0];
        setFormData({ ...formData, date: formatted });
        // Clear date error when user changes date
        if (errors.date) {
            setErrors(prev => ({ ...prev, date: '' }));
        }
    };

    const handleDescriptionChange = (e) => {
        setFormData({ ...formData, title: e.target.value });
        // Clear description error when user types
        if (errors.title) {
            setErrors(prev => ({ ...prev, title: '' }));
        }
    };

    if (budgetError) {
        return (
            <div className="fixed inset-0 bg-[#0f172a]/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                <div className="bg-[#1e293b] border border-red-500/30 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-slide-up relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Budget Limit Exceeded</h3>
                        <p className="text-slate-400 mb-6">
                            This expense would push your total spending over your monthly limit.
                            <br /><span className="text-sm">We've reset your budget so you can adjust your goals.</span>
                        </p>

                        <div className="space-y-3">
                            <button
                                onClick={() => {
                                    onCancel();
                                    navigate('/budget');
                                }}
                                className="w-full px-4 py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl shadow-lg shadow-red-500/20 transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95"
                            >
                                Adjust Budget Limit
                            </button>
                            <button
                                onClick={onCancel}
                                className="w-full px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-all duration-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-[#0f172a]/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-[#1e293b] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-slide-up">
                <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-[#0f172a]/30">
                    <h3 className="text-lg font-semibold text-white">{initialData ? 'Edit Expense' : 'New Expense'}</h3>
                    <button onClick={onCancel} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                        <input
                            type="text"
                            className={`w-full px-3 py-2 bg-[#0f172a] border ${errors.title ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-700 focus:border-indigo-500/50 focus:ring-indigo-500/50'} rounded-xl focus:ring-2 text-white placeholder-slate-600 outline-none transition-all`}
                            placeholder="e.g. Netflix Subscription"
                            value={formData.title}
                            onChange={handleDescriptionChange}
                        />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Amount</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-slate-500">$</span>
                                <input
                                    type="number"
                                    required
                                    step="0.01"
                                    min="0"
                                    className="w-full pl-7 pr-3 py-2 bg-[#0f172a] border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-white placeholder-slate-600 outline-none transition-all"
                                    placeholder="0.00"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Category</label>
                            <select
                                className="w-full px-3 py-2 bg-[#0f172a] border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-white outline-none transition-all"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="Food">Food</option>
                                <option value="Transportation">Transport</option>
                                <option value="Utilities">Utilities</option>
                                <option value="Entertainment">Entertainment</option>
                                <option value="Subscription">Subscription</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Date</label>
                        <div className="relative">
                            <DatePicker
                                selected={formData.date ? new Date(formData.date) : new Date()}
                                onChange={handleDateChange}
                                maxDate={new Date()}
                                className={`w-full pl-3 pr-10 py-2 bg-[#0f172a] border ${errors.date ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-700 focus:border-indigo-500/50 focus:border-indigo-500/50'} rounded-xl focus:ring-2 text-white outline-none transition-all cursor-pointer`}
                                wrapperClassName="w-full"
                                dateFormat="yyyy-MM-dd"
                                showYearDropdown
                                scrollableYearDropdown
                                yearDropdownItemNumber={20}
                                showMonthDropdown
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg className={`w-5 h-5 ${errors.date ? 'text-red-500' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                        {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={loading}
                            className="flex-1 px-4 py-2 border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-800 font-medium transition-colors cursor-pointer disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 font-medium shadow-lg shadow-indigo-500/20 transition-all cursor-pointer disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : (initialData ? 'Save Changes' : 'Add Expense')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddExpense;
