import { usePortfolioData } from './PortfolioDataProvider';
import React, { useState, useEffect, useRef, MouseEvent, useMemo, useCallback } from 'react';
import type { PortfolioData, Project, Blog, ConnectLink, Design, Video, View, Slide } from '../types';
import { EmailIcon, InstagramIcon, LinkedInIcon, TelegramIcon, YouTubeIcon, TikTokIcon, ArrowPathIcon, SparklesIcon } from './IconComponents';
import { generateContent, generateVideos, getVideosOperation, downloadVideo } from '../gemini-client';
import { useSearch } from '../App';
import { OptaScreen1, OptaScreen2, OptaScreen3, PhoneFrame } from './OptaMockups';
import { WalletScreen1, WalletScreen2, WalletScreen3 } from './WalletMockups';
import { LifeScreen1, LifeScreen2, LifeScreen3 } from './LifeArchitectMockups';
import { GildedScreen1, GildedScreen2, GildedScreen3 } from './GildedUIMockups';

// --- Icon Mapping ---
const socialIcons: Record<string, React.ReactNode> = {
  email: <EmailIcon className="w-full h-full" />,
  linkedin: <LinkedInIcon className="w-full h-full" />,
  instagram: <InstagramIcon className="w-full h-full" />,
  telegram: <TelegramIcon className="w-full h-full" />,
  youtube: <YouTubeIcon className="w-full h-full" />,
  tiktok: <TikTokIcon className="w-full h-full" />,
};

const socialCardStyles: Record<string, { bg: string; iconColor: string; shadow: string; }> = {
  email: { bg: 'bg-slate-700', iconColor: 'text-slate-200', shadow: 'hover:shadow-slate-500/50' },
  linkedin: { bg: 'bg-[#0077B5]', iconColor: 'text-white', shadow: 'hover:shadow-blue-500/50' },
  instagram: { bg: 'bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500', iconColor: 'text-white', shadow: 'hover:shadow-pink-500/50' },
  telegram: { bg: 'bg-[#0088cc]', iconColor: 'text-white', shadow: 'hover:shadow-sky-500/50' },
  youtube: { bg: 'bg-[#FF0000]', iconColor: 'text-white', shadow: 'hover:shadow-red-500/50' },
  tiktok: { bg: 'bg-black border border-slate-700', iconColor: 'text-white', shadow: 'hover:shadow-cyan-400/30' },
};

// --- Sparkle Effect ---
const Sparkles: React.FC<{ parentRef: React.RefObject<HTMLDivElement> }> = ({ parentRef }) => {
    useEffect(() => {
        const parent = parentRef.current;
        if (!parent) return;

        let interval: ReturnType<typeof setInterval> | null = null;

        const createSparkle = (e: globalThis.MouseEvent) => {
            const sparkle = document.createElement('div');
            sparkle.className = 'thumbnail-sparkle';
            const rect = parent.getBoundingClientRect();
            sparkle.style.left = `${e.clientX - rect.left}px`;
            sparkle.style.top = `${e.clientY - rect.top}px`;
            sparkle.style.setProperty('--x', `${(Math.random() - 0.5) * 40}px`);
            sparkle.style.setProperty('--y', `${(Math.random() - 0.5) * 40}px`);
            parent.appendChild(sparkle);
            sparkle.addEventListener('animationend', () => sparkle.remove(), { once: true });
        };

        const handleMouseEnter = (e: globalThis.MouseEvent) => {
            createSparkle(e);
            if (interval) clearInterval(interval);
            interval = setInterval(() => {
                if (parent.matches(':hover')) {
                    const rect = parent.getBoundingClientRect();
                    createSparkle({ clientX: rect.left + Math.random() * rect.width, clientY: rect.top + Math.random() * rect.height } as globalThis.MouseEvent);
                } else if (interval) {
                    clearInterval(interval);
                    interval = null;
                }
            }, 350);
        };

        const handleMouseLeave = () => {
            if (interval) {
                clearInterval(interval);
                interval = null;
            }
        };

        parent.addEventListener('mouseenter', handleMouseEnter);
        parent.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            parent.removeEventListener('mouseenter', handleMouseEnter);
            parent.removeEventListener('mouseleave', handleMouseLeave);
            if (interval) clearInterval(interval);
        };
    }, [parentRef]);

    return null;
};

