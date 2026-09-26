import React from 'react';

export const AppStoreIcon: React.FC = () => (
    <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="Download on the App Store" className="h-12" width="120" height="48" loading="lazy" />
);

export const PlayStoreIcon: React.FC = () => (
    <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" className="h-12" width="120" height="48" loading="lazy" />
);

export const EmailIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
    </svg>
);

export const InstagramIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className || "w-6 h-6"} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.08 2.525c.636-.247 1.363-.416 2.427-.465C9.53 2.013 9.884 2 12.315 2zM12 7a5 5 0 100 10 5 5 0 000-10zm0-2a7 7 0 110 14 7 7 0 010-14zm4.5-1.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clipRule="evenodd" />
    </svg>
);

export const LinkedInIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className || "w-6 h-6"} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
);

export const TelegramIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className || "w-6 h-6"} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9.78,18.65l.28-4.23l7.68-6.92c.34-.31-.07-.48-.52-.19L7.74,13.3L3.62,12.15c-.71-.22-.72-1.03.14-1.51L21.29,3.15c.62-.24,1.04.14.85.89l-2.88,13.82c-.16.74-.59.93-1.12.59l-4.26-3.11l-2.02,1.93c-.22.22-.4.4-.75.4Z"/>
    </svg>
);

export const YouTubeIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className || "w-6 h-6"} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M19.802 7.039a2.43 2.43 0 0 0-1.72-1.72C16.538 5 12 5 12 5s-4.538 0-6.082.319a2.43 2.43 0 0 0-1.72 1.72C4 8.582 4 12 4 12s0 3.418.198 4.961a2.43 2.43 0 0 0 1.72 1.72c1.544.319 6.082.319 6.082.319s4.538 0 6.082-.319a2.43 2.43 0 0 0 1.72-1.72C20 15.418 20 12 20 12s0-3.418-.198-4.961zM9.75 14.85V9.15l5.5 2.85-5.5 2.85z" clipRule="evenodd"/>
    </svg>
);

export const TikTokIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className || "w-6 h-6"} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.03-4.83-.95-6.43-2.98-1.55-1.99-2.3-4.47-2.1-6.84.25-2.72 1.96-5.12 4.22-6.52.92-.56 1.9-1.02 2.89-1.39.02-2.5.01-4.99-.02-7.48.01-1.12.39-2.22 1.1-3.08.79-.86 1.86-1.31 2.95-1.42z"/>
    </svg>
);

export const NeuralNetworkIcon: React.FC = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="2"></circle>
        <circle cx="5" cy="5" r="2"></circle>
        <circle cx="19" cy="5" r="2"></circle>
        <circle cx="5" cy="19" r="2"></circle>
        <circle cx="19" cy="19" r="2"></circle>
        <path d="M12 14v5M12 3v5M14 12h5M3 12h5M6.5 6.5l4 4M17.5 6.5l-4 4M6.5 17.5l4-4M17.5 17.5l-4-4"></path>
    </svg>
);

export const PaletteIcon: React.FC = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13.2,2.2c-0.5-0.2-1.1,0-1.4,0.4c-0.3,0.4-0.3,1,0.1,1.3c2,1.8,3.2,4.4,3.2,7.1c0,2-0.6,3.9-1.8,5.4"></path>
        <path d="M12,14c-2.2,0-4,1.8-4,4c0,1.1,0.4,2.1,1.2,2.8c1.6,1.4,4,1.4,5.6,0c0.8-0.7,1.2-1.7,1.2-2.8C16,15.8,14.2,14,12,14z"></path>
        <path d="M16.8,11.3c0-0.3-0.1-0.6-0.2-0.9C15.9,8.7,14.6,8,13,8c-0.3,0-0.6,0-0.9,0.1c-1,0.2-1.9,0.7-2.6,1.4"></path>
        <circle cx="8" cy="6" r="1"></circle>
        <circle cx="6" cy="10" r="1"></circle>
        <circle cx="10" cy="3" r="1"></circle>
    </svg>
);

