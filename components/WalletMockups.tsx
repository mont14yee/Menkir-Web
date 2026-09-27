import React from 'react';

// Authentic Wallet (ዋሌት) Screen Mockups
// Visual source of truth: https://github.com/mont14yee/Budget-
// Foundations: Forest Green #166534, Emerald #10B981, Dark Slate #0F172A / #1E293B, Bilingual Amharic/English

export const WalletScreen1: React.FC = () => (
    <div className="w-full h-full bg-[#0B1320] flex flex-col p-3.5 overflow-y-auto scrollbar-hide text-white font-sans text-xs">
        {/* App Header with Bilingual Title */}
        <div className="flex justify-between items-center pb-2.5 border-b border-white/10">
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#166534] flex items-center justify-center text-xs font-bold text-white shadow-sm">
                    ዋ
                </div>
                <div>
                    <h3 className="text-xs font-bold text-white leading-tight">ዋሌት • Wallet</h3>
                    <p className="text-[9px] text-emerald-400 font-mono">Bilingual Financial Suite</p>
                </div>
            </div>
            <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-800/60 px-1.5 py-0.5 rounded font-mono">EN | አማ</span>
        </div>

        {/* Forest Green Main Balance Card */}
        <div className="mt-3 bg-gradient-to-br from-[#166534] via-[#14532D] to-[#064E3B] rounded-2xl p-3.5 shadow-lg border border-emerald-500/20 relative overflow-hidden">
            <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] text-emerald-200/80 font-medium">ጠቅላላ ቀሪ ሒሳብ • Total Balance</span>
                <span className="text-[9px] bg-white/20 text-white px-1.5 py-0.5 rounded-full font-mono">USD / ETB</span>
            </div>
            <div className="text-2xl font-black text-white font-mono tracking-tight my-1">
                $18,450<span className="text-xs text-emerald-200">.00</span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-emerald-100 pt-2 border-t border-white/10">
                <span className="flex items-center gap-1 font-mono">
                    <span className="text-emerald-300">↑</span> +$3,420 (ወርሃዊ ገቢ)
                </span>
                <span className="text-emerald-200 font-mono">≈ Br 1,057,185</span>
            </div>
        </div>

        {/* Financial Flow Summary */}
        <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="bg-[#152033] rounded-xl p-2.5 border border-white/5">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] text-slate-400">ገቢ • Income</span>
                    <span className="text-emerald-400 text-[9px] font-bold">+8.4%</span>
                </div>
                <p className="text-sm font-bold text-white font-mono">$6,200.00</p>
            </div>
            <div className="bg-[#152033] rounded-xl p-2.5 border border-white/5">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] text-slate-400">ወጪ • Expense</span>
                    <span className="text-rose-400 text-[9px] font-bold">-2.1%</span>
                </div>
                <p className="text-sm font-bold text-white font-mono">$2,140.00</p>
            </div>
        </div>

        {/* Recent Transactions List */}
        <div className="mt-3 flex-1">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">የቅርብ ጊዜ ዝውውሮች • Recent Activity</span>
            <div className="space-y-1.5">
                <div className="bg-[#152033] p-2 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">ደ</div>
                        <div>
                            <div className="text-[11px] font-medium text-white">Salary • ደመወዝ</div>
                            <span className="text-[9px] text-slate-400 font-mono">Direct Deposit • Oct 1</span>
                        </div>
                    </div>
                    <span className="text-emerald-400 font-mono font-bold text-[11px]">+$4,500.00</span>
                </div>
                <div className="bg-[#152033] p-2 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px]">ም</div>
                        <div>
                            <div className="text-[11px] font-medium text-white">Groceries • የምግብ እቃዎች</div>
                            <span className="text-[9px] text-slate-400 font-mono">Fresh Market • Yesterday</span>
                        </div>
                    </div>
                    <span className="text-rose-400 font-mono font-bold text-[11px]">-$142.50</span>
                </div>
            </div>
        </div>
    </div>
);

