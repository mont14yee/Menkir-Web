import React from 'react';

export const WalletScreen1: React.FC = () => (
    <div className="w-full h-full bg-[#0F172A] flex flex-col p-4 overflow-y-auto scrollbar-hide text-white font-sans">
        <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">M</div>
                <div>
                    <h3 className="text-sm font-semibold">Dashboard</h3>
                    <p className="text-xs text-slate-400">Welcome back, Menkir</p>
                </div>
            </div>
            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 shadow-lg mb-4">
            <p className="text-blue-100 text-xs mb-1">Total Balance</p>
            <h2 className="text-2xl font-bold mb-3">$24,562.00</h2>
            <div className="flex justify-between text-xs">
                <div className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-1">
                    <svg className="w-3 h-3 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                    <span>+$3,240 (This month)</span>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-[#1E293B] rounded-xl p-3 shadow-md border border-slate-700/50">
                <div className="flex items-center justify-between mb-2">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                        <svg className="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg>
                    </div>
                    <span className="text-green-500 text-[10px] font-medium">+12.5%</span>
                </div>
                <p className="text-slate-400 text-[10px]">Total Income</p>
                <p className="text-sm font-bold">$8,450.00</p>
            </div>
            <div className="bg-[#1E293B] rounded-xl p-3 shadow-md border border-slate-700/50">
                <div className="flex items-center justify-between mb-2">
                    <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                        <svg className="w-3 h-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" /></svg>
                    </div>
                    <span className="text-red-500 text-[10px] font-medium">-4.2%</span>
                </div>
                <p className="text-slate-400 text-[10px]">Total Expenses</p>
                <p className="text-sm font-bold">$3,210.00</p>
            </div>
            <div className="bg-[#1E293B] rounded-xl p-3 shadow-md border border-slate-700/50">
                <div className="flex items-center justify-between mb-2">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <svg className="w-3 h-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                </div>
                <p className="text-slate-400 text-[10px]">Net Amount</p>
                <p className="text-sm font-bold">$5,240.00</p>
            </div>
            <div className="bg-[#1E293B] rounded-xl p-3 shadow-md border border-slate-700/50">
                 <div className="flex items-center justify-between mb-2">
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <svg className="w-3 h-3 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    </div>
                    <span className="text-green-500 text-[10px] font-medium">+8.1%</span>
                </div>
                <p className="text-slate-400 text-[10px]">Assets</p>
                <p className="text-sm font-bold">$18,320.00</p>
            </div>
        </div>
    </div>
);

export const WalletScreen2: React.FC = () => (
    <div className="w-full h-full bg-[#0F172A] flex flex-col overflow-y-auto scrollbar-hide text-white font-sans p-4">
        <h2 className="text-xl font-bold mb-4 mt-2">More</h2>
        
        <div className="space-y-3">
            <div className="bg-[#1E293B] rounded-2xl p-4 flex items-center gap-3 shadow-md border border-slate-700/50 hover:bg-[#2A3B52] transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <div className="flex-1">
                    <h4 className="font-semibold text-sm">Activity Log</h4>
                    <p className="text-slate-400 text-xs mt-0.5">View your recent transactions</p>
                </div>
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>

            <div className="bg-[#1E293B] rounded-2xl p-4 flex items-center gap-3 shadow-md border border-slate-700/50 hover:bg-[#2A3B52] transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <div className="flex-1">
                    <h4 className="font-semibold text-sm">Scheduled</h4>
                    <p className="text-slate-400 text-xs mt-0.5">Manage upcoming payments</p>
                </div>
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>

            <div className="bg-[#1E293B] rounded-2xl p-4 flex items-center gap-3 shadow-md border border-slate-700/50 hover:bg-[#2A3B52] transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
                </div>
                <div className="flex-1">
                    <h4 className="font-semibold text-sm">Savings</h4>
                    <p className="text-slate-400 text-xs mt-0.5">Track your savings goals</p>
                </div>
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>

            <div className="bg-[#1E293B] rounded-2xl p-4 flex items-center gap-3 shadow-md border border-slate-700/50 hover:bg-[#2A3B52] transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                </div>
                <div className="flex-1">
                    <h4 className="font-semibold text-sm">Loans</h4>
                    <p className="text-slate-400 text-xs mt-0.5">Manage your debts</p>
                </div>
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
        </div>
    </div>
);

export const WalletScreen3: React.FC = () => (
    <div className="w-full h-full bg-[#0F172A] flex flex-col overflow-y-auto scrollbar-hide text-white font-sans p-4">
        <h2 className="text-xl font-bold mb-4 mt-2">Tools & Lifestyle</h2>
        
        <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-[#1E293B] rounded-2xl p-4 shadow-md border border-slate-700/50 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#2A3B52] transition-colors">
                <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mb-2">
                    <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                </div>
                <h4 className="text-sm font-semibold">Investments</h4>
            </div>
            
            <div className="bg-[#1E293B] rounded-2xl p-4 shadow-md border border-slate-700/50 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#2A3B52] transition-colors">
                <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center mb-2">
                    <svg className="w-6 h-6 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                </div>
                <h4 className="text-sm font-semibold">All Calculator</h4>
            </div>
        </div>

        <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-2xl p-1 shadow-md border border-purple-500/30">
            <div className="bg-[#1E293B] rounded-xl p-4">
                <div className="flex items-start justify-between mb-2">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                        <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <span className="bg-purple-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">AI Powered</span>
                </div>
                <h4 className="font-bold text-base mb-1">Nutrition Planner</h4>
                <p className="text-slate-400 text-xs mb-3">Optimize your grocery budget with AI-generated meal plans based on local prices.</p>
                <button className="w-full bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs py-2 rounded-lg transition-colors">Start Planning</button>
            </div>
        </div>
    </div>
);
