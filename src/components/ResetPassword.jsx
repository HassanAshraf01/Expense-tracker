import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import AuthLayout from './AuthLayout';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // URL params
    const { uid, token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        setError('');
        setMessage('');

        try {
            await api.patch('auth/password-reset-confirm/', {
                uidb64: uid,
                token: token,
                password: password,
                confirm_password: confirmPassword
            });
            setMessage('Password reset successful! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            const errorMsg = err.response?.data?.detail || 'Invalid or expired token. Please request a new link.';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Reset Password" subtitle="Enter your new password">
            {!message ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                            New Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-[#0f172a] border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
                            placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
                            Confirm New Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-[#0f172a] border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
                            placeholder="••••••••"
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
                        {loading ? 'Reseting...' : 'Reset Password'}
                    </button>
                </form>
            ) : (
                <div className="text-center space-y-6">
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400">
                        {message}
                    </div>
                </div>
            )}
        </AuthLayout>
    );
};

export default ResetPassword;
