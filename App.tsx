
import React, { useState, useEffect, useRef, useContext, createContext, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { PortfolioDataProvider } from './components/PortfolioDataProvider';
import { Footer } from './components/Footer';
import { DownloadModal } from './components/DownloadModal';

const Portfolio = lazy(() => import('./components/Portfolio').then(m => ({ default: m.Portfolio })));
const InterfaceView = lazy(() => import('./components/InterfaceView').then(m => ({ default: m.InterfaceView })));
const DesignView = lazy(() => import('./components/DesignView').then(m => ({ default: m.DesignView })));
const PhotosView = lazy(() => import('./components/PhotosView').then(m => ({ default: m.PhotosView })));
const Resume = lazy(() => import('./components/Resume'));
const Hero = lazy(() => import('./components/Hero').then(m => ({ default: m.Hero })));
const FeatureSection = lazy(() => import('./components/FeatureSection').then(m => ({ default: m.FeatureSection })));
const FinalCTA = lazy(() => import('./components/FinalCTA').then(m => ({ default: m.FinalCTA })));
import { Season, Currency, ExchangeRates, CurrencyContext, CurrencyContextType, View, GoalsContext, GoalsContextType, GoalNode, TimelineEvent, SearchContext, SearchContextType } from './types';
import { FeatureContent } from './constants';

// --- Goals Management ---


const initialGoals: GoalNode[] = [
    { id: 'career', name: 'Career', color: 'bg-sky-500' },
    { id: 'wellness', name: 'Wellness', color: 'bg-emerald-500' },
    { id: 'legacy', name: 'Legacy', color: 'bg-indigo-500' },
];

const GoalsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [availableGoals, setAvailableGoals] = useState<GoalNode[]>(() => {
        const saved = localStorage.getItem('life-architect-available-goals');
        return saved ? JSON.parse(saved) : initialGoals;
    });
    const [orbitingGoals, setOrbitingGoals] = useState<GoalNode[]>(() => {
        const saved = localStorage.getItem('life-architect-orbiting-goals');
        return saved ? JSON.parse(saved) : [];
    });
    const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(() => {
        const saved = localStorage.getItem('life-architect-timeline-events');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('life-architect-available-goals', JSON.stringify(availableGoals));
    }, [availableGoals]);
    
    useEffect(() => {
        localStorage.setItem('life-architect-orbiting-goals', JSON.stringify(orbitingGoals));
    }, [orbitingGoals]);

    useEffect(() => {
        localStorage.setItem('life-architect-timeline-events', JSON.stringify(timelineEvents));
    }, [timelineEvents]);

    const contextValue = React.useMemo(() => ({
        availableGoals, setAvailableGoals, orbitingGoals, setOrbitingGoals, timelineEvents, setTimelineEvents
    }), [availableGoals, orbitingGoals, timelineEvents]);

    return (
        <GoalsContext.Provider value={contextValue}>
            {children}
        </GoalsContext.Provider>
    );
};

export const useGoals = () => {
    const context = useContext(GoalsContext);
    if (!context) throw new Error('useGoals must be used within GoalsProvider');
    return context;
};

// --- Currency Management ---

// Static rates with USD as the base
const exchangeRates: ExchangeRates = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 157.2,
    ETB: 57.3
};

const currencySymbols: Record<Currency, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    ETB: 'Br'
};

// Provider Component
const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currency, setCurrencyState] = useState<Currency>(() => {
        // Fallback to 'USD' if localStorage is not available or value is invalid
        const savedCurrency = localStorage.getItem('life-architect-currency');
        return (savedCurrency && exchangeRates[savedCurrency as Currency]) ? (savedCurrency as Currency) : 'USD';
    });

    useEffect(() => {
        localStorage.setItem('life-architect-currency', currency);
    }, [currency]);

    const setCurrency = (newCurrency: Currency) => {
        if (exchangeRates[newCurrency]) {
            setCurrencyState(newCurrency);
        }
    };

    const getSymbol = (curr: Currency = currency): string => currencySymbols[curr];

    const convertFromUSD = (amount: number, targetCurrency: Currency = currency): number => {
        if (isNaN(amount)) return 0;
        return amount * exchangeRates[targetCurrency];
    };
    
    const convertToUSD = (amount: number, sourceCurrency: Currency = currency): number => {
        if (isNaN(amount)) return 0;
        return amount / exchangeRates[sourceCurrency];
    };

    const formatCurrency = (amountUSD: number, targetCurrency: Currency = currency): string => {
        const convertedAmount = convertFromUSD(amountUSD, targetCurrency);
        const symbol = getSymbol(targetCurrency);
        
        const formatter = new Intl.NumberFormat(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

        // Ethiopian Birr format often places the symbol after the number, but for consistency we'll prefix.
        return `${symbol}${formatter.format(convertedAmount)}`;
    };

    const contextValue: CurrencyContextType = React.useMemo(() => ({
        currency,
        setCurrency,
        rates: exchangeRates,
        getSymbol,
        formatCurrency,
        convertFromUSD,
        convertToUSD,
    }), [currency]);

    return <CurrencyContext.Provider value={contextValue}>{children}</CurrencyContext.Provider>;
};

