import React from 'react';

// Authentic MenkiR CRM Screen Mockups
// Visual source of truth: https://github.com/mont14yee/MenkR-
// Foundation: Charcoal #1C1C1A, Warm Canvas #F1F0EC, Lime Accent #E7F45A, Warm Orange #F2A93E

export const MenkRScreen1: React.FC = () => (
    <div className="w-full h-full bg-[#1C1C1A] text-[#F5F5F0] flex flex-col p-3.5 overflow-y-auto scrollbar-hide font-sans text-xs">
        {/* App Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#1C1C1A] border border-[#E7F45A] p-0.5 flex items-center justify-center">
                    <svg viewBox="0 0 512 512" className="w-4 h-4" fill="none">
                        <circle cx="256" cy="240" r="120" stroke="#E7F45A" strokeWidth="50" />
                        <path d="M 340 324 L 400 384" stroke="#E7F45A" strokeWidth="50" strokeLinecap="round" />
                        <circle cx="256" cy="240" r="40" fill="#E7F45A" />
                    </svg>
                </div>
                <span className="font-bold tracking-tight text-white text-sm">MenkiR</span>
            </div>
            <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E7F45A] animate-pulse"></span>
                <span className="text-[10px] text-white/60 font-mono">WORKSPACE</span>
            </div>
        </div>

        {/* Financial & Time Ticker */}
        <div className="mt-3 bg-[#262624] rounded-xl p-3 border border-white/5 relative overflow-hidden">
            <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">Active Revenue</span>
                <span className="text-[10px] text-[#E7F45A] bg-[#E7F45A]/10 px-1.5 py-0.5 rounded font-mono font-bold">+18.4%</span>
            </div>
            <div className="text-xl font-black text-white font-mono tracking-tight">$14,850<span className="text-xs text-white/40">.00</span></div>
            <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-white/70">
                <span>Billable Time: <strong className="text-white font-mono">38.5 hrs</strong></span>
                <span className="text-[#F2A93E]">4 Active Clients</span>
            </div>
        </div>

        {/* Modules Overview */}
        <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="bg-[#262624] p-2.5 rounded-xl border border-white/5">
                <span className="text-[9px] text-white/50 block uppercase">Projects</span>
                <span className="text-base font-bold text-white mt-0.5 block">6 Active</span>
                <div className="w-full bg-white/10 h-1 rounded-full mt-2 overflow-hidden">
                    <div className="bg-[#E7F45A] h-full" style={{ width: '75%' }}></div>
                </div>
            </div>
            <div className="bg-[#262624] p-2.5 rounded-xl border border-white/5">
                <span className="text-[9px] text-white/50 block uppercase">Tasks Due</span>
                <span className="text-base font-bold text-white mt-0.5 block">5 Urgent</span>
                <div className="w-full bg-white/10 h-1 rounded-full mt-2 overflow-hidden">
                    <div className="bg-[#F2A93E] h-full" style={{ width: '60%' }}></div>
                </div>
            </div>
        </div>

        {/* Priority Deliverables */}
        <div className="mt-3 flex-1">
            <span className="text-[10px] font-semibold text-white/60 uppercase tracking-wider block mb-1.5">Deliverables</span>
            <div className="space-y-1.5">
                <div className="bg-[#242422] p-2 rounded-lg border-l-2 border-[#E7F45A] flex items-center justify-between">
                    <div>
                        <div className="font-semibold text-[11px] text-white">Client Contract Brief</div>
                        <span className="text-[9px] text-white/40 font-mono">Studio Apex • Today</span>
                    </div>
                    <span className="text-[9px] bg-[#E7F45A]/15 text-[#E7F45A] px-1.5 py-0.5 rounded font-bold">Review</span>
                </div>
                <div className="bg-[#242422] p-2 rounded-lg border-l-2 border-[#F2A93E] flex items-center justify-between">
                    <div>
                        <div className="font-semibold text-[11px] text-white">Invoice Milestone #2</div>
                        <span className="text-[9px] text-white/40 font-mono">Vanguard Tech • 2d</span>
                    </div>
                    <span className="text-[9px] bg-[#F2A93E]/15 text-[#F2A93E] px-1.5 py-0.5 rounded font-bold">$4.2K</span>
                </div>
            </div>
        </div>
    </div>
);

