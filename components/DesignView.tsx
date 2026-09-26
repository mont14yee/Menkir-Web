import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'motion/react';
import { ShieldCheck, Target, Leaf, Map, Activity, Layers, ArrowRight, ArrowLeft, CheckCircle2, Info, BarChart3, Droplet, X } from './ExtractedIcons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const trafficData = [
  { name: 'Ramp A', density: 18, capacity: 1200 },
  { name: 'Ramp B', density: 22, capacity: 1400 },
  { name: 'Loop C', density: 25, capacity: 1500 },
  { name: 'Mainline N', density: 20, capacity: 2200 },
  { name: 'Mainline S', density: 24, capacity: 2200 },
];

export const DesignView: React.FC = () => {
    const navigate = useNavigate();
    const { scrollYProgress } = useScroll();
    const yHero = useTransform(scrollYProgress, [0, 0.2], [0, 150]);
    const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

    const [activeStage, setActiveStage] = useState(0);
    const [activeDocModal, setActiveDocModal] = useState<'manuals' | 'citations' | 'policy' | null>(null);
    const [activeSvgPoint, setActiveSvgPoint] = useState<number | null>(null);

    const constructionStages = [
        { title: "Site Clearing & Utility Relocation", desc: "Relocating urban water/power lines. [3, 17]" },
        { title: "Substructure Installation", desc: "Caisson drilling and pier pouring." },
        { title: "Mainline Staging", desc: "Onsite detours to maintain 'unimpeded' ramp flow." },
        { title: "Superstructure Erection", desc: "Girder placement during off-peak night windows." },
        { title: "Paving & Drainage", desc: "Installation of permeable sub-bases and RCA layers." },
        { title: "Final Aesthetic Integration", desc: "Absorptive noise barriers and native landscaping." }
    ];

    return (
        <div className="bg-[#0f1115] text-slate-200 min-h-screen font-sans selection:bg-amber-500/30">
            {/* 1. Hero Section: Visual Authority */}
            <section className="relative h-screen flex flex-col justify-center overflow-hidden pt-20">
                <div className="absolute top-20 left-4 sm:left-8 z-30">
                    <button
                        onClick={() => navigate('/')}
                        className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-amber-500/30 px-3.5 py-1.5 rounded-full transition-all cursor-pointer shadow-lg focus-visible:ring-2 focus-visible:ring-amber-500"
                        aria-label="Return to Portfolio"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Portfolio</span>
                    </button>
                </div>
                <motion.div 
                    className="absolute inset-0 z-0"
                    style={{ y: yHero, opacity: opacityHero }}
                >
                    {/* Simulated 3D Render / Sunset Background */}
                    <div className="absolute inset-0 bg-gradient-to-b from-amber-900/40 via-slate-900/80 to-[#0f1115] mix-blend-multiply z-10" />
                    <img width="800" height="600" 
                        src="https://images.unsplash.com/photo-1545042746-ec9e5a59b359?q=80&w=2574&auto=format&fit=crop" 
                        alt="Interchange at sunset" 
                        className="w-full h-full object-cover opacity-60" loading="lazy" />
                    {/* Overlay Grid */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] z-10" />
                </motion.div>

                <div className="relative z-20 max-w-7xl mx-auto px-6 w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="max-w-4xl"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm font-medium mb-6 uppercase tracking-widest">
                            Project Overview
                        </div>
                        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-4 sm:mb-6 text-white leading-[1.15] break-words">
                            Engineering Seamless Connectivity: <br className="hidden sm:inline" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">The Coastal Trumpet Interchange.</span>
                        </h1>
                        <p className="text-base sm:text-xl text-slate-300 font-light max-w-2xl mb-8 sm:mb-10 leading-relaxed">
                            A high-capacity L-11/L-12 grade separation designed for Level of Service C, integrating climate-resilient infrastructure into dense urban/coastal corridors.
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-12 sm:mb-16">
                            <button 
                                onClick={() => {
                                    const el = document.getElementById('context-matrix');
                                    el?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="bg-amber-600 hover:bg-amber-500 active:scale-95 text-white px-6 sm:px-8 py-3 rounded-full font-bold transition-all flex items-center gap-2 min-h-[44px] cursor-pointer shadow-lg text-sm sm:text-base focus-visible:ring-2 focus-visible:ring-amber-500"
                            >
                                Explore Design <ArrowRight className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={() => window.dispatchEvent(new CustomEvent('open-download-modal', { detail: { project: 'Coastal Trumpet Interchange' } }))}
                                className="bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white px-6 sm:px-8 py-3 rounded-full font-medium transition-all min-h-[44px] cursor-pointer shadow-lg text-sm sm:text-base focus-visible:ring-2 focus-visible:ring-amber-500"
                            >
                                Request CAD Blueprint
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Trust Bar */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-md border-t border-white/10 z-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-wrap justify-between items-center gap-3 sm:gap-4 text-xs sm:text-sm font-medium text-slate-400">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" /> AASHTO Compliant
                        </div>
                        <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" /> Target LOS C
                        </div>
                        <div className="flex items-center gap-2">
                            <Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" /> Net-Zero Concrete
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Context & Multi-Criteria Assessment */}
            <section id="context-matrix" className="py-16 sm:py-24 px-4 sm:px-6 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Context & Multi-Criteria Assessment</h2>
                        <p className="text-slate-400 max-w-2xl">Validating site selection and engineering judgment through rigorous comparative analysis.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Interactive Context Map */}
                        <motion.div 
                            className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden relative min-h-[400px] group"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2674&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-luminosity" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                            
                            {/* Map Overlays */}
                            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl animate-pulse" />
                            <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-red-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

                            <div className="absolute inset-0 p-8 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-slate-700 flex items-center gap-2">
                                        <Map className="w-4 h-4 text-amber-400" />
                                        <span className="text-sm font-medium">Context Map Overlay</span>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <span className="flex items-center gap-2 text-xs bg-black/60 px-2 py-1 rounded border border-slate-800"><div className="w-2 h-2 rounded-full bg-blue-500" /> Flood Risk Zone</span>
                                        <span className="flex items-center gap-2 text-xs bg-black/60 px-2 py-1 rounded border border-slate-800"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Eco Sensitivity</span>
                                        <span className="flex items-center gap-2 text-xs bg-black/60 px-2 py-1 rounded border border-slate-800"><div className="w-2 h-2 rounded-full bg-red-500" /> AADT Heat Map</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* The Decision Matrix */}
                        <motion.div 
                            className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 flex flex-col"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Layers className="w-5 h-5 text-amber-500" /> The Decision Matrix
                            </h3>
                            <div className="space-y-6 flex-1">
                                <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl relative overflow-hidden">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />
                                    <h4 className="font-bold text-amber-400 mb-1">Trumpet (Selected)</h4>
                                    <p className="text-sm text-slate-300">2nd highest capacity, ideal for "T" junctions.</p>
                                </div>
                                <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl">
                                    <h4 className="font-bold text-slate-300 mb-1">Diamond</h4>
                                    <p className="text-sm text-slate-400">Lowest construction cost, but limited left-turn capacity.</p>
                                </div>
                                <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl">
                                    <h4 className="font-bold text-slate-300 mb-1">SPUI</h4>
                                    <p className="text-sm text-slate-400">Minimal footprint, but higher structural costs (10% to 20% more than a Diamond).</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 3. Geometric & Structural Precision */}
            <section className="py-24 px-6 bg-slate-900/30 border-y border-slate-800/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.05)_0%,transparent_50%)]" />
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Geometric & Structural Precision</h2>
                        <p className="text-slate-400 max-w-2xl">Project layering reveals the technical depth behind the aesthetics.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
                        {/* Geometric Callouts */}
                        <div className="relative min-h-[360px] sm:min-h-[460px] bg-black/40 border border-slate-800 rounded-3xl p-4 sm:p-8 flex items-center justify-center group">
                            {/* 3D Wireframe Simulation */}
                            <div className="relative w-full max-w-md aspect-square">
                                <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible bg-[#c0c4c8] rounded-xl shadow-inner">
                                    {/* Horizontal Lines */}
                                    <path d="M 15 40 L 85 40" stroke="#0000ff" strokeWidth="2" fill="none" strokeLinecap="round" />
                                    <path d="M 15 50 L 85 50" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" />
                                    <path d="M 15 60 L 85 60" stroke="#00ff00" strokeWidth="2" fill="none" strokeLinecap="round" />

                                    {/* Left Blue Ramp */}
                                    <path d="M 48 10 Q 35 35 25 40" stroke="#0000ff" strokeWidth="2" fill="none" strokeLinecap="round" />

                                    {/* Right Blue Ramp */}
                                    <path d="M 55 12 Q 58 35 60 50 C 60 90, 30 95, 15 75 Q 10 65 5 68" stroke="#0000ff" strokeWidth="2" fill="none" strokeLinecap="round" />

                                    {/* Green Loop Ramp */}
                                    <path d="M 49 20 L 50 55 C 50 75, 35 80, 35 65 C 35 55, 40 60, 50 60" stroke="#00ff00" strokeWidth="2" fill="none" strokeLinecap="round" />
                                    
                                    {/* Hover / Tap Points */}
                                    <g 
                                        className="cursor-pointer group/point1"
                                        onClick={() => setActiveSvgPoint(activeSvgPoint === 1 ? null : 1)}
                                        role="button"
                                        tabIndex={0}
                                        aria-label="Loop radius geometric specification"
                                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveSvgPoint(activeSvgPoint === 1 ? null : 1); } }}
                                    >
                                        <circle cx="35" cy="70" r="4" fill="#f59e0b" className="animate-pulse" />
                                        <foreignObject x="35" y="55" width="150" height="65" className={`${activeSvgPoint === 1 ? 'opacity-100' : 'opacity-0 group-hover/point1:opacity-100'} transition-opacity pointer-events-none`}>
                                            <div className="bg-slate-900 border border-amber-500/80 p-2 rounded-lg text-[9px] text-slate-200 shadow-2xl backdrop-blur-md">
                                                <strong className="text-amber-400 block mb-0.5">Loop Radius</strong>
                                                60–90 m calibrated for V = 50-60 km/h.
                                            </div>
                                        </foreignObject>
                                    </g>

                                    <g 
                                        className="cursor-pointer group/point2"
                                        onClick={() => setActiveSvgPoint(activeSvgPoint === 2 ? null : 2)}
                                        role="button"
                                        tabIndex={0}
                                        aria-label="Superelevation geometric specification"
                                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveSvgPoint(activeSvgPoint === 2 ? null : 2); } }}
                                    >
                                        <circle cx="30" cy="85" r="4" fill="#f59e0b" className="animate-pulse" />
                                        <foreignObject x="-95" y="65" width="135" height="65" className={`${activeSvgPoint === 2 ? 'opacity-100' : 'opacity-0 group-hover/point2:opacity-100'} transition-opacity pointer-events-none`}>
                                            <div className="bg-slate-900 border border-amber-500/80 p-2 rounded-lg text-[9px] text-slate-200 shadow-2xl backdrop-blur-md">
                                                <strong className="text-amber-400 block mb-0.5">Superelevation</strong>
                                                Method 2 distribution with e_max limited to 6% for coastal drainage.
                                            </div>
                                        </foreignObject>
                                    </g>
                                </svg>
                            </div>
                            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 text-xs text-slate-400 flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-full border border-slate-800">
                                <Info className="w-3.5 h-3.5 text-amber-500" /> Tap or hover points for data
                            </div>
                        </div>

                        {/* Structural Specs */}
                        <div className="flex flex-col justify-center space-y-6">
                            <motion.div 
                                className="bg-slate-800/40 border-l-4 border-amber-500 p-6 rounded-r-2xl"
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <h4 className="text-xl font-bold text-white mb-2">Loading Model</h4>
                                <p className="text-slate-400">Full HL-93 model (Design Truck + Lane Load) applied across all structural spans to ensure maximum resilience under peak freight conditions.</p>
                            </motion.div>

                            <motion.div 
                                className="bg-slate-800/40 border-l-4 border-amber-500 p-6 rounded-r-2xl"
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                            >
                                <h4 className="text-xl font-bold text-white mb-2">Deep Foundations</h4>
                                <p className="text-slate-400">Large-diameter caissons engineered for stability in saturated coastal soils, bypassing weak upper layers to anchor directly into bedrock.</p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Performance Visualization */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-16 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Performance Visualization</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">Translating complex traffic models into actionable insights for Level of Service (LOS) and weaving analysis.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Bar Chart */}
                        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-amber-500" /> Vehicle Density (pc/mi/ln)
                            </h3>
                            <div className="h-72 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={trafficData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip 
                                            cursor={{fill: '#1e293b'}}
                                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                                            itemStyle={{ color: '#f59e0b' }}
                                        />
                                        <ReferenceLine y={26} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: 'Target: ≤ 26 (LOS C)', fill: '#ef4444', fontSize: 12 }} />
                                        <Bar dataKey="density" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={50} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-6 flex justify-between items-center text-sm text-slate-400">
                                <span>Capacity Peak: Stable flow up to 1,500 vph</span>
                            </div>
                        </div>

                        {/* Weaving Analysis */}
                        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 flex flex-col">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-amber-500" /> Weaving Analysis (Type C)
                            </h3>
                            <div className="flex-1 relative bg-black/40 rounded-xl border border-slate-800 flex items-center justify-center p-6 overflow-hidden">
                                <svg viewBox="0 0 400 200" className="w-full h-full">
                                    {/* Lanes */}
                                    <path d="M 0 80 L 400 80" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
                                    <path d="M 0 120 L 400 120" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
                                    
                                    {/* Weaving paths */}
                                    <path d="M 50 60 Q 200 60 350 140" stroke="#3b82f6" strokeWidth="3" fill="none" markerEnd="url(#arrow-blue)" className="animate-[dash_3s_linear_infinite] [stroke-dasharray:10_10]" />
                                    <path d="M 50 140 Q 200 140 350 60" stroke="#f59e0b" strokeWidth="3" fill="none" markerEnd="url(#arrow-amber)" className="animate-[dash_3s_linear_infinite] [stroke-dasharray:10_10]" />
                                    
                                    <defs>
                                        <marker id="arrow-blue" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
                                        </marker>
                                        <marker id="arrow-amber" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
                                        </marker>
                                    </defs>
                                </svg>
                                <div className="absolute bottom-4 right-4 text-xs text-slate-500">1,000-foot section</div>
                            </div>
                            <p className="mt-4 text-sm text-slate-400">Predicted speeds and maneuver patterns indicate stable operation within the 1,000-foot weaving section.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. The "Living Infrastructure" */}
            <section className="py-24 px-6 bg-[#1a1c1e] border-y border-slate-800/50 relative">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-5 mix-blend-luminosity" />
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="mb-16 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm font-medium mb-6 uppercase tracking-widest">
                            Sustainability
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">The "Living Infrastructure"</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">Framing sustainability as a premium feature, integrating ecological function with structural form.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <motion.div 
                            className="bg-black/40 border border-slate-800 rounded-3xl p-8 hover:border-emerald-500/30 transition-colors"
                            whileHover={{ y: -5 }}
                        >
                            <div className="w-12 h-12 bg-emerald-900/50 rounded-full flex items-center justify-center mb-6 text-emerald-400">
                                <Layers className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Adaptive Alignment</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">Design elements capable of being raised incrementally to accommodate projected sea-level rise over the structure's lifespan.</p>
                        </motion.div>

                        <motion.div 
                            className="bg-black/40 border border-slate-800 rounded-3xl p-8 hover:border-emerald-500/30 transition-colors"
                            whileHover={{ y: -5 }}
                        >
                            <div className="w-12 h-12 bg-emerald-900/50 rounded-full flex items-center justify-center mb-6 text-emerald-400">
                                <Droplet className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">SuDS Integration</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">Permeable Interlocking Concrete Pavement (PICP) on shoulders and bio-retention swales engineered to filter 100% of urban runoff.</p>
                        </motion.div>

                        <motion.div 
                            className="bg-black/40 border border-slate-800 rounded-3xl p-8 hover:border-emerald-500/30 transition-colors"
                            whileHover={{ y: -5 }}
                        >
                            <div className="w-12 h-12 bg-emerald-900/50 rounded-full flex items-center justify-center mb-6 text-emerald-400">
                                <Leaf className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Low-Carbon Footprint</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">Extensive use of Recycled Concrete Aggregate (RCA), reducing raw material costs by 15% and embodied carbon emissions by 39%.</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 6. Phased Construction Sequence */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-16 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Phased Construction Sequence</h2>
                        <p className="text-slate-400">A rigorous 6-stage implementation timeline ensuring minimal disruption.</p>
                    </div>

                    <div className="relative border-l-2 border-slate-800 ml-4 md:ml-0">
                        {constructionStages.map((stage, index) => (
                            <motion.div 
                                key={index}
                                className="mb-12 ml-8 relative cursor-pointer group"
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ delay: index * 0.1 }}
                                onMouseEnter={() => setActiveStage(index)}
                            >
                                <div className={`absolute -left-[41px] top-1 w-5 h-5 rounded-full border-4 border-[#0f1115] transition-colors duration-300 ${activeStage === index ? 'bg-amber-500' : 'bg-slate-700 group-hover:bg-amber-500/50'}`} />
                                <div className={`bg-slate-900/50 border rounded-2xl p-6 transition-all duration-300 ${activeStage === index ? 'border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.1)]' : 'border-slate-800'}`}>
                                    <div className="text-amber-500 text-sm font-bold mb-1">Stage {index + 1}</div>
                                    <h3 className="text-xl font-bold text-white mb-2">{stage.title}</h3>
                                    <p className="text-slate-400 text-sm">{stage.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. Economic Appraisal & Conclusion */}
            <section className="relative py-32 px-6 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img width="800" height="600" 
                        src="https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=2670&auto=format&fit=crop" 
                        alt="Completed project" 
                        className="w-full h-full object-cover opacity-30" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f1115] via-[#0f1115]/80 to-transparent" />
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-8">Economic Appraisal</h2>
                            
                            <div className="bg-black/60 backdrop-blur-md border border-slate-800 rounded-3xl p-8 mb-8">
                                <div className="text-sm text-slate-400 uppercase tracking-wider mb-2">Projected BCR</div>
                                <div className="text-6xl font-mono font-bold text-amber-500 mb-6">2.08</div>
                                <p className="text-slate-300 text-sm">Over a 40-year lifecycle.</p>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-bold text-white uppercase tracking-wider text-sm mb-4">Key Drivers</h4>
                                <div className="flex items-center gap-3 text-slate-300">
                                    <CheckCircle2 className="w-5 h-5 text-amber-500" /> Travel time savings
                                </div>
                                <div className="flex items-center gap-3 text-slate-300">
                                    <CheckCircle2 className="w-5 h-5 text-amber-500" /> Reduced accident frequency
                                </div>
                                <div className="flex items-center gap-3 text-slate-300">
                                    <CheckCircle2 className="w-5 h-5 text-amber-500" /> Emission reductions
                                </div>
                            </div>
                        </div>

                        <div className="text-center lg:text-right flex flex-col items-center lg:items-end">
                            <h3 className="text-3xl font-bold mb-6">Ready to build the future?</h3>
                            <p className="text-slate-400 mb-10 max-w-md">The Coastal Trumpet Interchange represents the pinnacle of modern civil engineering, balancing capacity, cost, and climate resilience.</p>
                            <button onClick={() => window.dispatchEvent(new CustomEvent('open-download-modal', { detail: { project: 'Coastal Trumpet Interchange' } }))} className="bg-white text-black hover:bg-slate-200 px-10 py-4 rounded-full font-bold transition-colors flex items-center gap-2 text-lg">
                                Download Full Design <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            {/* Technical Documentation Footer */}
            <footer className="border-t border-slate-800/50 bg-black/80 backdrop-blur-md py-8 px-6 text-center text-sm text-slate-500">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>&copy; 2026 Coastal Trumpet Interchange. Civil Engineering &amp; Geometric Design.</div>
                    <div className="flex gap-6">
                        <button 
                            type="button" 
                            onClick={() => setActiveDocModal('manuals')} 
                            className="hover:text-amber-400 transition-colors cursor-pointer underline-offset-4 hover:underline"
                        >
                            Technical Manuals
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setActiveDocModal('citations')} 
                            className="hover:text-amber-400 transition-colors cursor-pointer underline-offset-4 hover:underline"
                        >
                            Academic Citations
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setActiveDocModal('policy')} 
                            className="hover:text-amber-400 transition-colors cursor-pointer underline-offset-4 hover:underline"
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

                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
                            <ShieldCheck className="w-4 h-4 text-amber-400" />
                            {activeDocModal === 'manuals' ? 'Highway Standards & Manuals' : activeDocModal === 'citations' ? 'Geometric Design Literature' : 'AASHTO Geometric Criteria'}
                        </div>

                        <h3 className="text-xl font-bold text-white mb-4">
                            {activeDocModal === 'manuals' && 'Interchange Technical Manuals & Specs'}
                            {activeDocModal === 'citations' && 'Highway Engineering Academic Citations'}
                            {activeDocModal === 'policy' && 'AASHTO Alignment & Superelevation Specs'}
                        </h3>

                        {activeDocModal === 'manuals' && (
                            <ul className="space-y-3 text-xs leading-relaxed text-slate-300">
                                <li className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                                    <strong className="text-white block mb-0.5">AASHTO Green Book (7th Edition):</strong>
                                    A Policy on Geometric Design of Highways and Streets, Chapters 9 and 10 (Interchanges and Grade Separations).
                                </li>
                                <li className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                                    <strong className="text-white block mb-0.5">FHWA-HIF-16-003:</strong>
                                    Ramp and Interchange Safety Design Manual, covering sight distances and deceleration lane lengths.
                                </li>
                                <li className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                                    <strong className="text-white block mb-0.5">TRB Highway Capacity Manual (HCM 6th Edition):</strong>
                                    Freeway weave and merge density computational models.
                                </li>
                            </ul>
                        )}

                        {activeDocModal === 'citations' && (
                            <ul className="space-y-3 text-xs leading-relaxed text-slate-300">
                                <li className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                                    <strong className="text-white block mb-0.5">[1] Leisch, J.E. (Transportation Research Board):</strong>
                                    &quot;Freeway and Interchange Geometric Design Handbook,&quot; evaluating horizontal curvature and friction factors.
                                </li>
                                <li className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                                    <strong className="text-white block mb-0.5">[2] TRB Circular Section Friction Studies (2025):</strong>
                                    Dynamic vehicle trajectory modeling on coastal curves under wet asphalt conditions.
                                </li>
                            </ul>
                        )}

                        {activeDocModal === 'policy' && (
                            <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                                    <strong className="text-white block mb-0.5">Design Velocities &amp; Superelevation:</strong>
                                    Mainline velocity: 80 km/h; loop ramp velocity: 45 km/h. Maximum cross-slope superelevation e_max: 6.0%.
                                </div>
                                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                                    <strong className="text-white block mb-0.5">Stopping Sight Distance (SSD):</strong>
                                    Mainline SSD: 130 meters; loop ramp SSD: 60 meters with continuous LED lighting.
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

// Add lucide-react Droplets icon if missing, otherwise use an alternative.
// I've imported Droplets from lucide-react above.
