import React, { forwardRef } from 'react';
import { ArrowRight } from './ExtractedIcons';
import { motion } from 'motion/react';

export const FinalCTA = forwardRef<HTMLElement>((props, ref) => {
    return (
        <section ref={ref} className="h-[100vh] flex items-center justify-center relative overflow-hidden">
            {/* Ambient subtle glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-zinc-800/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen opacity-50"></div>
            
            <motion.div
                initial={{ opacity: 0, filter: 'blur(20px)' }}
                whileInView={{ opacity: 1, filter: 'blur(0px)' }}
                viewport={{ once: false, margin: "-10%" }}
                transition={{ duration: 4, ease: "easeOut" }}
                className="flex flex-col items-center group relative z-10 w-full"
            >
                <button 
                    onClick={() => window.dispatchEvent(new CustomEvent('open-download-modal', { detail: { project: 'Master Development Plan' } }))} 
                    className="flex flex-col items-center justify-center gap-12 bg-transparent border-none outline-none cursor-pointer w-full"
                >
                    <div className="text-[10px] md:text-xs tracking-[0.4em] text-zinc-600 uppercase transition-all duration-3000 group-hover:text-zinc-300 group-hover:tracking-[0.8em]">
                        Download Full Design
                    </div>
                    
                    <div className="w-[1px] h-32 bg-gradient-to-b from-transparent via-zinc-800 to-transparent transition-all duration-2000 group-hover:via-zinc-500 group-hover:h-40"></div>
                    
                    <ArrowRight className="w-6 h-6 text-zinc-700 group-hover:text-zinc-400 group-hover:translate-y-4 transition-all duration-1000" />
                </button>
            </motion.div>
        </section>
    );
});
FinalCTA.displayName = 'FinalCTA';