// --- Thumbnail Component ---
const Thumbnail: React.FC<{ item: Project | Blog; onClick: () => void }> = ({ item, onClick }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    
    const hoverText = ('quip' in item && item.quip) ? item.quip : ('excerpt' in item && item.excerpt) ? item.excerpt : item.title;

    return (
        <div 
            ref={ref} 
            tabIndex={0}
            role="button"
            onClick={onClick} 
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick();
                }
            }}
            className="relative group flex-shrink-0 w-32 sm:w-44 md:w-56 aspect-[2/3] bg-slate-900 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ease-in-out md:hover:scale-105 active:scale-95 hover:z-20 shadow-lg hover:shadow-2xl hover:shadow-red-600/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 snap-start"
            aria-label={`View details for ${item.title}`}
        >
            {/* Skeleton Loading State */}
            {!imageLoaded && (
                <div className="absolute inset-0 bg-slate-800 animate-pulse flex items-center justify-center">
                    <span className="w-6 h-6 rounded-full border-2 border-slate-700 border-t-slate-500 animate-spin"></span>
                </div>
            )}
            <img 
                width="400" 
                height="600" 
                src={item.poster} 
                alt={item.title} 
                onLoad={() => setImageLoaded(true)}
                className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`} 
                loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300 p-3 sm:p-4 flex flex-col justify-end">
                <span className="text-[10px] text-red-400 font-mono tracking-wider uppercase mb-0.5">Explore Dossier</span>
                <h3 className="text-white font-bold text-xs sm:text-sm line-clamp-2 leading-snug">{hoverText}</h3>
            </div>
            <Sparkles parentRef={ref} />
        </div>
    );
};


// --- Horizontal Row Component ---
const ContentRow: React.FC<{ title: React.ReactNode; children: React.ReactNode; }> = ({ title, children }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = scrollRef.current.clientWidth * 0.8;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="group relative my-6 sm:my-10">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-slate-100 mb-3 px-4 sm:px-8 md:px-12 flex items-center justify-between">
                <div>{title}</div>
            </div>
            <button 
                onClick={() => scroll('left')} 
                className="hidden md:flex items-center justify-center absolute left-0 top-12 bottom-4 z-30 w-12 bg-gradient-to-r from-black/90 via-black/50 to-transparent text-white text-2xl opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-all hover:scale-110 active:scale-95 cursor-pointer" 
                aria-label="Scroll left"
            >
                ‹
            </button>
            <div 
                ref={scrollRef} 
                className="thumbnail-row flex items-center gap-3 sm:gap-4 overflow-x-auto pb-4 px-4 sm:px-8 md:px-12 snap-x snap-mandatory scroll-smooth touch-pan-x"
            >
                {children}
            </div>
            <button 
                onClick={() => scroll('right')} 
                className="hidden md:flex items-center justify-center absolute right-0 top-12 bottom-4 z-30 w-12 bg-gradient-to-l from-black/90 via-black/50 to-transparent text-white text-2xl opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-all hover:scale-110 active:scale-95 cursor-pointer" 
                aria-label="Scroll right"
            >
                ›
            </button>
        </div>
    );
};

// --- Project Modal Component ---
const ProjectModal: React.FC<{ 
    project: Project | null; 
    onClose: () => void;
    onUpdateMedia: (projectId: string, index: number, file: File) => void;
    projectGalleryState: Record<string, string[]>;
    projectPosterState: Record<string, string>;
    isFeatured?: boolean;
}> = ({ project, onClose, onUpdateMedia, projectGalleryState, projectPosterState, isFeatured = false }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isVideoError, setIsVideoError] = useState(false);
    const [mediaIndex, setMediaIndex] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const activeUploadIndex = useRef<number | null>(null);

    // Dynamic accent color based on project tags for the overview section
    // Defined BEFORE the early return to follow the Rules of Hooks
    const accentColor = useMemo(() => {
        if (!project) return 'slate';
        if (project.tags.some(t => t.toLowerCase().includes('eco-friendly') || t.toLowerCase().includes('green'))) return 'emerald';
        if (project.tags.some(t => t.toLowerCase().includes('energy') || t.toLowerCase().includes('hydro'))) return 'sky';
        if (project.tags.some(t => t.toLowerCase().includes('urban') || t.toLowerCase().includes('transport'))) return 'indigo';
        if (project.tags.some(t => t.toLowerCase().includes('finance') || t.toLowerCase().includes('app'))) return 'rose';
        return 'slate';
    }, [project]);

    useEffect(() => {
        let playTimer: ReturnType<typeof setTimeout> | null = null;
        if (project) {
            setIsVideoError(false);
            setMediaIndex(0);
            document.body.style.overflow = 'hidden';
            playTimer = setTimeout(() => {
                 videoRef.current?.play().catch(() => {});
            }, 300);
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => { 
            if (playTimer) clearTimeout(playTimer);
            document.body.style.overflow = 'auto'; 
        };
    }, [project]);

    useEffect(() => {
        if (!project) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [project, onClose]);

    if (!project) return null;

    const currentPoster = projectPosterState[project.id] || project.poster;
    const currentGallery = projectGalleryState[project.id] || project.gallery || [];

    const media = [
        { type: 'video' as const, src: project.video, poster: currentPoster },
        ...currentGallery.map(url => ({ type: 'image' as const, src: url }))
    ];

    const handleUploadClick = (e: React.MouseEvent, index: number) => {
        e.stopPropagation();
        activeUploadIndex.current = index;
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && activeUploadIndex.current !== null) {
            onUpdateMedia(project.id, activeUploadIndex.current, file);
        }
        if (e.target) e.target.value = '';
        activeUploadIndex.current = null;
    };

    const renderMarkdown = (text: string) => {
        const lines = text.split('\n').filter(line => line.trim() !== '');
        const elements = [];
        let i = 0;
        while (i < lines.length) {
            const line = lines[i];

            if (line.startsWith('### ')) {
                elements.push(<h3 key={i} className="text-xl font-semibold text-slate-200 mt-4 mb-2">{line.substring(4)}</h3>);
                i++;
            } else if (line.startsWith('## ')) {
                elements.push(<h2 key={i} className={`text-2xl font-bold mt-6 mb-3 border-b border-slate-700 pb-2 ${isFeatured ? 'text-white cinemantic-serif' : 'text-slate-100'}`}>{line.substring(3)}</h2>);
                i++;
            } else if (line.startsWith('* ')) {
                const listItems = [];
                while (i < lines.length && lines[i].startsWith('* ')) {
                    const itemLine = lines[i].substring(2);
                    const parts = itemLine.split('**');
                    const styledLine = parts.map((part, p_idx) => p_idx % 2 === 1 ? <strong key={p_idx} className="text-slate-100">{part}</strong> : part);
                    listItems.push(<li key={i}>{styledLine}</li>);
                    i++;
                }
                elements.push(<ul key={`ul-${i}`} className="list-disc pl-6 space-y-2 mb-4 text-slate-300">{listItems}</ul>);
            } else if (line.startsWith('```')) {
                const codeLines = [];
                i++; 
                while (i < lines.length && !lines[i].startsWith('```')) {
                    codeLines.push(lines[i]);
                    i++;
                }
                i++; 
                elements.push(
                    <pre key={`pre-${i}`} className="code-block-container bg-slate-800/50 p-4 rounded-md my-4 overflow-x-auto">
                        <code className="text-sm text-cyan-300 font-mono">{codeLines.join('\n')}</code>
                    </pre>
                );
            }
            else {
                const parts = line.split('**');
                const styledLine = parts.map((part, p_idx) => p_idx % 2 === 1 ? <strong key={p_idx} className="text-slate-100">{part}</strong> : part);
                elements.push(<p key={i} className="text-slate-300 mb-4 leading-relaxed">{styledLine}</p>);
                i++;
            }
        }
        return elements;
    };
    
    const hasMultipleMedia = media.length > 1;
    const nextMedia = () => setMediaIndex(prev => (prev + 1) % media.length);
    const prevMedia = () => setMediaIndex(prev => (prev - 1 + media.length) % media.length);

    const colorMap: Record<string, string> = {
        emerald: 'from-emerald-900/40 to-slate-900/60 shadow-[0_0_30px_rgba(16,185,129,0.15)] border-emerald-500/30',
        sky: 'from-sky-900/40 to-slate-900/60 shadow-[0_0_30px_rgba(14,165,233,0.15)] border-sky-500/30',
        indigo: 'from-indigo-900/40 to-slate-900/60 shadow-[0_0_30px_rgba(99,102,241,0.15)] border-indigo-500/30',
        rose: 'from-rose-900/40 to-slate-900/60 shadow-[0_0_30px_rgba(244,63,94,0.15)] border-rose-500/30',
        slate: 'from-slate-800/40 to-slate-900/60 shadow-[0_0_30px_rgba(71,85,105,0.15)] border-slate-600/30'
    };

    return (
        <div className={`fixed inset-0 z-50 modal-enter modal-enter-active ${isFeatured ? 'featured-immersive-bg' : 'bg-slate-900'}`} role="dialog" aria-modal="true" aria-labelledby="project-title">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            <div className={`w-full h-full overflow-y-auto ${isFeatured ? 'featured-reveal' : 'modal-content-enter modal-content-enter-active'}`} onClick={e => { if(e.target === e.currentTarget) onClose() }}>
                
                {/* Hero Stage */}
                <div className={`relative w-full h-[65vh] md:h-[75vh] ${isFeatured ? 'shadow-2xl' : 'bg-black'}`}>
                    <div className="w-full h-full overflow-hidden">
                        <div className="flex h-full transition-transform duration-1000 cubic-bezier(0.22, 1, 0.36, 1)" style={{ transform: `translateX(-${mediaIndex * 100}%)` }}>
                            {media.map((item, index) => (
                                <div key={index} className="w-full h-full flex-shrink-0 relative">
                                    {item.type === 'video' ? (
                                        isVideoError ? (
                                            <img width="800" height="600" src={item.poster} alt={`${project.title} poster`} className="w-full h-full object-cover" loading="lazy" />
                                        ) : (
                                            <video 
                                                ref={videoRef} 
                                                src={item.src} 
                                                poster={item.poster} 
                                                className={`w-full h-full object-cover ${isFeatured ? 'opacity-90' : ''}`} 
                                                loop 
                                                muted 
                                                playsInline
                                                controls={mediaIndex === index}
                                                onError={() => setIsVideoError(true)}
                                            />
                                        )
                                    ) : (
                                        <img width="800" height="600" src={item.src} alt={`Project gallery image ${index}`} className={`w-full h-full object-cover ${isFeatured ? 'opacity-90' : ''}`} loading="lazy" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={`absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent pointer-events-none`}></div>
                    <button 
                        onClick={onClose} 
                        className="absolute top-3 right-3 sm:top-6 sm:right-6 w-11 h-11 sm:w-12 sm:h-12 min-h-[44px] min-w-[44px] bg-black/75 backdrop-blur-md rounded-full text-white text-xl sm:text-2xl z-30 hover:bg-red-600 hover:scale-110 active:scale-95 transition-all shadow-xl flex items-center justify-center cursor-pointer border border-white/20 focus-visible:ring-2 focus-visible:ring-red-500" 
                        aria-label="Close project details"
                    >
                        &times;
                    </button>
                    
                    <div className="absolute bottom-6 sm:bottom-12 left-4 sm:left-8 md:left-12 right-4 sm:right-8 md:right-12 z-10 pointer-events-none max-w-4xl">
                        <h2 id="project-title" className={`text-xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-white mb-2 drop-shadow-2xl break-words ${isFeatured ? 'netflix-sans tracking-tight' : ''}`}>
                            {project.title}
                        </h2>
                        {isFeatured && (
                            <div className="flex gap-4 items-center">
                                <span className="text-red-500 font-bold text-xs sm:text-sm tracking-widest uppercase flex items-center gap-2">
                                    <SparklesIcon className="w-4 h-4" /> Featured Presentation
                                </span>
                                <div className="h-0.5 w-16 sm:w-24 bg-red-600/30"></div>
                            </div>
                        )}
                    </div>

                    {hasMultipleMedia && (
                        <>
                            <button onClick={prevMedia} className="carousel-btn left-3 sm:left-6 hover:scale-110 active:scale-95 transition-all opacity-100 cursor-pointer" aria-label="Previous media">‹</button>
                            <button onClick={nextMedia} className="carousel-btn right-3 sm:right-6 hover:scale-110 active:scale-95 transition-all opacity-100 cursor-pointer" aria-label="Next media">›</button>
                            <div className="carousel-dots">
                                {media.map((_, index) => (
                                    <button key={index} onClick={() => setMediaIndex(index)} aria-label={`View slide ${index + 1}`} className={`h-2 sm:h-2.5 rounded-full transition-all cursor-pointer ${mediaIndex === index ? 'bg-white w-8 sm:w-10' : 'bg-white/40 w-3 hover:bg-white/70'}`}></button>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <div className={`max-w-6xl mx-auto p-4 sm:p-8 md:p-12 -mt-6 sm:-mt-12 relative z-20 rounded-t-3xl ${isFeatured ? 'bg-[#0f172a]/95 backdrop-blur-xl border-t border-x border-slate-700/50 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]' : 'bg-slate-900 border-t border-slate-800'}`}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
                        <div className="md:col-span-2">
                            <p className={`mb-8 sm:mb-10 leading-relaxed text-sm sm:text-base md:text-lg ${isFeatured ? 'text-slate-200 font-light italic' : 'text-slate-300'}`}>
                                {isFeatured && <span className="text-red-500 text-3xl sm:text-4xl mr-2 cinemantic-serif">"</span>}
                                {project.plot}
                                {isFeatured && <span className="text-red-500 text-3xl sm:text-4xl ml-2 cinemantic-serif">"</span>}
                            </p>
                            
                            <div className="flex flex-wrap gap-2.5 sm:gap-4 mb-10 sm:mb-16">
                                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="bg-white text-black font-bold py-2.5 sm:py-3 px-5 sm:px-7 text-xs sm:text-sm uppercase tracking-wider rounded-lg hover:bg-red-600 hover:text-white transform active:scale-95 transition-all shadow-xl min-h-[44px] flex items-center justify-center">Watch Reel</a>
                                
                                {project.infographicsUrl && project.infographicsUrl !== "#" && (
                                    <a href={project.infographicsUrl} target="_blank" rel="noopener noreferrer" className="bg-slate-800/80 backdrop-blur-sm text-white font-bold py-2.5 sm:py-3 px-5 sm:px-7 text-xs sm:text-sm uppercase tracking-wider rounded-lg border border-slate-700 hover:bg-slate-700 transform active:scale-95 transition-all shadow-lg min-h-[44px] flex items-center justify-center">Infographics</a>
                                )}
                                
                                {project.brochureUrl && project.brochureUrl !== "#" && (
                                    <a href={project.brochureUrl} target="_blank" rel="noopener noreferrer" className="bg-slate-800/80 backdrop-blur-sm text-white font-bold py-2.5 sm:py-3 px-5 sm:px-7 text-xs sm:text-sm uppercase tracking-wider rounded-lg border border-slate-700 hover:bg-slate-700 transform active:scale-95 transition-all shadow-lg min-h-[44px] flex items-center justify-center">Brochure</a>
                                )}

                                <button 
                                    type="button"
                                    onClick={() => window.dispatchEvent(new CustomEvent('open-download-modal', { detail: { project: project.title } }))} 
                                    className="bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold py-2.5 sm:py-3 px-5 sm:px-7 text-xs sm:text-sm uppercase tracking-wider rounded-lg transition-all shadow-xl min-h-[44px] flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                    <span>Request CAD &amp; Specs</span>
                                </button>
                            </div>

                            {/* Immersive Visual Archives Section */}
                            <div className="mb-12 sm:mb-20">
                                <h3 className={`text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8 flex items-center gap-4 ${isFeatured ? 'text-white cinemantic-serif' : 'text-slate-200'}`}>
                                    Cinematic Archives <div className="h-px flex-grow bg-slate-700/50"></div>
                                </h3>
                                <div className="grid gap-3 sm:gap-4 grid-cols-2">
                                    {/* Video/Poster Thumbnail */}
                                    <div 
                                        className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-300 group/thumb ${mediaIndex === 0 ? 'border-red-600 scale-95 ring-4 sm:ring-8 ring-red-600/10' : 'border-slate-800/50 hover:border-red-500/50 opacity-80 hover:opacity-100 shadow-2xl'}`}
                                        onClick={() => setMediaIndex(0)}
                                    >
                                        <img width="800" height="600" src={currentPoster} alt="Poster" className="w-full h-full object-cover transition-transform duration-700 group-hover/thumb:scale-110" loading="lazy" />
                                        <div className="absolute inset-0 bg-gradient-to-tr from-black/60 to-transparent flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                                            <button onClick={(e) => handleUploadClick(e, 0)} className="bg-white/10 backdrop-blur-xl p-2.5 sm:p-3 rounded-full hover:bg-red-600 transition-colors shadow-2xl" title="Update Reel Poster">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                            </button>
                                        </div>
                                        <div className="absolute top-2 left-2 bg-red-600 text-[10px] font-bold px-2 py-0.5 rounded-sm text-white tracking-widest shadow-lg">REEL</div>
                                    </div>

                                    {/* Gallery Item Thumbnails */}
                                    {currentGallery.map((url, idx) => (
                                        <div 
                                            key={idx} 
                                            className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-300 group/thumb ${mediaIndex === idx + 1 ? 'border-red-600 scale-95 ring-4 sm:ring-8 ring-red-600/10' : 'border-slate-800/50 hover:border-red-500/50 opacity-80 hover:opacity-100 shadow-2xl'}`}
                                            onClick={() => setMediaIndex(idx + 1)}
                                        >
                                            <img width="800" height="600" src={url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover/thumb:scale-110" loading="lazy" />
                                            <div className="absolute inset-0 bg-gradient-to-tr from-black/60 to-transparent flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                                                <button onClick={(e) => handleUploadClick(e, idx + 1)} className="bg-white/10 backdrop-blur-xl p-2.5 sm:p-3 rounded-full hover:bg-red-600 transition-colors shadow-2xl" title="Update Captured View">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {isFeatured && (
                                    <p className="text-xs text-slate-500 mt-4 sm:mt-6 font-medium italic opacity-70">
                                        * Authenticated architectural captures. Interactive swap enabled for real-time validation.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Sidebar Info */}
                        <div className="text-sm space-y-6 sm:space-y-8">
                            <div className={`${isFeatured ? 'bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl' : 'bg-slate-800/40 border-slate-700/50'} p-5 sm:p-8 rounded-2xl sm:rounded-3xl border`}>
                                <h4 className="text-red-500 uppercase text-[11px] sm:text-[12px] font-black tracking-[0.3em] mb-4 sm:mb-6">Specification</h4>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">Architect</p>
                                        <p className="text-white text-base sm:text-lg font-medium">{project.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">Core Discipline</p>
                                        <p className="text-white text-base sm:text-lg font-medium">{project.major}</p>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 sm:mt-8 sm:pt-8 border-t border-white/5">
                                    <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-3">Structural Elements</p>
                                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                        {project.structuralComponents.map(comp => (
                                            <span key={comp} className="text-[11px] bg-slate-900/80 text-slate-300 px-2.5 py-1 rounded-md border border-white/10">{comp}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 p-1">
                                {project.tags.map(tag => (
                                    <span key={tag} className="text-red-400 font-mono text-xs font-semibold tracking-wider">#{tag}</span>
                                ))}
                            </div>

                            {isFeatured && (
                                <div className="p-4 sm:p-6 bg-gradient-to-br from-red-600/10 to-transparent rounded-2xl border border-red-500/20">
                                    <p className="text-xs text-slate-400 leading-relaxed italic">
                                        &ldquo;This project represents a milestone in regional infrastructure, blending sustainable civil logic with large-scale architectural vision.&rdquo;
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Full Width Project Anatomy for Featured Projects */}
                    {project.overview && (
                        <div className="mt-12 sm:mt-20 animate-fade-in-up">
                            {isFeatured ? (
                                <div className={`w-full p-5 sm:p-10 md:p-14 bg-gradient-to-br ${colorMap[accentColor]} border-2 blueprint-grid rounded-2xl sm:rounded-[32px] overflow-hidden transition-all duration-700`}>
                                    <div className="max-w-5xl mx-auto">
                                        <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-12">
                                            <h3 className="cinemantic-serif text-2xl sm:text-4xl md:text-5xl text-white font-bold tracking-tight">Project Anatomy &amp; Blueprints</h3>
                                            <div className="h-px flex-grow bg-gradient-to-r from-white/30 to-transparent"></div>
                                        </div>
                                        <div className="text-slate-100 text-sm sm:text-base md:text-lg leading-relaxed space-y-6 sm:space-y-8 drop-shadow-sm font-light">
                                            {renderMarkdown(project.overview)}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <details className="group project-accordion rounded-2xl p-1 bg-slate-800/30 border border-slate-700/30">
                                    <summary className="flex justify-between items-center cursor-pointer p-4 sm:p-6 font-bold text-white hover:bg-white/5 rounded-xl transition-all">
                                        <span className="text-base sm:text-xl">Project Anatomy &amp; Blueprints</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 transition-transform duration-500 group-open:rotate-180 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                    </summary>
                                    <div className="p-4 sm:p-8 border-t border-white/10 animate-fade-in text-slate-300 text-sm sm:text-base leading-relaxed">
                                        {renderMarkdown(project.overview)}
                                    </div>
                                </details>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Blog Modal Component ---
const BlogModal: React.FC<{
    blog: Blog | null;
    onClose: () => void;
    onOpenSlides: (slides: Slide[]) => void;
}> = ({ blog, onClose, onOpenSlides }) => {
    const [activeNote, setActiveNote] = useState<string | null>(null);

    useEffect(() => {
        if (blog) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => { document.body.style.overflow = 'auto'; };
    }, [blog]);

    useEffect(() => {
        if (!blog) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [blog, onClose]);

    if (!blog) return null;

    const renderMarkdown = (text: string, blog: Blog) => {
        const lines = text.split('\n');
        const elements = [];
        let i = 0;
        while (i < lines.length) {
            const line = lines[i];

            if (line.trim().startsWith('### ')) {
                elements.push(<h3 key={i} className="text-xl font-semibold text-slate-200 mt-4 mb-2">{line.trim().substring(4)}</h3>);
                i++;
            } else if (line.trim().startsWith('## ')) {
                elements.push(<h2 key={i} className="text-2xl font-bold text-slate-100 mt-6 mb-3 border-b border-slate-700 pb-2">{line.trim().substring(3)}</h2>);
                i++;
            } else if (line.trim().startsWith('* ')) {
                const listItems = [];
                while (i < lines.length && lines[i].trim().startsWith('* ')) {
                    const itemLine = lines[i].trim().substring(2);
                    const parts = itemLine.split('**');
                    const styledLine = parts.map((part, p_idx) => p_idx % 2 === 1 ? <strong key={p_idx} className="text-slate-100">{part}</strong> : part);
                    listItems.push(<li key={i}>{styledLine}</li>);
                    i++;
                }
                elements.push(<ul key={`ul-${i}`} className="list-disc pl-6 space-y-2 mb-4 text-slate-300">{listItems}</ul>);
            } else if (/^\d+\.\s/.test(line.trim())) {
                const listItems = [];
                while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
                    const itemLine = lines[i].trim().replace(/^\d+\.\s/, '');
                    const parts = itemLine.split('**');
                    const styledLine = parts.map((part, p_idx) => p_idx % 2 === 1 ? <strong key={p_idx} className="text-slate-100">{part}</strong> : part);
                    listItems.push(<li key={i}>{styledLine}</li>);
                    i++;
                }
                elements.push(<ol key={`ol-${i}`} className="list-decimal pl-6 space-y-2 mb-4 text-slate-300">{listItems}</ol>);
            } else if (line.trim().startsWith('```')) {
                const codeLines = [];
                i++; 
                while (i < lines.length && !lines[i].trim().startsWith('```')) {
                    codeLines.push(lines[i]);
                    i++;
                }
                i++; 
                 elements.push(
                    <div key={`pre-${i}`} className="code-block-container bg-[#0f172a] rounded-lg my-6 border border-slate-700 shadow-xl overflow-hidden relative group">
                        <div className="flex items-center px-4 py-2 bg-slate-800/80 border-b border-slate-700/50 gap-2 absolute top-0 left-0 right-0 z-10 backdrop-blur-sm">
                            <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                            <span className="ml-2 text-xs text-slate-500 font-mono">snippet</span>
                        </div>
                        <pre className="p-4 pt-12 overflow-x-auto relative z-0">
                            <code className="text-sm text-cyan-300 font-mono leading-relaxed">{codeLines.join('\n')}</code>
                        </pre>
                    </div>
                );
            } else if (line.trim().startsWith('> ')) {
                const quote = line.trim().substring(2);
                elements.push(
                    <blockquote key={i} className="border-l-4 border-indigo-500 pl-4 py-1 my-6 bg-slate-800/30 rounded-r-lg italic text-slate-300">
                        "{quote}"
                    </blockquote>
                );
                i++;
            } else if (line.trim() === '[VIDEO_PLAYER]') {
                elements.push(
                    <div key={`video-${i}`} className="my-6 rounded-lg overflow-hidden border border-slate-700 shadow-lg">
                        {blog.video_overview_url ? (
                            <video
                                src={blog.video_overview_url}
                                poster={blog.poster}
                                controls
                                className="w-full h-auto"
                                playsInline
                            />
                        ) : (
                            <div className="w-full aspect-video bg-slate-800 flex items-center justify-center">
                                <p className="text-slate-500">Video content is currently unavailable.</p>
                            </div>
                        )}
                    </div>
                );
                i++;
            } else if (line.trim().startsWith('|') && i + 1 < lines.length && lines[i + 1].trim().match(/^\|(\s*[-:]+\s*\|)+/)) {
                const headerLine = line.trim();
                const headers = headerLine.split('|').slice(1, -1).map(h => h.trim());
                
                const tableRows = [];
                let rowIndex = i + 2;
                while (rowIndex < lines.length && lines[rowIndex].trim().startsWith('|')) {
                    const rowCells = lines[rowIndex].trim().split('|').slice(1, -1).map(c => c.trim());
                    const styledCells = rowCells.map((cell, cellIndex) => {
                        const parts = cell.split('**');
                        const styledCellContent = parts.map((part, p_idx) => p_idx % 2 === 1 ? <strong key={p_idx} className="text-slate-100">{part}</strong> : part);
                        return <td key={cellIndex} className="border border-slate-700 px-4 py-3 text-slate-300">{styledCellContent}</td>;
                    });
                    tableRows.push(<tr key={rowIndex} className="even:bg-slate-800/30 hover:bg-slate-800/50 transition-colors">{styledCells}</tr>);
                    rowIndex++;
                }

                elements.push(
                    <div key={`table-wrapper-${i}`} className="overflow-x-auto my-6 rounded-lg border border-slate-700 shadow-lg bg-slate-900/30">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="bg-slate-800/80 text-slate-200">
                                    {headers.map((header, index) => <th key={index} className="border border-slate-700 px-4 py-3 font-bold uppercase tracking-wider text-xs">{header}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {tableRows}
                            </tbody>
                        </table>
                    </div>
                );
                i = rowIndex;
            } else if (line.trim()) { 
                const parts = line.split('**');
                const styledLine = parts.map((part, p_idx) => p_idx % 2 === 1 ? <strong key={p_idx} className="text-slate-100">{part}</strong> : part);
                elements.push(<p key={i} className="text-slate-300 mb-4 leading-relaxed">{styledLine}</p>);
                i++;
            } else {
                i++; 
            }
        }
        return elements;
    };


    return (
        <div className="fixed inset-0 bg-slate-900 z-50 modal-enter modal-enter-active" role="dialog" aria-modal="true" aria-labelledby="blog-title">
            <div className="modal-content-enter modal-content-enter-active w-full h-full overflow-y-auto" onClick={e => { if(e.target === e.currentTarget) onClose() }}>
                <div className="relative w-full h-[40vh] sm:h-[50vh] bg-black flex items-center justify-center">
                    <img width="800" height="600" src={blog.poster} alt={blog.title} className="w-full h-full object-cover opacity-60" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
                    <button 
                        onClick={onClose} 
                        className="absolute top-3 right-3 sm:top-6 sm:right-6 w-11 h-11 sm:w-12 sm:h-12 min-h-[44px] min-w-[44px] flex items-center justify-center bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-full text-white text-2xl z-10 transition-all cursor-pointer shadow-lg active:scale-95" 
                        aria-label="Close blog post"
                    >
                        &times;
                    </button>
                    <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-8">
                        <h2 id="blog-title" className="text-2xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>{blog.title}</h2>
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2 sm:mt-3 text-slate-300 text-xs sm:text-sm">
                            <span className="font-mono">{blog.read_time}</span>
                            <div className="flex flex-wrap gap-2 items-center">
                                {blog.slides && (
                                    <button 
                                        onClick={() => {
                                            onOpenSlides(blog.slides!);
                                            onClose();
                                        }}
                                        className="bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-blue-500 transition-all flex items-center gap-1 shadow-lg shadow-blue-500/20 min-h-[36px] cursor-pointer active:scale-95"
                                    >
                                        <SparklesIcon className="w-3 h-3" /> Infographics
                                    </button>
                                )}
                                {blog.infographicsUrl && blog.infographicsUrl !== "#" && (
                                    <a 
                                        href={blog.infographicsUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="bg-slate-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-slate-600 transition-all flex items-center gap-1 shadow-lg min-h-[36px]"
                                    >
                                        Infographics Link
                                    </a>
                                )}
                                {blog.tags.filter(t => t.toLowerCase() !== 'slides').map(tag => {
                                    const hasNote = blog.tagNotes && blog.tagNotes[tag];
                                    return hasNote ? (
                                        <button 
                                            key={tag} 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveNote(activeNote === tag ? null : tag);
                                            }}
                                            className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-all flex items-center gap-1 min-h-[32px] cursor-pointer ${activeNote === tag ? 'bg-emerald-500 text-slate-900 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600'}`}
                                        >
                                            <SparklesIcon className="w-3 h-3" />
                                            {tag}
                                        </button>
                                    ) : (
                                        <span key={tag} className="bg-slate-700/50 text-slate-300 text-xs font-semibold px-2.5 py-1 rounded-full">{tag}</span>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                {activeNote && blog.tagNotes && blog.tagNotes[activeNote] && (
                    <div className="max-w-4xl mx-auto px-4 sm:px-8 md:px-12 pt-6 sm:pt-8">
                        <div className="w-full p-4 sm:p-8 bg-gradient-to-br from-indigo-900/80 via-slate-900 to-emerald-900/80 border border-emerald-500/40 rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.15)] animate-fade-in relative overflow-hidden backdrop-blur-md">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-emerald-400 to-indigo-500"></div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
                            <h4 className="text-emerald-400 font-black text-xl sm:text-2xl mb-4 sm:mb-6 flex items-center gap-3 tracking-wide drop-shadow-md">
                                <SparklesIcon className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-300" />
                                {activeNote} Insights
                            </h4>
                            <div className="text-slate-100 text-sm sm:text-base leading-relaxed font-medium relative z-10">
                                {renderMarkdown(blog.tagNotes[activeNote], blog)}
                            </div>
                        </div>
                    </div>
                )}
                <div className="max-w-4xl mx-auto p-4 sm:p-8 md:p-12">
                    {renderMarkdown(blog.markdown_content, blog)}
                </div>
            </div>
        </div>
    );
};

// --- Slideshow Modal ---
const SlideshowModal: React.FC<{ slides: Slide[] | null; onClose: () => void; }> = ({ slides, onClose }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [generatedImages, setGeneratedImages] = useState<Record<number, string>>({});
    const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>({});
    const [errorStates, setErrorStates] = useState<Record<number, string | null>>({});
    const [slideDirection, setSlideDirection] = useState<'next' | 'prev' | 'none'>('none');
    
    const generateImage = useCallback(async (index: number, slide: Slide) => {
        if (generatedImages[index] || loadingStates[index]) return;

        if (slide.image) {
            setGeneratedImages(prev => ({ ...prev, [index]: slide.image }));
            return;
        }

        if (!slide.image_prompt) return;

        setLoadingStates(prev => ({ ...prev, [index]: true }));
        setErrorStates(prev => ({ ...prev, [index]: null }));

        try {
            const response = await generateContent({
                model: 'gemini-3.1-flash-lite-image',
                contents: { parts: [{ text: slide.image_prompt }] },
            });

            if (response.candidates?.[0]?.content?.parts) {
                for (const part of response.candidates[0].content.parts) {
                    if (part.inlineData) {
                        const base64ImageBytes: string = part.inlineData.data;
                        const imageUrl = `data:image/png;base64,${base64ImageBytes}`;
                        setGeneratedImages(prev => ({ ...prev, [index]: imageUrl }));
                        break;
                    }
                }
            }
        } catch (error) {
            console.error("Image generation failed:", error);
            setErrorStates(prev => ({ ...prev, [index]: "Image generation failed." }));
        } finally {
            setLoadingStates(prev => ({ ...prev, [index]: false }));
        }
    }, [generatedImages, loadingStates]);
    
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (slides) {
            setIsOpen(true);
            document.body.style.overflow = 'hidden';
            if(slides[0]) {
                generateImage(0, slides[0]);
            }
        } else {
            setIsOpen(false);
            document.body.style.overflow = 'auto';
        }
    }, [slides, generateImage]);
    
    useEffect(() => {
        if (slides && slides[currentIndex]) {
            generateImage(currentIndex, slides[currentIndex]);
        }
    }, [currentIndex, slides, generateImage]);

    const handleClose = () => {
        setIsOpen(false);
        setTimeout(() => {
            onClose();
            setCurrentIndex(0);
            setGeneratedImages({});
            setLoadingStates({});
            setErrorStates({});
        }, 300);
    };

    if (!slides) return null;
    
    const nextSlide = () => {
        if (currentIndex < slides.length - 1) {
            setSlideDirection('next');
            setCurrentIndex(prev => prev + 1);
        }
    };

    const prevSlide = () => {
        if (currentIndex > 0) {
            setSlideDirection('prev');
            setCurrentIndex(prev => prev - 1);
        }
    };
    
    const currentSlide = slides[currentIndex];
    const layout = currentSlide.layout || 'content_right';

    const renderContent = (content: string | string[]) => {
        if (Array.isArray(content)) {
            return (
                <ul>
                    {content.map((item, index) => {
                        const parts = item.split('**');
                        const styledItem = parts.map((part, p_idx) => p_idx % 2 === 1 ? <strong key={p_idx} className="text-slate-100">{part}</strong> : part);
                        return <li key={index}>{styledItem}</li>
                    })}
                </ul>
            );
        }
        return <p className="text-lg leading-relaxed">{content}</p>;
    };

    const renderImage = () => (
        <div className="slide-image-container">
            {loadingStates[currentIndex] && (
                 <div className="image-placeholder">
                     <svg className="h-8 w-8 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                     <p className="mt-2 text-sm">Generating AI Image...</p>
                 </div>
            )}
            {errorStates[currentIndex] && (
                 <div className="image-placeholder error">
                    <p>{errorStates[currentIndex]}</p>
                 </div>
            )}
            {generatedImages[currentIndex] && <img width="800" height="600" src={generatedImages[currentIndex]} alt={currentSlide.title} loading="lazy" />}
        </div>
    );
    
    return (
        <div className={`slideshow-modal-backdrop ${isOpen ? 'open' : ''}`} onClick={handleClose}>
            <div className={`slideshow-modal-content ${isOpen ? 'open' : ''}`} onClick={e => e.stopPropagation()}>
                <div className="slideshow-container">
                    {slides.map((slide, index) => (
                        <div key={index} className={`slide ${currentIndex === index ? 'active' : ''} ${currentIndex !== index && slideDirection !== 'none' ? 'exiting' : ''}`}>
                            {layout === 'title' || layout === 'full_image' ? (
                                <div className="slide-layout-title">
                                    {renderImage()}
                                    <h2 className="netflix-sans tracking-wide">{slide.title}</h2>
                                    {slide.subtitle && <p>{slide.subtitle}</p>}
                                    {layout === 'full_image' && <div className="mt-4">{renderContent(slide.content)}</div>}
                                </div>
                            ) : (
                                <>
                                    <div className="slide-header">
                                        <h2>{slide.title}</h2>
                                    </div>
                                    <div className={`slide-body ${['content_left', 'content_right'].includes(layout) ? 'layout-two-col' : ''}`}>
                                        {layout === 'content_left' && renderImage()}
                                        <div className="slide-content">
                                            {renderContent(slide.content)}
                                        </div>
                                        {layout === 'content_right' && renderImage()}
                                        {layout === 'diagram' && renderImage()}
                                    </div>
                                    <div className="slide-footer">
                                        <span>Menkir Wolde | Infrastructure & Design</span>
                                        <span>{currentIndex + 1} / {slides.length}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                     <button onClick={handleClose} className="slideshow-close-btn" aria-label="Close slideshow">&times;</button>
                     <div className="slideshow-nav">
                        <button onClick={prevSlide} disabled={currentIndex === 0}>‹</button>
                        <span>{currentIndex + 1} / {slides.length}</span>
                        <button onClick={nextSlide} disabled={currentIndex === slides.length - 1}>›</button>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- Design Store Components ---
const DesignThumbnail: React.FC<{ design: Design; onInstallClick: () => void }> = ({ design, onInstallClick }) => {
    const styleClasses: Record<Design['style'], string> = {
        'Eco-Futurist': 'style-eco-futurist',
        'Noir Thriller': 'style-noir-thriller',
        'Retro Arcade': 'style-retro-arcade',
        'Baroque Digital': 'style-baroque-digital',
        'Sports-Live': 'style-sports-live',
    };

    const buttonText = design.price === 'Free' ? 'Install' : design.price;
    
    return (
        <div className={`design-card group ${styleClasses[design.style] || ''} cursor-pointer`} onClick={onInstallClick}>
            <div className="design-card-image-wrapper">
                <img width="400" height="600" src={design.poster} alt={design.name} loading="lazy" />
            </div>
            
            <div className="design-card-content">
                 <div className="absolute inset-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/80 flex items-center justify-center text-center z-10 backdrop-blur-sm">
                    <p className="text-base font-bold italic text-white leading-relaxed">"{design.hover_quip}"</p>
                </div>
                
                <h3 className="design-card-title">{design.name}</h3>
                <p className="design-card-desc">{design.description}</p>
                
                <div className="design-card-meta">
                    <div className="flex flex-col">
                         <div className="flex items-center gap-1 text-yellow-400 font-bold">
                            <span>{design.rating}</span>
                            <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        </div>
                        <span className="text-xs text-slate-400">{design.reviews} reviews</span>
                    </div>
                    <button 
                        className="install-btn z-20 relative pointer-events-none" 
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
             <div className="install-progress-bar">
                <div className="progress-fill"></div>
            </div>
        </div>
    );
};

const ComingSoonModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="fixed inset-0 bg-black/80 z-[101] flex items-center justify-center p-4" onClick={onClose}>
        <div 
            className="coming-soon-modal-content bg-slate-900 border border-slate-700 rounded-2xl p-8 text-center max-w-sm shadow-2xl shadow-red-500/20"
            onClick={e => e.stopPropagation()}
        >
            <h2 className="text-3xl font-bold text-slate-100 netflix-sans tracking-wide">Coming Soon!</h2>
            <p className="text-slate-300 mt-2">This feature is currently under construction.</p>
            <p className="text-xs text-slate-500 mt-4">We're just polishing the pixels and training the AI to be extra persuasive. Check back soon!</p>
            <button onClick={onClose} className="mt-6 bg-red-600 text-white font-bold py-2 px-8 rounded-full hover:bg-red-700 transition-colors">
                I'll Be Back
            </button>
        </div>
    </div>
);

const AppStoreModal: React.FC<{ design: Design; onClose: () => void }> = ({ design, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/50 z-[101] flex items-center justify-center sm:p-4 backdrop-blur-sm" onClick={onClose}>
            <div 
                className="bg-[#202124] text-white sm:rounded-3xl w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-2xl overflow-y-auto shadow-2xl animate-fade-in-up"
                onClick={e => e.stopPropagation()}
            >
                <div className="sticky top-0 bg-[#202124]/90 backdrop-blur z-20 flex justify-between items-center p-4">
                    <button onClick={onClose} className="text-slate-200 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    </button>
                    <button className="text-slate-200 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                    </button>
                </div>

                <div className="px-6 relative">
                    <div className="flex items-start gap-6">
                        {design.id === 'design4' ? (
                            <div className="w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-[#121212] shadow-2xl flex-shrink-0 border border-slate-700 flex items-center justify-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#00FF00]/10 to-transparent"></div>
                                <span className="text-[#00FF00] text-5xl font-black italic tracking-tighter drop-shadow-[0_0_10px_rgba(0,255,0,0.5)]">O</span>
                                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#00FF00] animate-pulse"></div>
                            </div>
                        ) : design.id === 'design1' ? (
                            <div className="w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-slate-800 shadow-2xl flex-shrink-0 border border-slate-700 flex items-center justify-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent"></div>
                                <svg className="w-12 h-12 text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                            </div>
                        ) : design.id === 'design2' ? (
                            <div className="w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-black shadow-[0_0_20px_rgba(220,38,38,0.3)] flex-shrink-0 border border-red-900/50 flex items-center justify-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/50 to-transparent opacity-50"></div>
                                <svg className="w-12 h-12 text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.8)] relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            </div>
                        ) : design.id === 'design3' ? (
                            <div className="w-24 h-24 md:w-28 md:h-28 bg-[#1a0f08] flex-shrink-0 border-2 border-[#d4af37] flex items-center justify-center relative overflow-hidden group shadow-[0_4px_15px_rgba(0,0,0,0.8)]">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-30"></div>
                                <svg className="w-12 h-12 text-[#d4af37] relative z-10 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                </svg>
                                <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-[#d4af37]"></div>
                                <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-[#d4af37]"></div>
                                <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-[#d4af37]"></div>
                                <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-[#d4af37]"></div>
                            </div>
                        ) : (
                            <img width="112" height="112" src={design.poster} alt={design.name} className="w-24 h-24 md:w-28 md:h-28 rounded-2xl object-cover shadow-lg flex-shrink-0 border border-slate-700/50" loading="lazy" />
                        )}
                        <div className="flex-1 pt-1">
                            <h2 className="text-2xl font-bold tracking-tight leading-tight">{design.name}</h2>
                            <p className="text-[#01875f] font-medium mt-1">{design.developer || 'Menkir Wolde'}</p>
                            <p className="text-slate-400 text-xs mt-1">Contains ads • In-app purchases</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-8 mt-6 text-sm overflow-x-auto pb-2 scrollbar-hide">
                        <div className="flex flex-col items-center flex-shrink-0">
                            <div className="flex items-center gap-1 font-bold text-base">
                                <span>{design.rating}</span>
                                <svg className="w-3.5 h-3.5 text-slate-300 mb-[1px]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                            </div>
                            <span className="text-slate-400 text-xs">{design.reviews} reviews</span>
                        </div>
                        <div className="w-px h-8 bg-slate-700 flex-shrink-0"></div>
                        <div className="flex flex-col items-center justify-center flex-shrink-0">
                            <div className="font-bold text-base">{design.downloads || '500K+'}</div>
                            <span className="text-slate-400 text-xs font-normal">Downloads</span>
                        </div>
                        <div className="w-px h-8 bg-slate-700 flex-shrink-0"></div>
                        {design.contentRating === 'Top Grossing Finance' ? (
                            <div className="flex flex-col items-center justify-center flex-shrink-0">
                                <div className="font-bold text-xs bg-emerald-500/20 text-emerald-400 rounded px-1.5 mt-0.5 mb-[3px] leading-tight border border-emerald-500/30">#1</div>
                                <span className="text-slate-400 text-xs font-normal">Top Grossing</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center flex-shrink-0">
                                <div className="font-bold border border-slate-500 rounded text-[10px] px-1 mt-0.5 mb-[3px] leading-tight">{design.contentRating || 'E'}</div>
                                <span className="text-slate-400 text-xs font-normal">Everyone</span>
                            </div>
                        )}
                        {design.editorChoice && (
                            <>
                                <div className="w-px h-8 bg-slate-700 flex-shrink-0"></div>
                                <div className="flex flex-col items-center justify-center flex-shrink-0 px-2">
                                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 flex items-center gap-1 shadow-lg">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                        Editor's Choice
                                    </div>
                                    <span className="text-slate-400 text-xs font-normal">Award</span>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="mt-6 flex flex-col gap-3">
                        {design.install_url && design.install_url !== '#' ? (
                            <a 
                                href={design.install_url} 
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`w-full font-bold py-3.5 rounded-full flex justify-center items-center transition-all ${design.id === 'design4' ? 'bg-[#00FF00] hover:bg-[#00cc00] text-black shadow-[0_0_15px_rgba(0,255,0,0.3)]' : design.id === 'design1' ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]' : design.id === 'design2' ? 'bg-red-700 hover:bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]' : design.id === 'design3' ? 'bg-gradient-to-b from-[#d4af37] to-[#8a6825] hover:from-[#e2cda4] hover:to-[#b89552] text-[#1a0f08] border border-[#ffeba1] shadow-[0_4px_10px_rgba(0,0,0,0.8)]' : 'bg-[#01875F] hover:bg-[#00a876] text-white'}`}
                            >
                                {design.primaryButtonLabel || 'Install APK'}
                            </a>
                        ) : (
                            <button
                                type="button"
                                onClick={() => window.dispatchEvent(new CustomEvent('open-download-modal', { detail: { project: design.title } }))}
                                className={`w-full font-bold py-3.5 rounded-full flex justify-center items-center transition-all cursor-pointer ${design.id === 'design3' ? 'bg-gradient-to-b from-[#d4af37] to-[#8a6825] hover:from-[#e2cda4] hover:to-[#b89552] text-[#1a0f08] border border-[#ffeba1] shadow-[0_4px_10px_rgba(0,0,0,0.8)]' : 'bg-[#01875F] hover:bg-[#00a876] text-white'}`}
                            >
                                Request Design Spec &amp; Prototype
                            </button>
                        )}
                        <a href="https://t.me/frontenddesigns" target="_blank" rel="noopener noreferrer" className={`w-full font-semibold py-3.5 rounded-full flex justify-center items-center gap-2 transition-colors border ${design.id === 'design4' ? 'bg-transparent border-[#00FF00] text-[#00FF00] hover:bg-[#00FF00]/10' : design.id === 'design1' ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-blue-400' : design.id === 'design2' ? 'bg-black border-red-900/50 text-red-500 hover:bg-red-900/20' : design.id === 'design3' ? 'bg-[#1a0f08] border-[#a08447] text-[#d4af37] hover:bg-[#2a170f]' : 'bg-slate-800 hover:bg-slate-700 text-[#27A7E7] border-slate-700'}`}>
                            <TelegramIcon className="w-5 h-5 fill-current" />
                            {design.secondaryButtonLabel || 'Mirror via Telegram'}
                        </a>
                    </div>
                </div>

                <div className="mt-8 px-6 overflow-x-auto scrollbar-hide py-2">
                    <div className="flex items-center gap-4 w-max pb-4">
                        {design.id === 'design4' ? (
                            <>
                                <PhoneFrame><OptaScreen1 /></PhoneFrame>
                                <PhoneFrame><OptaScreen2 /></PhoneFrame>
                                <PhoneFrame><OptaScreen3 /></PhoneFrame>
                            </>
                        ) : design.id === 'design1' ? (
                            <>
                                <PhoneFrame><WalletScreen1 /></PhoneFrame>
                                <PhoneFrame><WalletScreen2 /></PhoneFrame>
                                <PhoneFrame><WalletScreen3 /></PhoneFrame>
                            </>
                        ) : design.id === 'design2' ? (
                            <>
                                <PhoneFrame><LifeScreen1 /></PhoneFrame>
                                <PhoneFrame><LifeScreen2 /></PhoneFrame>
                                <PhoneFrame><LifeScreen3 /></PhoneFrame>
                            </>
                        ) : design.id === 'design3' ? (
                            <>
                                <PhoneFrame><GildedScreen1 /></PhoneFrame>
                                <PhoneFrame><GildedScreen2 /></PhoneFrame>
                                <PhoneFrame><GildedScreen3 /></PhoneFrame>
                            </>
                        ) : (
                            <>
                                <img width="400" height="711" src={`https://picsum.photos/seed/${design.id}-1/400/711`} alt="Screenshot 1" className="w-[140px] md:w-[180px] aspect-[9/16] object-cover rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-slate-800/50" loading="lazy" />
                                <img width="400" height="711" src={`https://picsum.photos/seed/${design.id}-2/400/711`} alt="Screenshot 2" className="w-[140px] md:w-[180px] aspect-[9/16] object-cover rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-slate-800/50" loading="lazy" />
                                <img width="400" height="711" src={`https://picsum.photos/seed/${design.id}-3/400/711`} alt="Screenshot 3" className="w-[140px] md:w-[180px] aspect-[9/16] object-cover rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-slate-800/50" loading="lazy" />
                                <img width="400" height="711" src={`https://picsum.photos/seed/${design.id}-4/400/711`} alt="Screenshot 4" className="w-[140px] md:w-[180px] aspect-[9/16] object-cover rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-slate-800/50" loading="lazy" />
                            </>
                        )}
                    </div>
                </div>

                <div className="px-6 py-4 mt-2">
                    <div className="flex justify-between items-center mb-4 cursor-pointer group">
                        <h3 className="text-lg font-medium">About this app</h3>
                        <svg className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">{design.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                        <span className="px-3 py-1 rounded-full border border-slate-700 text-xs text-slate-300">{design.style}</span>
                        <span className="px-3 py-1 rounded-full border border-slate-700 text-xs text-slate-300">Design</span>
                        <span className="px-3 py-1 rounded-full border border-slate-700 text-xs text-slate-300">Productivity</span>
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-slate-800">
                    <div className="flex justify-between items-center mb-4 cursor-pointer group">
                        <h3 className="text-lg font-medium">Data safety</h3>
                        <svg className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Safety starts with understanding how developers collect and share your data. Data privacy and security practices may vary based on your use, region, and age. The developer provided this information and may update it over time.
                    </p>
                    <div className="mt-4 bg-[#2D2E30] rounded-xl p-4">
                        <div className="flex items-start gap-4 mb-4">
                            <svg className="w-6 h-6 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
                            <div className="text-sm">
                                <p className="text-slate-200">No data shared with third parties</p>
                                <span className="text-slate-400 text-xs">All application telemetry is disabled by default; user preferences reside strictly in local client storage.</span>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <svg className="w-6 h-6 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                            <div className="text-sm">
                                <p className="text-slate-200">This app may collect these data types</p>
                                <p className="text-slate-400">Location, Personal info and 2 others</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

// --- Video Reel Components ---
interface VideoGenerationState {
  status: 'idle' | 'generating' | 'ready' | 'error' | 'key_required';
  url?: string;
  message?: string;
}

const RegenerationModal: React.FC<{ video: Video | null; onClose: () => void; onGenerate: (modifiedPrompt: string) => void; }> = ({ video, onClose, onGenerate }) => {
    useEffect(() => {
        if (!video) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [video, onClose]);

    if (!video) return null;

    const styles = [
        { name: 'Cinematic Trailer', description: 'Dramatic, high-stakes, and epic in scope.', promptPrefix: 'A hyper-realistic, cinematic 4k teaser trailer with dramatic chiaroscuro lighting, epic wide angle drone shots, and IMAX-level production value' },
        { name: 'Energetic Reel', description: 'Fast-paced, modern, with quick cuts.', promptPrefix: 'An energetic, fast-paced 3D motion graphics reel with dynamic camera swoops, vibrant neon colors, glitch effects, and quick cuts' },
        { name: 'Documentary Explainer', description: 'Calm, informative, with smooth camera moves.', promptPrefix: 'A high-fidelity documentary-style explainer video with smooth cinematic panning, soft natural lighting, shallow depth of field, and crystal clear focus' },
        { name: 'Artsy Interpretation', description: 'Abstract, surreal visuals and an ambient score.', promptPrefix: 'An abstract, surreal artistic masterpiece featuring dreamlike 3D visuals, floating geometric elements, volumetric fog, and moody atmospheric lighting' }
    ];

    const handleStyleSelect = (style: typeof styles[0]) => {
        const originalPrompt = video.prompt;
        const promptParts = originalPrompt.split(/ for | on | about | showing | of /i);
        let newPrompt: string;

        if (promptParts.length > 1) {
            const subject = promptParts.slice(1).join(' for ');
            newPrompt = `${style.promptPrefix} for ${subject}`;
        } else {
            newPrompt = `${style.promptPrefix} about "${video.title}"`;
        }
        
        onGenerate(newPrompt);
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-[101] flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="coming-soon-modal-content bg-slate-900 border border-slate-700 rounded-2xl p-6 text-center max-w-md w-full shadow-2xl shadow-red-500/20"
                onClick={e => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold text-slate-100 netflix-sans tracking-wide">Regenerate Video</h2>
                <p className="text-slate-400 mt-1 text-sm">Choose a new style for <span className="font-semibold text-slate-200">"{video.title}"</span></p>
                <div className="space-y-3 mt-6 text-left">
                    {styles.map(style => (
                        <button 
                            key={style.name}
                            onClick={() => handleStyleSelect(style)}
                            className="w-full p-3 bg-slate-800/70 rounded-lg text-left hover:bg-slate-700/80 transition-colors border border-slate-700"
                        >
                            <p className="font-bold text-slate-100">{style.name}</p>
                            <p className="text-xs text-slate-400">{style.description}</p>
                        </button>
                    ))}
                </div>
                <button onClick={onClose} className="mt-6 text-sm text-slate-400 hover:text-white">
                    Cancel
                </button>
            </div>
        </div>
    );
};

const VideoThumbnail: React.FC<{ 
    item: Video; 
    state: VideoGenerationState;
    onPlay: () => void; 
    onGenerate: () => void;
    onRegenerate: () => void;
    onSelectKey: () => void;
}> = ({ item, state, onPlay, onGenerate, onRegenerate, onSelectKey }) => {
    const renderContent = () => {
        switch (state.status) {
            case 'key_required':
                 return (
                    <div className="w-full h-full flex flex-col items-center justify-center text-center p-2 bg-slate-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p className="text-amber-300 text-xs mb-3">{state.message || 'Service initializing.'}</p>
                        <button onClick={onGenerate} className="bg-amber-500 text-black text-xs font-bold px-3 py-1 rounded-full hover:bg-amber-400 transition-colors">Retry</button>
                    </div>
                );
            case 'generating':
                return (
                    <div className="w-full h-full flex flex-col items-center justify-center text-center p-2 bg-slate-800">
                        <svg className="animate-spin h-8 w-8 text-white mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-slate-300 text-xs font-bold animate-pulse">{state.message || 'Generating...'}</p>
                    </div>
                );
            case 'error':
                return (
                    <div className="w-full h-full flex flex-col items-center justify-center text-center p-2 bg-red-900/50">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p className="text-red-300 text-xs mb-3">{state.message}</p>
                        <button onClick={onGenerate} className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full hover:bg-red-500 transition-colors">Retry</button>
                    </div>
                );
            case 'ready':
                return (
                    <>
                        <img width="800" height="600" src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover" loading="lazy"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-3 flex flex-col justify-end">
                             <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={onPlay} className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-black/75 transition-colors" aria-label="Play video">
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"></path></svg>
                                </button>
                                <button onClick={onRegenerate} className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-black/75 transition-colors" aria-label="Regenerate video">
                                    <ArrowPathIcon className="w-5 h-5 text-white" />
                                </button>
                            </div>
                            <h3 className="text-white font-bold text-sm">{item.title}</h3>
                            <p className="text-xs text-slate-400">{item.duration}</p>
                        </div>
                    </>
                );
            case 'idle':
            default:
                return (
                    <>
                        <img width="800" height="600" src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover brightness-50" loading="lazy"/>
                        <div className="absolute inset-0 p-3 flex flex-col items-center justify-center text-center">
                            <button onClick={onGenerate} className="bg-red-600 text-white font-bold py-2 px-5 rounded-full hover:bg-red-500 transition-colors">
                                Generate
                            </button>
                            <p className="text-xs text-slate-300 mt-2">{item.title}</p>
                        </div>
                    </>
                );
        }
    };

    return (
        <div 
            onClick={state.status === 'ready' ? onPlay : undefined}
            className={`w-40 md:w-56 aspect-[2/3] relative group flex-shrink-0 bg-slate-900 rounded-md overflow-hidden transition-all duration-300 ease-in-out shadow-lg 
                ${state.status === 'ready' ? 'cursor-pointer hover:scale-110 hover:z-20 hover:shadow-red-600/50' : ''}`}
            aria-label={`Video: ${item.title}. Status: ${state.status}`}
        >
            {renderContent()}
            {item.isWebinar && <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">WEBINAR</div>}
        </div>
    );
};

const VideoReelModal: React.FC<{ videos: Video[]; startIndex: number; isOpen: boolean; onClose: () => void; }> = ({ videos, startIndex, isOpen, onClose }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const activeVideoRef = useRef<HTMLVideoElement | null>(null);
    const [currentIndex, setCurrentIndex] = useState(startIndex);
    const [isPlaying, setIsPlaying] = useState(true);
    const [progress, setProgress] = useState(0);
    const playButtonRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            const container = containerRef.current;
            if (container) {
                const slideHeight = container.clientHeight;
                container.scrollTop = startIndex * slideHeight;
            }
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => { document.body.style.overflow = 'auto'; };
    }, [isOpen, startIndex]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container || !isOpen) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    const videoElement = entry.target.querySelector('video');
                    if (entry.isIntersecting) {
                        if (videoElement) {
                            videoElement.play().catch(() => {});
                            activeVideoRef.current = videoElement;
                            setIsPlaying(true);
                            const newIndex = parseInt(videoElement.dataset.index || '0', 10);
                            setCurrentIndex(newIndex);
                        }
                    } else {
                        if (videoElement) {
                            videoElement.pause();
                            videoElement.currentTime = 0;
                        }
                    }
                });
            },
            { threshold: 0.7 }
        );

        const slides = container.querySelectorAll('.reel-slide');
        slides.forEach(slide => observer.observe(slide));

        return () => {
            slides.forEach(slide => observer.unobserve(slide));
            activeVideoRef.current?.pause();
        };
    }, [isOpen, videos]);

    useEffect(() => {
        const video = activeVideoRef.current;
        if (!video) return;

        const updateProgress = () => {
            if (video.duration) {
                setProgress((video.currentTime / video.duration) * 100);
            }
        };

        video.addEventListener('timeupdate', updateProgress);
        return () => video.removeEventListener('timeupdate', updateProgress);
    }, [currentIndex, isPlaying]);

    const togglePlay = () => {
        const video = activeVideoRef.current;
        if (video) {
            if (video.paused) {
                video.play().catch(() => {});
                setIsPlaying(true);
                 if (playButtonRef.current) {
                    playButtonRef.current.classList.add('play-confetti-burst');
                    setTimeout(() => playButtonRef.current?.classList.remove('play-confetti-burst'), 500);
                }
            } else {
                video.pause();
                setIsPlaying(false);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`reel-viewer-modal ${isOpen ? 'open' : ''}`}>
            <div ref={containerRef} className="reel-container">
                {videos.map((video, index) => (
                    <div key={video.id} className="reel-slide">
                        <video
                            src={video.video_url}
                            poster={video.thumbnail_url}
                            loop
                            muted
                            playsInline
                            data-index={index}
                        ></video>
                        <div className="reel-overlay">
                            <div>
                                <h3 className="text-white text-lg font-bold">{video.title}</h3>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {video.tags.map(tag => <span key={tag} className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">{tag}</span>)}
                                </div>
                            </div>
                            <div>
                                <p className="text-white text-sm">{video.quip}</p>
                            </div>
                        </div>
                        <div className="absolute inset-0 reel-ui-interactive" onClick={togglePlay}>
                            <div ref={playButtonRef} className={`play-pause-overlay ${!isPlaying ? 'visible' : ''}`}>
                                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"></path></svg>
                            </div>
                        </div>
                        <div className="rebar-progress-bar">
                             <div className="rebar-progress-fill" style={{ width: `${currentIndex === index ? progress : 0}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
            <button 
                onClick={onClose} 
                className="absolute top-3 right-3 sm:top-6 sm:right-6 w-11 h-11 sm:w-12 sm:h-12 min-h-[44px] min-w-[44px] flex items-center justify-center bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-full text-white text-2xl z-20 reel-ui-interactive cursor-pointer shadow-lg active:scale-95" 
                aria-label="Close video reel"
            >
                &times;
            </button>
        </div>
    );
};

const ParallaxHero = ({ data }: { data: PortfolioData }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if (videoRef.current) {
                        videoRef.current.style.transform = `translate3d(0, ${window.scrollY * 0.3}px, 0)`;
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="relative min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] w-full flex flex-col justify-center items-center text-center px-4 sm:px-6 pt-24 pb-20 sm:pb-32 overflow-hidden rippling-metal">
            <video 
                ref={videoRef}
                src={data.hero.videoUrl} 
                className="absolute top-0 left-0 w-full h-full object-cover opacity-30 will-change-transform" 
                autoPlay 
                loop 
                muted 
                playsInline 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30"></div>
            <div className="relative z-10 max-w-4xl mx-auto px-2">
                <h1 className="netflix-sans text-3xl sm:text-5xl md:text-6xl text-red-600 font-extrabold tracking-wider" style={{ textShadow: '0 0 15px rgba(0,0,0,0.7)' }}>
                    {data.hero.title}
                </h1>
                <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
                    <h2 className="text-white text-xl sm:text-3xl md:text-5xl font-bold tracking-tight">Builder: Infrastructure &amp; Digital Product</h2>
                    <p className="text-slate-300 text-xs sm:text-base md:text-lg max-w-3xl mx-auto leading-relaxed">Proven track record executing landmark African projects including the Grand Ethiopian Renaissance Dam, powered by advanced UI/UX, AI workflows development.</p>
                </div>
            </div>
        </div>
    );
};

// --- Main Portfolio Component ---
export const Portfolio: React.FC<{
    setView: (view: View) => void;
}> = ({ setView }) => {
    const portfolioData = usePortfolioData();
    const { searchQuery, setSearchQuery } = useSearch();
    const [data, setData] = useState<PortfolioData | null>(null);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
    const [selectedSlides, setSelectedSlides] = useState<Slide[] | null>(null);
    const [selectedAppStoreDesign, setSelectedAppStoreDesign] = useState<Design | null>(null);
    const [isComingSoonModalOpen, setIsComingSoonModalOpen] = useState(false);
    const [isReelOpen, setIsReelOpen] = useState(false);
    const [activeReelIndex, setActiveReelIndex] = useState(0);
    const [videoStates, setVideoStates] = useState<Record<string, VideoGenerationState>>({});
    const [regenerationVideo, setRegenerationVideo] = useState<Video | null>(null);
    
    const [projectGalleryState, setProjectGalleryState] = useState<Record<string, string[]>>({});
    const [projectPosterState, setProjectPosterState] = useState<Record<string, string>>({});

    useEffect(() => { if (portfolioData) { setData(portfolioData as any); const initialStates: Record<string, VideoGenerationState> = {}; (portfolioData as any).videos.forEach((v: Video) => { initialStates[v.id] = { status: 'idle' }; }); setVideoStates(initialStates); }

        const originalTitle = document.title;
        const originalDescription = document.querySelector('meta[name="description"]');
        const originalDescriptionContent = originalDescription ? originalDescription.getAttribute('content') : '';

        document.title = "Now Streaming: The Menkir Wolde Showcase";
        const metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        metaDescription.content = "A Netflix-inspired professional portfolio showcasing the projects, blogs, and creative work of Menkir Wolde. Grab your popcorn and start binge-watching a career.";
        document.head.appendChild(metaDescription);

        return () => {
            document.title = originalTitle;
            const currentMeta = document.querySelector('meta[name="description"]');
            if (currentMeta) {
                currentMeta.remove();
            }
            if (originalDescriptionContent) {
                 const restoredMeta = document.createElement('meta');
                 restoredMeta.name = 'description';
                 restoredMeta.content = originalDescriptionContent;
                 document.head.appendChild(restoredMeta);
            }
        };
    }, [portfolioData]);

    const handleUpdateProjectMedia = (projectId: string, index: number, file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target?.result as string;
            if (index === 0) {
                setProjectPosterState(prev => ({ ...prev, [projectId]: dataUrl }));
            } else {
                setProjectGalleryState(prev => {
                    const currentGallery = [...(prev[projectId] || data?.projects.find(p => p.id === projectId)?.gallery || [])];
                    currentGallery[index - 1] = dataUrl;
                    return { ...prev, [projectId]: currentGallery };
                });
            }
        };
        reader.readAsDataURL(file);
    };

    const handleGenerateVideo = async (video: Video, promptOverride?: string) => {
        setVideoStates(prev => ({ ...prev, [video.id]: { status: 'generating', message: 'Initializing cinematic generator...' } }));

        try {
            const promptToUse = promptOverride || video.prompt;

            let operation = await generateVideos({
                model: 'veo-3.1-lite-generate-preview',
                prompt: promptToUse,
                config: {
                    numberOfVideos: 1,
                    resolution: '720p',
                    aspectRatio: '9:16'
                }
            });
            
            const loadingMessages = [
                "Initializing cinematic render cameras...",
                "Storyboarding the architectural sequence...",
                "Synthesizing high-frame-rate vectors...",
                "Applying lighting, reflections, and grade...",
                "Compositing 3D scene elements...",
                "Finalizing video export..."
            ];
            let messageIndex = 0;
            let polls = 0;
            const maxPolls = 60; // 10 minutes maximum

            while (!operation.done && polls < maxPolls) {
                setVideoStates(prev => ({ ...prev, [video.id]: { status: 'generating', message: loadingMessages[messageIndex % loadingMessages.length] }}));
                messageIndex++;
                polls++;
                await new Promise(resolve => setTimeout(resolve, 8000));
                operation = await getVideosOperation({ operationName: operation.name });
            }

            if (operation.error) {
                throw new Error(operation.error.message || 'Video generation failed.');
            }
            if (!operation.done) {
                throw new Error("Video generation timed out. Please try again.");
            }

            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
            if (!downloadLink) {
                throw new Error("Video generation completed but no video source was returned.");
            }

            const videoBlob = await downloadVideo(downloadLink);
            const videoUrl = URL.createObjectURL(videoBlob);
            
            setVideoStates(prev => ({ ...prev, [video.id]: { status: 'ready', url: videoUrl } }));

        } catch (err: any) {
            const errorMessage = err.message || "An error occurred during video generation.";
            setVideoStates(prev => ({ ...prev, [video.id]: { status: 'error', message: errorMessage } }));
            console.error("Video generation error:", err);
        }
    };

    const handleSelectKeyAndRetry = async (video: Video) => {
        handleGenerateVideo(video);
    };

    const getDesignClickHandler = (design: Design) => {
        return () => setSelectedAppStoreDesign(design);
    };

    const videosForReel = useMemo(() => {
        if (!data) return [];
        return data.videos
            .map(video => ({
                ...video,
                video_url: videoStates[video.id]?.status === 'ready' ? videoStates[video.id].url! : ''
            }))
            .filter(video => video.video_url); 
    }, [data, videoStates]);

    const openReel = (index: number) => {
        if (!data) return;
        const clickedVideoId = data.videos[index].id;
        const reelIndex = videosForReel.findIndex(v => v.id === clickedVideoId);

        if (reelIndex > -1) {
            setActiveReelIndex(reelIndex);
            setIsReelOpen(true);
        }
    };

    const filteredData = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();
        if (!query || !data) {
            return data;
        }

        const projects = data.projects.filter(p => 
            p.title.toLowerCase().includes(query) ||
            p.tags.some(tag => tag.toLowerCase().includes(query)) ||
            (p.overview || '').toLowerCase().includes(query) ||
            p.plot.toLowerCase().includes(query) ||
            p.quip.toLowerCase().includes(query)
        );

        const blogs = data.blogs.filter(b =>
            b.title.toLowerCase().includes(query) ||
            b.tags.some(tag => tag.toLowerCase().includes(query)) ||
            b.excerpt.toLowerCase().includes(query) ||
            b.markdown_content.toLowerCase().includes(query)
        );
        
        const designs = data.designs.filter(d =>
            d.name.toLowerCase().includes(query) ||
            d.description.toLowerCase().includes(query) ||
            d.tech_stack.toLowerCase().includes(query) ||
            d.hover_quip.toLowerCase().includes(query)
        );

        const videos = data.videos.filter(v =>
            v.title.toLowerCase().includes(query) ||
            v.tags.some(tag => tag.toLowerCase().includes(query)) ||
            v.quip.toLowerCase().includes(query)
        );

        return { ...data, projects, blogs, designs, videos };
    }, [data, searchQuery]);

    if (!data || !filteredData) {
        return <div className="min-h-screen flex items-center justify-center text-white">Loading the Binge...</div>;
    }

    const featuredProjects = data.projects.filter(p => data.featured.includes(p.id));
    const hasSearchQuery = searchQuery.trim().length > 0;
    const noResults = hasSearchQuery && filteredData.projects.length === 0 && filteredData.blogs.length === 0 && filteredData.designs.length === 0 && filteredData.videos.length === 0;

    return (
        <div className="min-h-screen overflow-y-auto">
            {/* Hero Section */}
            <ParallaxHero data={data} />

            <main className="py-8 sm:py-12 -mt-10 sm:-mt-16 md:-mt-24 relative z-10">
                <div className="px-4 sm:px-8 md:px-12 mb-6 sm:mb-8 max-w-4xl">
                    <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 mt-4 sm:mt-6">
                        <a 
                            href="mailto:mon14yee@gmail.com" 
                            className="bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold py-2.5 sm:py-3 px-5 sm:px-7 rounded-lg shadow-lg transition-all text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center cursor-pointer min-h-[44px] focus-visible:ring-2 focus-visible:ring-red-500"
                        >
                            Contact Me
                        </a>
                        <button 
                            onClick={() => setView('resume')} 
                            className="bg-slate-900 border border-slate-700 hover:border-slate-500 hover:bg-slate-800 active:scale-95 text-white font-bold py-2.5 sm:py-3 px-5 sm:px-7 rounded-lg shadow-lg transition-all text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center cursor-pointer min-h-[44px] focus-visible:ring-2 focus-visible:ring-red-500"
                        >
                            Resume / CV
                        </button>
                        <button 
                            onClick={() => window.dispatchEvent(new CustomEvent('open-download-modal', { detail: { project: 'Engineering Architecture Portfolio' } }))}
                            className="bg-slate-900 border border-red-500/50 hover:bg-red-600/20 active:scale-95 text-white font-bold py-2.5 sm:py-3 px-5 sm:px-7 rounded-lg shadow-lg transition-all text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer min-h-[44px] focus-visible:ring-2 focus-visible:ring-red-500"
                        >
                            <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            <span>Request Design Spec</span>
                        </button>
                        <a 
                            href="https://t.me/frontenddesigns" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="bg-slate-900 border border-slate-700 hover:border-slate-500 hover:bg-slate-800 active:scale-95 text-white font-bold py-2.5 sm:py-3 px-5 sm:px-7 rounded-lg shadow-lg transition-all text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center cursor-pointer min-h-[44px] focus-visible:ring-2 focus-visible:ring-red-500"
                        >
                            Telegram Channel
                        </a>
                    </div>
                </div>

                {hasSearchQuery ? (
                    noResults ? (
                        <div className="text-center py-20 px-4 max-w-md mx-auto">
                            <div className="w-16 h-16 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto mb-4 text-slate-400">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-slate-200">No results found for &ldquo;{searchQuery}&rdquo;</h2>
                            <p className="text-slate-400 text-sm mt-2 mb-6">We couldn&apos;t find matching projects, designs, or technical articles for this search.</p>
                            <button 
                                onClick={() => setSearchQuery('')}
                                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-semibold rounded-lg text-xs transition-all shadow-lg cursor-pointer"
                            >
                                Clear Search Query
                            </button>
                        </div>
                    ) : (
                        <>
                            {filteredData.projects.length > 0 && (
                                <ContentRow title="Project Results">
                                                                        {filteredData.projects.map(project => <Thumbnail key={project.id} item={project} onClick={() => {
                                        if (project.id === 'proj9') {
                                            setView('main');
                                        } else if (project.id === 'proj-coastal') {
                                            setView('design');
                                        } else if (project.id === 'proj-fluid') {
                                            setView('interface');
                                        } else {
                                            setSelectedProject(project);
                                        }
                                    }} />)}
                                </ContentRow>
                            )}
                             {filteredData.designs.length > 0 && (
                                <div className="design-store-row-container my-8">
                                <ContentRow title={<><span className="text-red-600">■</span> Digital Product Results</>}>
                                    {filteredData.designs.map(design => 
                                        <DesignThumbnail key={design.id} design={design} onInstallClick={getDesignClickHandler(design)} />
                                    )}
                                </ContentRow>
                                </div>
                            )}
                            {filteredData.blogs.length > 0 && (
                                <ContentRow title="Blog Results">
                                    {filteredData.blogs.map(blog => <Thumbnail key={blog.id} item={blog} onClick={() => setSelectedBlog(blog)} />)}
                                </ContentRow>
                            )}
                            {filteredData.videos.length > 0 && (
                                <>
                                    <ContentRow title="Video & Webinar Results">
                                        {filteredData.videos.map((video, index) => (
                                            <VideoThumbnail
                                                key={video.id}
                                                item={video}
                                                state={videoStates[video.id] || { status: 'idle' }}
                                                onPlay={() => openReel(index)}
                                                onGenerate={() => handleGenerateVideo(video)}
                                                onRegenerate={() => setRegenerationVideo(video)}
                                                onSelectKey={() => handleSelectKeyAndRetry(video)}
                                            />
                                        ))}
                                    </ContentRow>
                                </>
                            )}
                        </>
                    )
                ) : (
                    <>
                        <div id="featured-presentations">
                            <ContentRow title={<span className="flex items-center gap-2">Featured Presentations <SparklesIcon className="w-5 h-5 text-red-600" /></span>}>
                                                                {featuredProjects.map(project => <Thumbnail key={project.id} item={project} onClick={() => {
                                    if (project.id === 'proj9') {
                                        setView('main');
                                    } else if (project.id === 'proj-coastal') {
                                        setView('design');
                                    } else if (project.id === 'proj-fluid') {
                                        setView('interface');
                                    } else {
                                        setSelectedProject(project);
                                    }
                                }} />)}
                            </ContentRow>
                        </div>
                        <div className="design-store-row-container my-8">
                             <ContentRow title={<><span className="text-red-600">■</span> Digital Product</>}>
                                {data.designs.map(design => 
                                    <DesignThumbnail key={design.id} design={design} onInstallClick={getDesignClickHandler(design)} />
                                )}
                            </ContentRow>
                        </div>
                        <ContentRow title="From The Blog">
                            {data.blogs.map(blog => <Thumbnail key={blog.id} item={blog} onClick={() => setSelectedBlog(blog)} />)}
                        </ContentRow>
                        <ContentRow title="Videos & Webinars">
                            {data.videos.map((video, index) => (
                                <VideoThumbnail
                                    key={video.id}
                                    item={video}
                                    state={videoStates[video.id] || { status: 'idle' }}
                                    onPlay={() => openReel(index)}
                                    onGenerate={() => handleGenerateVideo(video)}
                                    onRegenerate={() => setRegenerationVideo(video)}
                                    onSelectKey={() => handleSelectKeyAndRetry(video)}
                                />
                            ))}
                        </ContentRow>
                    </>
                )}
            </main>

            <ProjectModal 
                project={selectedProject} 
                onClose={() => setSelectedProject(null)} 
                onUpdateMedia={handleUpdateProjectMedia}
                projectGalleryState={projectGalleryState}
                projectPosterState={projectPosterState}
                isFeatured={selectedProject ? data.featured.includes(selectedProject.id) : false}
            />
            <BlogModal 
                blog={selectedBlog} 
                onClose={() => setSelectedBlog(null)} 
                onOpenSlides={(slides) => setSelectedSlides(slides)}
            />
            <SlideshowModal slides={selectedSlides} onClose={() => setSelectedSlides(null)} />
            {selectedAppStoreDesign && <AppStoreModal design={selectedAppStoreDesign} onClose={() => setSelectedAppStoreDesign(null)} />}
            {isComingSoonModalOpen && <ComingSoonModal onClose={() => setIsComingSoonModalOpen(false)} />}
            <VideoReelModal videos={videosForReel} startIndex={activeReelIndex} isOpen={isReelOpen} onClose={() => setIsReelOpen(false)} />
            <RegenerationModal
                video={regenerationVideo}
                onClose={() => setRegenerationVideo(null)}
                onGenerate={(prompt) => {
                    if (regenerationVideo) {
                        handleGenerateVideo(regenerationVideo, prompt);
                    }
                    setRegenerationVideo(null);
                }}
            />
        </div>
    );
};