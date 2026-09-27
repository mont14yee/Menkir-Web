
import React, { createContext } from 'react';

export enum Season {
    Winter,
    Spring,
    Fall
}

export type View = 'main' | 'portfolio' | 'interface' | 'design' | 'photos' | 'resume';

export type SmartPlan = { S: string; M: string; A: string; R: string; T: string };
export type GoalNode = { id: string; name: string; color: string; plan?: SmartPlan; isCustom?: boolean };

export type TimelineEvent = {
    id: string;
    month: number;
    title: string;
    description?: string;
    goalId?: string;
};

export interface GoalsContextType {
    availableGoals: GoalNode[];
    setAvailableGoals: React.Dispatch<React.SetStateAction<GoalNode[]>>;
    orbitingGoals: GoalNode[];
    setOrbitingGoals: React.Dispatch<React.SetStateAction<GoalNode[]>>;
    timelineEvents: TimelineEvent[];
    setTimelineEvents: React.Dispatch<React.SetStateAction<TimelineEvent[]>>;
}

export const GoalsContext = createContext<GoalsContextType | null>(null);

export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'ETB';

export type ExchangeRates = Record<Currency, number>;

export interface CurrencyContextType {
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    rates: ExchangeRates;
    getSymbol: (currency?: Currency) => string;
    formatCurrency: (amountUSD: number, targetCurrency?: Currency) => string;
    convertFromUSD: (amount: number, targetCurrency?: Currency) => number;
    convertToUSD: (amount: number, sourceCurrency?: Currency) => number;
}

export const CurrencyContext = createContext<CurrencyContextType | null>(null);

// --- Portfolio Types ---

export interface ProfileData {
  pictureUrl: string;
  name: string;
  tagline: string;
  status: string;
  availability: string;
  roles: string;
  location: string;
  locationUrl: string;
  stats: {
    views: number;
    appreciations: number;
    followers: number;
    following: number;
  };
}

export interface Project {
  id: string;
  title: string;
  poster: string;
  gallery?: string[];
  quip: string;
  tags: string[];
  video: string;
  name: string;
  major: string;
  plot: string;
  structuralComponents: string[];
  liveUrl: string;
  githubUrl: string;
  infographicsUrl?: string;
  brochureUrl?: string;
  overview?: string;
}

export interface Slide {
  title: string;
  subtitle?: string;
  content: string | string[];
  image_prompt: string;
  image?: string;
  layout?: 'title' | 'content_left' | 'content_right' | 'diagram' | 'quote' | 'full_image';
}

export interface Blog {
  id: string;
  title: string;
  poster: string;
  poster_prompt: string;
  tags: string[];
  read_time: string;
  excerpt: string;
  fullContentUrl: string;
  markdown_content: string;
  slides?: Slide[];
  infographicsUrl?: string;
  video_overview_url?: string;
  tagNotes?: Record<string, string>;
}

export interface ConnectLink {
  id: string;
  title: string;
  poster: string;
  subtitle: string;
  prompt: string;
  finePrint: string;
  url: string;
}

export interface Design {
  id: string;
  name: string;
  title?: string;
  description: string;
  poster: string;
  poster_prompt?: string;
  icon?: string;
  install_url?: string;
  website_url?: string;
  github_url?: string;
  price: string;
  rating: string;
  reviews: string;
  hover_quip: string;
  tech_stack: string;
  style: string;
  downloads?: string;
  contentRating?: string;
  editorChoice?: boolean;
  screenshots?: string[];
  primaryButtonLabel?: string;
  secondaryButtonLabel?: string;
  developer?: string;
}

export interface Video {
  id: string;
  title: string;
  thumbnail_url: string;
  video_url?: string;
  prompt: string;
  duration: string;
  tags: string[];
  isWebinar: boolean;
  quip: string;
}

export type SearchContextType = {
    searchQuery: string;
    setSearchQuery: (q: string) => void;
};
export const SearchContext = createContext<SearchContextType | undefined>(undefined);

export interface PortfolioData {
  hero: {
    title: string;
    subtitle?: string;
    description?: string;
    cta?: string;
    inputPlaceholder?: string;
    buttonText?: string;
    videoUrl?: string;
  };
  footer?: {
    ctaTitle: string;
    ctaSubtitle: string;
    copyright: string;
  };
  featured: string[];
  featured_designs: string[];
  projects: Project[];
  blogs: Blog[];
  designs: Design[];
  connect: ConnectLink[];
  profile: ProfileData;
  videos: Video[];
}
