import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import api from '../api/axios';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [saveLoading, setSaveLoading] = useState(false);

    const [showAdminModal, setShowAdminModal] = useState(false);
    const [adminUsers, setAdminUsers] = useState([]);
    const [loadingAdminData, setLoadingAdminData] = useState(false);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    useEffect(() => {
        if (showAdminModal && user?.is_staff) {
            fetchAdminUsers();
        }
    }, [showAdminModal, user]);

    const fetchAdminUsers = async () => {
        setLoadingAdminData(true);
        try {
            const response = await api.get('auth/admin/users/');
            setAdminUsers(response.data);
        } catch (err) {
            console.error("Failed to fetch admin user list:", err);
            // Optionally set an error state for the modal
        } finally {
            setLoadingAdminData(false);
        }
    };

    const fetchUserProfile = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('auth/profile/');
            setUser(response.data);
            setEditName(response.data.name);
        } catch (err) {
            console.error("Failed to fetch profile:", err);
            setError('Failed to load profile data.');
            if (err.response?.status === 401) {
                navigate('/login');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_name');
        navigate('/login');
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setSaveLoading(true);
        try {
            const response = await api.patch('auth/profile/', { name: editName });
            setUser(prev => ({ ...prev, name: response.data.name }));
            localStorage.setItem('user_name', response.data.name); // Update local storage too
            setIsEditing(false);
        } catch (err) {
            console.error("Failed to update profile:", err);
            setError('Failed to update profile.');
        } finally {
            setSaveLoading(false);
        }
    };

    const [uploadingImg, setUploadingImg] = useState(false);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingImg(true);
        const formData = new FormData();
        formData.append('profile_picture', file);

        try {
            const response = await api.patch('auth/profile/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setUser(prev => ({ ...prev, profile_picture: response.data.profile_picture }));
        } catch (err) {
            console.error("Failed to upload image:", err);
            setError('Failed to upload profile picture.');
        } finally {
            setUploadingImg(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f172a] font-sans text-slate-300 pb-20 selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-hidden">
            {/* Background Animations */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/30 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob"></div>
                <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/30 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob [animation-delay:2s]"></div>
            </div>

            <Navbar />

            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                <div className="bg-[#1e293b]/50 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-2xl">

                    {/* Header / Avatar Section */}
                    <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 p-8 text-center border-b border-white/5 relative">
                        <div className="w-32 h-32 mx-auto relative group">
                            <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-xl ring-4 ring-white/10 overflow-hidden">
                                {user?.profile_picture ? (
                                    <img
                                        src={user.profile_picture.startsWith('http') ? user.profile_picture : `http://127.0.0.1:8000${user.profile_picture}`}
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    getInitials(user?.name)
                                )}
                            </div>

                            <label className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full cursor-pointer hover:bg-indigo-500 shadow-lg border-2 border-[#1e293b] transition-all duration-200 hover:scale-110 active:scale-95">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                    disabled={uploadingImg}
                                />
                                {uploadingImg ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                )}
                            </label>
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">{user?.name}</h1>
                        <p className="text-indigo-300 font-medium">@{user?.email?.split('@')[0]}</p> {/* Use username if available, else email prefix */}
                    </div>

                    <div className="p-8 space-y-8">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center">
                                {error}
                            </div>
                        )}

                        {/* Profile Details Form */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
                                {isEditing ? (
                                    <form onSubmit={handleUpdateProfile} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                                            autoFocus
                                        />
                                        <button
                                            type="submit"
                                            disabled={saveLoading}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 disabled:opacity-50"
                                        >
                                            {saveLoading ? 'Saving...' : 'Save'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => { setIsEditing(false); setEditName(user?.name); }}
                                            className="px-4 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600"
                                        >
                                            Cancel
                                        </button>
                                    </form>
                                ) : (
                                    <div className="flex items-center justify-between bg-[#0f172a]/50 p-4 rounded-xl border border-white/5">
                                        <span className="text-white font-medium">{user?.name}</span>
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="text-sm text-indigo-400 hover:text-indigo-300 font-medium"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Username</label>
                                <div className="bg-[#0f172a]/50 p-4 rounded-xl border border-white/5 text-slate-400 flex items-center gap-2">
                                    <svg className="w-5 h-5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    @{user?.username}
                                    <span className="ml-auto text-xs bg-slate-700/50 text-slate-400 px-2 py-1 rounded">Read-only</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
                                <div className="bg-[#0f172a]/50 p-4 rounded-xl border border-white/5 text-slate-400 flex items-center gap-2">
                                    <svg className="w-5 h-5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    {user?.email}
                                    <span className="ml-auto text-xs bg-slate-700/50 text-slate-400 px-2 py-1 rounded">Read-only</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Member Since</label>
                                <div className="bg-[#0f172a]/50 p-4 rounded-xl border border-white/5 text-slate-400 flex items-center gap-2">
                                    <svg className="w-5 h-5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    {formatDate(user?.date_joined)}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row gap-4">
                            {user?.is_staff && (
                                <button
                                    onClick={() => setShowAdminModal(true)}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/20"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                    View Users Detail
                                </button>
                            )}

                            <button
                                onClick={() => navigate('/forgot-password')} /* Using forgot password as user requested redirect to change password flow */
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-all duration-200 border border-white/5"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Change Password
                            </button>

                            <button
                                onClick={handleLogout}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-rose-600/10 hover:bg-rose-600 text-rose-400 hover:text-white font-medium rounded-xl transition-all duration-200 border border-rose-600/20 hover:border-rose-600"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Logout
                            </button>
                        </div>

                    </div>
                </div>
            </main>

            {/* Admin User Detail Modal */}
            {showAdminModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#1e293b] border border-white/10 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0f172a]/50">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                User Details (Admin View)
                            </h2>
                            <button onClick={() => setShowAdminModal(false)} className="text-slate-400 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex-1 overflow-auto p-6">
                            {loadingAdminData ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                                </div>
                            ) : (
                                <div className="overflow-x-auto max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-transparent">
                                    <table className="w-full text-left border-collapse relative">
                                        <thead className="sticky top-0 bg-[#1e293b] z-10">
                                            <tr className="border-b border-white/10 text-slate-400 text-sm uppercase tracking-wider shadow-sm">
                                                <th className="p-4 font-semibold">User</th>
                                                <th className="p-4 font-semibold">Email</th>
                                                <th className="p-4 font-semibold">Date Joined</th>
                                                <th className="p-4 font-semibold text-right">Total Budget</th>
                                                <th className="p-4 font-semibold text-right">Total Expenses</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5 text-slate-300">
                                            {adminUsers.map(u => (
                                                <tr key={u.id} className="hover:bg-white/5 transition-colors">
                                                    <td className="p-4">
                                                        <div className="font-medium text-white">{u.name || 'N/A'}</div>
                                                        <div className="text-xs text-indigo-400">@{u.username}</div>
                                                    </td>
                                                    <td className="p-4 text-sm">{u.email}</td>
                                                    <td className="p-4 text-sm whitespace-nowrap">{formatDate(u.date_joined)}</td>
                                                    <td className="p-4 text-right font-medium text-emerald-400">
                                                        ${parseFloat(u.total_budget || 0).toLocaleString()}
                                                    </td>
                                                    <td className="p-4 text-right font-medium text-rose-400">
                                                        ${parseFloat(u.total_expenses || 0).toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))}
                                            {adminUsers.length === 0 && (
                                                <tr>
                                                    <td colSpan="5" className="p-8 text-center text-slate-500 italic">No users found.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
