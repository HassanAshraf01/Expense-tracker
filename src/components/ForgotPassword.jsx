import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import AuthLayout from './AuthLayout';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const response = await api.post('auth/password-reset/', { email });
            setMessage(response.data.success);
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Forgot Password" subtitle="Enter your email to reset your password">
            {!message ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-[#0f172a] border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
                            placeholder="you@example.com"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#1e293b] transition-all duration-200 active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>

                    <div className="text-center text-sm">
                        <Link to="/login" className="text-slate-400 hover:text-white transition-colors">
                            Back to Login
                        </Link>
                    </div>
                </form>
            ) : (
                <div className="text-center space-y-6">
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400">
                        {message}
                    </div>
                    <div className="text-sm text-slate-400">
                        Check your email for the reset link using the email provided securely.
                    </div>
                    <Link to="/login" className="block w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-all duration-200">
                        Back to Login
                    </Link>
                </div>
            )}
        </AuthLayout>
    );
};

export default ForgotPassword;
