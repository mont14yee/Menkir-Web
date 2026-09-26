import { usePortfolioData } from './PortfolioDataProvider';
import React, { useState, useEffect, useRef } from 'react';
import { NeuralNetworkIcon, PaletteIcon, TrophyIcon } from './IconComponents';
import { motion, useScroll, useTransform } from 'motion/react';

export const Hero: React.FC = () => {
    const portfolioData = usePortfolioData();
    const [goal, setGoal] = useState('');
    const [heroData, setHeroData] = useState<any>(null);
    const sectionRef = useRef<HTMLElement>(null);
    
    useEffect(() => { 
        if(portfolioData) setHeroData((portfolioData as any).hero); 
    }, [portfolioData]);
    
    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
    const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
    const y = useTransform(scrollYProgress, [0, 1], [0, 150]);

    const handleGeneratePreview = () => {
        const section = document.getElementById('yearly-goals-doorway') || document.querySelector('section');
        section?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    return (
        <section ref={sectionRef} className="relative min-h-[120vh] flex flex-col items-center justify-center p-8 z-10 overflow-hidden cursor-crosshair">
            
            <motion.div style={{ opacity, y }} className="absolute inset-0 pointer-events-none transition-opacity duration-1000">
                <div className="absolute top-[10%] left-[20%] w-[40vw] h-[40vw] bg-zinc-800/5 rounded-full blur-[120px] mix-blend-screen"></div>
                <div className="absolute bottom-[20%] right-[10%] w-[50vw] h-[50vw] bg-neutral-800/10 rounded-full blur-[150px] mix-blend-screen animate-pulse-slow"></div>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, filter: 'blur(20px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                transition={{ duration: 5, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center space-y-16 relative z-10 w-full max-w-4xl"
            >
                <p className="text-[9px] tracking-[0.5em] uppercase text-zinc-600 font-mono opacity-50 text-center">
                    {heroData?.title || 'MENKIR WOLDE'}
                </p>
                <h1 className="text-2xl md:text-4xl font-light tracking-[0.2em] text-zinc-300 opacity-80 text-center leading-loose mix-blend-difference">
                    {heroData?.subtitle || 'Your Future, Designed.'}
                </h1>
                
                <p className="text-[11px] md:text-sm font-light tracking-widest text-zinc-500 opacity-60 text-center max-w-2xl leading-[2.5]">
                    {heroData?.description || 'Move beyond planning. Architect a year of purpose, achievement, and growth.'}
                </p>

                <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: "4rem" }}
                    transition={{ delay: 3, duration: 4, ease: "easeInOut" }}
                    className="w-[1px] bg-gradient-to-b from-zinc-700 to-transparent"
                />

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 4, duration: 3, ease: "easeOut" }}
                    className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-xl group relative"
                >
                    <input
                        type="text"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        placeholder={heroData?.inputPlaceholder || 'Launch my podcast...'}
                        className="w-full bg-transparent border-b border-zinc-800 py-4 px-2 text-zinc-300 text-sm tracking-widest placeholder-zinc-700 focus:outline-none focus:border-zinc-500 transition-colors text-center sm:text-left"
                        aria-label="Enter your primary goal"
                    />
                    <button
                        onClick={handleGeneratePreview}
                        className="text-[9px] uppercase tracking-[0.4em] text-zinc-500 hover:text-zinc-200 py-4 px-8 border border-zinc-800 hover:border-zinc-500 transition-all duration-1000 whitespace-nowrap bg-black/20 backdrop-blur-sm"
                    >
                        {heroData?.buttonText || 'Generate'}
                    </button>
                    
                    {/* Ethereal Glow on hover */}
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 blur-[40px] pointer-events-none transition-opacity duration-2000"></div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 5, duration: 4 }}
                    className="flex items-center justify-center gap-16 md:gap-32 pt-20"
                >
                    <div className="flex flex-col items-center gap-4 group/icon">
                        <div className="w-10 h-10 text-zinc-700 group-hover/icon:text-zinc-300 transition-colors duration-1000">
                            <NeuralNetworkIcon />
                        </div>
                        <span className="text-[8px] tracking-[0.2em] text-zinc-800 group-hover/icon:text-zinc-500 uppercase transition-colors duration-1000">AI Goal Nudges</span>
                    </div>
                    <div className="flex flex-col items-center gap-4 group/icon">
                        <div className="w-10 h-10 text-zinc-700 group-hover/icon:text-zinc-300 transition-colors duration-1000">
                            <PaletteIcon />
                        </div>
                        <span className="text-[8px] tracking-[0.2em] text-zinc-800 group-hover/icon:text-zinc-500 uppercase transition-colors duration-1000">Custom Themes</span>
                    </div>
                    <div className="flex flex-col items-center gap-4 group/icon">
                        <div className="w-10 h-10 text-zinc-700 group-hover/icon:text-zinc-300 transition-colors duration-1000">
                            <TrophyIcon />
                        </div>
                        <span className="text-[8px] tracking-[0.2em] text-zinc-800 group-hover/icon:text-zinc-500 uppercase transition-colors duration-1000">Achievements</span>
                    </div>
                </motion.div>

            </motion.div>
            
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 7, duration: 5 }}
                className="absolute bottom-12 text-[8px] text-zinc-700 tracking-[0.4em] uppercase"
            >
                Descend Slowly
            </motion.div>
        </section>
    );
};
