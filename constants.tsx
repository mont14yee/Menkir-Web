

import React from 'react';
import {
    AppStoreIcon, PlayStoreIcon, GearIcon, GoalIcon, TimelineIcon, BudgetIcon, PlannerIcon, DreamIcon, EventIcon, VisionBoardIcon, SelfCareIcon, ReviewIcon, NotesIcon, ReadingIcon
} from './components/IconComponents';
import { useState, useEffect, DragEvent, useMemo, useRef, MouseEvent, FormEvent, useCallback } from 'react';
import { generateContent, generateContentStream } from './gemini-client';
import { useCurrency, useGoals } from './App';
import type { Currency, GoalNode, SmartPlan, TimelineEvent } from './types';

// Visual components for each feature section
const YearlyGoalsVisual = () => {
    const { availableGoals, setAvailableGoals, orbitingGoals, setOrbitingGoals } = useGoals();
    const [newGoalName, setNewGoalName] = useState('');
    const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    
    

    const getRandomColor = () => {
        const colors = ['bg-rose-500', 'bg-amber-500', 'bg-violet-500', 'bg-fuchsia-500', 'bg-cyan-500', 'bg-lime-500'];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const handleAddCustomGoal = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newGoalName.trim()) return;
        const newGoal: GoalNode = {
            id: `custom-${Date.now()}`,
            name: newGoalName.trim(),
            color: getRandomColor(),
            isCustom: true
        };
        setAvailableGoals(prev => [...prev, newGoal]);
        setNewGoalName('');
    };

    const handleDragStart = (e: DragEvent<HTMLDivElement>, goal: GoalNode) => {
        e.dataTransfer.setData("goalId", goal.id);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const goalId = e.dataTransfer.getData("goalId");
        const goal = availableGoals.find(g => g.id === goalId);
        
        if (goal && !orbitingGoals.find(g => g.id === goalId)) {
            setOrbitingGoals(prev => [...prev, goal]);
            // Automatically select newly dropped goal to prompt generation
            setSelectedGoalId(goalId);
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleGenerateSmartPlan = async (goal: GoalNode) => {
        setIsGenerating(true);
        try {
            const prompt = `Generate a concise SMART (Specific, Measurable, Achievable, Relevant, Time-bound) goal breakdown for: "${goal.name}". Ensure each section is 1 short sentence.`;
            
            const response = await generateContent({
                model: "gemini-3.8-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: "OBJECT",
                        properties: {
                            S: { type: "STRING" },
                            M: { type: "STRING" },
                            A: { type: "STRING" },
                            R: { type: "STRING" },
                            T: { type: "STRING" },
                        },
                        required: ["S", "M", "A", "R", "T"]
                    }
                }
            });

            const plan = JSON.parse(response.text || '{}') as SmartPlan;
            
            setOrbitingGoals(prev => prev.map(g => g.id === goal.id ? { ...g, plan } : g));
            // Also update available so if ejected and re-added, plan persists
            setAvailableGoals(prev => prev.map(g => g.id === goal.id ? { ...g, plan } : g));

        } catch (error) {
            console.error("SMART Plan generation failed", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleEject = (goalId: string) => {
        setOrbitingGoals(prev => prev.filter(g => g.id !== goalId));
        if (selectedGoalId === goalId) setSelectedGoalId(null);
    };

    const handleDeleteCustom = (goalId: string) => {
        setAvailableGoals(prev => prev.filter(g => g.id !== goalId));
        setOrbitingGoals(prev => prev.filter(g => g.id !== goalId));
        if (selectedGoalId === goalId) setSelectedGoalId(null);
    };

    const selectedGoal = orbitingGoals.find(g => g.id === selectedGoalId);

    const testimonials = [
        { name: 'Alex R.', quote: 'From chaos to clarity.', position: 'top-1/4 left-10' },
        { name: 'Sarah T.', quote: 'My year, finally designed.', position: 'bottom-10 right-10' },
    ];

    return (
        <div className="w-full aspect-square md:aspect-auto md:h-[600px] p-4 flex flex-col md:flex-row items-stretch justify-center gap-6 relative">
            {/* Left Panel: Star Forge */}
            <div className="w-full md:w-1/3 bg-slate-900/60 border border-slate-700 rounded-2xl p-4 flex flex-col shadow-xl z-20">
                <h3 className="text-slate-200 font-bold text-lg mb-4 text-center uppercase tracking-widest border-b border-slate-700 pb-2">Star Forge</h3>
                
                <div className="flex-grow overflow-y-auto space-y-3 mb-4 pr-2">
                    {availableGoals.filter(g => !orbitingGoals.find(og => og.id === g.id)).map(goal => (
                        <div
                            key={goal.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, goal)}
                            className={`p-3 rounded-lg flex items-center justify-between cursor-grab active:cursor-grabbing text-white font-bold text-sm ${goal.color} shadow-lg transition-transform hover:scale-105 group relative`}
                        >
                            <span>{goal.name}</span>
                            {goal.isCustom && (
                                <button 
                                    onClick={() => handleDeleteCustom(goal.id)} 
                                    className="opacity-0 group-hover:opacity-100 bg-black/30 hover:bg-black/50 rounded-full w-5 h-5 flex items-center justify-center text-xs transition-opacity"
                                    title="Destroy Star"
                                >
                                    &times;
                                </button>
                            )}
                        </div>
                    ))}
                    {availableGoals.length === orbitingGoals.length && (
                        <p className="text-slate-500 text-xs text-center italic mt-10">All stars are in orbit.</p>
                    )}
                </div>

                <form onSubmit={handleAddCustomGoal} className="mt-auto pt-4 border-t border-slate-700">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newGoalName}
                            onChange={(e) => setNewGoalName(e.target.value)}
                            placeholder="Forge new star..."
                            className="bg-slate-800 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-grow w-full"
                        />
                        <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 rounded-md transition-colors">+</button>
                    </div>
                </form>
            </div>

            {/* Right Panel: Observatory */}
            <div
                className="w-full md:w-2/3 h-full min-h-[400px] bg-black/40 border border-slate-800 rounded-3xl shadow-2xl shadow-slate-900/50 relative flex items-center justify-center overflow-hidden"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => setSelectedGoalId(null)}
            >
                {/* Background Nebula */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-900/10 to-transparent pointer-events-none"></div>
                {/* Grid */}
                <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)', backgroundSize: '30px 30px'}}></div>

                {/* Testimonials */}
                {testimonials.map((t, i) => (
                    <div key={i} className={`absolute ${t.position} text-center p-2 rounded-lg opacity-40 hover:opacity-100 transition-opacity duration-500 pointer-events-none md:pointer-events-auto`}>
                        <p className="text-[10px] text-slate-400 italic">"{t.quote}"</p>
                    </div>
                ))}
                
                {/* Central Core */}
                <div className={`w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center text-center shadow-[0_0_50px_rgba(79,70,229,0.3)] z-10 transition-all duration-500 ${isGenerating ? 'animate-pulse scale-110 shadow-[0_0_80px_rgba(79,70,229,0.6)]' : ''}`}>
                    <div className="w-20 h-20 rounded-full bg-slate-900 flex flex-col items-center justify-center border border-slate-700">
                         <span className="text-slate-300 font-bold text-xs">CORE</span>
                         {isGenerating && <span className="text-[8px] text-indigo-400 animate-pulse">AI Active</span>}
                    </div>
                </div>

                {/* Orbiting Nodes */}
                {orbitingGoals.map((goal, index) => {
                    const animationDuration = 20 + index * 5;
                    const orbitRadius = 120 + index * 35; // Stagger orbits
                    // Create a unique animation for each radius if needed, or reuse simplified logic
                    // For simplicity in this specialized update, we'll use inline styles for dynamic orbits or classes if predefined.
                    // We'll stick to the predefined classes 'orbit1', 'orbit2', 'orbit3' for simplicity but cycle them.
                    const animName = `orbit${(index % 3) + 1}`;
                    
                    return (
                        <div 
                            key={goal.id} 
                            className="absolute top-1/2 left-1/2 -ml-6 -mt-6 cursor-pointer z-10"
                            style={{ animation: `${animName} ${animationDuration}s linear infinite` }}
                            onClick={(e) => { e.stopPropagation(); setSelectedGoalId(goal.id); }}
                        >
                           <div className={`w-12 h-12 rounded-full ${goal.color} flex items-center justify-center text-white text-[10px] font-bold shadow-lg border-2 ${selectedGoalId === goal.id ? 'border-white scale-125' : 'border-transparent hover:scale-110'} transition-all`}>
                               {goal.name.substring(0, 4)}..
                           </div>
                        </div>
                    );
                })}

                {/* Holographic Detail Overlay */}
                {selectedGoal && (
                    <div 
                        className="absolute inset-4 md:inset-10 bg-slate-900/90 backdrop-blur-md border border-indigo-500/50 rounded-xl p-6 z-30 flex flex-col animate-fade-in shadow-[0_0_50px_rgba(0,0,0,0.8)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h4 className="text-2xl font-bold text-white flex items-center gap-2">
                                <span className={`w-4 h-4 rounded-full ${selectedGoal.color}`}></span>
                                {selectedGoal.name}
                            </h4>
                            <div className="flex gap-2">
                                <button onClick={() => handleEject(selectedGoal.id)} className="text-rose-400 hover:text-rose-300 text-xs uppercase font-bold tracking-wider px-2 py-1 border border-rose-900 rounded bg-rose-900/20 hover:bg-rose-900/40 transition-colors">Eject</button>
                                <button onClick={() => setSelectedGoalId(null)} className="text-slate-400 hover:text-white text-xl leading-none">&times;</button>
                            </div>
                        </div>

                        <div className="flex-grow overflow-y-auto">
                            {selectedGoal.plan ? (
                                <div className="space-y-3">
                                    <p className="text-xs text-indigo-300 uppercase tracking-widest mb-2 border-b border-indigo-900/50 pb-1">SMART Breakdown</p>
                                    <div className="grid grid-cols-1 gap-2 text-sm">
                                        <div className="bg-slate-800/50 p-2 rounded border-l-2 border-indigo-500"><strong className="text-indigo-200">S:</strong> <span className="text-slate-300">{selectedGoal.plan.S}</span></div>
                                        <div className="bg-slate-800/50 p-2 rounded border-l-2 border-indigo-500"><strong className="text-indigo-200">M:</strong> <span className="text-slate-300">{selectedGoal.plan.M}</span></div>
                                        <div className="bg-slate-800/50 p-2 rounded border-l-2 border-indigo-500"><strong className="text-indigo-200">A:</strong> <span className="text-slate-300">{selectedGoal.plan.A}</span></div>
                                        <div className="bg-slate-800/50 p-2 rounded border-l-2 border-indigo-500"><strong className="text-indigo-200">R:</strong> <span className="text-slate-300">{selectedGoal.plan.R}</span></div>
                                        <div className="bg-slate-800/50 p-2 rounded border-l-2 border-indigo-500"><strong className="text-indigo-200">T:</strong> <span className="text-slate-300">{selectedGoal.plan.T}</span></div>
                                    </div>
                                    <button 
                                        onClick={() => handleGenerateSmartPlan(selectedGoal)} 
                                        className="mt-4 text-xs text-indigo-400 hover:text-indigo-300 underline"
                                        disabled={isGenerating}
                                    >
                                        {isGenerating ? 'Regenerating...' : 'Regenerate Plan'}
                                    </button>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                                    <p className="text-slate-300 mb-4">Initialize AI analysis for this goal?</p>
                                    <button 
                                        onClick={() => handleGenerateSmartPlan(selectedGoal)} 
                                        disabled={isGenerating}
                                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-full shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] transition-all flex items-center gap-2"
                                    >
                                        {isGenerating ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                Analyzing...
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-lg">✨</span> Generate SMART Plan
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {orbitingGoals.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <p className="text-slate-500/50 text-xl font-bold tracking-widest uppercase">Orbit Empty</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const seasonalColors = [
    'border-sky-700', 'border-sky-600', 'border-teal-600', // Winter
    'border-pink-500', 'border-green-500', 'border-green-400', // Spring
    'border-yellow-400', 'border-orange-400', 'border-orange-500', // Summer
    'border-amber-600', 'border-red-600', 'border-indigo-700'  // Fall
];

const TimelineVisual = () => {
    const { orbitingGoals, timelineEvents, setTimelineEvents } = useGoals();
    const [activeMonth, setActiveMonth] = useState<number | null>(6);
    const [anchorText, setAnchorText] = useState('');
    const [selectedGoalId, setSelectedGoalId] = useState<string>('');
    const [isAnimating, setIsAnimating] = useState(false);

    const handleAddEvent = (e: React.FormEvent) => {
        e.preventDefault();
        if (!anchorText.trim() || activeMonth === null) return;

        setIsAnimating(true);
        setTimelineEvents(prev => [...prev, {
            id: `evt-${Date.now()}`,
            month: activeMonth,
            title: anchorText.trim(),
            goalId: selectedGoalId || undefined,
        }]);
        
        setAnchorText('');
        setSelectedGoalId('');
        
        setTimeout(() => {
            setIsAnimating(false);
        }, 800);
    };

    const handleDeleteEvent = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setTimelineEvents(prev => prev.filter(evt => evt.id !== id));
    };

    const activeEvents = timelineEvents.filter(evt => evt.month === activeMonth);

    return (
        <div className="w-full h-[550px] flex flex-col lg:flex-row items-center justify-center gap-8 relative overflow-hidden p-4">
            {/* Left Side: Astrolabe Month Selector */}
            <div className="w-full lg:w-1/4 h-full flex items-center justify-center" style={{ perspective: '1000px' }}>
                <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
                    {monthNames.map((month, i) => {
                        const isActive = activeMonth === i;
                        const offset = i - (activeMonth ?? 6);
                        const translateY = isActive ? 0 : offset * 35;
                        const scale = isActive ? 1.15 : 1 - Math.abs(offset) * 0.15;
                        const opacity = isActive ? 1 : Math.max(0, 1 - Math.abs(offset) * 0.25);
                        const zIndex = 12 - Math.abs(offset);
                        const eventCount = timelineEvents.filter(e => e.month === i).length;

                        return (
                            <div
                                key={month}
                                onClick={() => setActiveMonth(i)}
                                className={`absolute inset-x-0 h-14 bg-slate-900/60 backdrop-blur-md border-l-4 ${seasonalColors[i]} rounded-r-lg flex items-center justify-between px-4 cursor-pointer transition-all duration-500 ease-out hover:bg-slate-800/80`}
                                style={{
                                    top: '50%',
                                    marginTop: '-1.75rem',
                                    transform: `translateY(${translateY}px) translateZ(${isActive ? 120 : 0}px) scale(${scale})`,
                                    opacity,
                                    zIndex,
                                    boxShadow: isActive ? '0 10px 30px -10px rgba(0,0,0,0.5)' : 'none'
                                }}
                            >
                                <span className={`font-bold transition-colors ${isActive ? 'text-white' : 'text-slate-400'}`}>{month}</span>
                                {eventCount > 0 && (
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-700 text-xs font-bold text-slate-200">
                                        {eventCount}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Right Side: Timeline Event Manager */}
            <div className="w-full lg:w-3/4 h-full bg-slate-900/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl flex flex-col p-6 relative shadow-2xl">
                <div className="text-center mb-6">
                    <h3 className="font-bold text-2xl text-slate-100 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Master Timeline Portal</h3>
                    <p className="text-sm text-slate-400 mt-1">Visualize project phases and link them to your core goals.</p>
                </div>

                <div className="flex-grow flex flex-col gap-6 overflow-hidden">
                    {activeMonth !== null && (
                        <div className="w-full h-full flex flex-col animate-fade-in gap-4">
                            <div className="flex items-center justify-between border-b border-slate-700/50 pb-3">
                                <h4 className="text-xl font-bold text-slate-200">{monthNames[activeMonth]} Milestones</h4>
                                <span className="text-xs font-mono text-slate-500">{activeEvents.length} Phases Planned</span>
                            </div>

                            <div className="flex-grow overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                                {activeEvents.length === 0 ? (
                                    <div className="h-full flex items-center justify-center text-slate-500 italic text-sm">
                                        No milestones mapped for this month.
                                    </div>
                                ) : (
                                    activeEvents.map(evt => {
                                        const linkedGoal = orbitingGoals.find(g => g.id === evt.goalId);
                                        return (
                                            <div key={evt.id} className="group relative bg-slate-800/50 border border-slate-700 p-3 rounded-xl flex flex-col gap-2 hover:bg-slate-800 transition-colors">
                                                <div className="flex justify-between items-start">
                                                    <h5 className="font-semibold text-slate-200">{evt.title}</h5>
                                                    <button onClick={(e) => handleDeleteEvent(evt.id, e)} className="opacity-0 group-hover:opacity-100 text-rose-400 hover:text-rose-300 transition-opacity">
                                                        &times;
                                                    </button>
                                                </div>
                                                {linkedGoal && (
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className={`w-2 h-2 rounded-full ${linkedGoal.color}`}></span>
                                                        <span className="text-xs text-slate-400">Aligned with: {linkedGoal.name}</span>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            <form onSubmit={handleAddEvent} className="flex flex-col gap-3 mt-auto pt-4 border-t border-slate-700/50 bg-slate-900/80 p-4 rounded-xl">
                                <input
                                    type="text"
                                    value={anchorText}
                                    onChange={(e) => setAnchorText(e.target.value)}
                                    placeholder="Enter project phase or milestone..."
                                    className="bg-slate-950 border border-slate-700 rounded-lg py-2.5 px-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full transition-all"
                                />
                                <div className="flex gap-3">
                                    <select
                                        value={selectedGoalId}
                                        onChange={(e) => setSelectedGoalId(e.target.value)}
                                        className="bg-slate-950 border border-slate-700 rounded-lg py-2.5 px-3 text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-grow appearance-none cursor-pointer text-sm"
                                    >
                                        <option value="">Link to a Goal (Optional)</option>
                                        {orbitingGoals.map(goal => (
                                            <option key={goal.id} value={goal.id}>{goal.name}</option>
                                        ))}
                                    </select>
                                    <button type="submit" disabled={!anchorText.trim()} className="bg-indigo-600 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-indigo-500 transition-colors whitespace-nowrap">
                                        Add Phase
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>

                {isAnimating && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 rounded-2xl animate-fade-in-out">
                         <div className="p-4 bg-slate-800 rounded-full text-indigo-400 animate-spin-slow">
                            <TimelineIcon />
                         </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const BudgetAlchemyVisual = () => {
    type FinancialItem = { id: number; name: string; amount: number; }; // Amount is in USD
    type DebtItem = FinancialItem & { apr: number; };
    type Financials = {
        income: number; // USD
        expenses: { fixed: FinancialItem[]; variable: FinancialItem[]; };
        debts: DebtItem[];
        savings: FinancialItem[];
        goals: FinancialItem[];
    };

    const { currency, setCurrency, getSymbol, formatCurrency, convertFromUSD, convertToUSD, rates } = useCurrency();
    const [view, setView] = useState<'forge' | 'loading' | 'simulation'>('forge');
    const [financials, setFinancials] = useState<Financials>({
        income: 5000,
        expenses: { fixed: [{ id: 1, name: 'Rent', amount: 1500 }], variable: [{ id: 1, name: 'Groceries', amount: 400 }] },
        debts: [{ id: 1, name: 'Student Loan', amount: 20000, apr: 5.5 }],
        savings: [{ id: 1, name: 'Emergency Fund', amount: 3000 }],
        goals: [{ id: 1, name: 'Vacation', amount: 2500 }],
    });
    const [advice, setAdvice] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [whatIf, setWhatIf] = useState({ savingsBoost: 0 }); // In USD

    

    const handleAddItem = (category: 'expenses.fixed' | 'expenses.variable' | 'debts' | 'savings' | 'goals') => {
        const id = Date.now();
        const newItem = { id, name: 'New Item', amount: 0, ...(category === 'debts' && { apr: 0 }) };
        
        setFinancials(prev => {
            const newFinancials = { ...prev };
            let targetArray;
            if (category === 'expenses.fixed') targetArray = newFinancials.expenses.fixed;
            else if (category === 'expenses.variable') targetArray = newFinancials.expenses.variable;
            else if (category === 'debts') targetArray = newFinancials.debts;
            else if (category === 'savings') targetArray = newFinancials.savings;
            else targetArray = newFinancials.goals;
            
            // @ts-ignore
            targetArray.push(newItem);
            return newFinancials;
        });
    };
    
    const handleItemChange = (category: string, id: number, field: string, value: string | number) => {
        setFinancials(prev => {
            const newFinancials = JSON.parse(JSON.stringify(prev));
            let targetArray;
            if (category === 'expenses.fixed') targetArray = newFinancials.expenses.fixed;
            else if (category === 'expenses.variable') targetArray = newFinancials.expenses.variable;
            else if (category === 'debts') targetArray = newFinancials.debts;
            else if (category === 'savings') targetArray = newFinancials.savings;
            else if (category === 'goals') targetArray = newFinancials.goals;

            const item = targetArray.find((i: FinancialItem) => i.id === id);
            if (item) {
                // @ts-ignore
                item[field] = (field === 'name') ? value : Number(value);
            }
            return newFinancials;
        });
    };

    const handleTransmute = async (e: FormEvent) => {
        e.preventDefault();
        setView('loading');
        setIsLoading(true);
        setError('');
        setAdvice('');

        const toLocalCurrency = (amount: number) => convertFromUSD(amount).toFixed(2);
        const symbol = getSymbol();

        const prompt = `
            You are a world-class financial advisor AI, The Life Architect Oracle. Your advice is practical, empathetic, and empowering. Based on the following financial data (in ${currency}), provide a personalized and actionable financial plan in markdown format.

            **User's Financial Snapshot:**
            *   **Monthly Income:** ${symbol}${toLocalCurrency(financials.income)}
            *   **Fixed Monthly Expenses:**
                ${financials.expenses.fixed.map(item => `- ${item.name}: ${symbol}${toLocalCurrency(item.amount)}`).join('\n')}
            *   **Variable Monthly Expenses:**
                ${financials.expenses.variable.map(item => `- ${item.name}: ${symbol}${toLocalCurrency(item.amount)}`).join('\n')}
            *   **Debts:**
                ${financials.debts.map(debt => `- ${debt.name}: ${symbol}${toLocalCurrency(debt.amount)} at ${debt.apr}% APR`).join('\n')}
            *   **Current Savings:**
                ${financials.savings.map(item => `- ${item.name}: ${symbol}${toLocalCurrency(item.amount)}`).join('\n')}
            *   **Financial Goals:**
                ${financials.goals.map(goal => `- ${goal.name}: Target ${symbol}${toLocalCurrency(goal.amount)}`).join('\n')}

            **Your Task:**
            Generate a comprehensive financial plan covering these five key areas. Be encouraging and use headings for each section.

            1.  **### Spending Optimization Analysis**
                Identify 3-5 specific areas where spending can be cut or optimized. Provide realistic reduction targets in ${currency}.
            2.  **### Prioritized Debt Payoff Strategy**
                Recommend either the Avalanche or Snowball method, explain why it's a good fit, and create a clear, prioritized list of which debts to tackle first.
            3.  **### Automated Wealth-Building Plan**
                Suggest specific, automated actions for saving and investing. Recommend amounts in ${currency} for an emergency fund vs. long-term investments.
            4.  **### Income Growth Opportunities**
                Suggest 2-3 practical ways to potentially increase income.
            5.  **### Long-Term Vision & Sticking To It**
                Provide a motivational closing statement and practical tips for staying on track.
        `;

        try {
            const stream = await generateContentStream({
                model: "gemini-3.8-flash",
                contents: prompt,
            });
            setView('simulation');
            for await (const chunk of stream) {
                setAdvice(prev => prev + chunk.text);
            }
        } catch (err) {
            console.error(err);
            setError("The financial cosmos is turbulent. Please try again later.");
            setView('forge');
        } finally {
            setIsLoading(false);
        }
    };
    
    const totals = useMemo(() => {
        const totalFixed = financials.expenses.fixed.reduce((sum, item) => sum + item.amount, 0);
        const totalVariable = financials.expenses.variable.reduce((sum, item) => sum + item.amount, 0);
        const totalExpenses = totalFixed + totalVariable;
        const netFlow = financials.income - totalExpenses;
        return { totalExpenses, netFlow }; // In USD
    }, [financials]);

    const InputSection: React.FC<{title: string, items: (FinancialItem[] | DebtItem[]), category: string}> = ({ title, items, category }) => (
        <fieldset className="border border-slate-700 p-3 rounded-lg">
            <legend className="px-2 text-sm font-bold text-slate-300">{title}</legend>
            <div className="space-y-2">
                {items.map(item => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                        <input type="text" value={item.name} onChange={e => handleItemChange(category, item.id, 'name', e.target.value)} placeholder="Name" className="col-span-5 bg-slate-800 border border-slate-600 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-slate-500 focus:outline-none" />
                        <input type="number" value={convertFromUSD(item.amount).toFixed(2)} onChange={e => handleItemChange(category, item.id, 'amount', convertToUSD(parseFloat(e.target.value) || 0))} placeholder="Amount" className="col-span-4 bg-slate-800 border border-slate-600 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-slate-500 focus:outline-none" />
                        {'apr' in item ? (
                             <input type="number" value={item.apr} onChange={e => handleItemChange(category, item.id, 'apr', parseFloat(e.target.value) || 0)} placeholder="APR %" className="col-span-3 bg-slate-800 border border-slate-600 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-slate-500 focus:outline-none" />
                        ) : <div className="col-span-3"></div>}
                    </div>
                ))}
            </div>
            <button type="button" onClick={() => handleAddItem(category as any)} className="mt-2 text-xs bg-slate-700 hover:bg-slate-600 rounded px-2 py-1 font-bold w-full">+ Add</button>
        </fieldset>
    );

    const renderView = () => {
        switch (view) {
            case 'loading':
                return (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="relative w-32 h-32">
                            <div className="absolute top-4 left-4 text-slate-600 gear-1"><GearIcon size={64}/></div>
                            <div className="absolute bottom-4 right-4 text-slate-700 gear-2"><GearIcon size={48}/></div>
                        </div>
                        <h3 className="text-xl font-bold text-slate-200 mt-4">Consulting the Financial Cosmos...</h3>
                        <p className="text-slate-400">Your personalized oracle is being forged.</p>
                    </div>
                );
            case 'simulation':
                const simulatedNetFlowUSD = totals.netFlow + whatIf.savingsBoost;
                const totalIncome = financials.income || 1;
                const expensePercent = Math.min(100, (totals.totalExpenses / totalIncome) * 100);
                const netPercent = 100 - expensePercent;
                
                const sliderMin = Math.round(convertFromUSD(-500));
                const sliderMax = Math.round(convertFromUSD(500));
                
                return (
                    <div className="flex flex-col lg:flex-row gap-6 w-full h-full p-2">
                        <div className="lg:w-1/3 flex flex-col gap-4">
                             <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 text-center">
                                 <h4 className="text-xs uppercase tracking-wider text-slate-400">Simulated Net Flow</h4>
                                 <p className={`text-3xl font-bold transition-colors duration-300 ${simulatedNetFlowUSD >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>{formatCurrency(simulatedNetFlowUSD)}/mo</p>
                            </div>
                            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                                <h4 className="text-sm font-bold text-slate-300 mb-2 text-center">Cash Flow Vein</h4>
                                <div className="w-full bg-slate-800 rounded-full h-4 flex overflow-hidden border border-slate-700" title={`Expenses: ${expensePercent.toFixed(1)}%, Net: ${netPercent.toFixed(1)}%`}>
                                    <div className="bg-rose-500/80 transition-all duration-500" style={{ width: `${expensePercent}%` }}></div>
                                    <div className="bg-emerald-500/80 transition-all duration-500" style={{ width: `${netPercent}%` }}></div>
                                </div>
                            </div>
                            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                                <h4 className="text-sm font-bold text-slate-300 mb-2 text-center">'What If' Altar</h4>
                                 <div className="flex items-center gap-4">
                                    <span className="text-xs text-rose-400">{getSymbol()}{sliderMin}</span>
                                    <input id="whatif-slider" type="range" min={sliderMin} max={sliderMax} step={Math.max(1, Math.round(convertFromUSD(25)))} value={Math.round(convertFromUSD(whatIf.savingsBoost))} onChange={(e) => setWhatIf({savingsBoost: convertToUSD(parseInt(e.target.value))})} className="w-full" aria-label="What if scenario slider" />
                                    <span className="text-xs text-emerald-400">+{getSymbol()}{sliderMax}</span>
                                </div>
                                <p className="text-xs text-slate-500 text-center mt-1">Adjust monthly savings/debt payment</p>
                            </div>
                             <button onClick={() => setView('forge')} className="w-full text-center bg-slate-700 hover:bg-slate-600 rounded p-2 text-sm font-bold">Reforge Data</button>
                        </div>
                        <div className="lg:w-2/3 bg-slate-900/50 p-4 rounded-lg border border-slate-700 overflow-y-auto max-h-[450px] lg:max-h-full">
                             <h3 className="text-lg font-bold text-slate-200 mb-2">Oracle's Scroll</h3>
                            <div className="prose prose-sm prose-invert max-w-none prose-p:text-slate-300 prose-headings:text-slate-100 prose-strong:text-slate-100" dangerouslySetInnerHTML={{ __html: advice.replace(/\n/g, '<br />') }} />
                        </div>
                    </div>
                );
            case 'forge':
            default:
                return (
                    <form onSubmit={handleTransmute} className="w-full space-y-4">
                        {error && <p className="text-rose-400 text-center">{error}</p>}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <fieldset className="border border-slate-700 p-3 rounded-lg md:col-span-2">
                                <div className="flex justify-between items-center mb-2">
                                    <legend className="px-2 text-sm font-bold text-slate-300">Core Alchemy</legend>
                                    <select
                                        value={currency}
                                        onChange={(e) => setCurrency(e.target.value as Currency)}
                                        className="bg-slate-800 border border-slate-600 rounded-md py-1 px-2 text-xs text-white focus:outline-none"
                                    >
                                        {(Object.keys(rates) as Currency[]).map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <label className="text-xs text-slate-400">Monthly Income ({getSymbol()})</label>
                                <input type="number" value={convertFromUSD(financials.income).toFixed(2)} onChange={e => setFinancials(p => ({ ...p, income: convertToUSD(parseFloat(e.target.value) || 0) }))} className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 focus:ring-1 focus:ring-slate-500 focus:outline-none" />
                            </fieldset>
                            <InputSection title="Fixed Expenses" items={financials.expenses.fixed} category="expenses.fixed" />
                            <InputSection title="Variable Expenses" items={financials.expenses.variable} category="expenses.variable" />
                            <InputSection title="Debts" items={financials.debts} category="debts" />
                            <InputSection title="Savings & Investments" items={financials.savings} category="savings" />
                            <InputSection title="Financial Goals" items={financials.goals} category="goals" />
                        </div>
                        <button type="submit" disabled={isLoading} className="w-full bg-slate-200 text-black font-bold py-3 px-4 rounded-md hover:bg-white transition-colors disabled:bg-slate-500">
                            {isLoading ? 'Transmuting...' : 'Forge Your Fortune Flow'}
                        </button>
                    </form>
                );
        }
    };

    return (
        <div className="w-full min-h-[500px] flex flex-col gap-4 p-2 md:p-4 relative items-center justify-center">
           {renderView()}
        </div>
    );
};

const PlannerVisual = () => {
    type TaskType = 'ritual' | 'focus' | 'growth';
    type Task = { id: number; day: number; name: string; type: TaskType; completed: boolean };
    
    const initialTasks: Task[] = [
        { id: 1, day: 1, name: "Dawn Journaling", type: 'ritual', completed: true },
        { id: 2, day: 2, name: "Project Phoenix Deep Dive", type: 'focus', completed: true },
        { id: 3, day: 3, name: "Read 'Atomic Habits'", type: 'growth', completed: false },
        { id: 4, day: 1, name: "Morning Run", type: 'ritual', completed: false },
        { id: 5, day: 2, name: "Dawn Journaling", type: 'ritual', completed: true },
    ];

    const [tasks, setTasks] = useState(initialTasks);
    const [newTask, setNewTask] = useState({ name: '', day: 0, type: 'ritual' as TaskType });
    const [weekKey, setWeekKey] = useState(0);

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTask.name) return;
        setTasks(prev => [...prev, { ...newTask, id: Date.now(), completed: false }]);
        setNewTask({ name: '', day: newTask.day, type: newTask.type });
        setWeekKey(prev => prev + 1); // Trigger re-animation
    };

    const toggleTask = (id: number) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const taskColors: Record<TaskType, { bg: string; energy: string; flame: string; }> = {
        ritual: { bg: 'bg-indigo-600/50', energy: 'bg-indigo-400', flame: 'shadow-[0_0_15px_3px] shadow-indigo-400/50' },
        focus: { bg: 'bg-sky-600/50', energy: 'bg-sky-400', flame: 'shadow-[0_0_15px_3px] shadow-sky-400/50' },
        growth: { bg: 'bg-emerald-600/50', energy: 'bg-emerald-400', flame: 'shadow-[0_0_15px_3px] shadow-emerald-400/50' }
    };

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return (
        <div className="w-full flex flex-col gap-4 p-2 md:p-4 bg-black/20 rounded-2xl min-h-[500px]">
            {/* Header */}
            <div className="text-center px-4">
                <h3 className="font-bold text-xl text-slate-200">Sculpt Your Weekly Symphony</h3>
                <div className="w-full bg-slate-800 rounded-full h-2.5 mt-2">
                    <div className="progress-bar-glow h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            {/* Planner Grid */}
            <div key={weekKey} className="flex-grow grid grid-cols-7 gap-1 md:gap-2 relative">
                {weekDays.map((day, i) => (
                    <div key={day} className="flex flex-col gap-1 md:gap-2 bg-slate-900/50 rounded-lg p-1">
                        <div className="text-center text-xs font-bold text-slate-400">{day}</div>
                        <div className="flex flex-col gap-1 md:gap-2 min-h-[200px]">
                            {tasks.filter(t => t.day === i).map((task, index) => (
                                <div
                                    key={task.id}
                                    onClick={() => toggleTask(task.id)}
                                    className={`task-brick p-2 rounded-md cursor-pointer text-xs text-slate-200 border-l-4 transition-all duration-300 ${task.completed ? taskColors[task.type].flame : ''} ${taskColors[task.type].bg} border-${taskColors[task.type].energy.replace('bg-', '')}`}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className="flex items-start gap-1.5">
                                        <div className={`w-2 h-2 rounded-full ${taskColors[task.type].energy} mt-0.5 flex-shrink-0 ${task.completed ? 'habit-flame' : ''}`}></div>
                                        <span>{task.name}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Atelier Form */}
            <div className="bg-slate-900/50 border-t border-slate-800 p-3 rounded-b-2xl">
                <form onSubmit={handleAddTask} className="flex flex-col sm:flex-row items-center gap-2">
                    <input
                        type="text"
                        placeholder="Add a new ritual..."
                        value={newTask.name}
                        onChange={(e) => setNewTask(prev => ({ ...prev, name: e.target.value }))}
                        className="bg-slate-800 border border-slate-700 rounded-md py-1.5 px-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 flex-grow w-full"
                    />
                    <div className="flex gap-2 w-full sm:w-auto">
                        <select
                            value={newTask.day}
                            onChange={(e) => setNewTask(prev => ({ ...prev, day: parseInt(e.target.value) }))}
                            className="bg-slate-800 border border-slate-700 rounded-md py-1.5 px-2 text-white focus:outline-none focus:ring-2 focus:ring-slate-500"
                        >
                            {weekDays.map((day, i) => <option key={i} value={i}>{day}</option>)}
                        </select>
                        <select
                            value={newTask.type}
                            onChange={(e) => setNewTask(prev => ({ ...prev, type: e.target.value as TaskType }))}
                            className="bg-slate-800 border border-slate-700 rounded-md py-1.5 px-2 text-white focus:outline-none focus:ring-2 focus:ring-slate-500"
                        >
                            <option value="ritual">Ritual</option>
                            <option value="focus">Focus</option>
                            <option value="growth">Growth</option>
                        </select>
                        <button type="submit" className="bg-slate-200 text-black font-bold py-1.5 px-4 rounded-md hover:bg-white transition-colors">+</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const DreamInventoryVisual = () => {
    type Dream = { id: number; text: string; progress: number; image: string; isNew?: boolean };
    const initialDreams: Dream[] = [
        { id: 1, text: 'Sail the Aegean Sea', progress: 25, image: 'https://picsum.photos/seed/aegean/400/600' },
        { id: 2, text: 'Write a Bestseller', progress: 60, image: 'https://picsum.photos/seed/book/400/600' },
        { id: 3, text: 'Build a Cabin', progress: 10, image: 'https://picsum.photos/seed/cabin/400/600' },
        { id: 4, text: 'Learn Piano', progress: 45, image: 'https://picsum.photos/seed/piano/400/600' },
    ];
    const [dreams, setDreams] = useState<Dream[]>(initialDreams);
    const [newDream, setNewDream] = useState('');
    const [spunDream, setSpunDream] = useState<string | null>(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const inspirationSparks = ["Launch a Podcast", "Run a Marathon", "Master a New Language", "Start a Tech Company", "Learn to Paint", "Travel to Japan"];

    const DreamProgressConstellation: React.FC<{ progress: number; size?: number; id: string | number; }> = ({ progress, size = 80, id }) => {
        // A simple pentagon shape
        const points = [
            { x: 40, y: 5 },  // Top
            { x: 75, y: 35 }, // Right
            { x: 60, y: 75 }, // Bottom-right
            { x: 20, y: 75 }, // Bottom-left
            { x: 5,  y: 35 }, // Left
        ];
    
        const starsToShow = progress >= 100 ? 5 : Math.floor(progress / 25) + 1;
        const isComplete = progress >= 100;
    
        return (
            <svg viewBox="0 0 80 80" width={size} height={size} className="constellation-svg">
                <g className={isComplete ? 'constellation-complete' : ''}>
                    {/* Render lines first */}
                    {points.slice(0, starsToShow).map((p, i) => {
                        if (i === 0) return null;
                        const prev = points[i - 1];
                        return (
                            <line
                                key={`line-${id}-${i}`}
                                x1={prev.x} y1={prev.y}
                                x2={p.x} y2={p.y}
                                className="constellation-line"
                                style={{ animationDelay: `${i * 150}ms` }}
                            />
                        );
                    })}
                    {/* Final line to close the loop at 100% */}
                    {isComplete && (
                        <line
                            x1={points[4].x} y1={points[4].y}
                            x2={points[0].x} y2={points[0].y}
                            className="constellation-line"
                            style={{ animationDelay: `${5 * 150}ms` }}
                        />
                    )}
                    {/* Render stars on top */}
                    {points.slice(0, starsToShow).map((p, i) => (
                        <circle
                            key={`star-${id}-${i}`}
                            cx={p.x} cy={p.y}
                            r="3"
                            className="constellation-star"
                            style={{ animationDelay: `${i * 150}ms` }}
                        />
                    ))}
                </g>
            </svg>
        );
    };

    const handleAddDream = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newDream.trim()) return;
        const newDreamItem: Dream = {
            id: Date.now(),
            text: newDream,
            progress: 0,
            image: `https://picsum.photos/seed/${Date.now()}/400/600`,
            isNew: true,
        };
        setDreams(prev => [newDreamItem, ...prev]);
        setNewDream('');
        // Remove the 'isNew' flag after animation to prevent re-animating
        setTimeout(() => {
            setDreams(prev => prev.map(d => d.id === newDreamItem.id ? { ...d, isNew: false } : d));
        }, 800);
    };

    const handleSpin = () => {
        setIsSpinning(true);
        setSpunDream(null);
        let spinCount = 0;
        const spinInterval = setInterval(() => {
            setSpunDream(inspirationSparks[Math.floor(Math.random() * inspirationSparks.length)]);
            spinCount++;
            if (spinCount > 15) {
                clearInterval(spinInterval);
                const finalDream = inspirationSparks[Math.floor(Math.random() * inspirationSparks.length)];
                setSpunDream(finalDream);
                setIsSpinning(false);
            }
        }, 100);
    };
    
    const updateProgress = (id: number) => {
        setDreams(dreams.map(d => d.id === id ? {...d, progress: Math.min(100, d.progress + 10)} : d));
    };

    return (
        <div ref={containerRef} className="w-full flex flex-col gap-4 p-4 min-h-[500px] relative overflow-hidden">
            <div className="text-center z-10">
                <h3 className="font-bold text-xl text-slate-200">Awaken Your Aspiration Arsenal</h3>
                <p className="text-sm text-slate-400 italic">"Liberate latent legends from the dream-weave, each fancy a flare to fuel your firmament."</p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 z-10">
                 <form onSubmit={handleAddDream} className="flex-grow flex gap-2">
                    <input
                        type="text"
                        placeholder="Invoke a reverie (e.g., 'Write bestseller')"
                        value={newDream}
                        onChange={e => setNewDream(e.target.value)}
                        className="bg-slate-900/80 border border-slate-700 rounded-md py-2 px-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-grow w-full"
                    />
                    <button type="submit" className="bg-indigo-500 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-400 transition-colors">Forge</button>
                </form>
                <div className="flex items-center gap-2">
                    <button onClick={handleSpin} disabled={isSpinning} className="bg-slate-700 text-white font-bold py-2 px-4 rounded-md hover:bg-slate-600 transition-colors w-full md:w-auto">
                        {isSpinning ? 'Spinning...' : 'Spin for a Spark'}
                    </button>
                    {spunDream && <p className="text-sm text-center metallic-mantra p-2 bg-black/30 rounded-md">{spunDream}</p>}
                </div>
            </div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 w-full mx-auto z-10 flex-grow">
                {dreams.map(dream => (
                     <div key={dream.id} className={`dream-card group relative aspect-[3/4] rounded-lg shadow-lg overflow-hidden border-2 border-slate-800/50 transition-all duration-300 hover:border-indigo-500/80 hover:shadow-indigo-500/20 hover:shadow-2xl hover:scale-105 ${dream.isNew ? 'is-new' : ''}`}>
                        <img src={dream.image} alt={dream.text} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-3 text-white flex items-end justify-between gap-2">
                            <h4 className="font-bold text-sm leading-tight flex-grow">{dream.text}</h4>
                            <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
                                <DreamProgressConstellation progress={dream.progress} size={48} id={dream.id} />
                            </div>
                        </div>
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center opacity-0 transform scale-95 transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:scale-100">
                             <h4 className="font-bold text-lg text-white -mt-4 mb-1">{dream.text}</h4>
                             <DreamProgressConstellation progress={dream.progress} size={100} id={`modal-${dream.id}`} />
                            <p className="text-xl font-bold text-emerald-300 -mt-4 mb-2">{dream.progress}% Complete</p>
                            <button onClick={() => updateProgress(dream.id)} className="text-xs bg-slate-200 text-black font-bold py-1 px-3 rounded-full mb-2 hover:bg-white">Log Progress</button>
                            <div className="text-xs space-y-1">
                                <button className="block w-full text-slate-300 hover:text-white">🔗 Link to Budget</button>
                                <button className="block w-full text-slate-300 hover:text-white">🔗 Add to Planner</button>
                            </div>
                        </div>
                     </div>
                ))}
            </div>
        </div>
    );
};

const useCountdown = (targetDate: string) => {
    const [countdown, setCountdown] = useState({
        days: 0, hours: 0, minutes: 0, seconds: 0
    });

    useEffect(() => {
        if (!targetDate) return;
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = new Date(targetDate).getTime() - now;

            if (distance < 0) {
                clearInterval(interval);
                setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            setCountdown({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    return countdown;
};

const EventsCalendarVisual = () => {
    type Event = { id: number, name: string, date: string, position: { top: string, left: string }, size: number };
    const getFutureDate = (days: number) => new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const initialEvents: Event[] = [
        { id: 1, name: "Launch Gala", date: getFutureDate(15), position: { top: '20%', left: '25%' }, size: 90 },
        { id: 2, name: "Q4 Summit", date: getFutureDate(40), position: { top: '55%', left: '15%' }, size: 120 },
        { id: 3, name: "Team Retreat", date: getFutureDate(80), position: { top: '35%', left: '65%' }, size: 100 },
        { id: 4, name: "Project Review", date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], position: { top: '70%', left: '50%' }, size: 80 },
    ];

    const [events, setEvents] = useState<Event[]>(initialEvents);
    const [activeEvent, setActiveEvent] = useState<Event | null>(null);
    const [newEvent, setNewEvent] = useState({ name: '', date: '' });
    const isPast = activeEvent ? new Date(activeEvent.date).getTime() < new Date().getTime() : false;
    const countdown = useCountdown(activeEvent?.date || '');

    const handleAddEvent = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEvent.name || !newEvent.date) return;
        const newEventItem: Event = {
            id: Date.now(),
            name: newEvent.name,
            date: newEvent.date,
            position: {
                top: `${20 + Math.random() * 60}%`,
                left: `${10 + Math.random() * 80}%`,
            },
            size: 80 + Math.random() * 40
        };
        setEvents(prev => [...prev, newEventItem]);
        setNewEvent({ name: '', date: '' });
    };

    return (
        <div className="w-full h-[550px] flex flex-col gap-4 p-4 relative overflow-hidden bg-black/30 rounded-2xl border border-slate-800">
            <div className="text-center z-20">
                <h3 className="font-bold text-xl text-slate-200">Etch Eternity's Engagements</h3>
                <p className="text-sm text-slate-400 italic">"Conduct chaos into cadence, a calendar clairvoyant."</p>
            </div>
            
            {/* Clockwork Cosmos */}
            <div className="flex-grow relative" style={{ perspective: '800px' }}>
                {/* Gears */}
                <div className="absolute top-1/4 left-1/4 w-48 h-48 text-slate-800/50 opacity-50 gear-1"><GearIcon size={192} /></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 text-slate-900 opacity-50 gear-2"><GearIcon size={128} /></div>

                {events.map((event, i) => {
                    const isEventPast = new Date(event.date).getTime() < new Date().getTime();
                    return (
                        <div
                            key={event.id}
                            className={`chronosphere absolute rounded-full flex items-center justify-center text-center p-2 cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-2xl z-10 ${isEventPast ? 'memory-mandala bg-slate-700/50' : 'bg-indigo-600/50 border-2 border-indigo-400 shadow-lg shadow-indigo-500/20'}`}
                            style={{ top: event.position.top, left: event.position.left, width: event.size, height: event.size, animationDelay: `${i * 100}ms` }}
                            onClick={() => setActiveEvent(event)}
                        >
                            <div>
                                <p className="text-sm font-bold text-white">{event.name}</p>
                                <p className="text-xs text-slate-300">{new Date(event.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Event Detail Dirigible */}
            {activeEvent && (
                 <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-30" onClick={() => setActiveEvent(null)}>
                    <div className="dirigible-detail absolute w-11/12 max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6" onClick={e => e.stopPropagation()}>
                        <h4 className="text-2xl font-bold text-white mb-2">{activeEvent.name}</h4>
                        <p className="text-slate-400 mb-4">{new Date(activeEvent.date).toDateString()}</p>
                        
                        {isPast ? (
                            <div>
                                <h5 className="text-sm font-semibold text-slate-300 mb-2">Reflection Runes</h5>
                                <textarea placeholder="How did it go? What did you learn?" className="w-full h-24 bg-slate-800 border border-slate-600 rounded-md p-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
                            </div>
                        ) : (
                            <div>
                                <div className="grid grid-cols-4 text-center gap-2 mb-4">
                                    <div><p className="text-2xl font-bold countdown-tick">{countdown.days}</p><p className="text-xs text-slate-400">Days</p></div>
                                    <div><p className="text-2xl font-bold countdown-tick">{countdown.hours}</p><p className="text-xs text-slate-400">Hours</p></div>
                                    <div><p className="text-2xl font-bold countdown-tick">{countdown.minutes}</p><p className="text-xs text-slate-400">Mins</p></div>
                                    <div><p className="text-2xl font-bold countdown-tick">{countdown.seconds}</p><p className="text-xs text-slate-400">Secs</p></div>
                                </div>
                                <div className="bg-sky-900/50 border border-sky-700 p-3 rounded-lg">
                                    <p className="text-sm font-bold text-sky-300">Weather Wisp:</p>
                                    <p className="text-xs text-sky-400">☀️ Sunlit Summit expected. AI suggests booking the patio.</p>
                                </div>
                            </div>
                        )}
                        <button onClick={() => setActiveEvent(null)} className="absolute top-3 right-3 text-slate-500 hover:text-white">&times;</button>
                    </div>
                 </div>
            )}
            
            {/* Input Easel */}
            <div className="z-20 border-t border-slate-800 pt-3">
                <form onSubmit={handleAddEvent} className="flex flex-col sm:flex-row gap-2 items-center">
                    <input type="text" placeholder="New Occasion" value={newEvent.name} onChange={e => setNewEvent({...newEvent, name: e.target.value})} className="bg-slate-800 border border-slate-700 rounded-md py-1.5 px-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 flex-grow w-full" />
                    <input type="date" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} className="bg-slate-800 border border-slate-700 rounded-md py-1.5 px-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 w-full sm:w-auto" />
                    <button type="submit" className="bg-slate-200 text-black font-bold py-1.5 px-4 rounded-md hover:bg-white transition-colors w-full sm:w-auto">Pin</button>
                </form>
            </div>
        </div>
    );
};


const VisionBoardVisual = () => {
    type Vision = { id: number; src: string; x: number; y: number; z: number; width: number; isNew?: boolean; };
    type DragState = { id: number; offsetX: number; offsetY: number } | null;

    const initialVisions: Vision[] = [
        { id: 1, src: 'https://picsum.photos/seed/throne/500/700', x: 20, y: 15, z: 20, width: 25 },
        { id: 2, src: 'https://picsum.photos/seed/mountain/500/700', x: 60, y: 50, z: -30, width: 30 },
    ];
    const aiSuggestions = [
        { name: "Throne", src: 'https://picsum.photos/seed/throne/500/700' },
        { name: "Journey", src: 'https://picsum.photos/seed/journey/500/700' },
        { name: "Empire", src: 'https://picsum.photos/seed/empire/500/700' }
    ];

    const [visions, setVisions] = useState<Vision[]>(initialVisions);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState<DragState>(null);
    const atelierRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (dragging) {
            const rect = atelierRef.current!.getBoundingClientRect();
            const x = ((e.clientX - rect.left - dragging.offsetX) / rect.width) * 100;
            const y = ((e.clientY - rect.top - dragging.offsetY) / rect.height) * 100;
            setVisions(v => v.map(vision => {
                if (vision.id === dragging.id) {
                    const clampedX = Math.max(0, Math.min(100 - vision.width, x));
                    const clampedY = Math.max(0, Math.min(100 - (vision.width * 1.33), y));
                    return { ...vision, x: clampedX, y: clampedY, z: 35 }; // Bring to front when dragging
                }
                return vision;
            }));
        } else {
            const { clientX, clientY, currentTarget } = e;
            const { left, top, width, height } = currentTarget.getBoundingClientRect();
            setMousePos({ x: (clientX - left) / width, y: (clientY - top) / height });
        }
    };
    
    const handleMouseUp = () => setDragging(null);
    const handleMouseLeave = () => setDragging(null);
    
    const addVision = (src: string) => {
         const newVision: Vision = {
            id: Date.now(),
            src,
            x: 25 + Math.random() * 30,
            y: 30 + Math.random() * 20,
            z: (Math.random() - 0.5) * 60,
            width: 20 + Math.random() * 10,
            isNew: true
        };
        setVisions(prev => [...prev, newVision]);
        setTimeout(() => {
            setVisions(prev => prev.map(v => v.id === newVision.id ? { ...v, isNew: false } : v));
        }, 1000);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    addVision(event.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="w-full flex flex-col gap-4 p-4 min-h-[500px] relative">
            <div className="text-center z-20">
                <h3 className="font-bold text-xl text-slate-200">Manifest Mirage Maker</h3>
                <p className="text-sm text-slate-400 italic">"Birth your blueprint in a boundless dream-dome."</p>
            </div>
            
            <div
                ref={atelierRef}
                className="flex-grow w-full border border-slate-800 rounded-2xl bg-black/30 relative overflow-hidden"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
            >
                {/* Parallax Background */}
                <div 
                    className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-slate-900/20 to-purple-900/30 transition-transform duration-500 ease-out"
                    style={{ transform: `translate(${(0.5 - mousePos.x) * 10}px, ${(0.5 - mousePos.y) * 10}px)` }}
                ></div>

                {/* Visions */}
                {visions.map(vision => {
                    const parallaxX = (0.5 - mousePos.x) * vision.z;
                    const parallaxY = (0.5 - mousePos.y) * vision.z;
                    return (
                        <div
                            key={vision.id}
                            className={`vision-diorama absolute rounded-lg shadow-2xl shadow-black/50 border-2 border-slate-500/50 overflow-hidden cursor-grab active:cursor-grabbing transition-all duration-300 hover:border-slate-200 hover:z-30 ${vision.isNew ? 'is-new' : ''}`}
                            style={{
                                left: `${vision.x}%`,
                                top: `${vision.y}%`,
                                width: `${vision.width}%`,
                                paddingBottom: `${vision.width * 1.33}%`, // Aspect ratio 3:4
                                transform: `translate(${parallaxX}px, ${parallaxY}px)`,
                                zIndex: dragging?.id === vision.id ? 30 : Math.round(vision.z),
                            }}
                            onMouseDown={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                setDragging({ id: vision.id, offsetX: e.clientX - rect.left, offsetY: e.clientY - rect.top });
                            }}
                        >
                             <img src={vision.src} alt="Vision" className="absolute w-full h-full object-cover" loading="lazy" />
                        </div>
                    );
                })}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 z-20">
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="bg-slate-200 text-black font-bold py-2 px-4 rounded-md hover:bg-white transition-colors">Upload a Totem</button>
                <div className="flex gap-2">
                    <span className="text-sm text-slate-400 self-center">AI Shards:</span>
                    {aiSuggestions.map(sugg => (
                        <button key={sugg.name} onClick={() => addVision(sugg.src)} className="bg-slate-700/80 text-xs py-1 px-3 rounded-full hover:bg-slate-600 transition-colors">{sugg.name}</button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const SelfCareVisual = () => {
    type Ritual = { id: number; text: string; completed: boolean; justCompleted?: boolean };

    const initialRituals: Ritual[] = [
        { id: 1, text: "Moonlit meditation", completed: true },
        { id: 2, text: "Read for 20 minutes", completed: false },
        { id: 3, text: "Digital detox hour", completed: true },
        { id: 4, text: "Stretch and hydrate", completed: false },
    ];
    
    const affirmations = [
        "Your peace is your power.",
        "Rest is a form of productivity.",
        "You are worthy of this moment of calm.",
        "Nourish to flourish.",
        "Breathe. You are enough."
    ];

    const [rituals, setRituals] = useState<Ritual[]>(initialRituals);
    const [newRitual, setNewRitual] = useState('');
    const [affirmation, setAffirmation] = useState(affirmations[0]);
    const [editingRitualId, setEditingRitualId] = useState<number | null>(null);
    const [editingRitualText, setEditingRitualText] = useState('');
    
    useEffect(() => {
        const affirmationInterval = setInterval(() => {
            setAffirmation(prev => {
                const currentIndex = affirmations.indexOf(prev);
                const nextIndex = (currentIndex + 1) % affirmations.length;
                return affirmations[nextIndex];
            });
        }, 7000);
        return () => clearInterval(affirmationInterval);
    }, []);

    const handleAddRitual = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newRitual.trim()) return;
        setRituals(prev => [...prev, { id: Date.now(), text: newRitual.trim(), completed: false }]);
        setNewRitual('');
    };

    const toggleRitual = (id: number) => {
        setRituals(rituals.map(r => {
            if (r.id === id) {
                const wasCompleted = r.completed;
                return { ...r, completed: !r.completed, justCompleted: !wasCompleted };
            }
            return r;
        }));
         // Reset animation trigger
        setTimeout(() => {
             setRituals(prev => prev.map(r => r.id === id ? {...r, justCompleted: false} : r));
        }, 1000);
    };

    const handleDeleteRitual = (id: number) => {
        setRituals(prev => prev.filter(r => r.id !== id));
    };

    const handleStartEditing = (ritual: Ritual) => {
        setEditingRitualId(ritual.id);
        setEditingRitualText(ritual.text);
    };

    const handleCancelEdit = () => {
        setEditingRitualId(null);
        setEditingRitualText('');
    };

    const handleSaveEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingRitualId || !editingRitualText.trim()) {
            handleCancelEdit();
            return;
        };
        setRituals(prev => prev.map(r => 
            r.id === editingRitualId ? { ...r, text: editingRitualText.trim() } : r
        ));
        handleCancelEdit();
    };

    const progress = useMemo(() => {
        const completedCount = rituals.filter(r => r.completed).length;
        return rituals.length > 0 ? (completedCount / rituals.length) * 100 : 0;
    }, [rituals]);

    return (
        <div className="w-full flex flex-col gap-4 p-4 bg-slate-900/50 rounded-2xl min-h-[500px] border border-emerald-900/50">
            <div className="text-center">
                <h3 className="font-bold text-xl text-slate-200">Bloom Your Being's Balm</h3>
                <p className="text-sm text-emerald-300/80 affirmation-firefly mt-1">"{affirmation}"</p>
            </div>

            <div className="flex-grow space-y-3 overflow-y-auto pr-2">
                {rituals.map(ritual => (
                    <div key={ritual.id} className="ritual-item group flex items-center gap-4 p-3 bg-slate-800/40 rounded-lg transition-all duration-300">
                        {editingRitualId === ritual.id ? (
                            <form onSubmit={handleSaveEdit} className="w-full flex items-center gap-2">
                                <input
                                    type="text"
                                    value={editingRitualText}
                                    onChange={e => setEditingRitualText(e.target.value)}
                                    className="flex-grow bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                                    autoFocus
                                    onKeyDown={(e) => { if (e.key === 'Escape') handleCancelEdit(); }}
                                />
                                <button type="submit" className="text-xs bg-emerald-600 hover:bg-emerald-500 rounded px-2 py-1 font-bold text-white" aria-label="Save ritual">Save</button>
                            </form>
                        ) : (
                            <>
                                <div onClick={() => toggleRitual(ritual.id)} className="flex items-center gap-4 flex-grow cursor-pointer">
                                    <div className="relative w-5 h-5 flex-shrink-0">
                                        <div className={`w-5 h-5 rounded-md border-2 ${ritual.completed ? 'border-emerald-500 bg-emerald-500' : 'border-slate-600'} transition-colors`}>
                                            {ritual.completed && <span className="text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">✓</span>}
                                        </div>
                                        {ritual.justCompleted && <div className="flourish-animate"></div>}
                                    </div>
                                    <span className={`text-slate-300 transition-colors ${ritual.completed ? 'line-through text-slate-500' : ''}`}>
                                        {ritual.text}
                                    </span>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                                    <button onClick={() => handleStartEditing(ritual)} className="text-slate-400 hover:text-white" aria-label="Edit ritual">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" /></svg>
                                    </button>
                                    <button onClick={() => handleDeleteRitual(ritual.id)} className="text-slate-400 hover:text-rose-400" aria-label="Delete ritual">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>

            <div className="border-t border-emerald-800/50 pt-3">
                 {/* Progress Vine */}
                <div className="w-full bg-slate-800 rounded-full h-1.5 mb-3">
                    <div className="progress-vine h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>

                <form onSubmit={handleAddRitual} className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Select a sanctifier..."
                        value={newRitual}
                        onChange={(e) => setNewRitual(e.target.value)}
                        className="bg-slate-800 border border-slate-700 rounded-md py-1.5 px-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 flex-grow"
                    />
                    <button type="submit" className="bg-emerald-600 text-white font-bold py-1.5 px-4 rounded-md hover:bg-emerald-500 transition-colors">Sow</button>
                </form>
            </div>
        </div>
    );
};

const YearlyReviewVisual = () => {
    type ReflectionType = 'triumph' | 'trail';
    type Reflection = { id: number; text: string; type: ReflectionType; isNew?: boolean; };
    type View = 'reflection' | 'strategistInput' | 'strategistOutput' | 'loading';
    type CareerInput = { currentRole: string; desiredRole: string; skills: string; };

    const initialReflections: Reflection[] = [
        { id: 1, text: "Launched Project Phoenix", type: 'triumph' },
        { id: 2, text: "Missed trip to Milan", type: 'trail' },
        { id: 3, text: "Read 12 books", type: 'triumph' },
        { id: 4, text: "Postponed learning guitar", type: 'trail' },
    ];

    
    const [view, setView] = useState<View>('reflection');
    const [reflections, setReflections] = useState<Reflection[]>(initialReflections);
    const [userInput, setUserInput] = useState('');
    const [careerInput, setCareerInput] = useState<CareerInput>({ currentRole: 'Software Engineer', desiredRole: 'Product Manager', skills: 'Python, SQL, AWS, React, Project Management basics' });
    const [careerPlan, setCareerPlan] = useState('');
    const [error, setError] = useState('');
    const [isEditingPlan, setIsEditingPlan] = useState(false);
    const [tempPlanText, setTempPlanText] = useState('');

    const handleReflectionSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim()) return;

        // Simple logic to guess the type for demo purposes
        const isTriumph = /launch|complete|achieve|new|learn|read/i.test(userInput);

        const newReflection: Reflection = {
            id: Date.now(),
            text: userInput,
            type: isTriumph ? 'triumph' : 'trail',
            isNew: true,
        };
        setReflections(prev => [newReflection, ...prev]);
        setUserInput('');
        setTimeout(() => {
            setReflections(prev => prev.map(r => r.id === newReflection.id ? { ...r, isNew: false } : r));
        }, 1000);
    };

    const handleDeleteReflection = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setReflections(prev => prev.filter(r => r.id !== id));
    };

    const handleCareerSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setView('loading');
        setError('');
        setCareerPlan('');

        const prompt = `
            You are a world-class career strategist oracle. Your advice is insightful, actionable, and encouraging. You specialize in helping people transition between careers. Based on the following user input, generate a comprehensive career transition roadmap in markdown format.

            **User's Career Goals:**
            *   **Current Role:** ${careerInput.currentRole}
            *   **Desired Role:** ${careerInput.desiredRole}
            *   **Current Skills:** ${careerInput.skills}

            **Your Task:**
            Generate a detailed and structured roadmap covering these key areas. Use markdown H3 headings (###) for each section title. Use lists and bold text to make it easy to read.

            1.  ### Skill Gap Analysis
                Identify the key skills the user needs to develop for their desired role. Be specific (e.g., "From technical coding to market research, stakeholder alignment, and business acumen").

            2.  ### Personalized Learning Path (Multi-Year Timeline)
                Create a step-by-step timeline (e.g., Year 1, Year 2, Year 3). For each phase, recommend specific learning resources, certifications, and actions. Mention specific platforms like Coursera, Product School, Udacity, and books like "Inspired" by Marty Cagan. Suggest stepping-stone roles if applicable.

            3.  ### Target Organizations & Salary Insights
                Suggest types of companies to target (e.g., FAANG, startups). Provide realistic salary ranges for entry-level, mid-level, and senior positions in major tech hubs, noting potential salary changes from their current role.

            4.  ### Networking & Portfolio Strategy
                Provide actionable strategies for networking (LinkedIn outreach, events via Meetup), finding mentors (ADPList), and building a portfolio (e.g., creating sample PRDs/roadmaps).

            5.  ### Motivational Closing
                End with an inspiring message about their career journey.
        `;

        try {
            const stream = await generateContentStream({
                model: "gemini-3.8-flash",
                contents: prompt,
            });
            setView('strategistOutput');
            for await (const chunk of stream) {
                setCareerPlan(prev => prev + chunk.text);
            }
        } catch (err) {
            console.error(err);
            setError("The career cosmos is clouded. Please try again.");
            setView('strategistInput');
        }
    };
    
    const triumphCount = useMemo(() => reflections.filter(r => r.type === 'triumph').length, [reflections]);
    const trailCount = useMemo(() => reflections.filter(r => r.type === 'trail').length, [reflections]);
    const totalReflections = reflections.length > 0 ? reflections.length : 1;
    const triumphHeight = (triumphCount / totalReflections) * 100;
    const trailHeight = (trailCount / totalReflections) * 100;

    const Accordion: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
        <details className="group border-b border-slate-700">
            <summary className="p-3 cursor-pointer list-none flex justify-between items-center text-slate-200 font-semibold hover:bg-slate-800/50">
                {title}
                <span className="transform transition-transform duration-300 group-open:rotate-90">&gt;</span>
            </summary>
            <div className="p-4 bg-black/20 text-slate-300">{children}</div>
        </details>
    );

    const handleEditPlan = () => {
        setTempPlanText(careerPlan);
        setIsEditingPlan(true);
    };

    const handleSavePlan = () => {
        setCareerPlan(tempPlanText);
        setIsEditingPlan(false);
    };

    const handleDeletePlan = () => {
        setCareerPlan('');
        setView('strategistInput');
    };

    const renderContent = () => {
        switch (view) {
            case 'loading':
                return (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="relative w-32 h-32">
                            <div className="absolute top-4 left-4 text-slate-600 gear-1"><GearIcon size={64}/></div>
                            <div className="absolute bottom-4 right-4 text-slate-700 gear-2"><GearIcon size={48}/></div>
                        </div>
                        <h3 className="text-xl font-bold text-slate-200 mt-4">Consulting the Oracle...</h3>
                        <p className="text-slate-400">Charting your career constellations.</p>
                    </div>
                );
            case 'strategistInput':
                return (
                    <div className="w-full h-full flex flex-col justify-center animate-fade-in">
                        <h3 className="text-xl font-bold text-slate-200 text-center mb-1">Career Strategist Oracle</h3>
                        <p className="text-sm text-slate-400 italic text-center mb-4">Chart a course from your current role to your desired future.</p>
                        <form onSubmit={handleCareerSubmit} className="space-y-4">
                            <div>
                                <label className="text-xs text-slate-400">Current Role/Field</label>
                                <input type="text" value={careerInput.currentRole} onChange={e => setCareerInput(p => ({ ...p, currentRole: e.target.value }))} placeholder="e.g., Software Engineer in IT" className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1.5 focus:ring-1 focus:ring-slate-500 focus:outline-none" required />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400">Desired Role/Industry</label>
                                <input type="text" value={careerInput.desiredRole} onChange={e => setCareerInput(p => ({ ...p, desiredRole: e.target.value }))} placeholder="e.g., Product Manager in Tech" className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1.5 focus:ring-1 focus:ring-slate-500 focus:outline-none" required />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400">Your Key Skills</label>
                                <textarea value={careerInput.skills} onChange={e => setCareerInput(p => ({ ...p, skills: e.target.value }))} placeholder="List your current skills..." rows={3} className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1.5 focus:ring-1 focus:ring-slate-500 focus:outline-none" required />
                            </div>
                             {error && <p className="text-rose-400 text-center text-sm">{error}</p>}
                            <div className="flex gap-2">
                                <button type="button" onClick={() => setView('reflection')} className="w-1/3 bg-slate-700 text-white font-bold py-2.5 px-4 rounded-md hover:bg-slate-600 transition-colors">Back</button>
                                <button type="submit" className="w-2/3 bg-slate-200 text-black font-bold py-2.5 px-4 rounded-md hover:bg-white transition-colors">Generate Roadmap</button>
                            </div>
                        </form>
                    </div>
                );
            case 'strategistOutput':
                if (isEditingPlan) {
                    return (
                        <div className="w-full h-full flex flex-col animate-fade-in">
                            <h3 className="text-xl font-bold text-slate-200 text-center mb-2">Edit Your Roadmap</h3>
                            <textarea 
                                value={tempPlanText}
                                onChange={(e) => setTempPlanText(e.target.value)}
                                className="flex-grow bg-slate-900 border border-slate-700 rounded-md p-3 text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm resize-none"
                            />
                            <div className="flex gap-2 mt-4">
                                <button onClick={() => setIsEditingPlan(false)} className="w-1/2 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-md transition-colors">Cancel</button>
                                <button onClick={handleSavePlan} className="w-1/2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-md transition-colors">Save Changes</button>
                            </div>
                        </div>
                    );
                }

                const sections = careerPlan.split('### ').slice(1);
                return (
                    <div className="w-full h-full flex flex-col animate-fade-in">
                        <h3 className="text-xl font-bold text-slate-200 text-center mb-2">Your Career Constellation</h3>
                        <div className="flex-grow bg-slate-900/50 border border-slate-700 rounded-lg overflow-y-auto">
                            {sections.map((section, index) => {
                                const [title, ...content] = section.split('\n');
                                return (
                                    <Accordion key={index} title={title.trim()}>
                                        <div className="prose prose-sm prose-invert max-w-none prose-p:text-slate-300 prose-li:text-slate-300 prose-strong:text-slate-100" dangerouslySetInnerHTML={{ __html: content.join('<br />') }} />
                                    </Accordion>
                                );
                            })}
                        </div>
                        <div className="mt-4 flex flex-col gap-2">
                            <div className="flex gap-2">
                                <button onClick={handleEditPlan} className="w-1/2 bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-500 transition-colors text-sm">Edit Text</button>
                                <button onClick={handleDeletePlan} className="w-1/2 bg-rose-600 text-white font-bold py-2 px-4 rounded-md hover:bg-rose-500 transition-colors text-sm">Delete Roadmap</button>
                            </div>
                            <button onClick={() => setView('strategistInput')} className="w-full bg-slate-700 text-white font-bold py-2 px-4 rounded-md hover:bg-slate-600 transition-colors text-sm">Start Over</button>
                        </div>
                    </div>
                );
            case 'reflection':
            default:
                return (
                    <>
                        <div className="text-center">
                            <h3 className="font-bold text-xl text-slate-200">Yearly Review Reflection</h3>
                            <p className="text-sm text-slate-400 italic">"Reap the radiance of retrospection, illuminating infinities unborn."</p>
                        </div>
                        <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-4">
                            <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-3 p-2 bg-black/30 rounded-lg overflow-y-auto max-h-[300px] md:max-h-full">
                                {reflections.map(r => (
                                    <div key={r.id} className={`reflection-card group relative p-3 rounded-md text-slate-900 font-semibold text-sm cursor-pointer h-24 flex items-center justify-center text-center ${r.type === 'triumph' ? 'metallic-mirror-triumph' : 'metallic-mirror-trail'} ${r.isNew ? 'is-new' : ''}`}>
                                        {r.text}
                                        <button 
                                            onClick={(e) => handleDeleteReflection(r.id, e)}
                                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-black/50 hover:bg-rose-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs transition-all"
                                            aria-label="Delete reflection"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="md:col-span-4 flex flex-col justify-between items-center p-3 bg-black/30 rounded-lg">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-300 mb-4 text-center">Data Dances</h4>
                                    <div className="flex items-end gap-6 h-32">
                                        <div className="flex flex-col items-center"><div className="chart-bar w-8 bg-amber-400 rounded-t-sm" style={{height: `${triumphHeight}%`}}></div><p className="text-xs mt-1 text-amber-300">Triumphs</p><p className="font-bold text-amber-200">{triumphCount}</p></div>
                                        <div className="flex flex-col items-center"><div className="chart-bar w-8 bg-slate-400 rounded-t-sm" style={{height: `${trailHeight}%`}}></div><p className="text-xs mt-1 text-slate-300">Trails</p><p className="font-bold text-slate-200">{trailCount}</p></div>
                                    </div>
                                </div>
                                <button onClick={() => setView('strategistInput')} className="w-full bg-indigo-600 text-white font-bold py-2 px-3 rounded-md hover:bg-indigo-500 transition-colors text-sm mt-4">Chart Career Path ✨</button>
                            </div>
                        </div>
                        <div className="border-t border-slate-700 pt-3">
                            <form onSubmit={handleReflectionSubmit} className="flex gap-2">
                                <input type="text" placeholder="Input year-end echoes (e.g., 'Missed Milan?')" value={userInput} onChange={(e) => setUserInput(e.target.value)} className="bg-slate-800 border border-slate-600 rounded-md py-1.5 px-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 flex-grow" />
                                <button type="submit" className="bg-slate-200 text-black font-bold py-1.5 px-4 rounded-md hover:bg-white transition-colors">Weave</button>
                            </form>
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="w-full flex flex-col gap-4 p-4 bg-slate-900/40 rounded-2xl min-h-[500px] border border-slate-700">
            {renderContent()}
        </div>
    );
};

const NotesNexusVisual = () => {
    type Note = {
        id: number;
        text: string;
        x: number;
        y: number;
        connections: number[];
        isNew?: boolean;
        media?: { type: 'image' | 'sketch'; content: string; };
    };
    type DragState = { id: number; offsetX: number; offsetY: number; } | null;
    
    const placeholderSketch = `<svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg" class="animated-sketch w-full h-full"><path d="M 10 40 C 20 10, 40 10, 50 40 S 80 70, 90 40" stroke="white" fill="none" stroke-width="2"/><path d="M 20 30 Q 50 5, 80 30" stroke="#a78bfa" fill="none" stroke-width="1.5"/><circle cx="10" cy="40" r="3" fill="#a78bfa"/><circle cx="50" cy="40" r="4" fill="white"/><circle cx="90" cy="40" r="3" fill="#a78bfa"/><circle cx="20" cy="30" r="2" fill="white"/><circle cx="80" cy="30" r="2" fill="white"/></svg>`;

    const initialNotes: Note[] = [
        { id: 1, text: "Podcast pivot idea", x: 20, y: 30, connections: [2], media: { type: 'sketch', content: placeholderSketch } },
        { id: 2, text: "Q4 Summit Event", x: 60, y: 50, connections: [] },
        { id: 3, text: "Vision: New Empire", x: 40, y: 70, connections: [1, 2] },
    ];
    
    const [notes, setNotes] = useState<Note[]>(initialNotes);
    const [userInput, setUserInput] = useState('');
    const [dragging, setDragging] = useState<DragState>(null);
    const nexusRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const activeNoteIdRef = useRef<number | null>(null);

    const handleAddNote = (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim()) return;
        
        const newNote: Note = {
            id: Date.now(),
            text: userInput,
            x: Math.random() * 60 + 20,
            y: Math.random() * 60 + 20,
            connections: notes.length > 0 ? [notes[Math.floor(Math.random() * notes.length)].id] : [],
            isNew: true
        };
        setNotes(prev => [...prev, newNote]);
        setUserInput('');
        setTimeout(() => {
            setNotes(prev => prev.map(n => n.id === newNote.id ? { ...n, isNew: false } : n));
        }, 1000);
    };

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (dragging) {
            const rect = nexusRef.current!.getBoundingClientRect();
            const x = ((e.clientX - rect.left - dragging.offsetX) / rect.width) * 100;
            const y = ((e.clientY - rect.top - dragging.offsetY) / rect.height) * 100;
            setNotes(n => n.map(note => note.id === dragging.id ? { ...note, x: Math.max(0, Math.min(85, x)), y: Math.max(0, Math.min(85, y)) } : note));
        }
    };
    
    const handleMouseUp = () => setDragging(null);

    const getNoteCenter = (note: Note) => {
        const rect = nexusRef.current?.getBoundingClientRect();
        if (!rect) return { x: 0, y: 0 };
        const noteWidth = rect.width * 0.15;
        const noteHeight = note.media ? 140 : 60; // Approximate height in pixels
        return {
            x: (note.x / 100) * rect.width + (noteWidth / 2),
            y: (note.y / 100) * rect.height + (noteHeight / 2)
        };
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        const noteId = activeNoteIdRef.current;
        if (file && noteId) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    const newMedia = { type: 'image' as const, content: event.target.result as string };
                    setNotes(prev => prev.map(n => n.id === noteId ? { ...n, media: newMedia } : n));
                }
            };
            reader.readAsDataURL(file);
        }
        if(e.target) e.target.value = ''; // Allow re-uploading the same file
        activeNoteIdRef.current = null;
    };
    
    const addAiSketch = (noteId: number) => {
        const newMedia = { type: 'sketch' as const, content: placeholderSketch };
        setNotes(prev => prev.map(n => n.id === noteId ? { ...n, media: newMedia } : n));
    };

    return (
        <div className="w-full flex flex-col gap-4 p-4 bg-black/20 rounded-2xl min-h-[500px]">
             <div className="text-center">
                <h3 className="font-bold text-xl text-slate-200">Notes Pages Nexus</h3>
                <p className="text-sm text-slate-400 italic">"Transmute mental maelstroms into masterpieces, notes as neural nexuses of your narrative."</p>
            </div>
            
            <div
                ref={nexusRef}
                className="flex-grow w-full border border-slate-800 rounded-lg relative nexus-bg"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                {/* Connection Lines */}
                 <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
                    {notes.map(note => {
                        const start = getNoteCenter(note);
                        return note.connections.map(connId => {
                            const endNote = notes.find(n => n.id === connId);
                            if (!endNote) return null;
                            const end = getNoteCenter(endNote);
                            return <line key={`${note.id}-${connId}`} x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="rgba(167, 139, 250, 0.3)" strokeWidth="2" />;
                        });
                    })}
                </svg>

                {/* Notes */}
                {notes.map(note => (
                    <div
                        key={note.id}
                        className={`note-memo absolute p-3 rounded-lg text-white text-sm cursor-grab active:cursor-grabbing w-[15%] min-w-[120px] flex flex-col ${note.isNew ? 'is-new' : ''} metallic-memo group`}
                        style={{ left: `${note.x}%`, top: `${note.y}%`, zIndex: dragging?.id === note.id ? 10 : 1 }}
                        onMouseDown={(e) => {
                             if ((e.target as HTMLElement).closest('button')) return; // prevent drag on button click
                            const rect = e.currentTarget.getBoundingClientRect();
                            setDragging({ id: note.id, offsetX: e.clientX - rect.left, offsetY: e.clientY - rect.top });
                        }}
                    >
                         <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <button onClick={() => { activeNoteIdRef.current = note.id; fileInputRef.current?.click(); }} title="Add Image" className="w-5 h-5 bg-slate-600 rounded p-0.5 hover:bg-slate-500 text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            </button>
                            <button onClick={() => addAiSketch(note.id)} title="Generate AI Sketch" className="w-5 h-5 bg-slate-600 rounded p-0.5 hover:bg-slate-500 text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 12l-2.293-2.293a1 1 0 010-1.414L10 6m5 4l2.293 2.293a1 1 0 010 1.414L12 18l-2.293-2.293a1 1 0 010-1.414L12 12m5-4h.01M17 17h.01"></path></svg>
                            </button>
                        </div>
                        {note.media && (
                            <div className="mb-2 h-24 rounded-md overflow-hidden bg-black/30">
                                {note.media.type === 'image' && <img src={note.media.content} alt={note.text} className="w-full h-full object-cover" loading="lazy" />}
                                {note.media.type === 'sketch' && <div className="w-full h-full p-1" dangerouslySetInnerHTML={{ __html: note.media.content }} />}
                            </div>
                        )}
                        <div className="flex-grow">{note.text}</div>
                    </div>
                ))}
            </div>

            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" aria-hidden="true" />
            
            <div className="border-t border-slate-800 pt-3">
                 <form onSubmit={handleAddNote} className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Scribble a spark..."
                        value={userInput}
                        onChange={e => setUserInput(e.target.value)}
                        className="bg-slate-800 border border-slate-700 rounded-md py-1.5 px-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 flex-grow"
                    />
                    <button type="submit" className="bg-violet-500 text-white font-bold py-1.5 px-4 rounded-md hover:bg-violet-400 transition-colors">Nexus</button>
                </form>
            </div>
        </div>
    );
};

const ReadingListVisual = () => {
    type Book = {
        id: number;
        title: string;
        author: string;
        cover: string;
        progress: number;
        affinity: string;
    };

    const initialBooks: Book[] = [
        { id: 1, title: 'The Alchemist', author: 'Paulo Coelho', cover: 'https://picsum.photos/seed/alchemist/400/600', progress: 75, affinity: 'Journey' },
        { id: 2, title: 'Sapiens', author: 'Yuval Noah Harari', cover: 'https://picsum.photos/seed/sapiens/400/600', progress: 20, affinity: 'Legacy Lore' },
        { id: 3, title: 'Atomic Habits', author: 'James Clear', cover: 'https://picsum.photos/seed/habits/400/600', progress: 100, affinity: 'Productivity' },
        { id: 4, title: 'Dune', author: 'Frank Herbert', cover: 'https://picsum.photos/seed/dune/400/600', progress: 10, affinity: 'Vision' },
    ];

    const aiSuggestions = [
        { title: 'Meditations', author: 'Marcus Aurelius', affinity: 'Wellness' },
        { title: 'The War of Art', author: 'Steven Pressfield', affinity: 'Career' },
    ];

    const [books, setBooks] = useState<Book[]>(initialBooks);
    const [activeIndex, setActiveIndex] = useState(1);
    const [newBookTitle, setNewBookTitle] = useState('');
    const [showConfetti, setShowConfetti] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [fetchedBook, setFetchedBook] = useState<{ title: string; author: string; affinity: string; } | null>(null);
    const [fetchError, setFetchError] = useState('');

    

    const handleProgressChange = (id: number, newProgress: number) => {
        setBooks(prev => prev.map(book => {
            if (book.id === id) {
                if (book.progress < 100 && newProgress >= 100) {
                    setShowConfetti(true);
                    setTimeout(() => setShowConfetti(false), 3000);
                }
                return { ...book, progress: newProgress };
            }
            return book;
        }));
    };

    const handleAddBook = (title: string, author: string, affinity: string) => {
        if (!title.trim()) return;
        const newBook: Book = {
            id: Date.now(),
            title,
            author,
            cover: `https://picsum.photos/seed/${title.toLowerCase().replace(/\s/g, '-')}/400/600`,
            progress: 0,
            affinity,
        };
        setBooks(prev => [...prev, newBook]);
        setActiveIndex(books.length);
    };

    const handleSearchBook = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedTitle = newBookTitle.trim();
        if (!trimmedTitle) return;

        setIsFetching(true);
        setFetchError('');
        setFetchedBook(null);

        const affinities = ['Journey', 'Legacy Lore', 'Productivity', 'Vision', 'Wellness', 'Career', 'Philosophy', 'Creativity', 'Science Fiction', 'History'];
        const prompt = `
            For the book titled "${trimmedTitle}", please provide the author's full name. 
            Also, from the following list, select the single most fitting "affinity" category for this book: ${affinities.join(', ')}.
        `;
        
        try {
            const response = await generateContent({
                model: "gemini-3.8-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: "OBJECT",
                        properties: {
                            author: {
                                type: "STRING",
                                description: "The full name of the book's author."
                            },
                            affinity: {
                                type: "STRING",
                                description: `The single most relevant category from the provided list.`
                            }
                        },
                        required: ["author", "affinity"]
                    }
                }
            });

            const jsonString = response.text.trim();
            const bookData = JSON.parse(jsonString);

            if (bookData.author && bookData.affinity) {
                 setFetchedBook({
                    title: trimmedTitle,
                    author: bookData.author,
                    affinity: bookData.affinity,
                });
            } else {
                throw new Error("Invalid data format received from AI.");
            }

        } catch (err) {
            console.error(err);
            setFetchError("The Oracle couldn't find that tome. Please check the title.");
        } finally {
            setIsFetching(false);
        }
    };

    const confirmAddBook = () => {
        if (fetchedBook) {
            handleAddBook(fetchedBook.title, fetchedBook.author, fetchedBook.affinity);
            setFetchedBook(null);
            setNewBookTitle(''); 
        }
    };
    
    const cancelAddBook = () => {
        setFetchedBook(null);
    };
    
    const activeBook = books[activeIndex];

    return (
        <div className="w-full flex flex-col items-center justify-center gap-4 p-4 min-h-[500px] overflow-hidden">
            <div className="text-center">
                 <h3 className="font-bold text-xl text-slate-200">Labyrinth of Leather-Bound Lore</h3>
                 <p className="text-sm text-slate-400 italic">"Ingest infinities attuned to your odyssey, a library luminous with latent lore."</p>
            </div>

            {/* Carousel */}
            <div className="h-60 w-full relative" style={{ perspective: '1000px' }}>
                {books.map((book, i) => {
                    const offset = i - activeIndex;
                    const isActive = offset === 0;
                    const transform = `rotateY(${offset * -25}deg) translateX(${offset * 25}%) scale(${isActive ? 1 : 0.7})`;
                    const zIndex = books.length - Math.abs(offset);
                    return (
                        <div
                            key={book.id}
                            className={`absolute top-0 left-0 right-0 mx-auto w-36 h-56 rounded-lg cursor-pointer transition-transform duration-500 ease-out shadow-lg ${isActive ? 'is-active' : ''}`}
                            style={{ transform, zIndex, boxShadow: '0 10px 20px rgba(0,0,0,0.4), inset 0 0 10px rgba(0,0,0,0.5)' }}
                            onClick={() => setActiveIndex(i)}
                        >
                            <img src={book.cover} alt={book.title} className={`w-full h-full object-cover rounded-lg transition-all duration-300 ${isActive ? 'brightness-100' : 'brightness-75'}`} loading="lazy" />
                        </div>
                    );
                })}
            </div>

            {/* Active Book Details */}
            {activeBook && (
                <div className="active-tome-oracle w-full max-w-sm text-center bg-slate-900/50 p-4 rounded-xl border border-slate-700 relative">
                    {showConfetti && Array.from({ length: 50 }).map((_, i) => {
                        const colors = ['#fde047', '#f97316', '#ec4899', '#8b5cf6'];
                        return <div key={i} className="confetti-piece" style={{ left: `${Math.random() * 100}%`, backgroundColor: colors[i % 4], animationDelay: `${Math.random() * 2}s` }}></div>
                    })}
                    <h4 className="font-bold text-lg text-slate-100">{activeBook.title}</h4>
                    <p className="text-sm text-slate-400 mb-2">{activeBook.author}</p>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-mono text-slate-500">0%</span>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={activeBook.progress}
                            onChange={(e) => handleProgressChange(activeBook.id, parseInt(e.target.value))}
                            className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:bg-slate-300 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none"
                            aria-label="Reading progress"
                        />
                        <span className="text-xs font-mono text-slate-500">100%</span>
                    </div>
                     <div className="flex justify-between items-center text-xs text-slate-400">
                        <span>Progress Phantom: {activeBook.progress}%</span>
                         <span className="bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">{activeBook.affinity}</span>
                    </div>
                </div>
            )}
            
            {/* Controls and AI Suggestions */}
            <div className="w-full max-w-sm text-center space-y-3">
                 <form onSubmit={handleSearchBook} className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Inscribe Your Intellectual Incantations..."
                        value={newBookTitle}
                        onChange={(e) => setNewBookTitle(e.target.value)}
                        disabled={isFetching}
                        className="bg-slate-800 border border-slate-700 rounded-md py-1.5 px-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 flex-grow disabled:opacity-50"
                    />
                    <button type="submit" disabled={isFetching} className="bg-slate-200 text-black font-bold py-1.5 px-4 rounded-md hover:bg-white transition-colors disabled:bg-slate-500 disabled:cursor-not-allowed">
                        {isFetching ? '...' : 'Add'}
                    </button>
                </form>
                {fetchError && !fetchedBook && <p className="text-sm text-rose-400 mt-2">{fetchError}</p>}
                <div className="text-xs text-slate-500 flex items-center justify-center gap-2">
                     <span>AI Oracles Suggest:</span>
                     {aiSuggestions.map(sugg => (
                        <button key={sugg.title} onClick={() => handleAddBook(sugg.title, sugg.author, sugg.affinity)} className="bg-slate-700/80 text-slate-300 py-1 px-2 rounded-full hover:bg-slate-600 transition-colors">{sugg.title}</button>
                    ))}
                </div>
            </div>

            {/* Confirmation Modal */}
            {fetchedBook && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center" onClick={cancelAddBook}>
                    <div className="active-tome-oracle bg-slate-900 border border-slate-700 rounded-xl p-6 w-11/12 max-w-sm text-center" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-slate-200 mb-2">Is this your tome?</h3>
                        <img src={`https://picsum.photos/seed/${fetchedBook.title.toLowerCase().replace(/\s/g, '-')}/400/600`} alt={fetchedBook.title} className="w-24 h-36 object-cover rounded-md mx-auto mb-4 shadow-lg" loading="lazy" />
                        <p className="font-bold text-white">{fetchedBook.title}</p>
                        <p className="text-sm text-slate-400">by {fetchedBook.author}</p>
                        <p className="text-xs text-slate-500 mt-2">Suggested Affinity: <span className="bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">{fetchedBook.affinity}</span></p>
                        <div className="flex gap-4 mt-6">
                            <button onClick={cancelAddBook} className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 rounded-md transition-colors">Cancel</button>
                            <button onClick={confirmAddBook} className="w-full bg-slate-200 hover:bg-white text-black font-bold py-2 rounded-md transition-colors">Confirm & Add</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


export const FeatureContent = [
    {
        id: 'budget-tracker-frame',
        title: "12-Month Budget Tracker",
        description: "Turn your budget from a chore into a story of success. Enter your financial details, and our AI oracle will create a personalized plan to grow your wealth, showing you what's possible with dynamic simulations.",
        visual: <BudgetAlchemyVisual />,
        icon: <BudgetIcon />,
    },
    {
        id: 'planner-window',
        title: "48-Week Planner",
        description: "Design your perfect week, every week. Turn your routines into powerful rituals, build momentum by tracking your habits, and approach each day with clear intention.",
        visual: <PlannerVisual />,
        icon: <PlannerIcon />,
    },
    {
        id: 'events-calendar-chamber',
        title: "Events Calendar Chamber",
        description: "Bring order to your busy schedule. Our smart calendar organizes your events into a clear, intuitive map, helping you manage your time and reflect on important moments.",
        visual: <EventsCalendarVisual />,
        icon: <EventIcon />,
    },
    {
        id: 'reading-list-library',
        title: "Reading List Library",
        description: "Build your personal library of wisdom. Our interactive reading list lets you track what you've read, log your progress, and get smart, AI-powered suggestions for what to read next.",
        visual: <ReadingListVisual />,
        icon: <ReadingIcon />,
    },
    {
        id: 'self-care-sanctuary',
        title: "Self-Care Checklist Sanctuary",
        description: "Find balance on your path to success. Our sanctuary helps you create and track meaningful self-care rituals, ensuring you stay renewed and refreshed as you strive.",
        visual: <SelfCareVisual />,
        icon: <SelfCareIcon />,
    },
    {
        id: 'master-timeline-portal',
        title: "Master Timeline Portal",
        description: "See your whole year come to life. Our living timeline intelligently organizes your goals, projects, and personal milestones, helping you see how everything fits together.",
        visual: <TimelineVisual />,
        icon: <TimelineIcon />,
    },
    {
        id: 'dream-inventory-gateway',
        title: "Dream Inventory Gateway",
        description: "Don't just dream—achieve. Our Aspiration Arsenal helps you capture all your big ideas, track your progress visually, and even provides sparks of inspiration when you need them.",
        visual: <DreamInventoryVisual />,
        icon: <DreamIcon />,
    },
    {
        id: 'vision-board-realm',
        title: "Vision Board Realm",
        description: "Create a powerful vision for your future. Our digital dream-dome lets you build a beautiful vision board, connect your dreams to your plans, and keep your inspiration front and center.",
        visual: <VisionBoardVisual />,
        icon: <VisionBoardIcon />,
    },
    {
        id: 'notes-pages-nexus',
        title: "Notes Pages Nexus",
        description: "Connect your thoughts in a whole new way. Here, your notes, sketches, and ideas are intelligently linked, helping you find clarity in the chaos and uncover your next big idea.",
        visual: <NotesNexusVisual />,
        icon: <NotesIcon />,
    },
    {
        id: 'yearly-review-reflection',
        title: "Yearly Review Reflection",
        description: "Look back to leap forward. This tool helps you reflect on your year's wins and challenges, using AI insights to turn your experiences into a clear roadmap for what's next.",
        visual: <YearlyReviewVisual />,
        icon: <ReviewIcon />,
    },
];
