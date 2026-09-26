import React from 'react';

export const LifeScreen1: React.FC = () => (
    <div className="w-full h-full bg-[#0a0a0a] flex flex-col p-4 overflow-y-auto scrollbar-hide text-slate-300 font-sans relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-[#0a0a0a] to-black opacity-50"></div>
        <div className="relative z-10 flex justify-between items-center mb-6 border-b border-red-900/30 pb-3">
            <h3 className="text-white text-lg font-bold uppercase tracking-widest flex items-center gap-2">
                <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                Master Plan
            </h3>
            <div className="w-6 h-6 rounded border border-red-900/50 flex items-center justify-center bg-black">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></div>
            </div>
        </div>

        <div className="relative z-10 flex flex-col gap-4">
            <div className="bg-[#111] p-4 rounded-sm border-l-2 border-red-700 shadow-[0_0_15px_rgba(220,38,38,0.1)] relative group cursor-pointer hover:bg-[#1a1a1a] transition-all">
                <div className="absolute right-3 top-3 text-[10px] text-red-700 font-mono">01_INIT</div>
                <h4 className="text-white font-medium text-sm mb-1 uppercase tracking-wider">Career Shift</h4>
                <p className="text-slate-500 text-xs text-justify">Infiltrate the frontend domain. Gather intel on modern frameworks.</p>
                <div className="mt-3 w-full h-1 bg-black overflow-hidden">
                    <div className="bg-red-700 h-full" style={{ width: '65%' }}></div>
                </div>
            </div>
            
            <div className="bg-[#111] p-4 rounded-sm border-l-2 border-slate-700 relative group cursor-pointer hover:bg-[#1a1a1a] transition-all">
                <div className="absolute right-3 top-3 text-[10px] text-slate-600 font-mono">02_EXEC</div>
                <h4 className="text-white font-medium text-sm mb-1 uppercase tracking-wider">Financial Web</h4>
                <p className="text-slate-500 text-xs text-justify">Untangle the budget constraints. Secure the assets.</p>
                <div className="mt-3 w-full h-1 bg-black overflow-hidden">
                    <div className="bg-slate-700 h-full" style={{ width: '30%' }}></div>
                </div>
            </div>

            <div className="bg-[#0f0f0f] p-4 rounded-sm border border-slate-800/50 relative border-dashed flex items-center justify-center cursor-pointer hover:border-red-900/50 transition-colors">
                <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" /></svg>
                <span className="text-slate-600 text-xs ml-2 uppercase tracking-widest">New Directive</span>
            </div>
        </div>
    </div>
);

export const LifeScreen2: React.FC = () => (
    <div className="w-full h-full bg-[#0a0a0a] flex flex-col p-4 overflow-y-auto scrollbar-hide text-white font-mono relative">
        <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-10 pointer-events-none">
            {Array.from({ length: 36 }).map((_, i) => (
                <div key={i} className="border border-slate-700"></div>
            ))}
        </div>
        <h3 className="text-red-700 text-xs uppercase tracking-[0.3em] text-center mb-6 border-b border-red-900/30 pb-2">The Web of Connections</h3>
        
        <div className="flex-1 relative">
            <svg className="absolute inset-0 w-full h-full">
                <path d="M 50 50 Q 80 150 120 80" stroke="rgba(220,38,38,0.4)" strokeWidth="1" fill="none" strokeDasharray="4 4" />
                <path d="M 120 80 Q 150 20 180 100" stroke="rgba(220,38,38,0.4)" strokeWidth="1" fill="none" strokeDasharray="4 4" />
                <path d="M 50 50 L 150 200" stroke="rgba(71,85,105,0.4)" strokeWidth="1" fill="none" />
            </svg>
            
            <div className="absolute top-[30px] left-[30px] w-10 h-10 rounded-full border border-red-500 bg-black shadow-[0_0_20px_rgba(220,38,38,0.3)] flex items-center justify-center z-10">
                <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <div className="absolute top-[60px] left-[100px] w-10 h-10 rounded-full border border-slate-600 bg-[#111] flex items-center justify-center z-10">
                 <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            
            <div className="absolute bottom-[80px] right-[40px] w-12 h-12 rounded-full border-2 border-red-700 bg-[#1a0505] flex items-center justify-center z-10">
                <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            
            <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm border border-slate-800 p-2 text-[8px] text-slate-400 uppercase">
                <span className="text-red-500">Anomaly detected:</span> Target node shifted. Re-evaluating path.
            </div>
        </div>
    </div>
);

export const LifeScreen3: React.FC = () => (
    <div className="w-full h-full bg-black flex flex-col p-4 overflow-y-auto scrollbar-hide text-white relative">
        <div className="flex justify-between items-end mb-6 border-b border-red-900/50 pb-2">
            <div>
                <h3 className="text-3xl font-serif italic text-white tracking-tight">Today</h3>
                <p className="text-slate-500 font-mono text-[9px] uppercase tracking-widest mt-1">Classified Log</p>
            </div>
            <div className="text-right">
                <p className="text-red-700 font-mono text-sm">24_OCT</p>
            </div>
        </div>

        <div className="space-y-4 font-serif">
            <div className="flex gap-3">
                <div className="text-red-800 text-xs font-mono uppercase mt-1">08:00</div>
                <div className="flex-1 pb-4 border-b border-slate-900">
                    <h4 className="text-slate-200 text-sm italic">Analyze market trends</h4>
                    <p className="text-slate-600 text-[10px] mt-1">Look for the hidden patterns in the data stream.</p>
                </div>
            </div>
            <div className="flex gap-3">
                <div className="text-red-500 text-xs font-mono uppercase mt-1 flex items-center gap-1">
                    <div className="w-1 h-1 bg-red-500 rounded-full animate-ping"></div>
                    14:30
                </div>
                <div className="flex-1 pb-4 border-b border-slate-900 border-l border-red-900/50 pl-2">
                    <h4 className="text-white text-sm font-medium">Briefing with Contact X</h4>
                    <p className="text-red-900/80 text-[10px] mt-1 uppercase tracking-widest">High Priority Interception</p>
                </div>
            </div>
            <div className="flex gap-3">
                <div className="text-slate-700 text-xs font-mono uppercase mt-1 line-through">19:00</div>
                <div className="flex-1 pb-4 border-b border-slate-900 opacity-50 text-slate-500">
                    <h4 className="text-sm italic line-through">Routine exercise</h4>
                    <span className="text-[9px] px-1 bg-slate-800 text-slate-400 mt-1 inline-block">Aborted</span>
                </div>
            </div>
        </div>
        
        <button className="mt-auto w-full bg-red-900/20 border border-red-900/50 text-red-500 uppercase tracking-widest text-xs py-3 hover:bg-red-900/40 transition-colors font-mono">
            Log Entry
        </button>
    </div>
);