export const TrophyIcon: React.FC = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L12 5"></path>
        <path d="M6 8L6 11"></path>
        <path d="M18 8L18 11"></path>
        <path d="M12 18L12 22"></path>
        <path d="M10 22L14 22"></path>
        <path d="M8 5C6.34315 5 5 6.34315 5 8L5 15C5 18.3137 7.68629 21 11 21L13 21C16.3137 21 19 18.3137 19 15L19 8C19 6.34315 17.6569 5 16 5L8 5Z"></path>
        <path d="M8 5C8 3.34315 6.65685 2 5 2L4 2"></path>
        <path d="M16 5C16 3.34315 17.3431 2 19 2L20 2"></path>
    </svg>
);

export const GearIcon: React.FC<{size: number}> = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 12m-8 0a8 8 0 1 0 16 0a8 8 0 1 0 -16 0"></path>
        <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
        <path d="M12 2v2"></path><path d="M12 20v2"></path>
        <path d="m4.93 4.93 1.41 1.41"></path>
        <path d="m17.66 17.66 1.41 1.41"></path>
        <path d="m2 12h2"></path><path d="m20 12h2"></path>
        <path d="m4.93 19.07 1.41-1.41"></path>
        <path d="m17.66 6.34 1.41-1.41"></path>
    </svg>
);

export const ChevronDownIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
);

export const MenuIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6h16.5" />
    </svg>
);

export const CloseIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const SearchIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
);


// --- Feature Icons ---

const iconProps = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "w-full h-full"
};

export const GoalIcon: React.FC = () => (
    <svg {...iconProps}><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
);

export const TimelineIcon: React.FC = () => (
    <svg {...iconProps}><path d="M21 12H3m18 0l-4-4m4 4l-4 4M3 12l4-4M3 12l4 4"></path></svg>
);

export const BudgetIcon: React.FC = () => (
    <svg {...iconProps}><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"></path></svg>
);

export const PlannerIcon: React.FC = () => (
    <svg {...iconProps}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
);

export const DreamIcon: React.FC = () => (
    <svg {...iconProps}><path d="M21.73 18.73c-4.42-4.42-4.42-11.58 0-16M3 21.01l8-8M3.27 15.27C7.69 10.85 14.85 10.85 19.27 15.27"></path></svg>
);

export const EventIcon: React.FC = () => (
    <svg {...iconProps}><path d="M4.5 8.5h15M7 12h1m4 0h1m4 0h1M7 16h1m4 0h1m4 0h1"></path><path d="M8 6V4m8 2V4"></path><rect x="3" y="5" width="18" height="16" rx="2"></rect></svg>
);

export const VisionBoardIcon: React.FC = () => (
    <svg {...iconProps}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
);

export const SelfCareIcon: React.FC = () => (
    <svg {...iconProps}><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>
);

export const ReviewIcon: React.FC = () => (
    <svg {...iconProps}><path d="M1 4v6h6M23 20v-6h-6"></path><path d="M20.49 9A9 9 0 0012 5C8.49 5 5.31 6.34 3 8.24M3.51 15A9 9 0 0012 19c3.51 0 6.69-1.34 9-3.24"></path></svg>
);

export const NotesIcon: React.FC = () => (
    <svg {...iconProps}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
);

export const ReadingIcon: React.FC = () => (
    <svg {...iconProps}><path d="M4 19.5A2.5 2.5 0 016.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"></path></svg>
);

// --- Profile Modal Icons ---