// Custom hook for easy context access
export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};


const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const contextValue = React.useMemo(() => ({ searchQuery, setSearchQuery }), [searchQuery]);
    return (
        <SearchContext.Provider value={contextValue}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (!context) throw new Error('useSearch must be used within SearchProvider');
    return context;
};

const routeMetadata: Record<string, { title: string; description: string; path: string }> = {
    '/': {
        title: 'Menkir Wolde | Civil Engineer & Digital Product Architect',
        description: 'Explore the portfolio of Menkir Wolde: Grand Ethiopian Renaissance Dam (GERD) civil engineering landmarks, concrete technology, and elite digital product architecture.',
        path: '/',
    },
    '/interface': {
        title: 'Interface Engineering & Mega Systems | Menkir Wolde',
        description: 'Discover interactive structural systems, civil engineering calculators, and digital infrastructure tools designed and engineered by Menkir Wolde.',
        path: '/interface',
    },
    '/design': {
        title: 'Digital Product Design & Mobile Systems | Menkir Wolde',
        description: 'Showcasing high-impact mobile UX/UI, fintech ecosystems, productivity platforms, and engineering calculation apps designed by Menkir Wolde.',
        path: '/design',
    },
    '/photos': {
        title: 'Visual Expeditions & Architectural Fieldwork | Menkir Wolde',
        description: 'A curated visual archive of civil engineering fieldwork, mega-dam construction sites, structural inspections, and architectural expeditions by Menkir Wolde.',
        path: '/photos',
    },
    '/resume': {
        title: 'Executive Resume & Credentials | Menkir Wolde',
        description: 'Verified professional curriculum vitae, 10+ years of civil engineering leadership on GERD mega-projects, software architecture skills, and credentials of Menkir Wolde.',
        path: '/resume',
    },
    '/main': {
        title: 'Engineering Landmark Showcase & Digital Lab | Menkir Wolde',
        description: 'Comprehensive engineering showcase, technical features, structural calculation suite, and contact portal for Menkir Wolde.',
        path: '/main',
    },
};

const RouteChangeListener = () => {
    const location = useLocation();
    const { setSearchQuery } = useSearch();
    
    useEffect(() => {
        setSearchQuery('');

        const meta = routeMetadata[location.pathname] || routeMetadata['/'];
        document.title = meta.title;

        // Meta description
        let descMeta = document.querySelector('meta[name="description"]');
        if (!descMeta) {
            descMeta = document.createElement('meta');
            descMeta.setAttribute('name', 'description');
            document.head.appendChild(descMeta);
        }
        descMeta.setAttribute('content', meta.description);

        // Canonical link
        const canonicalUrl = `https://menkir.dev${meta.path === '/' ? '' : meta.path}`;
        let canonicalLink = document.querySelector('link[rel="canonical"]');
        if (!canonicalLink) {
            canonicalLink = document.createElement('link');
            canonicalLink.setAttribute('rel', 'canonical');
            document.head.appendChild(canonicalLink);
        }
        canonicalLink.setAttribute('href', canonicalUrl);

        // Open Graph & Twitter
        const setMetaTag = (attr: 'property' | 'name', key: string, content: string) => {
            let el = document.querySelector(`meta[${attr}="${key}"]`);
            if (!el) {
                el = document.createElement('meta');
                el.setAttribute(attr, key);
                document.head.appendChild(el);
            }
            el.setAttribute('content', content);
        };

        setMetaTag('property', 'og:title', meta.title);
        setMetaTag('property', 'og:description', meta.description);
        setMetaTag('property', 'og:url', canonicalUrl);
        setMetaTag('name', 'twitter:title', meta.title);
        setMetaTag('name', 'twitter:description', meta.description);
        setMetaTag('name', 'twitter:url', canonicalUrl);
    }, [location.pathname, setSearchQuery]);
    
    return null;
};

