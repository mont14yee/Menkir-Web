import React from 'react';

export const OptaScreen1: React.FC = () => (
    <div className="w-full h-full bg-[#121212] flex flex-col relative overflow-hidden">
        <div className="w-full h-2/5 bg-slate-800 flex items-center justify-center relative">
            <svg className="w-12 h-12 text-[#00FF00] opacity-80" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-[#121212] to-transparent">
                <span className="bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded mr-2">LIVE</span>
                <span className="text-[#00FF00] text-[10px] font-bold">HD</span>
            </div>
        </div>
        <div className="p-4 w-full flex-1">
            <h3 className="text-white text-lg font-bold leading-tight">Watch For Free</h3>
            <p className="text-slate-400 text-xs mt-1">Global HD Broadcast</p>
            <p className="text-slate-500 text-[10px] mt-2 leading-relaxed">Experience the thrill of the match with zero latency and ultra-high definition streaming.</p>
        </div>
        <div className="p-4 mt-auto">
            <button className="w-full bg-[#00FF00] hover:bg-[#00cc00] text-black font-bold text-sm py-3 rounded-xl shadow-[0_0_15px_rgba(0,255,0,0.3)] transition-all">STREAM NOW</button>
        </div>
    </div>
);

export const OptaScreen2: React.FC = () => (
    <div className="w-full h-full bg-[#121212] p-4 flex flex-col overflow-y-auto scrollbar-hide">
        <div className="flex items-center justify-between mb-4 mt-2">
            <h3 className="text-white text-base font-bold">Featured Competitions</h3>
            <span className="text-[#00FF00] text-xs">See All</span>
        </div>
        <div className="flex flex-col gap-3">
            <div className="bg-gradient-to-r from-[#1E1E1E] to-[#2A2A2A] rounded-xl p-3 border-l-4 border-[#00FF00] relative overflow-hidden">
                <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#00FF00]/10 to-transparent"></div>
                <h4 className="text-white font-bold text-sm">English Premier League</h4>
                <p className="text-slate-400 text-[10px] mt-1">Live Matches & Highlights</p>
            </div>
            <div className="bg-gradient-to-r from-[#1E1E1E] to-[#2A2A2A] rounded-xl p-3 border-l-4 border-white relative overflow-hidden">
                <h4 className="text-white font-bold text-sm">La Liga</h4>
                <p className="text-slate-400 text-[10px] mt-1">El Clásico & More</p>
            </div>
            <div className="bg-gradient-to-r from-[#1E1E1E] to-[#2A2A2A] rounded-xl p-3 border-l-4 border-blue-500 relative overflow-hidden">
                <h4 className="text-white font-bold text-sm">Serie A</h4>
                <p className="text-slate-400 text-[10px] mt-1">Italian Top Flight</p>
            </div>
            <div className="bg-gradient-to-r from-[#1E1E1E] to-[#2A2A2A] rounded-xl p-3 border-l-4 border-yellow-400 relative overflow-hidden">
                <h4 className="text-white font-bold text-sm">Champions League</h4>
                <p className="text-slate-400 text-[10px] mt-1">European Nights</p>
            </div>
        </div>
    </div>
);

export const OptaScreen3: React.FC = () => (
    <div className="w-full h-full bg-[#121212] flex flex-col pb-0">
        <div className="flex-1 p-4 overflow-y-auto scrollbar-hide pb-0 mt-2">
            <h3 className="text-white text-base font-bold mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-[#00FF00]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                Deep Analytics
            </h3>
            
            <div className="flex justify-between text-xs text-white mb-2"><span>Possession</span> <span className="text-[#00FF00] font-bold">64%</span></div>
            <div className="w-full bg-[#1E1E1E] h-2 rounded-full mb-5 overflow-hidden"><div className="bg-[#00FF00] h-full rounded-full" style={{width: '64%'}}></div></div>
            
            <div className="flex justify-between text-xs text-white mb-2"><span>Shots on Target</span> <span className="text-[#00FF00] font-bold">8</span></div>
            <div className="w-full bg-[#1E1E1E] h-2 rounded-full mb-5 overflow-hidden"><div className="bg-[#00FF00] h-full rounded-full" style={{width: '70%'}}></div></div>
            
            <div className="flex justify-between text-xs text-white mb-2"><span>Pass Accuracy</span> <span className="text-[#00FF00] font-bold">89%</span></div>
            <div className="w-full bg-[#1E1E1E] h-2 rounded-full mb-5 overflow-hidden"><div className="bg-[#00FF00] h-full rounded-full" style={{width: '89%'}}></div></div>
            
             <div className="flex justify-between text-xs text-white mb-2"><span>Expected Goals (xG)</span> <span className="text-[#00FF00] font-bold">2.14</span></div>
            <div className="w-full bg-[#1E1E1E] h-2 rounded-full mb-2 overflow-hidden"><div className="bg-[#00FF00] h-full rounded-full" style={{width: '45%'}}></div></div>
        </div>
        <div className="h-[52px] bg-[#0A0A0A] border-t border-[#2a2a2a] flex justify-around items-center text-[10px] text-slate-500 mt-auto rounded-b-[20px] relative z-10">
            <div className="flex flex-col items-center text-[#00FF00] gap-1">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                <span className="font-bold">Live</span>
            </div>
            <div className="flex flex-col items-center gap-1 hover:text-slate-300 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H14" /></svg>
                <span>News</span>
            </div>
            <div className="flex flex-col items-center gap-1 hover:text-slate-300 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                <span>Opta</span>
            </div>
            <div className="flex flex-col items-center gap-1 hover:text-slate-300 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span>Settings</span>
            </div>
        </div>
    </div>
);

export const PhoneFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="w-[160px] h-[340px] md:w-[200px] md:h-[420px] bg-black rounded-[28px] p-[6px] shadow-2xl border border-slate-700/50 flex-shrink-0 relative box-border transform hover:scale-[1.02] transition-transform duration-300">
        {/* Notch */}
        <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[50px] md:w-[60px] h-[16px] bg-black rounded-b-xl z-20 flex justify-center items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-900 shadow-[inset_0_0_2px_rgba(255,255,255,0.2)] ml-2"></div>
        </div>
        {/* Screen */}
        <div className="w-full h-full rounded-[22px] overflow-hidden bg-[#121212] relative z-10 border border-white/5">
            {children}
        </div>
    </div>
);