export const CheckCircleIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>;
export const HammerWandIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10 3.75a.75.75 0 01.75.75v3.44l1.4-1.4a.75.75 0 011.06 1.06l-3.5 3.5a.75.75 0 01-1.06 0l-3.5-3.5a.75.75 0 111.06-1.06l1.4 1.4V4.5a.75.75 0 01.75-.75z" /><path d="M4.5 9.75a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v6a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75v-6zm10.5 0a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v6a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75v-6zM7.5 1.5a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0V1.5zm5.25 0a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0V1.5z" /></svg>;
export const MapPinIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.1.4-.27.61-.453l2.835-2.28a6.5 6.5 0 001.33-2.324 6.5 6.5 0 000-5.416 6.571 6.571 0 00-1.33-2.324L11.83 2.529a5.74 5.74 0 00-.61-.453A2.43 2.43 0 0010 2a2.43 2.43 0 00-.696.102q-.06.022-.116.046a5.74 5.74 0 00-.61.453L5.74 4.868A6.571 6.571 0 004.41 7.192a6.5 6.5 0 000 5.416 6.5 6.5 0 001.33 2.324l2.836 2.28a5.74 5.74 0 00.89.593zM10 8a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>;
export const ArrowLongRightIcon: React.FC<{className?: string}> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}><path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" /></svg>;
export const EnvelopeIcon: React.FC<{className?: string}> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}><path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" /><path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" /></svg>;
export const GlobeAltIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.74 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a.5.5 0 00.5.5h2a.5.5 0 00.5-.5V7.5a1.5 1.5 0 011.5-1.5c.526 0 .988-.26 1.256-.473a6.003 6.003 0 011.912 2.706A6.003 6.003 0 0115.668 12c0 .779-.22 1.513-.61 2.143a6.003 6.003 0 01-1.912 2.706C13.488 16.26 13.026 16 12.5 16a1.5 1.5 0 01-1.5-1.5v-.5a.5.5 0 00-.5-.5h-2a.5.5 0 00-.5.5v.5a1.5 1.5 0 01-1.5 1.5c-.526 0-.988.26-1.256.473a6.003 6.003 0 01-1.912-2.706A6.003 6.003 0 014.332 12c0-1.42.386-2.75.998-3.973z" clipRule="evenodd" /></svg>;
export const HeartIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="m9.653 16.915-.005-.003-.019-.01a20.759 20.759 0 0 1-1.162-.682 22.045 22.045 0 0 1-2.582-1.9-22.345 22.345 0 0 1-2.949-2.585 22.345 22.345 0 0 1-1.9-2.582 20.759 20.759 0 0 1-.682-1.162l-.01-.019-.003-.005a.75.75 0 0 1 .745-1.052a.75.75 0 0 1 .652.31c.174.269.37.538.58.829.21.292.43.596.659.915.23.319.47.653.724.996.254.343.525.698.815 1.062a21.41 21.41 0 0 0 3.344 3.344c.364.29.718.561 1.062.815.343.254.698.525.996.724.319.23.596.43.915.659.292.21.538.37.829.58.269.174.31.652.31.652a.75.75 0 0 1-1.052.745z" /></svg>;
export const UsersIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.095a1.23 1.23 0 0 0 .41-1.412A9.957 9.957 0 0 0 10 12c-2.31 0-4.438.784-6.131 2.095z" /></svg>;
export const ArrowPathIcon: React.FC<{className?: string}> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}><path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201-4.42 5.5 5.5 0 0 1 10.89 2.166l.274-1.137a.75.75 0 1 1 1.45.35l-1.64 6.8c-.118.49-.575.82-1.074.82H10.5a.75.75 0 0 1 0-1.5h2.123a4 4 0 0 0 3.688-5.392Z" clipRule="evenodd" /></svg>;
export const SparklesIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.393c-.842.07-1.168 1.063-.57 1.616l3.635 3.28-1.087 4.673c-.183.785.695 1.428 1.408 1.003l4.132-2.41 4.132 2.41c.713.425 1.591-.218 1.408-1.003l-1.087-4.673 3.635-3.28c.598-.553.272-1.547-.57-1.616l-4.753-.393L10.868 2.884z" clipRule="evenodd" /></svg>;