const AppContent: React.FC = () => {
    const [season, setSeason] = useState<Season>(() => {
        const saved = localStorage.getItem('menkir_preferred_season');
        if (saved !== null) {
            const parsed = parseInt(saved, 10);
            if (!isNaN(parsed) && parsed in Season) {
                return parsed as Season;
            }
        }
        return Season.Winter;
    });

    const handleSeasonChange = (newSeason: Season) => {
        setSeason(newSeason);
        localStorage.setItem('menkir_preferred_season', String(newSeason));
    };

    const sectionRefs = useRef<(HTMLElement | null)[]>([]);
    const location = useLocation();
    const navigate = useNavigate();

    const currentView = (location.pathname === '/' ? 'portfolio' : location.pathname.substring(1)) as View;

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            {
                rootMargin: '0px',
                threshold: 0.1
            }
        );

        sectionRefs.current.forEach((ref) => {
            if (ref) {
                observer.observe(ref);
            }
        });

        return () => {
            sectionRefs.current.forEach((ref) => {
                if (ref) {
                    observer.unobserve(ref);
                }
            });
            observer.disconnect();
        };
    }, [currentView]); // Re-run when view changes to observe new elements
    
    const handleSetView = (view: View) => {
        window.scrollTo(0, 0);
        if (view === 'portfolio') {
            navigate('/');
        } else {
            navigate(`/${view}`);
        }
    };

    const seasonalClasses: Record<Season, string> = {
        [Season.Winter]: 'seasonal-bg-winter',
        [Season.Spring]: 'seasonal-bg-spring',
        [Season.Fall]: 'seasonal-bg-fall',
    };

    const MainContent = () => (
        <div className="bg-[#030303] text-zinc-500 font-sans selection:bg-zinc-800/50 relative overflow-hidden">
            {/* Extreme Grain overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.25] z-50 mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
            
            <main className="relative z-10">
                <Hero />
                <div className="flex flex-col gap-[40vh] py-[30vh]">
                    {FeatureContent.map((feature, index) => (
                        <FeatureSection
                            key={index}
                            id={feature.id}
                            title={feature.title}
                            description={feature.description}
                            index={index}
                            ref={el => { sectionRefs.current[index] = el }}
                        >
                            {feature.visual}
                        </FeatureSection>
                    ))}
                </div>
                <FinalCTA ref={el => { sectionRefs.current[FeatureContent.length] = el }}/>
            </main>
            <Footer />
        </div>
    );


    

    return (
        <div className={`relative min-h-screen bg-black overflow-x-hidden ${currentView === 'portfolio' ? 'portfolio-active' : ''}`}>
            <RouteChangeListener />
            <div className={`absolute inset-0 transition-opacity duration-1000 ${seasonalClasses[season]}`}></div>
            <div className="relative z-10">
                {currentView !== 'resume' && (
                    <Header 
                        setView={handleSetView} 
                        season={season}
                        currentView={currentView}
                    />
                )}
                
                <Suspense fallback={<div className="min-h-screen w-full bg-black" />}>
                    <Routes>
                        <Route path="/" element={
                            <>
                                <Portfolio setView={handleSetView} />
                                <Footer variant="portfolio" />
                            </>
                        } />
                        <Route path="/interface" element={
                            <>
                                <InterfaceView />
                                <Footer />
                            </>
                        } />
                        <Route path="/design" element={
                            <>
                                <DesignView />
                                <Footer />
                            </>
                        } />
                        <Route path="/photos" element={
                            <>
                                <PhotosView />
                                <Footer />
                            </>
                        } />
                        <Route path="/resume" element={<Resume setView={handleSetView} />} />
                        <Route path="/main" element={<MainContent />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Suspense>

                {/* Season Switcher for Theme Customization */}
                {currentView !== 'resume' && (
                    <div className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-40 bg-black/80 backdrop-blur-md p-1.5 sm:p-2 rounded-2xl border border-white/10 shadow-2xl">
                        <div className="flex items-center space-x-1.5 sm:space-x-2">
                            <span className="text-[11px] sm:text-xs text-slate-400 font-medium pl-1">Theme:</span>
                            <button 
                                onClick={() => handleSeasonChange(Season.Winter)} 
                                aria-label="Activate Cosmic Winter Theme"
                                title="Cosmic Winter"
                                className={`w-8 h-8 rounded-full border-2 ${season === Season.Winter ? 'border-white scale-110 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'} bg-blue-900 flex items-center justify-center text-white transition-all cursor-pointer text-xs focus-visible:ring-2 focus-visible:ring-blue-400`}
                            >
                                ❄
                            </button>
                            <button 
                                onClick={() => handleSeasonChange(Season.Spring)} 
                                aria-label="Activate Blueprint Spring Theme"
                                title="Blueprint Spring"
                                className={`w-8 h-8 rounded-full border-2 ${season === Season.Spring ? 'border-white scale-110 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'} bg-pink-400 flex items-center justify-center text-black transition-all cursor-pointer text-xs focus-visible:ring-2 focus-visible:ring-pink-300`}
                            >
                                🌸
                            </button>
                            <button 
                                onClick={() => handleSeasonChange(Season.Fall)} 
                                aria-label="Activate Terracotta Fall Theme"
                                title="Terracotta Fall"
                                className={`w-8 h-8 rounded-full border-2 ${season === Season.Fall ? 'border-white scale-110 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'} bg-amber-600 flex items-center justify-center text-white transition-all cursor-pointer text-xs focus-visible:ring-2 focus-visible:ring-amber-400`}
                            >
                                🍂
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <GoalsProvider>
        <CurrencyProvider>
        <SearchProvider>
            <PortfolioDataProvider>
                <Router>
                    <AppContent />
                    <DownloadModal />
                </Router>
            </PortfolioDataProvider>
        </SearchProvider>
        </CurrencyProvider>
        </GoalsProvider>
    );
};

export default App;
