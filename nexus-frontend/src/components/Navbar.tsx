import React from 'react';
import { Activity, Layers, Terminal, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'mission' | 'reliability' | 'architecture' | 'integrations';
  setActiveTab: (tab: 'home' | 'mission' | 'reliability' | 'architecture' | 'integrations') => void;
  mode: 'DEMO' | 'LIVE';
  setMode: (mode: 'DEMO' | 'LIVE') => void;
  isRunning: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, mode, setMode, isRunning }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[rgba(147,197,253,0.16)] bg-[rgba(6,20,47,0.85)] backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand with 25x25px minimal geometric NEXUS symbol */}
        <div
          onClick={() => setActiveTab('home')}
          className="flex items-center space-x-3 cursor-pointer group"
          role="link"
          tabIndex={0}
          aria-label="NEXUS home"
        >
          <div className="relative w-[25px] h-[25px] flex items-center justify-center rounded-full bg-gradient-to-tr from-[#0B1F4D] to-[#2563EB] shadow-[0_0_12px_rgba(56,189,248,0.35)] border border-[rgba(147,197,253,0.3)] group-hover:scale-105 transition-transform duration-300">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#EAF2FF]"
            >
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
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-lg tracking-wider text-white">NEXUS</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#0B1F4D] text-[#38BDF8] border border-[rgba(147,197,253,0.2)]">
                v1.0
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs: Home, Missions, Integrations, Reliability */}
        <nav className="hidden md:flex items-center space-x-1" aria-label="Primary Navigation">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-sm font-medium transition-all ${
              activeTab === 'home'
                ? 'bg-[#2563EB]/15 text-white border border-[#38BDF8]/40 shadow-sm'
                : 'text-[rgba(219,234,254,0.78)] hover:text-white hover:bg-[#0B1F4D]/50'
            }`}
          >
            <span>Home</span>
          </button>

          <button
            onClick={() => setActiveTab('mission')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-sm font-medium transition-all ${
              activeTab === 'mission'
                ? 'bg-[#2563EB]/15 text-white border border-[#38BDF8]/40 shadow-sm'
                : 'text-[rgba(219,234,254,0.78)] hover:text-white hover:bg-[#0B1F4D]/50'
            }`}
          >
            <Terminal className="h-4 w-4 text-[#38BDF8]" />
            <span>Missions</span>
            {isRunning && (
              <span className="h-2 w-2 rounded-full bg-[#10B981] animate-ping ml-1" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('integrations')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-sm font-medium transition-all ${
              activeTab === 'integrations'
                ? 'bg-[#2563EB]/15 text-white border border-[#38BDF8]/40 shadow-sm'
                : 'text-[rgba(219,234,254,0.78)] hover:text-white hover:bg-[#0B1F4D]/50'
            }`}
          >
            <span>Integrations</span>
          </button>

          <button
            onClick={() => setActiveTab('reliability')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-sm font-medium transition-all ${
              activeTab === 'reliability'
                ? 'bg-[#2563EB]/15 text-white border border-[#38BDF8]/40 shadow-sm'
                : 'text-[rgba(219,234,254,0.78)] hover:text-white hover:bg-[#0B1F4D]/50'
            }`}
          >
            <Activity className="h-4 w-4 text-[#38BDF8]" />
            <span>Reliability</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-sm font-medium transition-all ${
              activeTab === 'architecture'
                ? 'bg-[#2563EB]/15 text-white border border-[#38BDF8]/40 shadow-sm'
                : 'text-[rgba(219,234,254,0.78)] hover:text-white hover:bg-[#0B1F4D]/50'
            }`}
          >
            <Layers className="h-4 w-4 text-[#38BDF8]" />
            <span>Architecture</span>
          </button>
        </nav>

        {/* Right Controls: System Status, Connect Apps, Mode Switcher */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Time / System Status Panel */}
          <div className="hidden lg:flex items-center space-x-2 px-3 py-1 rounded-full border border-[rgba(147,197,253,0.16)] bg-[rgba(8,24,52,0.80)] text-xs font-mono">
            <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-[rgba(219,234,254,0.78)]">System Status:</span>
            <span className="text-[rgba(255,255,255,0.94)] font-semibold">All Systems Ready</span>
          </div>

          {/* Header CTA ("Connect Apps") */}
          <button
            onClick={() => setActiveTab('integrations')}
            className="hidden sm:inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-medium text-[#EAF2FF] border border-[rgba(147,197,253,0.22)] bg-[linear-gradient(145deg,rgba(13,35,72,0.82),rgba(4,15,36,0.90))] hover:border-[rgba(56,189,248,0.45)] hover:text-white transition-all"
          >
            Connect Apps
          </button>

          {/* Mode Switcher (DEMO MODE vs LIVE APIS) */}
          <div className="flex items-center bg-[#071225] border border-[rgba(147,197,253,0.2)] rounded-lg p-0.5">
            <button
              onClick={() => setMode('DEMO')}
              className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-all ${
                mode === 'DEMO'
                  ? 'bg-[#38BDF8] text-[#071225] font-bold shadow-sm'
                  : 'text-[rgba(219,234,254,0.7)] hover:text-white'
              }`}
            >
              DEMO
            </button>
            <button
              onClick={() => setMode('LIVE')}
              className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-all ${
                mode === 'LIVE'
                  ? 'bg-[#10B981] text-[#071225] font-bold shadow-sm'
                  : 'text-[rgba(219,234,254,0.7)] hover:text-white'
              }`}
            >
              LIVE
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};
