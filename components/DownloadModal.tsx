import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle2, ShieldCheck, ArrowRight } from './ExtractedIcons';

interface RequestResult {
  requestId: string;
  project: string;
  theme: string;
  timestamp: string;
  deliveryStatus: 'dispatched' | 'logged';
  message: string;
}

export const DownloadModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [result, setResult] = useState<RequestResult | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // Form Fields
  const [email, setEmail] = useState('');
  const [project, setProject] = useState('Coastal Trumpet Interchange');
  const [theme, setTheme] = useState('Cosmic Dark (Default)');
  const [format, setFormat] = useState('Full Schematic Dossier + CAD Specs');
  const [notes, setNotes] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Anti-spam hidden field

  const modalRef = useRef<HTMLDivElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ project?: string }>;
      if (customEvent.detail?.project) {
        setProject(customEvent.detail.project);
      }
      setIsOpen(true);
      setStatus('idle');
      setErrorMessage('');
      setResult(null);
      setCopiedId(false);
    };

    window.addEventListener('open-download-modal', handleOpen);
    return () => window.removeEventListener('open-download-modal', handleOpen);
  }, []);

  // Trap focus and handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    emailInputRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    // Strict client-side email format validation
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/.test(trimmedEmail)) {
      setErrorMessage('Please provide a valid work email address format.');
      return;
    }

    setStatus('loading');

    try {
      const res = await fetch('/api/design-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmedEmail,
          project,
          theme: `${theme} · ${format}`,
          notes,
          honeypot,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit design request to the server.');
      }

      setResult({
        requestId: data.requestId,
        project: data.project,
        theme: data.theme,
        timestamp: data.timestamp,
        deliveryStatus: data.deliveryStatus,
        message: data.message,
      });
      setStatus('success');
    } catch (err: any) {
      console.error('Design request error:', err);
      setErrorMessage(err.message || 'Delivery request could not be processed.');
      setStatus('error');
    }
  };

  const directMailtoUrl = `mailto:mon14yee@gmail.com?subject=${encodeURIComponent(
    `[Direct Design Request] ${project}`
  )}&body=${encodeURIComponent(
    `Hello Menkir,\n\nI am requesting the complete design package for: ${project}\n\nDelivery Format: ${format}\nTheme/Aesthetic: ${theme}\nSender Email: ${email}\n\nProject Notes & Specifications:\n${notes || 'None provided'}\n\nThank you,\n${email}`
  )}`;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="download-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsOpen(false);
      }}
    >
      <div
        ref={modalRef}
        className="bg-slate-900 border border-slate-700/80 rounded-2xl p-4 sm:p-6 md:p-8 w-full max-w-lg shadow-2xl relative text-slate-200 animate-fadeIn max-h-[92vh] overflow-y-auto"
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-slate-800 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-red-500"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. SUCCESS STATE */}
        {status === 'success' && result ? (
          <div className="text-center py-4">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="w-16 h-16 text-emerald-400" />
            </div>
            <h3 id="download-modal-title" className="text-xl sm:text-2xl font-bold text-white mb-2">
              Request Registered
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm mb-6 max-w-md mx-auto">
              Your inquiry has been verified and registered with an authentic request ID.
            </p>

            <div className="bg-slate-950/80 p-4 sm:p-5 rounded-xl border border-slate-800 text-left space-y-3 mb-6 font-mono text-xs">
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-2 gap-2">
                <span className="text-slate-400">Request ID:</span>
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold tracking-wider">{result.requestId}</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(result.requestId);
                      setCopiedId(true);
                      setTimeout(() => setCopiedId(false), 2000);
                    }}
                    className="px-2 py-0.5 text-[10px] rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                  >
                    {copiedId ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Project:</span>
                <span className="text-white font-medium truncate max-w-[200px] sm:max-w-[240px]">{result.project}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Recipient Email:</span>
                <span className="text-slate-300 truncate max-w-[200px] sm:max-w-[240px]">{email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Delivery Status:</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {result.deliveryStatus === 'dispatched' ? 'Dispatched to Webhook' : 'Registered & Queued'}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              {result.message}
            </p>

            <button
              onClick={() => setIsOpen(false)}
              className="w-full bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-semibold py-3 min-h-[44px] rounded-xl transition-all cursor-pointer flex items-center justify-center"
            >
              Done
            </button>
          </div>
        ) : status === 'error' ? (
          /* 2. FAILURE & RETRY STATE */
          <div className="py-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-400 mb-2">
              <ShieldCheck className="w-4 h-4 text-red-400" /> Delivery Status Notice
            </div>
            <h3 id="download-modal-title" className="text-lg sm:text-xl font-bold text-white mb-2">
              Unable to Complete Automated Dispatch
            </h3>
            
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-xl text-xs font-mono leading-relaxed mb-6">
              {errorMessage}
            </div>

            <p className="text-slate-300 text-xs sm:text-sm mb-6 leading-relaxed">
              Your parameters for <strong className="text-white">{project}</strong> are saved. You can retry submission or send this request directly to the lead engineer via your default email client.
            </p>

            <div className="space-y-3">
              <a
                href={directMailtoUrl}
                className="w-full bg-amber-500 hover:bg-amber-400 active:scale-95 text-black font-bold py-3 min-h-[44px] rounded-xl transition-all flex justify-center items-center gap-2 cursor-pointer shadow-lg text-sm"
              >
                <span>Send Direct to mon14yee@gmail.com</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="w-full bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-semibold py-3 min-h-[44px] rounded-xl transition-all cursor-pointer text-sm"
              >
                Back to Form &amp; Retry
              </button>
            </div>
          </div>
        ) : (
          /* 3. INPUT FORM STATE */
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-500 mb-1">
              <ShieldCheck className="w-4 h-4" /> Official Request System
            </div>
            <h3 id="download-modal-title" className="text-xl sm:text-2xl font-bold text-white mb-2">
              Request Full Design Package
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mb-5 sm:mb-6">
              Submit your project specifications to receive technical drawings, CAD files, and engineering documentation.
            </p>

            {errorMessage && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-xs sm:text-sm mb-4">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Anti-spam honeypot (hidden from human users) */}
              <input
                type="text"
                name="organization_nickname"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              <div>
                <label htmlFor="design-email" className="block text-xs sm:text-sm font-medium text-slate-300 mb-1">
                  Your Work Email <span className="text-red-500">*</span>
                </label>
                <input
                  ref={emailInputRef}
                  type="email"
                  id="design-email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="engineer@domain.com"
                  className="w-full min-h-[44px] bg-slate-950 border border-slate-700 rounded-lg p-3 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label htmlFor="design-project" className="block text-xs sm:text-sm font-medium text-slate-300 mb-1">
                    Select Project / Design
                  </label>
                  <select
                    id="design-project"
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                    className="w-full min-h-[44px] bg-slate-950 border border-slate-700 rounded-lg p-2.5 sm:p-3 text-base sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all cursor-pointer"
                  >
                    <option value="Coastal Trumpet Interchange">Coastal Trumpet Interchange</option>
                    <option value="Urban Mining & Concrete Reuse">Urban Mining Framework</option>
                    <option value="Master Development Plan">Master Development Plan Blueprint</option>
                    <option value="Circulus Digital Architecture">Circulus Digital Architecture</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="design-format" className="block text-xs sm:text-sm font-medium text-slate-300 mb-1">
                    Requested Format
                  </label>
                  <select
                    id="design-format"
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full min-h-[44px] bg-slate-950 border border-slate-700 rounded-lg p-2.5 sm:p-3 text-base sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all cursor-pointer"
                  >
                    <option value="Full Schematic Dossier + CAD Specs">Full Schematic Dossier + CAD Specs</option>
                    <option value="Executive Summary (PDF)">Executive Summary (PDF)</option>
                    <option value="Design Assets (Figma/Vector)">Design Assets (Figma/Vector)</option>
                    <option value="Interactive Web Prototype">Interactive Web Prototype</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="design-theme" className="block text-xs sm:text-sm font-medium text-slate-300 mb-1">
                  Color Theme Preference
                </label>
                <select
                  id="design-theme"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full min-h-[44px] bg-slate-950 border border-slate-700 rounded-lg p-2.5 sm:p-3 text-base sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all cursor-pointer"
                >
                  <option value="Cosmic Dark (Default)">Cosmic Dark (Default)</option>
                  <option value="Pristine Light">Pristine Light</option>
                  <option value="Engineering Blueprint Mode">Engineering Blueprint Cyan</option>
                  <option value="Brand Custom Palette">Brand Custom Palette</option>
                </select>
              </div>

              <div>
                <label htmlFor="design-notes" className="block text-xs sm:text-sm font-medium text-slate-300 mb-1">
                  Specific Specifications or Team Name <span className="text-slate-500 text-xs">(optional)</span>
                </label>
                <textarea
                  id="design-notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Detail any regional codes (e.g. AASHTO), custom sizing, or delivery instructions..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full min-h-[44px] bg-white text-black hover:bg-slate-200 active:scale-95 font-bold py-3 sm:py-3.5 rounded-xl transition-all mt-2 flex justify-center items-center gap-2 disabled:opacity-60 cursor-pointer shadow-lg"
              >
                {status === 'loading' ? (
                  <>
                    <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing Secure Request...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Design Request</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
