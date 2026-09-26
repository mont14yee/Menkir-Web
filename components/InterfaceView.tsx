import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Activity, Droplet, Layers, Zap, ShieldCheck, BarChart3, ArrowRight, ArrowLeft, FileText, Cpu, X } from './ExtractedIcons';

export const InterfaceView: React.FC = () => {
    const navigate = useNavigate();
    const { scrollYProgress } = useScroll();
    const [activeDocModal, setActiveDocModal] = useState<'manuals' | 'citations' | 'policy' | null>(null);
    const [isScanActive, setIsScanActive] = useState(false);
    
    // Wave transformations
    const waveY = useTransform(scrollYProgress, [0, 0.2], ['0%', '100%']);
    const waveOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

    return (
        <div className="bg-[#020617] text-slate-200 min-h-screen font-sans selection:bg-teal-500/30">
            {/* 1. Hero Section: Cradle-to-Cradle Flux */}
            <section className="relative h-[120vh] flex flex-col items-center justify-center overflow-hidden pt-20">
                <div className="absolute top-20 left-4 sm:left-8 z-30">
                    <button
                        onClick={() => navigate('/')}
                        className="inline-flex items-center gap-2 text-xs font-semibold text-teal-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-teal-500/30 px-3.5 py-1.5 rounded-full transition-all cursor-pointer shadow-lg focus-visible:ring-2 focus-visible:ring-teal-500"
                        aria-label="Return to Portfolio"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Portfolio</span>
                    </button>
                </div>
                <motion.div 
                    className="absolute inset-0 z-0 opacity-40"
                    style={{ y: waveY, opacity: waveOpacity }}
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] bg-[radial-gradient(circle,rgba(20,184,166,0.15)_0%,transparent_60%)] blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />
                    <svg className="absolute w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 800">
                        <path fill="rgba(20,184,166,0.05)" d="M0,400 C320,200 420,600 720,400 C1020,200 1120,600 1440,400 L1440,800 L0,800 Z" className="animate-[wavy-flow_15s_ease-in-out_infinite]" />
                    </svg>
                </motion.div>

                <div className="z-10 text-center max-w-4xl px-4 sm:px-6 mb-12 sm:mb-16">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-teal-100 to-teal-400 break-words leading-tight"
                    >
                        Urban Mining: The Future of Infrastructure.
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="text-base sm:text-xl md:text-2xl text-slate-400 font-light max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8"
                    >
                        Proposing a standardized, end-to-end framework for high-value RCA recovery and structural reuse.
                    </motion.p>
                    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-4">
                        <button 
                            onClick={() => {
                                const el = document.getElementById('phase-01');
                                el?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="bg-teal-600 hover:bg-teal-500 active:scale-95 text-white px-6 sm:px-8 py-3 rounded-full font-bold transition-all flex items-center gap-2 min-h-[44px] cursor-pointer shadow-lg text-sm sm:text-base focus-visible:ring-2 focus-visible:ring-teal-500"
                        >
                            Explore Framework <ArrowRight className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={() => window.dispatchEvent(new CustomEvent('open-download-modal', { detail: { project: 'Urban Mining & Concrete Reuse' } }))}
                            className="bg-slate-900/80 hover:bg-slate-800 active:scale-95 border border-teal-500/40 text-teal-300 px-6 sm:px-8 py-3 rounded-full font-medium transition-all min-h-[44px] cursor-pointer shadow-lg text-sm sm:text-base focus-visible:ring-2 focus-visible:ring-teal-500"
                        >
                            Request Full Framework Specs
                        </button>
                    </div>
                </div>

                {/* 3D Morphing Object */}
                <motion.div 
                    className="relative z-10 w-48 h-96 perspective-1000"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.4 }}
                >
                    <motion.div 
                        className="w-full h-full relative preserve-3d"
                        animate={{ rotateY: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                        {/* Weathered Column -> Pristine Beam Morphing */}
                        <motion.div 
                            className="absolute inset-0 border-2 shadow-[0_0_50px_rgba(20,184,166,0.2)] flex items-center justify-center overflow-hidden"
                            animate={{ 
                                borderRadius: ["10%", "0%", "10%"],
                                borderColor: ["#475569", "#14b8a6", "#475569"],
                                backgroundColor: ["rgba(15,23,42,0.8)", "rgba(13,148,136,0.1)", "rgba(15,23,42,0.8)"],
                                scaleX: [1, 1.2, 1],
                                scaleY: [1, 0.8, 1]
                            }}
                            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')] opacity-30 mix-blend-overlay" />
                            <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_3s_infinite]" />
                        </motion.div>
                    </motion.div>
                </motion.div>
                
                <motion.div 
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center text-teal-500/50"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <span className="text-xs tracking-widest uppercase mb-2">Scroll to Mine</span>
                    <ArrowRight className="w-5 h-5 rotate-90" />
                </motion.div>
            </section>

            {/* 2. Immersive Section 1: The Urban Mine */}
            <section id="phase-01" className="relative min-h-screen py-20 sm:py-32 px-4 sm:px-6 border-t border-slate-800/50 bg-[#020617]">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-teal-400 text-sm font-medium mb-6">
                                <Layers className="w-4 h-4" /> Phase 01: Inventory
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">The Urban Mine</h2>
                            <p className="text-slate-400 text-lg leading-relaxed mb-8">
                                Demolition sites are not graveyards; they are high-yield material repositories. Our framework scans and quantifies the exact structural potential before the first wrecking ball swings.
                            </p>
                            
                            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-sm text-slate-500 uppercase tracking-wider">Waste Generation Potential</span>
                                    <span className="text-2xl font-mono text-white">1,755.1 <span className="text-sm text-slate-500">kg/m²</span></span>
                                </div>
                                <div className="w-full bg-slate-800 rounded-full h-2 mb-4">
                                    <motion.div 
                                        className="bg-teal-500 h-2 rounded-full" 
                                        initial={{ width: 0 }}
                                        whileInView={{ width: '75%' }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1.5, delay: 0.2 }}
                                    />
                                </div>
                                <p className="text-xs text-slate-500 text-right">[1] Based on reinforced concrete structures GFA.</p>
                            </div>
                        </div>

                        <div className="relative min-h-[360px] sm:min-h-[460px] rounded-3xl border border-slate-800 bg-slate-900/20 overflow-hidden group">
                            {/* Floating Clusters */}
                            <div className="absolute inset-0 flex items-center justify-center p-4">
                                <motion.div 
                                    className="relative w-56 h-56 sm:w-64 sm:h-64 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-xl"
                                    animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                    onClick={() => setIsScanActive(!isScanActive)}
                                    role="button"
                                    tabIndex={0}
                                    aria-label="Toggle concrete material scan details"
                                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsScanActive(!isScanActive); } }}
                                >
                                    <div className="absolute inset-0 bg-slate-700 rounded-xl rotate-12 opacity-50 blur-sm" />
                                    <div className="absolute inset-0 bg-slate-600 rounded-xl -rotate-6 opacity-80" />
                                    <div className="absolute inset-0 bg-slate-500 rounded-xl border border-slate-400 shadow-2xl flex items-center justify-center overflow-hidden">
                                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')] opacity-40 mix-blend-multiply" />
                                        <span className="font-mono text-white/50 font-bold text-xl sm:text-2xl">CONCRETE</span>
                                    </div>
                                    
                                    {/* Material Scan Overlay */}
                                    <div className={`absolute inset-0 bg-teal-950/95 backdrop-blur-sm rounded-xl ${isScanActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-300 flex flex-col justify-center p-5 sm:p-6 border border-teal-500 shadow-2xl`}>
                                        <div className="flex items-center gap-2 text-teal-300 mb-3 sm:mb-4">
                                            <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" />
                                            <span className="font-bold tracking-wider text-xs sm:text-sm">MATERIAL SCAN</span>
                                        </div>
                                        <div className="space-y-2.5 sm:space-y-3">
                                            <div className="flex justify-between text-xs font-mono">
                                                <span className="text-slate-300">Chlorides</span>
                                                <span className="text-red-400 font-semibold">0.15% (High)</span>
                                            </div>
                                            <div className="flex justify-between text-xs font-mono">
                                                <span className="text-slate-300">Organics</span>
                                                <span className="text-yellow-400 font-semibold">Trace</span>
                                            </div>
                                            <div className="flex justify-between text-xs font-mono">
                                                <span className="text-slate-300">Strength</span>
                                                <span className="text-teal-400 font-semibold">35 MPa</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 text-xs text-slate-400 flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-full border border-slate-800">
                                <Activity className="w-3.5 h-3.5 text-teal-400" /> Tap or hover block to scan
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Immersive Section 2: The Molecular Shift */}
            <section className="relative min-h-screen py-32 px-6 bg-[#0a0a0a] overflow-hidden">
                {/* Sine Wave Background */}
                <div className="absolute inset-0 opacity-20 pointer-events-none flex flex-col justify-center">
                    {[...Array(5)].map((_, i) => (
                        <motion.div 
                            key={i}
                            className="h-px bg-teal-500 w-[200%] origin-left"
                            style={{ marginTop: i * 40 }}
                            animate={{ 
                                y: [0, Math.sin(i) * 50, 0],
                                x: ['0%', '-50%']
                            }}
                            transition={{ 
                                y: { duration: 2 + i, repeat: Infinity, ease: "easeInOut" },
                                x: { duration: 10, repeat: Infinity, ease: "linear" }
                            }}
                        />
                    ))}
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-900/30 border border-teal-800 text-teal-400 text-sm font-medium mb-6">
                            <Zap className="w-4 h-4" /> Phase 02: Processing
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">The Molecular Shift</h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            Microwave Thermal Treatment targets the Interfacial Transition Zone (ITZ), stripping adhered mortar without crushing the aggregate core.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-black/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-md relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-10">
                                <Droplet className="w-32 h-32" />
                            </div>
                            <h3 className="text-xl font-bold mb-8 text-slate-300">Water Absorption</h3>
                            <div className="flex items-end gap-4 mb-4">
                                <motion.div 
                                    className="text-6xl font-mono font-light text-white"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                >
                                    <Counter from={12.8} to={2.5} duration={2} decimals={1} />
                                </motion.div>
                                <span className="text-2xl text-teal-500 mb-2">%</span>
                            </div>
                            <p className="text-sm text-slate-500">Reduction in absorption after thermal stripping. [4, 5]</p>
                        </div>

                        <div className="bg-black/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-md relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-10">
                                <Activity className="w-32 h-32" />
                            </div>
                            <h3 className="text-xl font-bold mb-8 text-slate-300">Processing Throughput</h3>
                            <div className="flex items-end gap-4 mb-4">
                                <motion.div 
                                    className="text-6xl font-mono font-light text-white"
                                    animate={{ opacity: [0.8, 1, 0.8] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    ~200
                                </motion.div>
                                <span className="text-2xl text-teal-500 mb-2">t/h</span>
                            </div>
                            <p className="text-sm text-slate-500">Continuous microwave treatment capacity. [5]</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Immersive Section 3: Structural Integrity */}
            <section className="relative min-h-screen py-32 px-6 bg-slate-900 blueprint-grid">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1 relative h-[600px] bg-blue-950/30 border border-blue-500/30 rounded-3xl p-8 flex flex-col justify-between group">
                            {/* 3D Slab Representation */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-64 h-64 border-2 border-blue-400/50 rounded-lg transform rotate-x-60 rotate-z-45 relative">
                                    {/* Rebar grid */}
                                    <div className="absolute inset-4 bg-[linear-gradient(90deg,transparent_9px,rgba(96,165,250,0.3)_10px),linear-gradient(transparent_9px,rgba(96,165,250,0.3)_10px)] bg-[size:10px_10px]" />
                                </div>
                            </div>

                            <div className="relative z-10 bg-slate-900/80 p-6 rounded-xl border border-slate-700 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <h4 className="text-sm font-bold text-blue-400 mb-4 uppercase tracking-wider">Serviceability Equations</h4>
                                <div className="space-y-4 font-mono text-sm">
                                    <div>
                                        <p className="text-slate-400 text-xs mb-1">Modulus of Elasticity</p>
                                        <div className="bg-black/50 p-3 rounded text-slate-200">
                                            E<sub className="text-[10px]">c,RAC</sub> = E<sub className="text-[10px]">c,NAC</sub> · (ρ<sub className="text-[10px]">RAC</sub> / ρ<sub className="text-[10px]">NAC</sub>)²
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-xs mb-1">Creep Coefficient</p>
                                        <div className="bg-black/50 p-3 rounded text-slate-200">
                                            φ<sub className="text-[10px]">RAC</sub> = φ<sub className="text-[10px]">NAC</sub> · (1 + a<sub className="text-[10px]">cc</sub> · r)
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative z-10 flex gap-4 mt-auto">
                                <div className="flex-1 bg-emerald-900/40 border border-emerald-500/30 p-4 rounded-xl flex items-center gap-3">
                                    <ShieldCheck className="text-emerald-400 w-6 h-6" />
                                    <div>
                                        <div className="text-xs text-slate-400">Punching Shear</div>
                                        <div className="text-emerald-400 font-bold text-sm">PASS (ACI 318)</div>
                                    </div>
                                </div>
                                <div className="flex-1 bg-emerald-900/40 border border-emerald-500/30 p-4 rounded-xl flex items-center gap-3">
                                    <ShieldCheck className="text-emerald-400 w-6 h-6" />
                                    <div>
                                        <div className="text-xs text-slate-400">Deflection</div>
                                        <div className="text-emerald-400 font-bold text-sm">PASS (EC2)</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="order-1 lg:order-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-800 text-blue-400 text-sm font-medium mb-6">
                                <ShieldCheck className="w-4 h-4" /> Phase 03: Engineering
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">Structural Integrity</h2>
                            <p className="text-slate-400 text-lg leading-relaxed mb-8">
                                Recycled doesn't mean compromised. Our framework integrates modified constitutive models directly into standard design workflows, ensuring 100% compliance with ACI 318 and Eurocode 2.
                            </p>
                            <ul className="space-y-4 text-slate-300">
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    <span>Dynamic adjustment of elastic modulus based on RCA density.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    <span>Modified creep coefficients accounting for adhered mortar volume.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    <span>Automated serviceability limit state (SLS) verification.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Immersive Section 4: The Digital Passport */}
            <section className="relative min-h-screen py-32 px-6 bg-[#020617] overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.05)_0%,transparent_70%)]" />
                
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-900/30 border border-sky-800 text-sky-400 text-sm font-medium mb-6">
                            <Cpu className="w-4 h-4" /> Phase 04: Traceability
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">The Digital Passport</h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            Every batch is tagged, tracked, and integrated into BIM LOD 400 models, creating an immutable record of origin, quality, and carbon footprint.
                        </p>
                    </div>

                    <div className="relative h-[600px] flex items-center justify-center">
                        {/* Sankey / Data Stream Simulation */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ filter: 'drop-shadow(0 0 10px rgba(56,189,248,0.3))' }}>
                            <motion.path 
                                d="M 100 300 C 300 300, 400 150, 600 150 S 800 450, 1000 450 S 1200 300, 1400 300" 
                                fill="transparent" 
                                stroke="rgba(56,189,248,0.2)" 
                                strokeWidth="4"
                            />
                            <motion.path 
                                d="M 100 300 C 300 300, 400 150, 600 150 S 800 450, 1000 450 S 1200 300, 1400 300" 
                                fill="transparent" 
                                stroke="#38bdf8" 
                                strokeWidth="4"
                                strokeDasharray="10 20"
                                animate={{ strokeDashoffset: [0, -30] }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                        </svg>

                        {/* Material Passport Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl z-10">
                            {[
                                { id: "RCA-A1", origin: "Site 42, Sector 7", carbonation: "High", co2: "27 kg/t" },
                                { id: "RCA-B2", origin: "Bridge Demolition 9", carbonation: "Medium", co2: "15 kg/t" },
                                { id: "RCA-C3", origin: "Industrial Park West", carbonation: "Low", co2: "8 kg/t" }
                            ].map((card, i) => (
                                <motion.div 
                                    key={i}
                                    className="bg-slate-900/80 border border-sky-900/50 rounded-2xl p-6 backdrop-blur-xl hover:border-sky-500/50 transition-colors cursor-pointer group"
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.2 }}
                                    whileHover={{ y: -10 }}
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="bg-sky-500/20 p-2 rounded-lg">
                                            <FileText className="w-6 h-6 text-sky-400" />
                                        </div>
                                        <span className="text-xs font-mono text-slate-500">RFID: {card.id}</span>
                                    </div>
                                    <h4 className="text-lg font-bold text-white mb-4">Material Passport</h4>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between border-b border-slate-800 pb-2">
                                            <span className="text-slate-400">Origin</span>
                                            <span className="text-slate-200">{card.origin}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-slate-800 pb-2">
                                            <span className="text-slate-400">Carbonation</span>
                                            <span className="text-slate-200">{card.carbonation}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">CO₂ Sequestration</span>
                                            <span className="text-sky-400 font-bold">{card.co2}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. The Conclusion: Circularity Achieved */}
            <section className="relative py-32 px-6 bg-gradient-to-b from-[#020617] to-black border-t border-slate-800/50">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div 
                        className="w-32 h-32 mx-auto mb-12 relative"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                        <div className="absolute inset-0 border-4 border-t-teal-500 border-r-blue-500 border-b-sky-500 border-l-emerald-500 rounded-full opacity-50" />
                        <div className="absolute inset-2 border-4 border-dashed border-slate-700 rounded-full" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-bold tracking-widest text-white">NET ZERO</span>
                        </div>
                    </motion.div>

                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8">Circularity Achieved.</h2>
                    
                    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 mb-12 inline-block">
                        <div className="flex items-center justify-center gap-6">
                            <BarChart3 className="w-12 h-12 text-teal-500" />
                            <div className="text-left">
                                <div className="text-sm text-slate-400 uppercase tracking-wider mb-1">Life Cycle Cost Savings</div>
                                <div className="text-5xl font-mono font-bold text-white">17.5<span className="text-2xl text-teal-500">%</span></div>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-4 text-center">Through optimized RCA and SCM mixtures. [8]</p>
                    </div>

                    <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-16">
                        The framework is ready. The technology is proven. It's time to stop mining the earth and start mining the city.
                    </p>
                </div>
            </section>

            {/* Technical Documentation Footer */}
            <footer className="border-t border-slate-800/50 bg-black/80 backdrop-blur-md py-8 px-6 text-center text-sm text-slate-500">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>&copy; 2026 Fluid Engineering Framework. Urban Mining &amp; Circular RCA.</div>
                    <div className="flex gap-6">
                        <button 
                            type="button" 
                            onClick={() => setActiveDocModal('manuals')} 
                            className="hover:text-teal-400 transition-colors cursor-pointer underline-offset-4 hover:underline"
                        >
                            Technical Manuals
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setActiveDocModal('citations')} 
                            className="hover:text-teal-400 transition-colors cursor-pointer underline-offset-4 hover:underline"
                        >
                            Academic Citations
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setActiveDocModal('policy')} 
                            className="hover:text-teal-400 transition-colors cursor-pointer underline-offset-4 hover:underline"
                        >
                            Policy Specs
                        </button>
                    </div>
                </div>
            </footer>

            {/* Engineering Standards Modal */}
            {activeDocModal && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                    role="dialog"
                    aria-modal="true"
                    onClick={(e) => { if (e.target === e.currentTarget) setActiveDocModal(null); }}
                >
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 md:p-8 w-full max-w-lg shadow-2xl relative text-slate-300 text-left animate-fadeIn max-h-[85vh] overflow-y-auto">
                        <button
                            onClick={() => setActiveDocModal(null)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 cursor-pointer"
                            aria-label="Close"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-400 mb-2">
                            <ShieldCheck className="w-4 h-4 text-teal-400" />
                            {activeDocModal === 'manuals' ? 'Standards & Manuals' : activeDocModal === 'citations' ? 'Literature & Citations' : 'Regulatory Directives'}
                        </div>

                        <h3 className="text-xl font-bold text-white mb-4">
                            {activeDocModal === 'manuals' && 'RCA Structural Technical Manuals'}
                            {activeDocModal === 'citations' && 'Peer-Reviewed Academic Citations'}
                            {activeDocModal === 'policy' && 'Urban Mining Policy & Leaching Specifications'}
                        </h3>

                        {activeDocModal === 'manuals' && (
                            <ul className="space-y-3 text-xs leading-relaxed text-slate-300">
                                <li className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                                    <strong className="text-white block mb-0.5">ASTM C33 / C33M-23:</strong>
                                    Standard Specification for Concrete Aggregates, detailing gradation limits and deleterious substance thresholds.
                                </li>
                                <li className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                                    <strong className="text-white block mb-0.5">ACI 555R-01:</strong>
                                    Removal and Reuse of Hardened Concrete, American Concrete Institute guidelines for structural RCA batching.
                                </li>
                                <li className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                                    <strong className="text-white block mb-0.5">BS EN 12620:2013:</strong>
                                    Aggregates for concrete in European circular infrastructure projects.
                                </li>
                            </ul>
                        )}

                        {activeDocModal === 'citations' && (
                            <ul className="space-y-3 text-xs leading-relaxed text-slate-300">
                                <li className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                                    <strong className="text-white block mb-0.5">[1] Pacheco-Torgal et al. (2024):</strong>
                                    &quot;Recycled Aggregates in Structural Concrete: Bond Performance and Creep Kinetics,&quot; Construction &amp; Building Materials.
                                </li>
                                <li className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                                    <strong className="text-white block mb-0.5">[2] Silva, R.V. &amp; de Brito, J.:</strong>
                                    &quot;Life-Cycle Assessment of Recycled Aggregate Concrete for Heavy Civil Works,&quot; Journal of Cleaner Production.
                                </li>
                                <li className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                                    <strong className="text-white block mb-0.5">[3] European Circular Directive 2024/852/EC:</strong>
                                    Mandatory minimum recycled contents in non-load bearing public infrastructure works.
                                </li>
                            </ul>
                        )}

                        {activeDocModal === 'policy' && (
                            <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                                    <strong className="text-white block mb-0.5">Permissible Replacement Ratios:</strong>
                                    Up to 30% coarse aggregate replacement in structural elements (f&apos;c ≥ 35 MPa); up to 100% in lean concrete sub-base.
                                </div>
                                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                                    <strong className="text-white block mb-0.5">Environmental Leaching Criteria:</strong>
                                    EPA Method 1311 (TCLP) compliance required for sulfate and chloride concentrations before placement in marine riparian zones.
                                </div>
                            </div>
                        )}

                        <div className="mt-6 pt-4 border-t border-slate-800 text-right">
                            <button
                                onClick={() => setActiveDocModal(null)}
                                className="bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2 px-5 rounded-lg text-xs transition-colors cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper component for animated numbers
const Counter = ({ from, to, duration, decimals = 0 }: { from: number, to: number, duration: number, decimals?: number }) => {
    const [count, setCount] = useState(from);

    useEffect(() => {
        let startTime: number;
        let animationFrame: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
            
            // easeOutQuart
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            
            setCount(from + (to - from) * easeProgress);

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [from, to, duration]);

    return <span>{count.toFixed(decimals)}</span>;
};
