import { usePortfolioData } from './PortfolioDataProvider';
import { useSearch } from '../App';

import React, { useState, useEffect, useRef, DragEvent, FC, MouseEvent, ChangeEvent } from 'react';
import { GearIcon, CheckCircleIcon, HammerWandIcon, MapPinIcon, GlobeAltIcon, ArrowLongRightIcon, EnvelopeIcon, HeartIcon, UsersIcon, ArrowPathIcon, SparklesIcon, MenuIcon, CloseIcon, InstagramIcon, LinkedInIcon, TelegramIcon, YouTubeIcon, TikTokIcon } from './IconComponents';
import type { View, ProfileData, ConnectLink } from '../types';
import { Season } from '../types';

// --- Custom Hooks ---
const useCountUp = (end: number, duration = 1500) => {
    const [count, setCount] = useState(0);
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);

    useEffect(() => {
        let frame = 0;
        const counter = setInterval(() => {
            frame++;
            const progress = (frame / totalFrames) ** 2; // Ease out
            const currentCount = Math.round(end * progress);
            setCount(currentCount);

            if (frame === totalFrames) {
                clearInterval(counter);
                setCount(end); 
            }
        }, frameRate);
        return () => clearInterval(counter);
    }, [end, duration]);

    return count;
};

// --- Profile Modal Component ---
const ProfileModal: FC<{ isOpen: boolean; onClose: () => void; season: Season; }> = ({ isOpen, onClose, season }) => { const portfolioData = usePortfolioData();
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [profilePic, setProfilePic] = useState<string>('');
    const [introState, setIntroState] = useState<'hidden' | 'gears' | 'blueprint' | 'content'>('hidden');
    const [isExiting, setIsExiting] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const seasonalClasses: Record<Season, string> = {
        [Season.Winter]: 'seasonal-bg-winter',
        [Season.Spring]: 'seasonal-bg-spring',
        [Season.Fall]: 'seasonal-bg-fall',
    };
    const activeSeasonClass = seasonalClasses[season];

    useEffect(() => { 
        if (portfolioData) { 
            setProfileData((portfolioData as any).profile); 
            const savedAvatar = localStorage.getItem('menkir_user_avatar');
            setProfilePic(savedAvatar || (portfolioData as any).profile.pictureUrl); 
        } 
    }, [portfolioData]);

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            setIsExiting(false);
            document.body.style.overflow = 'hidden';
            setIntroState('gears');
            const gearsTimer = setTimeout(() => setIntroState('blueprint'), 800);
            const blueprintTimer = setTimeout(() => setIntroState('content'), 1600);
            return () => {
                clearTimeout(gearsTimer);
                clearTimeout(blueprintTimer);
            };
        } else {
             document.body.style.overflow = 'auto';
        }
    }, [isOpen]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            onClose();
            setIsExiting(false);
            setIntroState('hidden');
        }, 300);
    };

    const handleDragOver = (e: DragEvent) => e.preventDefault();
    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const dataUrl = event.target?.result as string;
                setProfilePic(dataUrl);
                localStorage.setItem('menkir_user_avatar', dataUrl);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const dataUrl = event.target?.result as string;
                setProfilePic(dataUrl);
                localStorage.setItem('menkir_user_avatar', dataUrl);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfilePicClick = () => {
        fileInputRef.current?.click();
    };

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        const { clientX, clientY, currentTarget } = e;
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        setMousePos({ x: (clientX - left) / width, y: (clientY - top) / height });
    };
    
    const Stat: FC<{ icon: React.ReactNode; value: number; label: string; tooltip: string; }> = ({ icon, value, label, tooltip }) => {
        const count = useCountUp(value);
        return (
            <div className="group relative stat-orb text-center bg-slate-800/70 p-2 rounded-full">
                <div className="text-slate-400">{icon}</div>
                <div className="stat-value text-xl font-bold text-gray-100">{count.toLocaleString()}</div>
                <p className="text-xs text-gray-400">{label}</p>
                <div className="absolute bottom-full mb-2 w-max bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">{tooltip}</div>
            </div>
        );
    };
    
    if (!isOpen && !isExiting) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-[100] flex justify-end"
            onClick={handleClose}
            role="dialog" aria-modal="true"
        >
            <div
                className={`w-full max-w-2xl h-full bg-black shadow-2xl text-gray-200 ${isExiting ? 'profile-modal-slide-out' : 'profile-modal-slide-in'}`}
                style={{ '--mouse-x': mousePos.x, '--mouse-y': mousePos.y } as React.CSSProperties}
                onClick={e => e.stopPropagation()}
                onMouseMove={handleMouseMove}
            >
                <div className="h-full w-full relative overflow-hidden">
                    <div className={`absolute inset-0 transition-all duration-500 ease-out ${activeSeasonClass}`} style={{ transform: `translate(${(0.5 - mousePos.x) * 15}px, ${(0.5 - mousePos.y) * 15}px) scale(1.05)` }}></div>

                    {introState !== 'content' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black z-20">
                           {introState === 'gears' && (
                               <div className="relative flex items-center justify-center" style={{animation: 'gears-grind 0.8s ease-out forwards'}}>
                                   <div className="text-slate-400 animate-spin" style={{ animationDuration: '4s' }}>
                                       <GearIcon size={160} />
                                   </div>
                                   <div className="absolute w-20 h-20 rounded-full overflow-hidden border-2 border-slate-700 bg-black shadow-[0_0_20px_rgba(229,9,20,0.4)]">
                                       <img src={profilePic || '/profile.webp'} alt="Menkir Wolde" className="w-full h-full object-cover" referrerPolicy="no-referrer" width="80" height="80" />
                                   </div>
                               </div>
                           )}
                           {introState === 'blueprint' && <div className="w-4/5 h-4/5 border-2 border-teal-500 rounded-lg p-4" style={{animation: 'blueprint-unroll 0.8s steps(10, end) forwards'}}><p className="text-teal-500 font-mono">LOADING_PROFILE.SCHEMATIC...</p></div>}
                        </div>
                    )}

                    {profileData && (
                        <div className={`h-full flex flex-col p-6 transition-opacity duration-500 backdrop-blur-sm bg-black/50 netflix-modal-bg overflow-y-auto ${introState === 'content' ? 'opacity-100' : 'opacity-0'}`}>
                            <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-white z-10">&times;</button>
                            {/* Header */}
                            <div className="text-center mb-6 flex-shrink-0">
                                <div onClick={handleProfilePicClick} onDragOver={handleDragOver} onDrop={handleDrop} className="profile-pic-glow relative w-32 h-32 mx-auto rounded-full border-4 border-slate-700 shadow-lg group cursor-pointer" title="Click or drag & drop an image">
                                    <img src={profilePic} alt="Menkir Wolde" className="w-full h-full object-cover rounded-full" width="128" height="128" />
                                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="text-xs font-bold">Change</p>
                                    </div>
                                    <div className="pro-badge absolute -bottom-1 -right-1 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full shadow-md transform -rotate-12 cursor-pointer group">
                                        PR<span className="relative">O<div className="emoji-toolbox absolute bottom-full left-1/2 -translate-x-1/2 mb-1 flex gap-1 bg-white p-1 rounded-full shadow-lg opacity-0 transform-gpu transition-all duration-300 scale-90 -translate-y-2"><span className="cursor-pointer">😂</span><span className="cursor-pointer">😎</span><span className="cursor-pointer">🚀</span></div></span>
                                    </div>
                                </div>
                                <h2 className="text-2xl font-bold mt-4">{profileData.name}</h2>
                                <div className="group relative inline-flex items-center gap-2 mt-1 text-green-500 font-semibold cursor-pointer">
                                    <span className="relative flex h-3 w-3"><span className="status-dot-available absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-green-600"></span></span>
                                    {profileData.status}
                                    <div className="absolute bottom-full mb-2 w-max bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">Snag me quick—before I blueprint my escape to Bali.</div>
                                </div>
                            </div>
                            
                            {/* Info */}
                            <div className="space-y-3 mb-6 text-sm flex-shrink-0">
                                <div className="group relative flex items-center gap-3 info-icon"><span className="text-slate-400"><CheckCircleIcon /></span> {profileData.availability} <div className="absolute left-8 bottom-full mb-1 w-max bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">Freelance: Hit-and-run heroics. Fulltime: Your loyal sidekick with benefits.</div></div>
                                <div className="flex items-center gap-3 info-icon"><span className="text-slate-400"><HammerWandIcon /></span> {profileData.roles}</div>
                                <a href={profileData.locationUrl} target="_blank" rel="noopener noreferrer" className="group relative flex items-center gap-3 info-icon"><span className="text-slate-400"><MapPinIcon /></span> {profileData.location}<div className="absolute left-8 bottom-full mb-1 w-max bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">Sheger's sunny vibes: Where coffee fuels code and concrete dreams collide.</div></a>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-center gap-4 mb-8 flex-shrink-0">
                                <button className="follow-btn animate-relay-1 group relative bg-red-600 text-white font-bold py-2 px-6 rounded-full flex items-center gap-2 hover:bg-red-700 transition-colors"><div className="absolute bottom-full mb-2 w-max bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">Trail my triumphs—guaranteed no plot spoilers!</div>Follow <ArrowLongRightIcon className="w-5 h-5 follow-btn-arrow" /></button>
                                <button className="message-btn animate-relay-2 group relative border-2 border-slate-600 text-slate-300 font-bold py-2 px-6 rounded-full flex items-center gap-2 hover:bg-slate-700/50 transition-colors"><div className="absolute bottom-full mb-2 w-max bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">Drop a line; I'll reply faster than rebar sets.</div><EnvelopeIcon className="w-5 h-5 message-btn-envelope" /> Message</button>
                            </div>
                            
                            {/* Hire Me */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 flex-shrink-0">
                                <div className="hire-card relative bg-slate-900/70 border-2 border-slate-800 rounded-lg p-4 text-center">
                                    <div className="now-badge absolute -top-2 -left-2 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full transform -rotate-12">Now</div>
                                    <h4 className="font-bold text-lg text-gray-200">Freelance/Project</h4>
                                    <p className="text-xs text-gray-400">Dive Deeper &rarr;</p>
                                </div>
                                <div className="hire-card relative bg-slate-900/70 border-2 border-slate-800 rounded-lg p-4 text-center">
                                    <h4 className="font-bold text-lg text-gray-200">Full Time Job</h4>
                                    <p className="text-xs text-gray-400 flex items-center justify-center gap-1">Willing to Relocate <GlobeAltIcon/></p>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-auto flex-shrink-0">
                                <Stat icon={<SparklesIcon />} value={profileData.stats.views} label="Project Views" tooltip="Each view is a potential 'aha!' moment." />
                                <Stat icon={<HeartIcon />} value={profileData.stats.appreciations} label="Appreciations" tooltip="Pixel hugs incoming!" />
                                <Stat icon={<UsersIcon />} value={profileData.stats.followers} label="Followers" tooltip="Our book club reads blueprints." />
                                <Stat icon={<ArrowPathIcon />} value={profileData.stats.following} label="Following" tooltip="The dream team I double-tap daily." />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Enhanced Navigation Component ---
const CategoryNav: FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
        <div 
            className="relative group h-full flex items-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <button 
                className={`
                    relative px-4 py-1.5 text-sm font-bold rounded-full transition-all duration-300 border
                    ${isHovered 
                        ? 'bg-slate-100 text-black shadow-[0_0_10px_rgba(255,255,255,0.5)] border-white scale-105' 
                        : 'text-slate-400 hover:text-slate-200 border-slate-800 bg-slate-900/50'
                    }
                `}
            >
                {title}
            </button>

            <div className={`
                absolute top-full left-0 pt-4 w-48 z-50
                transition-all duration-300 origin-top-left
                ${isHovered ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}
            `}>
                <div className="bg-[#0d1117] border border-slate-800 rounded-xl p-2 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-800/20 to-transparent pointer-events-none" />
                    <div className="relative flex flex-col gap-1">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

const CategoryItem: FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
    <button 
        onClick={onClick}
        className="text-left px-3 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 flex items-center gap-2 group/item"
    >
        <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover/item:bg-red-500 transition-colors shadow-sm" />
        {children}
    </button>
);

const SidebarLink: FC<{ href?: string; onClick?: () => void; children: React.ReactNode; target?: string; rel?: string }> = ({ href = "#", onClick, children, target, rel }) => (
    <a href={href} onClick={onClick} target={target} rel={rel} className="block py-2 text-sm text-slate-400 hover:text-white">
        {children}
    </a>
);


// --- Header Component ---
export const Header: React.FC<{ setView: (view: View) => void, season: Season, currentView?: View }> = ({ setView, season, currentView = 'portfolio' }) => { 
    const portfolioData = usePortfolioData();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isSettingsPopoverOpen, setSettingsPopoverOpen] = useState(false);
    const [isProfileModalOpen, setProfileModalOpen] = useState(false);
    const [connectLinks, setConnectLinks] = useState<ConnectLink[]>([]);
    const [profilePic, setProfilePic] = useState<string>('');
    const sidebarRef = useRef<HTMLDivElement>(null);
    const settingsRef = useRef<HTMLDivElement>(null);

    const socialIconMap: Record<string, React.ReactNode> = {
        'instagram': <InstagramIcon className="w-5 h-5" />,
        'linkedin': <LinkedInIcon className="w-5 h-5" />,
        'telegram': <TelegramIcon className="w-5 h-5" />,
        'youtube': <YouTubeIcon className="w-5 h-5" />,
        'tiktok': <TikTokIcon className="w-5 h-5" />,
    };
    
    const socialHoverClasses: Record<string, string> = {
        'instagram': 'hover:bg-gradient-to-br from-pink-500 to-yellow-500 hover:shadow-[0_0_15px_rgba(236,72,153,0.6)]',
        'linkedin': 'hover:bg-blue-600 hover:shadow-[0_0_15px_rgba(59,130,246,0.6)]',
        'telegram': 'hover:bg-sky-500 hover:shadow-[0_0_15px_rgba(14,165,233,0.6)]',
        'youtube': 'hover:bg-red-600 hover:shadow-[0_0_15px_rgba(239,68,68,0.6)]',
        'tiktok': 'hover:bg-slate-700 hover:shadow-[0_0_15px_rgba(56,189,248,0.6)]',
    };

    useEffect(() => {
        if (portfolioData) {
            const socials = (portfolioData as any).connect.filter((c: ConnectLink) => ['instagram', 'linkedin', 'telegram', 'youtube', 'tiktok'].includes(c.id)); 
            setConnectLinks(socials); 
            if ((portfolioData as any).profile && (portfolioData as any).profile.pictureUrl) { 
                setProfilePic((portfolioData as any).profile.pictureUrl); 
            } 
        }

        const handleClickOutside = (event: globalThis.MouseEvent) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                setSidebarOpen(false);
            }
            if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
                setSettingsPopoverOpen(false);
            }
        };

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setSettingsPopoverOpen(false);
                setSidebarOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, []);

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
    const toggleSettingsPopover = () => setSettingsPopoverOpen(!isSettingsPopoverOpen);
    
    const { searchQuery, setSearchQuery } = useSearch();

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearchQuery(val);
        if (val.trim().length > 0) {
            setView('portfolio');
        }
    };

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-40 px-2.5 sm:px-6 md:px-8 py-2.5 sm:py-3.5 flex justify-between items-center gap-2 sm:gap-4 backdrop-blur-md bg-black/75 border-b border-white/10 transition-all duration-300">
                {/* Brand / Logo */}
                <div className="flex items-center gap-2 sm:gap-3.5 flex-shrink min-w-0">
                    <button 
                        onClick={() => setView('portfolio')} 
                        className="text-xl sm:text-2xl font-black tracking-tighter text-red-600 netflix-sans flex-shrink-0 cursor-pointer hover:scale-105 active:scale-95 transition-transform p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded"
                        aria-label="Menkir Wolde Portfolio Home"
                    >
                        MW
                    </button>

                    {/* Integrated Search Input */}
                    <div className="relative flex items-center min-w-0">
                        <svg className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input 
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search..."
                            className="w-24 xs:w-32 sm:w-48 md:w-60 focus:w-32 xs:focus:w-40 sm:focus:w-64 bg-slate-900/90 border border-slate-700/80 rounded-full py-1.5 pl-7 sm:pl-8 pr-6 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                            aria-label="Search portfolio"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-2 text-slate-400 hover:text-white p-0.5 rounded-full cursor-pointer focus-visible:ring-1 focus-visible:ring-red-500"
                                aria-label="Clear search"
                            >
                                <CloseIcon className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Desktop Primary Navigation */}
                <nav className="hidden lg:flex items-center gap-1 bg-slate-900/80 p-1 rounded-full border border-slate-800 backdrop-blur-md shadow-inner">
                    <button 
                        onClick={() => setView('portfolio')}
                        className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500 ${
                            currentView === 'portfolio' ? 'bg-red-600/20 text-white border border-red-500/40 shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                        }`}
                    >
                        Portfolio
                    </button>
                    <button 
                        onClick={() => setView('resume')}
                        className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500 ${
                            currentView === 'resume' ? 'bg-red-600/20 text-white border border-red-500/40 shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                        }`}
                    >
                        Resume
                    </button>
                    <button 
                        onClick={() => setView('design')}
                        className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500 ${
                            currentView === 'design' ? 'bg-red-600/20 text-white border border-red-500/40 shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                        }`}
                    >
                        CAD Spec
                    </button>
                    <button 
                        onClick={() => setView('interface')}
                        className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500 ${
                            currentView === 'interface' ? 'bg-red-600/20 text-white border border-red-500/40 shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                        }`}
                    >
                        Urban Mining
                    </button>
                    <button 
                        onClick={() => setView('photos')}
                        className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500 ${
                            currentView === 'photos' ? 'bg-red-600/20 text-white border border-red-500/40 shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                        }`}
                    >
                        Natural
                    </button>
                    <button 
                        onClick={() => setView('main')}
                        className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500 ${
                            currentView === 'main' ? 'bg-red-600/20 text-white border border-red-500/40 shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                        }`}
                    >
                        System
                    </button>
                </nav>

                {/* Right Actions & Utilities */}
                <div className="flex items-center space-x-3">
                    <div className="hidden md:flex items-center space-x-2 border-r border-slate-700 pr-3">
                        {connectLinks.map(link => (
                            <a
                                key={link.id}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={link.title}
                                className={`relative group w-8 h-8 flex items-center justify-center bg-slate-800/50 rounded-full text-slate-400 hover:text-white transition-all duration-300 ${socialHoverClasses[link.id] || ''}`}
                            >
                                {socialIconMap[link.id]}
                                <span className="absolute bottom-full mb-2 w-max bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                    {link.title}
                                </span>
                            </a>
                        ))}
                    </div>

                    <div ref={settingsRef} className="relative flex-shrink-0">
                        <button 
                            onClick={toggleSettingsPopover} 
                            className="group relative flex items-center justify-center p-1 rounded-full bg-slate-800/40 hover:bg-slate-800/80 transition-all duration-300 w-9 h-9 border border-slate-700/50 hover:border-red-500/50 cursor-pointer" 
                            aria-label="Open settings and profile"
                            aria-expanded={isSettingsPopoverOpen}
                        >
                            <div className="relative w-7 h-7 flex items-center justify-center">
                                <span className={`absolute text-slate-400 group-hover:text-white transition-all duration-500 ${isSettingsPopoverOpen ? 'rotate-90 text-red-500' : 'group-hover:rotate-45'}`}>
                                    <GearIcon size={28} />
                                </span>
                                <div className={`w-3.5 h-3.5 rounded-full overflow-hidden border border-slate-700 group-hover:border-red-500 transition-all duration-300 ${isSettingsPopoverOpen ? 'scale-110 border-red-500' : ''}`}>
                                    <img width="14" height="14" 
                                        src={profilePic || '/profile.webp'} 
                                        alt="Menkir Wolde" 
                                        className="w-full h-full object-cover" 
                                        referrerPolicy="no-referrer"
                                    />
                                </div>
                            </div>
                        </button>

                        {/* Dropdown/Popover visible while user occupies the setting state */}
                        {isSettingsPopoverOpen && (
                            <div className="absolute right-0 mt-3 w-[min(18rem,calc(100vw-24px))] bg-slate-950 border border-slate-800 rounded-xl shadow-2xl p-4 z-50 animate-fadeIn" style={{ animationDuration: '0.2s' }}>
                                <div className="absolute right-3.5 -top-1.5 w-3 h-3 bg-slate-950 border-t border-l border-slate-800 transform rotate-45"></div>
                                
                                <div className="flex flex-col items-center text-center">
                                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-slate-700 shadow-md mb-3">
                                        <img width="80" height="80" 
                                            src={profilePic || '/profile.webp'} 
                                            alt="Menkir Wolde" 
                                            className="w-full h-full object-cover"
                                            referrerPolicy="no-referrer"
                                        />
                                        <span className="absolute bottom-1 right-1 flex h-3.5 w-3.5">
                                            <span className="status-dot-available absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-500 border border-slate-950"></span>
                                        </span>
                                    </div>
                                    <h3 className="text-white font-bold text-base">Menkir Wolde</h3>
                                    <p className="text-[11px] text-red-500 font-mono tracking-wider uppercase mb-1">Builder: Infrastructure &amp; Digital Product</p>
                                    <p className="text-xs text-slate-400 max-w-[220px] mb-3 leading-tight">
                                        Executing landmark African projects including the Grand Ethiopian Renaissance Dam (GERD).
                                    </p>
                                    
                                    <div className="w-full h-px bg-slate-800 my-2"></div>
                                    
                                    <div className="w-full text-left space-y-1 text-xs text-slate-400">
                                        <p className="flex justify-between">
                                            <span>Location:</span>
                                            <strong className="text-slate-300">Sheger, Ethiopia</strong>
                                        </p>
                                        <p className="flex justify-between">
                                            <span>Status:</span>
                                            <strong className="text-green-400">Available Now</strong>
                                        </p>
                                    </div>
                                    
                                    <button 
                                        onClick={() => {
                                            setSettingsPopoverOpen(false);
                                            setProfileModalOpen(true);
                                        }} 
                                        className="w-full mt-4 py-2.5 min-h-[44px] bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold rounded-lg text-xs transition-all shadow-lg hover:shadow-red-600/30 cursor-pointer flex items-center justify-center"
                                    >
                                        MANAGE PROFILE WORKSPACE
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Hamburger */}
                    <button 
                        onClick={toggleSidebar} 
                        className="text-slate-300 hover:text-white lg:hidden p-2 rounded-lg hover:bg-slate-800/60 active:scale-95 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-red-500" 
                        aria-label="Open mobile navigation menu"
                        aria-expanded={isSidebarOpen}
                    >
                        <MenuIcon className="w-6 h-6" />
                    </button>
                </div>
            </header>

            {/* Slide-out Sidebar for Mobile */}
            {isSidebarOpen && (
                <div 
                  className="sidebar-backdrop fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" 
                  onClick={toggleSidebar}
                  style={{ animation: 'fadeIn 0.3s ease-in-out' }}
                ></div>
            )}
            <div 
                ref={sidebarRef} 
                role="dialog"
                aria-label="Mobile Navigation"
                className={`sidebar-panel fixed top-0 right-0 h-full w-[min(20rem,calc(100vw-32px))] bg-slate-950 border-l border-slate-800 shadow-2xl z-50 p-5 sm:p-6 flex flex-col justify-between overflow-y-auto ${isSidebarOpen ? 'open' : ''}`}
            >
                <div>
                    <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                        <span className="text-sm font-bold text-white tracking-wider uppercase flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                            Navigation
                        </span>
                        <button 
                            onClick={toggleSidebar} 
                            className="text-slate-400 hover:text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-slate-800 cursor-pointer focus-visible:ring-2 focus-visible:ring-red-500"
                            aria-label="Close navigation menu"
                        >
                            <CloseIcon className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <nav className="mt-5 space-y-1.5">
                        <button 
                            onClick={() => { setView('portfolio'); toggleSidebar(); }} 
                            className={`w-full text-left min-h-[44px] py-2.5 px-3 rounded-lg text-sm transition-all font-medium flex items-center justify-between cursor-pointer active:scale-98 ${
                                currentView === 'portfolio' ? 'bg-red-600/15 text-white border-l-2 border-red-500 font-semibold' : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                            }`}
                        >
                            <span>Portfolio Overview</span>
                            <span className={`text-xs font-mono ${currentView === 'portfolio' ? 'text-red-400 font-bold' : 'text-slate-500'}`}>01</span>
                        </button>
                        <button 
                            onClick={() => { setView('resume'); toggleSidebar(); }} 
                            className={`w-full text-left min-h-[44px] py-2.5 px-3 rounded-lg text-sm transition-all font-medium flex items-center justify-between cursor-pointer active:scale-98 ${
                                currentView === 'resume' ? 'bg-red-600/15 text-white border-l-2 border-red-500 font-semibold' : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                            }`}
                        >
                            <span>Engineering Dossier (CV)</span>
                            <span className={`text-xs font-mono ${currentView === 'resume' ? 'text-red-400 font-bold' : 'text-slate-500'}`}>02</span>
                        </button>
                        <button 
                            onClick={() => { setView('design'); toggleSidebar(); }} 
                            className={`w-full text-left min-h-[44px] py-2.5 px-3 rounded-lg text-sm transition-all font-medium flex items-center justify-between cursor-pointer active:scale-98 ${
                                currentView === 'design' ? 'bg-red-600/15 text-white border-l-2 border-red-500 font-semibold' : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                            }`}
                        >
                            <span>Trumpet Interchange CAD</span>
                            <span className={`text-xs font-mono ${currentView === 'design' ? 'text-red-400 font-bold' : 'text-slate-500'}`}>03</span>
                        </button>
                        <button 
                            onClick={() => { setView('interface'); toggleSidebar(); }} 
                            className={`w-full text-left min-h-[44px] py-2.5 px-3 rounded-lg text-sm transition-all font-medium flex items-center justify-between cursor-pointer active:scale-98 ${
                                currentView === 'interface' ? 'bg-red-600/15 text-white border-l-2 border-red-500 font-semibold' : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                            }`}
                        >
                            <span>Urban Mining Framework</span>
                            <span className={`text-xs font-mono ${currentView === 'interface' ? 'text-red-400 font-bold' : 'text-slate-500'}`}>04</span>
                        </button>
                        <button 
                            onClick={() => { setView('photos'); toggleSidebar(); }} 
                            className={`w-full text-left min-h-[44px] py-2.5 px-3 rounded-lg text-sm transition-all font-medium flex items-center justify-between cursor-pointer active:scale-98 ${
                                currentView === 'photos' ? 'bg-red-600/15 text-white border-l-2 border-red-500 font-semibold' : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                            }`}
                        >
                            <span>Photographic Journal</span>
                            <span className={`text-xs font-mono ${currentView === 'photos' ? 'text-red-400 font-bold' : 'text-slate-500'}`}>05</span>
                        </button>
                        <button 
                            onClick={() => { setView('main'); toggleSidebar(); }} 
                            className={`w-full text-left min-h-[44px] py-2.5 px-3 rounded-lg text-sm transition-all font-medium flex items-center justify-between cursor-pointer active:scale-98 ${
                                currentView === 'main' ? 'bg-red-600/15 text-white border-l-2 border-red-500 font-semibold' : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                            }`}
                        >
                            <span>Interactive Goal Matrix</span>
                            <span className={`text-xs font-mono ${currentView === 'main' ? 'text-red-400 font-bold' : 'text-slate-500'}`}>06</span>
                        </button>

                        <div className="pt-4 mt-3">
                            <button
                                onClick={() => {
                                    toggleSidebar();
                                    window.dispatchEvent(new CustomEvent('open-download-modal', { detail: { project: 'Portfolio Architecture' } }));
                                }}
                                className="w-full min-h-[44px] py-3 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold rounded-xl text-xs transition-all shadow-lg hover:shadow-red-600/30 cursor-pointer text-center flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                <span>REQUEST DESIGN SPEC</span>
                            </button>
                        </div>
                    </nav>
                </div>

                <div className="pt-6 border-t border-slate-800">
                    <p className="text-xs text-slate-500 mb-3 text-center">Connect &amp; Follow</p>
                    <div className="flex justify-center items-center gap-3">
                        {connectLinks.map(link => (
                            <a 
                                key={link.id} 
                                href={link.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                aria-label={link.title}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-all active:scale-90"
                            >
                                {socialIconMap[link.id]}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
            
            <ProfileModal isOpen={isProfileModalOpen} onClose={() => setProfileModalOpen(false)} season={season} />
        </>
    );
};