export const WalletScreen2: React.FC = () => (
    <div className="w-full h-full bg-[#0B1320] flex flex-col p-3.5 overflow-y-auto scrollbar-hide text-white font-sans text-xs">
        {/* Header */}
        <div className="flex justify-between items-center pb-2 border-b border-white/10">
            <div>
                <h4 className="font-bold text-white text-xs">Blooming Flower Chart</h4>
                <p className="text-[9px] text-slate-400">Categorical Spending Visualizer</p>
            </div>
            <span className="text-[9px] bg-emerald-900/50 text-emerald-300 px-2 py-0.5 rounded-full font-mono">Oct 2026</span>
        </div>

        {/* Blooming Flower Graphic Representation */}
        <div className="my-3 bg-[#152033] rounded-2xl p-3 border border-emerald-500/20 flex flex-col items-center justify-center relative overflow-hidden">
            <svg viewBox="0 0 200 160" className="w-40 h-32 my-1">
                {/* Center Core */}
                <circle cx="100" cy="80" r="22" fill="#166534" stroke="#10B981" strokeWidth="2" />
                <text x="100" y="78" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="monospace">$2,140</text>
                <text x="100" y="88" textAnchor="middle" fill="#A7F3D0" fontSize="6">ወጪ TOTAL</text>
                
                {/* Petals representing Category Ratios */}
                {/* Top: Bills (38%) */}
                <ellipse cx="100" cy="40" rx="14" ry="24" fill="#10B981" opacity="0.85" transform="rotate(0 100 80)" />
                {/* Right: Food (24%) */}
                <ellipse cx="100" cy="40" rx="12" ry="20" fill="#34D399" opacity="0.8" transform="rotate(72 100 80)" />
                {/* Bottom Right: Transport (18%) */}
                <ellipse cx="100" cy="40" rx="11" ry="17" fill="#F59E0B" opacity="0.8" transform="rotate(144 100 80)" />
                {/* Bottom Left: Shopping (12%) */}
                <ellipse cx="100" cy="40" rx="10" ry="15" fill="#6366F1" opacity="0.75" transform="rotate(216 100 80)" />
                {/* Top Left: Health (8%) */}
                <ellipse cx="100" cy="40" rx="9" ry="13" fill="#EC4899" opacity="0.75" transform="rotate(288 100 80)" />
            </svg>
            <span className="text-[9px] text-slate-400 text-center">Interactive Petals scale proportionally with budget limits</span>
        </div>

        {/* Categories Breakdown */}
        <div className="space-y-1.5 flex-1">
            <div className="bg-[#152033] p-2 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
                    <span className="text-[11px] text-white">የቤት ክፍያዎች • Bills</span>
                </div>
                <div className="text-right font-mono">
                    <span className="text-[11px] text-white font-bold">$813.20</span>
                    <span className="text-[9px] text-slate-400 block">38%</span>
                </div>
            </div>
            <div className="bg-[#152033] p-2 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#34D399]"></span>
                    <span className="text-[11px] text-white">ምግብ • Food & Dining</span>
                </div>
                <div className="text-right font-mono">
                    <span className="text-[11px] text-white font-bold">$513.60</span>
                    <span className="text-[9px] text-slate-400 block">24%</span>
                </div>
            </div>
            <div className="bg-[#152033] p-2 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></span>
                    <span className="text-[11px] text-white">ትራንስፖርት • Transport</span>
                </div>
                <div className="text-right font-mono">
                    <span className="text-[11px] text-white font-bold">$385.20</span>
                    <span className="text-[9px] text-slate-400 block">18%</span>
                </div>
            </div>
        </div>
    </div>
);

export const WalletScreen3: React.FC = () => (
    <div className="w-full h-full bg-[#0B1320] flex flex-col p-3.5 overflow-y-auto scrollbar-hide text-white font-sans text-xs">
        {/* Header */}
        <div className="flex justify-between items-center pb-2 border-b border-white/10">
            <div>
                <h4 className="font-bold text-white text-xs">Savings &amp; Offline Vault</h4>
                <p className="text-[9px] text-slate-400">IndexedDB Client Encryption</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
        </div>

        {/* Savings Goals */}
        <div className="mt-3 space-y-2 flex-1">
            <div className="bg-[#152033] p-3 rounded-xl border border-white/5">
                <div className="flex justify-between items-start mb-1.5">
                    <div>
                        <div className="font-bold text-white text-[11px]">የድንገተኛ ፈንድ • Emergency Fund</div>
                        <span className="text-[9px] text-emerald-400 font-mono">Target: $10,000</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400">85%</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mb-1">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '85%' }}></div>
                </div>
                <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                    <span>Saved: $8,500</span>
                    <span>Remaining: $1,500</span>
                </div>
            </div>

            <div className="bg-[#152033] p-3 rounded-xl border border-white/5">
                <div className="flex justify-between items-start mb-1.5">
                    <div>
                        <div className="font-bold text-white text-[11px]">ኢንቨስትመንት • Investment Portfolio</div>
                        <span className="text-[9px] text-emerald-400 font-mono">Target: $25,000</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400">62%</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mb-1">
                    <div className="bg-[#10B981] h-full rounded-full" style={{ width: '62%' }}></div>
                </div>
                <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                    <span>Saved: $15,500</span>
                    <span>Remaining: $9,500</span>
                </div>
            </div>
        </div>

        {/* Security / Privacy Guarantee Banner */}
        <div className="mt-3 p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            </div>
            <div className="text-[9px] text-emerald-200/90 leading-tight">
                <strong>100% Client-Side Privacy:</strong> Zero cloud trackers or external data collection. All accounts stored in local browser IndexedDB.
            </div>
        </div>
    </div>
);
