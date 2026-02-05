import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthLayout from './AuthLayout';

const Signup = () => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('auth/signup/', {
                name,
                username,
                email,
                password
            });
            navigate('/login');
        } catch (err) {
            console.error("Signup error:", err.response);
            const getErrorMessage = (error) => {
                if (error.response?.data) {
                    const data = error.response.data;
                    if (data.username) return Array.isArray(data.username) ? data.username[0] : data.username;
                    if (data.email) return Array.isArray(data.email) ? data.email[0] : data.email;
                    if (data.password) return Array.isArray(data.password) ? data.password[0] : data.password;
                    if (data.name) return Array.isArray(data.name) ? data.name[0] : data.name;
                    // Fallback for other errors
                    const firstError = Object.values(data).flat()[0];
                    return typeof firstError === 'string' ? firstError : 'Signup failed. Please try again.';
                }
                return 'Signup failed. Please check your connection.';
            };
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Create Account" subtitle="Start tracking your expenses today">
            <form onSubmit={handleSignup} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                        Full Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 bg-[#0f172a] border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
                        placeholder="John Doe"
                    />
                </div>

                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-2">
                        Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-3 bg-[#0f172a] border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
                        placeholder="johndoe123"
                    />
                </div>

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

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-[#0f172a] border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors focus:outline-none"
                        >
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm mb-4">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#1e293b] transition-all duration-200 active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                    {loading ? 'Creating Account...' : 'Create Account'}
                </button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-400">
                Already have an account?{' '}
                <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                    Login
                </Link>
            </div>
        </AuthLayout>
    );
};

export default Signup;
