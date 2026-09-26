import React, { forwardRef, ReactNode } from 'react';
import { motion } from 'motion/react';

interface FeatureSectionProps {
    title: string;
    description: string;
    children: ReactNode;
    id?: string;
    index?: number;
}

export const FeatureSection = forwardRef<HTMLElement, FeatureSectionProps>(({ title, description, children, id, index = 0 }, ref) => {
    const isLeft = index % 2 === 0;

    return (
        <motion.section 
            id={id} 
            ref={ref} 
            initial={{ opacity: 0, filter: 'blur(20px)', y: 100 }}
            whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            viewport={{ once: false, margin: "-20%" }}
            transition={{ duration: 3, ease: [0.16, 1, 0.3, 1] }}
            className={`w-full max-w-7xl mx-auto flex flex-col items-center justify-center relative group ${isLeft ? 'md:items-start' : 'md:items-end'}`}
        >
            {/* Visual Element hidden in shadows, acting as atmosphere */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] grayscale mix-blend-overlay transition-all duration-[3000ms] ease-out group-hover:opacity-[0.25] group-hover:scale-105 pointer-events-none blur-[8px] group-hover:blur-none">
                <div className="w-[120%] h-[120%] scale-[1.2] origin-center">
                    {children}
                </div>
            </div>

            {/* The Actual Functional Visual (interactive and clear) */}
            <div className={`relative z-20 w-full md:w-3/4 max-w-4xl p-4 transition-all duration-[2000ms] opacity-60 group-hover:opacity-100 ${isLeft ? 'md:pl-12' : 'md:pr-12'}`}>
                {children}
            </div>

            {/* Text Node */}
            <div className={`relative z-30 w-full max-w-sm flex flex-col space-y-8 p-12 transition-all duration-1000 mt-12 ${isLeft ? 'text-left md:pl-24' : 'text-right md:pr-24'}`}>
                <div className="text-[8px] tracking-[0.4em] text-zinc-700 font-mono opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-[2000ms]">
                    0{index + 1}
                </div>
                
                <h3 className="text-sm tracking-[0.2em] font-light text-zinc-400 opacity-40 group-hover:opacity-90 transition-all duration-[2000ms] delay-300 uppercase">
                    {title}
                </h3>
                
                <p className="text-[11px] leading-[2.5] text-zinc-500 font-light opacity-0 translate-y-8 group-hover:opacity-60 group-hover:translate-y-0 transition-all duration-[2000ms] delay-500">
                    {description}
                </p>
                
                <div className={`w-0 h-[1px] bg-zinc-800 transition-all duration-[3000ms] delay-700 group-hover:w-16 ${isLeft ? 'self-start' : 'self-end'}`}></div>
            </div>
            
            {/* Interactive hint point */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-[1px] bg-zinc-500 rounded-full opacity-30 shadow-[0_0_10px_rgba(255,255,255,0.1)] group-hover:opacity-0 transition-opacity duration-1000"></div>
        </motion.section>
    );
});
FeatureSection.displayName = 'FeatureSection';
