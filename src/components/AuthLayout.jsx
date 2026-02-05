import React from 'react';

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="min-h-screen bg-[#0f172a] relative overflow-hidden flex items-center justify-center p-4 font-sans text-slate-300">
            {/* Background Animations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-purple-500/30 rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-blob"></div>
                <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] bg-indigo-500/30 rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-blob [animation-delay:2s]"></div>
                <div className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] bg-pink-500/30 rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-blob [animation-delay:4s]"></div>
            </div>

            <div className="w-full max-w-md bg-[#1e293b]/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/5 p-8 transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl hover:border-indigo-500/20 relative z-10">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white tracking-tight">{title}</h2>
                    <p className="text-slate-400 mt-2 text-sm">{subtitle}</p>
                </div>
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;
