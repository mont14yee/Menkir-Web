import React from 'react';

export const GildedScreen1: React.FC = () => (
    <div className="w-full h-full bg-[#1a0f08] flex flex-col p-4 overflow-y-auto scrollbar-hide font-serif relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-20 pointer-events-none"></div>
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/80 to-transparent"></div>
        
        <div className="relative z-10 flex justify-between items-center mb-6 border-b-2 border-[#b89552] border-double pb-3">
            <h3 className="text-[#d4af37] text-lg font-bold uppercase tracking-widest" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                Componentry
            </h3>
            <svg className="w-6 h-6 text-[#b89552]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
        </div>

        <div className="relative z-10 space-y-6">
            <div>
                <p className="text-[#a08447] text-[10px] uppercase tracking-[0.2em] mb-2 text-center">The Royal Button</p>
                <div className="bg-[#2a170f] border border-[#d4af37]/40 shadow-[0_4px_15px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.1)] rounded px-6 py-3 text-center cursor-pointer hover:bg-[#331c12] transition-colors relative">
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#d4af37]"></div>
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#d4af37]"></div>
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#d4af37]"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#d4af37]"></div>
                    <span className="text-[#d4af37] text-sm uppercase tracking-widest font-semibold" style={{ textShadow: '0px 1px 1px black' }}>Engage</span>
                </div>
            </div>

            <div>
                <p className="text-[#a08447] text-[10px] uppercase tracking-[0.2em] mb-2 text-center">Gilded Sliders</p>
                <div className="h-1 bg-[#1a0f08] border-y border-[#d4af37]/20 rounded-full relative shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] mt-4 mb-2">
                    <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#8a6825] to-[#d4af37] w-[60%] rounded-full shadow-[0_0_5px_rgba(212,175,55,0.5)]"></div>
                    <div className="absolute top-1/2 left-[60%] -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-[#d4af37] border-2 border-[#fff7d6] rounded-full shadow-[0_2px_5px_rgba(0,0,0,0.8)]"></div>
                </div>
            </div>

            <div>
                 <p className="text-[#a08447] text-[10px] uppercase tracking-[0.2em] mb-2 text-center">Ornate Select</p>
                 <div className="bg-[#1c0f0a] border border-[#d4af37]/30 flex justify-between items-center px-3 py-2">
                     <span className="text-[#cbad71] text-xs italic">Choose an Option...</span>
                     <svg className="w-3 h-3 text-[#d4af37]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                 </div>
            </div>
        </div>
    </div>
);

export const GildedScreen2: React.FC = () => (
    <div className="w-full h-full bg-[#120a06] flex flex-col overflow-y-auto scrollbar-hide p-2 font-serif">
        <div className="bg-[#24150d] border border-[#8a6825] m-2 flex-1 relative flex flex-col p-4 shadow-[0_10px_30px_rgba(0,0,0,0.9)]">
             <div className="absolute -top-[5px] -left-[5px] w-4 h-4 border-t-2 border-l-2 border-[#d4af37]"></div>
             <div className="absolute -top-[5px] -right-[5px] w-4 h-4 border-t-2 border-r-2 border-[#d4af37]"></div>
             <div className="absolute -bottom-[5px] -left-[5px] w-4 h-4 border-b-2 border-l-2 border-[#d4af37]"></div>
             <div className="absolute -bottom-[5px] -right-[5px] w-4 h-4 border-b-2 border-r-2 border-[#d4af37]"></div>
             
             <div className="text-center mb-6">
                 <svg className="w-8 h-8 text-[#d4af37] mx-auto mb-2 opacity-80" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 12h3v9h6v-6h4v6h6v-9h3L12 2zm0 2.8L19.5 12H18v7h-2v-6H8v6H6v-7H4.5L12 4.8z"/></svg>
                 <h2 className="text-[#d4af37] text-xl font-bold uppercase tracking-widest drop-shadow-md">The Manor</h2>
                 <p className="text-[#a08447] text-[9px] italic mt-1">Invitation Request</p>
             </div>

             <div className="space-y-4">
                 <div className="border-b border-[#d4af37]/40 pb-1">
                     <span className="text-[#8a6825] text-[10px] uppercase tracking-wider block mb-1">Name</span>
                     <p className="text-[#e2cda4] text-xs font-medium">Lord Arthur Wellesley</p>
                 </div>
                 <div className="border-b border-[#d4af37]/40 pb-1">
                     <span className="text-[#8a6825] text-[10px] uppercase tracking-wider block mb-1">Affiliation</span>
                     <p className="text-[#e2cda4] text-xs font-medium">The Velvet Society</p>
                 </div>
             </div>

             <button className="mt-8 bg-gradient-to-b from-[#b89552] to-[#735118] border border-[#ffeba1] text-[#2a170f] font-bold uppercase tracking-[0.2em] text-xs py-3 w-full shadow-[0_4px_10px_rgba(0,0,0,0.8)] hover:from-[#d4af37] hover:to-[#8a6825] transition-colors relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-30 mix-blend-overlay"></div>
                Submit Scroll
             </button>
        </div>
    </div>
);

export const GildedScreen3: React.FC = () => (
    <div className="w-full h-full bg-[#1a0f08] flex flex-col overflow-y-auto scrollbar-hide py-4 px-3 font-serif relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#3a2012] via-[#1a0f08] to-[#0d0703] opacity-60 pointer-events-none"></div>
        
        <h3 className="text-[#d4af37] text-lg text-center font-bold uppercase tracking-widest mb-4 drop-shadow-lg relative z-10">
            Gallery of Antiquities
        </h3>

        <div className="flex flex-col gap-5 relative z-10">
            <div className="bg-[#120a06] p-2 border border-[#d4af37]/30 shadow-[0_8px_20px_rgba(0,0,0,0.8),0_0_10px_rgba(212,175,55,0.1)] group cursor-pointer">
                <div className="w-full aspect-video bg-[#24150d] border border-[#523A1D] flex items-center justify-center relative overflow-hidden">
                    <img width="800" height="600" src="https://images.unsplash.com/photo-1544967082-d9d25d867d66?q=80&w=400&auto=format&fit=crop" alt="Painting 1" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" loading="lazy" />
                    <div className="absolute inset-0 border-[3px] border-[#d4af37]/60 pointer-events-none m-1"></div>
                </div>
                <div className="mt-2 text-center">
                    <h4 className="text-[#e2cda4] text-xs font-semibold uppercase tracking-wider">The Golden Hour</h4>
                    <p className="text-[#8a6825] text-[9px] italic mt-0.5">Canvas • 1892</p>
                </div>
            </div>

            <div className="bg-[#120a06] p-2 border border-[#d4af37]/30 shadow-[0_8px_20px_rgba(0,0,0,0.8),0_0_10px_rgba(212,175,55,0.1)] group cursor-pointer">
                <div className="w-full aspect-video bg-[#24150d] border border-[#523A1D] flex items-center justify-center relative overflow-hidden">
                     <img width="800" height="600" src="https://images.unsplash.com/photo-1578301978693-85fa9c03fa75?q=80&w=400&auto=format&fit=crop" alt="Painting 2" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity grayscale opacity-60 sepia" loading="lazy" />
                     <div className="absolute inset-0 border-[3px] border-[#d4af37]/60 pointer-events-none m-1"></div>
                </div>
                <div className="mt-2 text-center">
                    <h4 className="text-[#e2cda4] text-xs font-semibold uppercase tracking-wider">Silent Corridors</h4>
                    <p className="text-[#8a6825] text-[9px] italic mt-0.5">Fresco • 1740</p>
                </div>
            </div>
        </div>
    </div>
);