export const MenkRScreen2: React.FC = () => (
    <div className="w-full h-full bg-[#1C1C1A] text-[#F5F5F0] flex flex-col p-3.5 overflow-y-auto scrollbar-hide font-sans text-xs">
        {/* Kanban Board Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
            <div>
                <h4 className="font-bold text-white text-sm">Kanban Pipeline</h4>
                <p className="text-[10px] text-white/50">4 Columns • 14 Total Cards</p>
            </div>
            <span className="text-[10px] bg-[#E7F45A] text-[#1C1C1A] font-bold px-2 py-0.5 rounded-full">+ Card</span>
        </div>

        {/* Column Navigation Tabs */}
        <div className="flex gap-1.5 mt-2.5 pb-1 overflow-x-auto scrollbar-hide">
            <span className="bg-[#E7F45A] text-[#1C1C1A] font-bold px-2.5 py-1 rounded-md text-[10px] whitespace-nowrap">In Progress (3)</span>
            <span className="bg-white/10 text-white/70 px-2 py-1 rounded-md text-[10px] whitespace-nowrap">Review (2)</span>
            <span className="bg-white/10 text-white/70 px-2 py-1 rounded-md text-[10px] whitespace-nowrap">Done (8)</span>
        </div>

        {/* Kanban Cards */}
        <div className="mt-3 space-y-2.5 flex-1">
            <div className="bg-[#262624] p-2.5 rounded-xl border border-white/10 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] text-[#E7F45A] font-mono font-bold">PRJ-084</span>
                    <span className="text-[9px] bg-red-500/20 text-red-300 px-1 rounded">High</span>
                </div>
                <div className="font-bold text-white text-xs mb-1">Civil Design System Portal</div>
                <p className="text-[10px] text-white/60 mb-2">Finalize responsive component library and color mappings.</p>
                <div className="flex items-center justify-between text-[9px] text-white/50 pt-2 border-t border-white/5">
                    <span>Deadline: Oct 2</span>
                    <span className="text-white font-mono">8/10 Tasks</span>
                </div>
            </div>

            <div className="bg-[#262624] p-2.5 rounded-xl border border-white/10 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] text-[#F2A93E] font-mono font-bold">PRJ-089</span>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1 rounded">Normal</span>
                </div>
                <div className="font-bold text-white text-xs mb-1">Invoice Automation Pipeline</div>
                <p className="text-[10px] text-white/60 mb-2">Generate client PDF receipt templates.</p>
                <div className="flex items-center justify-between text-[9px] text-white/50 pt-2 border-t border-white/5">
                    <span>Deadline: Oct 5</span>
                    <span className="text-white font-mono">3/6 Tasks</span>
                </div>
            </div>
        </div>
    </div>
);

export const MenkRScreen3: React.FC = () => (
    <div className="w-full h-full bg-[#1C1C1A] text-[#F5F5F0] flex flex-col p-3.5 overflow-y-auto scrollbar-hide font-sans text-xs">
        {/* Productivity & Timer Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
            <div>
                <h4 className="font-bold text-white text-sm">Time Tracker</h4>
                <p className="text-[10px] text-white/50">Active Focus Session</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-[#E7F45A] animate-ping"></span>
        </div>

        {/* Stopwatch Display */}
        <div className="my-4 bg-[#262624] rounded-2xl p-4 text-center border border-[#E7F45A]/30 shadow-lg">
            <span className="text-[10px] text-[#E7F45A] font-semibold uppercase tracking-widest block mb-1">CURRENT PROJECT</span>
            <div className="text-xs font-bold text-white mb-2">Studio Menkir • Architecture</div>
            <div className="text-3xl font-black text-white font-mono tracking-tight text-center my-1">
                02:45:<span className="text-[#E7F45A]">18</span>
            </div>
            <div className="mt-3 flex gap-2 justify-center">
                <button className="bg-[#E7F45A] text-[#1C1C1A] font-bold text-[10px] px-4 py-1.5 rounded-full shadow">Pause</button>
                <button className="bg-white/10 text-white font-bold text-[10px] px-4 py-1.5 rounded-full hover:bg-white/20">Log Time</button>
            </div>
        </div>

        {/* Weekly Productivity Ledger */}
        <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-semibold text-white/60 uppercase">Weekly Hours</span>
                <span className="text-[10px] text-[#E7F45A] font-mono font-bold">36.2 / 40 hrs</span>
            </div>
            <div className="space-y-1.5">
                <div className="bg-[#242422] p-2 rounded-lg flex items-center justify-between text-[10px]">
                    <span className="text-white">Monday • Client Consultations</span>
                    <span className="text-white/60 font-mono">7.5 hrs</span>
                </div>
                <div className="bg-[#242422] p-2 rounded-lg flex items-center justify-between text-[10px]">
                    <span className="text-white">Tuesday • Pipeline Review</span>
                    <span className="text-white/60 font-mono">8.0 hrs</span>
                </div>
                <div className="bg-[#242422] p-2 rounded-lg flex items-center justify-between text-[10px]">
                    <span className="text-white">Wednesday • Sprint Coding</span>
                    <span className="text-white/60 font-mono">8.2 hrs</span>
                </div>
            </div>
        </div>
    </div>
);
