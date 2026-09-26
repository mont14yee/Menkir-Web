import { usePortfolioData } from './PortfolioDataProvider';
import React, { useState, useEffect } from 'react';
import { InstagramIcon, LinkedInIcon, EmailIcon, TelegramIcon, YouTubeIcon, TikTokIcon } from './IconComponents';
import { X, ShieldCheck, CheckCircle2 } from './ExtractedIcons';

export const Footer: React.FC<{ variant?: 'app' | 'portfolio' }> = ({ variant = 'app' }) => {
    const portfolioData = usePortfolioData();
    const [footerData, setFooterData] = useState<any>(null);
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
    const [newsletterError, setNewsletterError] = useState('');
    const [activePolicyModal, setActivePolicyModal] = useState<'privacy' | 'terms' | null>(null);

    useEffect(() => {
        if (portfolioData) setFooterData((portfolioData as any).footer);
        if (localStorage.getItem('menkir_newsletter_subscribed')) {
            setNewsletterSubscribed(true);
        }
    }, [portfolioData]);

    const handleNewsletterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setNewsletterError('');

        const trimmed = newsletterEmail.trim();
        if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) {
            setNewsletterError('Please enter a valid email address.');
            return;
        }

        // Store subscription locally
        localStorage.setItem('menkir_newsletter_subscribed', trimmed);
        setNewsletterSubscribed(true);
        setNewsletterEmail('');
    };

    return (
        <>
            <footer className="bg-black border-t border-slate-800 py-12">
                <div className="container mx-auto px-4 sm:px-6 text-center">
                    {variant === 'portfolio' && (
                        <div className="max-w-2xl mx-auto mb-10">
                            <h3 className="text-xl sm:text-2xl font-bold text-slate-100">Engineering Briefs &amp; Dispatches</h3>
                            <p className="mt-2 text-slate-400 text-xs sm:text-sm">
                                Receive technical notes, structural case studies, and infrastructure updates directly.
                            </p>

                            {newsletterSubscribed ? (
                                <div className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm flex items-center justify-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                                    <span>You are subscribed to technical updates. Thank you!</span>
                                </div>
                            ) : (
                                <form onSubmit={handleNewsletterSubmit} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                                    <input
                                        type="email"
                                        value={newsletterEmail}
                                        onChange={(e) => setNewsletterEmail(e.target.value)}
                                        placeholder="engineer@domain.com"
                                        className="bg-slate-900 border border-slate-700 rounded-lg py-2.5 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 flex-grow text-base sm:text-sm min-h-[44px]"
                                        aria-label="Email for newsletter"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        className="bg-red-600 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-red-700 active:scale-95 transition-all text-xs sm:text-sm cursor-pointer shadow-md min-h-[44px]"
                                    >
                                        Subscribe
                                    </button>
                                </form>
                            )}
                            {newsletterError && (
                                <p className="text-red-400 text-xs mt-2">{newsletterError}</p>
                            )}
                        </div>
                    )}

                    <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 my-6">
                        <a href="mailto:mon14ye@gmail.com" aria-label="Email Menkir" className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-400 hover:text-white transition-transform duration-300 hover:scale-110"><EmailIcon className="w-6 h-6" /></a>
                        <a href="https://t.me/Menkiree" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-400 hover:text-white transition-transform duration-300 hover:scale-110"><TelegramIcon className="w-6 h-6" /></a>
                        <a href="https://www.linkedin.com/in/menkir-wolde-32a1a4108" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-400 hover:text-white transition-transform duration-300 hover:scale-110"><LinkedInIcon className="w-6 h-6" /></a>
                        <a href="https://www.instagram.com/menkirwolde?igsh=MTY4Nmh1N2FtMHVrNg==" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-400 hover:text-white transition-transform duration-300 hover:scale-110"><InstagramIcon className="w-6 h-6" /></a>
                        <a href="https://youtube.com/@menkir127" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-400 hover:text-white transition-transform duration-300 hover:scale-110"><YouTubeIcon className="w-6 h-6" /></a>
                        <a href="https://www.tiktok.com/@menkirteamir" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-400 hover:text-white transition-transform duration-300 hover:scale-110"><TikTokIcon className="w-6 h-6" /></a>
                    </div>

                    <div className="mt-8 border-t border-slate-800/80 pt-6 text-slate-500 text-xs">
                        <p>© {new Date().getFullYear()} {footerData?.copyright || 'Menkir Wolde. All rights reserved.'}</p>
                        <div className="mt-2 space-x-4">
                            <button
                                type="button"
                                onClick={() => setActivePolicyModal('privacy')}
                                className="hover:text-slate-300 transition-colors cursor-pointer underline-offset-4 hover:underline"
                            >
                                Privacy Policy
                            </button>
                            <span>&middot;</span>
                            <button
                                type="button"
                                onClick={() => setActivePolicyModal('terms')}
                                className="hover:text-slate-300 transition-colors cursor-pointer underline-offset-4 hover:underline"
                            >
                                Terms of Service
                            </button>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Policy & Terms Modal */}
            {activePolicyModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                    role="dialog"
                    aria-modal="true"
                    onClick={(e) => { if (e.target === e.currentTarget) setActivePolicyModal(null); }}
                >
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 md:p-8 w-full max-w-lg shadow-2xl relative text-slate-300 text-left animate-fadeIn max-h-[85vh] overflow-y-auto">
                        <button
                            onClick={() => setActivePolicyModal(null)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 cursor-pointer"
                            aria-label="Close"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-400 mb-2">
                            <ShieldCheck className="w-4 h-4 text-red-400" />
                            {activePolicyModal === 'privacy' ? 'Privacy Disclosure' : 'Engineering Terms'}
                        </div>

                        <h3 className="text-xl font-bold text-white mb-4">
                            {activePolicyModal === 'privacy' ? 'Privacy & Data Protection Policy' : 'Terms of Service & Engineering Licensing'}
                        </h3>

                        {activePolicyModal === 'privacy' ? (
                            <div className="space-y-4 text-xs leading-relaxed text-slate-300">
                                <p>
                                    <strong>Zero Telemetry Commitment:</strong> This portfolio does not employ tracking pixels, third-party analytics trackers, or commercial marketing surveillance.
                                </p>
                                <p>
                                    <strong>Client-Side Storage:</strong> Preferences such as custom theme mode, currency settings, newsletter subscription markers, and local goal plans are stored solely in your browser&apos;s <code>localStorage</code> and are never transmitted to external brokers.
                                </p>
                                <p>
                                    <strong>Inquiries &amp; Design Requests:</strong> When submitting an engineering design request, provided emails and specifications are utilized exclusively for communication regarding requested deliverables.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4 text-xs leading-relaxed text-slate-300">
                                <p>
                                    <strong>Intellectual Property:</strong> Civil engineering blueprints, 3D BIM models, and architectural drawings displayed are intellectual property of Menkir Wolde or respective contract joint ventures.
                                </p>
                                <p>
                                    <strong>Engineering Guidance:</strong> Technical articles and simulations provided on this website are for demonstration and portfolio review purposes. All physical engineering construction requires certified on-site structural sign-off.
                                </p>
                                <p>
                                    <strong>Design Requests:</strong> Official design dossiers, CAD files, and structural models are made available upon verified institutional request.
                                </p>
                            </div>
                        )}

                        <div className="mt-6 pt-4 border-t border-slate-800 text-right">
                            <button
                                onClick={() => setActivePolicyModal(null)}
                                className="bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2 px-5 rounded-lg text-xs transition-colors cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
