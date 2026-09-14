import React, { useState, useEffect } from 'react';
import { Play, ArrowRight, Menu, X, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { InteractiveBackground } from './InteractiveBackground';

interface VantageLandingProps {
  onLaunchMission: () => void;
  onNavigate: (tab: 'mission' | 'reliability' | 'architecture' | 'integrations') => void;
  onOpenIntegrations: () => void;
  activeTab: string;
}

export const VantageLanding: React.FC<VantageLandingProps> = ({
  onLaunchMission,
  onNavigate,
  onOpenIntegrations,
  activeTab = 'home'
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#06142F] text-[#EAF2FF] flex flex-col justify-between selection:bg-[#2563EB] selection:text-white">
      {/* 1. Interactive 3D Neural Mesh, Perspective Radar Grid & Mission Control Atmosphere */}
      <InteractiveBackground initialMode="hybrid" />

      {/* 2. Top Header Navigation */}
      <header className="relative z-30 w-full px-6 sm:px-10 md:px-14 py-6 md:py-8 flex items-center justify-between">
        {/* Brand & Minimal 25x25 NEXUS Logo */}
        <div
          onClick={() => onNavigate('mission')}
          className="flex items-center space-x-3 cursor-pointer group"
          role="link"
          tabIndex={0}
          aria-label="NEXUS home"
        >
          {/* Minimal NEXUS Symbol (25x25px circular geometric interconnected-N) */}
          <div className="relative w-[25px] h-[25px] flex items-center justify-center rounded-full bg-gradient-to-tr from-[#0B1F4D] to-[#2563EB] shadow-[0_0_12px_rgba(56,189,248,0.35)] border border-[rgba(147,197,253,0.3)] group-hover:scale-105 transition-transform duration-300">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#EAF2FF]"
            >
              {/* Interconnected geometric Nexus N */}
              <path
                d="M5 19V5L19 19V5"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="5" cy="5" r="2" fill="#38BDF8" />
              <circle cx="19" cy="19" r="2" fill="#38BDF8" />
              <circle cx="12" cy="12" r="1.5" fill="#FFFFFF" />
            </svg>
          </div>

          <span className="font-semibold text-base sm:text-lg tracking-wider text-[#FFFFFF] group-hover:text-white transition-colors">
            NEXUS
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav
          className="hidden md:flex items-center space-x-8 text-sm font-medium"
          aria-label="Primary Navigation"
        >
          <button
            onClick={() => onNavigate('mission')}
            className={`relative py-1 transition-colors ${
              activeTab === 'home' || activeTab === 'mission'
                ? 'text-[#FFFFFF] font-semibold'
                : 'text-[rgba(219,234,254,0.78)] hover:text-[#FFFFFF]'
            }`}
          >
            Home
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#2563EB] to-[#38BDF8] rounded-full" />
          </button>

          <button
            onClick={() => onNavigate('mission')}
            className="text-[rgba(219,234,254,0.78)] hover:text-[#FFFFFF] py-1 transition-colors"
          >
            Missions
          </button>

          <button
            onClick={() => onNavigate('integrations')}
            className="text-[rgba(219,234,254,0.78)] hover:text-[#FFFFFF] py-1 transition-colors"
          >
            Integrations
          </button>

          <button
            onClick={() => onNavigate('reliability')}
            className="text-[rgba(219,234,254,0.78)] hover:text-[#FFFFFF] py-1 transition-colors"
          >
            Reliability
          </button>
        </nav>

        {/* Right Controls: System Status Panel & Header CTA */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          {/* Time / System Status Panel */}
          <div className="hidden lg:flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-[rgba(147,197,253,0.16)] bg-[rgba(8,24,52,0.80)] backdrop-blur-md text-xs font-mono">
            <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-[rgba(219,234,254,0.78)]">System Status:</span>
            <span className="text-[rgba(255,255,255,0.94)] font-medium">All Systems Ready</span>
          </div>

          {/* Header CTA Pill ("Connect Apps") */}
          <button
            onClick={onOpenIntegrations}
            className="hidden sm:inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium text-[#EAF2FF] border border-[rgba(147,197,253,0.22)] bg-[linear-gradient(145deg,rgba(13,35,72,0.82),rgba(4,15,36,0.90))] hover:border-[rgba(56,189,248,0.45)] hover:text-white transition-all shadow-sm"
          >
            Connect Apps
          </button>

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 rounded-lg border border-[rgba(147,197,253,0.20)] bg-[rgba(8,24,52,0.80)] backdrop-blur-md text-[#EAF2FF] hover:text-white transition-colors"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 inset-x-4 z-40 p-5 rounded-2xl nexus-glass-card animate-fade-in space-y-4">
          <nav className="flex flex-col space-y-3 text-sm font-medium">
            <button
              onClick={() => { onNavigate('mission'); setMobileMenuOpen(false); }}
              className="text-left py-2 text-white font-semibold flex items-center justify-between border-b border-[rgba(147,197,253,0.1)]"
            >
              <span>Home</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#38BDF8]" />
            </button>
            <button
              onClick={() => { onNavigate('mission'); setMobileMenuOpen(false); }}
              className="text-left py-2 text-[rgba(219,234,254,0.78)] hover:text-white border-b border-[rgba(147,197,253,0.1)]"
            >
              Missions
            </button>
            <button
              onClick={() => { onNavigate('integrations'); setMobileMenuOpen(false); }}
              className="text-left py-2 text-[rgba(219,234,254,0.78)] hover:text-white border-b border-[rgba(147,197,253,0.1)]"
            >
              Integrations
            </button>
            <button
              onClick={() => { onNavigate('reliability'); setMobileMenuOpen(false); }}
              className="text-left py-2 text-[rgba(219,234,254,0.78)] hover:text-white border-b border-[rgba(147,197,253,0.1)]"
            >
              Reliability
            </button>
          </nav>

          <div className="pt-2 flex items-center justify-between text-xs font-mono text-[rgba(219,234,254,0.78)]">
            <span>System Status:</span>
            <span className="text-[#10B981] font-bold">All Systems Ready</span>
          </div>

          <button
            onClick={() => { onOpenIntegrations(); setMobileMenuOpen(false); }}
            className="w-full py-2.5 rounded-xl text-xs font-semibold text-[#EAF2FF] bg-[#0B1F4D] border border-[rgba(147,197,253,0.3)] text-center"
          >
            Connect Apps
          </button>
        </div>
      )}

      {/* 3. Hero Section (Left-Anchored Composition) */}
      <main className="relative z-20 w-full px-6 sm:px-10 md:px-14 lg:px-16 py-12 sm:py-16 md:py-20 flex-1 flex flex-col justify-center">
        <div className="max-w-4xl">
          {/* Two-Line Headline Architecture */}
          <div className="headline-container mb-6 sm:mb-8 select-none">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[84px] font-semibold tracking-[-0.035em] leading-[1.04]">
              {/* Line 1 */}
              <span className="line-one">
                Turn Goals
              </span>
              {/* Line 2 */}
              <span className="line-two">
                Into Verified Action.
              </span>
            </h1>
          </div>

          {/* Hero Body Copy */}
          <p className="text-sm sm:text-base md:text-lg text-[rgba(226,237,255,0.86)] leading-relaxed max-w-xl font-normal mb-8 sm:mb-10">
            Your work is scattered across the apps you use every day.<br className="hidden sm:inline" />
            NEXUS turns your goal into an intelligent mission, so every<br className="hidden sm:inline" />
            action is planned, executed, and verified.
          </p>

          {/* Primary CTA (High-contrast White Button with Dark Arrow Box) */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onLaunchMission}
              className="nexus-primary-cta group inline-flex items-center space-x-3 px-6 py-3.5 rounded-full text-sm font-semibold tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8]"
            >
              <span className="text-[#071225] font-semibold">Launch Mission</span>
              <span className="arrow-box flex items-center justify-center w-7 h-7 rounded-full text-white">
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>
          </div>
        </div>
      </main>

      {/* 4. Bottom-Right Demo Card ("See NEXUS") */}
      <div className="relative md:absolute md:bottom-8 md:right-8 lg:bottom-10 lg:right-12 z-20 px-6 sm:px-10 md:px-0 pb-8 md:pb-0 flex justify-end">
        <div className="nexus-glass-card w-full sm:w-[320px] p-3 rounded-2xl shadow-2xl transition-transform duration-300 hover:scale-[1.02]">
          {/* Thumbnail: ABSTRACT BLUE AI MISSION GRAPH */}
          <div
            onClick={onLaunchMission}
            className="relative w-full h-40 sm:h-44 rounded-xl overflow-hidden cursor-pointer group bg-[#06142F] border border-[rgba(147,197,253,0.18)] flex items-center justify-center"
          >
            {/* Generative Blue AI Mission Graph Visual Canvas/SVG */}
            <svg
              className="absolute inset-0 w-full h-full object-cover"
              viewBox="0 0 320 180"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Deep Navy Background Gradient */}
              <rect width="320" height="180" fill="url(#bg-gradient)" />

              {/* Electric Blue Network Grid Lines */}
              <g stroke="#3B82F6" strokeWidth="0.8" strokeOpacity="0.4" strokeDasharray="3 3">
                <path d="M 40 40 L 110 80 L 160 50 L 210 110 L 280 80" />
                <path d="M 50 140 L 110 80 L 180 130 L 250 140 L 280 80" />
                <path d="M 110 80 L 210 110" />
                <path d="M 160 50 L 250 140" />
              </g>

              {/* Dynamic Animated Pulse Lines */}
              <path
                d="M 40 40 L 110 80 L 210 110 L 280 80"
                stroke="#38BDF8"
                strokeWidth="1.5"
                strokeOpacity="0.8"
                className="animate-pulse"
              />

              {/* Subtle Cyan Luminous Mission Nodes */}
              <circle cx="40" cy="40" r="4.5" fill="#2563EB" stroke="#38BDF8" strokeWidth="1.5" />
              <circle cx="110" cy="80" r="5.5" fill="#0B1F4D" stroke="#38BDF8" strokeWidth="2" />
              <circle cx="160" cy="50" r="4" fill="#2563EB" stroke="#93C5FD" strokeWidth="1" />
              <circle cx="180" cy="130" r="4" fill="#06142F" stroke="#38BDF8" strokeWidth="1" />
              <circle cx="210" cy="110" r="6" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="250" cy="140" r="3.5" fill="#2563EB" stroke="#38BDF8" strokeWidth="1" />
              <circle cx="280" cy="80" r="5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />

              {/* Flowing Data Connections Glow */}
              <circle cx="110" cy="80" r="16" fill="#38BDF8" fillOpacity="0.12" />
              <circle cx="210" cy="110" r="20" fill="#3B82F6" fillOpacity="0.15" />
              <circle cx="280" cy="80" r="18" fill="#10B981" fillOpacity="0.15" />

              <defs>
                <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06142F" />
                  <stop offset="50%" stopColor="#0B1F4D" />
                  <stop offset="100%" stopColor="#071225" />
                </linearGradient>
              </defs>
            </svg>

            {/* Circular Glass Play Button in Center */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLaunchMission();
              }}
              aria-label="Play NEXUS demo"
              className="nexus-play-btn relative z-10 w-11 h-11 rounded-full flex items-center justify-center text-white cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </button>
          </div>

          {/* Card Footer: "See NEXUS" Watch Button */}
          <div className="mt-2.5">
            <button
              onClick={onLaunchMission}
              className="nexus-watch-btn w-full py-2 px-3 rounded-lg flex items-center justify-between text-xs font-medium"
            >
              <span className="font-semibold tracking-wide">See NEXUS</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#93C5FD]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
