import React, { useState } from 'react';
import { Send, Zap, Clock, ShieldCheck, Sparkles, Activity, CheckCircle2, ArrowRight } from 'lucide-react';

interface MissionInputProps {
  onStartMission: (goal: string, humanApproval: boolean) => void;
  isLoading: boolean;
  activeMissionGoal?: string;
}

const PRESET_GOALS = [
  {
    id: 'acme',
    tag: 'FLAGSHIP BENCHMARK',
    tagColor: 'text-[#38BDF8] border-[#38BDF8]/40 bg-[#0B1F4D]/80',
    title: "🎯 Acme Interview Prep",
    target: 'Google Calendar • Gmail • GitHub • Slack',
    desc: "Extracts calendar schedule, recruiter expectations, analyzes target GitHub repos, builds a study plan & notifies via Slack.",
    goal: "Prepare me for tomorrow's technical interview at Acme. Find the interview details, gather relevant information from my email and GitHub, research the company, identify what I should study, create a preparation briefing and study plan, and notify me when it's ready."
  },
  {
    id: 'stripe',
    tag: 'SYSTEM DESIGN',
    tagColor: 'text-indigo-400 border-indigo-500/40 bg-indigo-950/60',
    title: "💳 Stripe Ledger Architecture",
    target: 'Google Calendar • GitHub • Slack',
    desc: "Scans calendar for systems design round, analyzes payment ledger repos, generates architectural briefing and verifies hashes.",
    goal: "Prepare me for next week's technical interview at Stripe. Find the calendar invite, analyze payment ledger repos, create a study guide, and verify completion."
  },
  {
    id: 'datadog',
    tag: 'OBSERVABILITY',
    tagColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/60',
    title: "📊 Datadog Distributed Tracing",
    target: 'Calendar • Gmail • Research • Slack',
    desc: "Synthesizes observability repository commits, reviews recruiter emails, creates study schedule, and dispatches verified summary.",
    goal: "Prepare me for tomorrow's architecture interview at Datadog. Check calendar, synthesize observability repo commits, generate briefing, and notify."
  },
  {
    id: 'cloudflare',
    tag: 'FAULT RECOVERY',
    tagColor: 'text-amber-400 border-amber-500/40 bg-amber-950/60',
    title: "🛡️ Cloudflare Network Fault Recovery",
    target: 'Calendar • Recovery Agent • Web • Slack',
    desc: "Simulates transient API rate-limiting on calendar lookup, triggers Recovery Agent auto-healing, and finishes verified dossier.",
    goal: "Prepare me for interview at Cloudflare. Trigger transient retry on calendar lookup, recover automatically, and complete verified briefing."
  }
];

export const MissionInput: React.FC<MissionInputProps> = ({ onStartMission, isLoading }) => {
  const [goal, setGoal] = useState(PRESET_GOALS[0].goal);
  const [requireApproval, setRequireApproval] = useState(false);
  const [activePreset, setActivePreset] = useState<string>('acme');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim() || isLoading) return;
    onStartMission(goal, requireApproval);
  };

  const handleSelectPreset = (preset: typeof PRESET_GOALS[0]) => {
    setGoal(preset.goal);
    setActivePreset(preset.id);
  };

  return (
    <div className="w-full space-y-10">
      {/* 1. Spacious Cinematic Mission Control Banner */}
      <div className="relative w-full rounded-3xl overflow-hidden border border-[rgba(147,197,253,0.2)] shadow-2xl bg-[#06142F] group">
        <div className="relative h-64 sm:h-72 md:h-80 w-full overflow-hidden">
          <img
            src="/assets/mission_control_banner.jpg"
            alt="NEXUS Mission Control Center"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06142F] via-[#06142F]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#06142F] via-[#06142F]/40 to-transparent" />

          {/* Floating Telemetry Badge Overlay */}
          <div className="absolute top-6 left-6 right-6 flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center space-x-2.5 px-4 py-2 rounded-full bg-[#0B1F4D]/90 border border-[rgba(147,197,253,0.3)] backdrop-blur-md text-xs font-mono text-[#EAF2FF]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#10B981] animate-pulse" />
              <span>NEXUS AI MISSION CONTROL // ONLINE</span>
            </div>

            <div className="hidden sm:flex items-center space-x-3 text-xs font-mono text-[rgba(219,234,254,0.8)]">
              <span className="px-3 py-1.5 rounded-lg bg-[#06142F]/80 border border-[rgba(147,197,253,0.2)] backdrop-blur-md">
                8 SPECIALIST AGENTS
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-[#06142F]/80 border border-[rgba(147,197,253,0.2)] backdrop-blur-md text-[#38BDF8]">
                SHA-256 ATTESTATION
              </span>
            </div>
          </div>

          {/* Headline Content Inside Banner Frame */}
          <div className="absolute bottom-6 left-6 right-6 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0B1F4D]/80 border border-[#38BDF8]/40 text-[#38BDF8] text-xs font-mono mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>AUTONOMOUS MULTI-APP EXECUTION</span>
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Turn Goals Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38BDF8] via-[#60A5FA] to-[#93C5FD]">Verified Actions</span>.
            </h1>
            <p className="text-xs sm:text-sm text-[rgba(226,237,255,0.85)] mt-2 leading-relaxed max-w-2xl font-normal hidden sm:block">
              State your objective. NEXUS schedules the DAG, executes in parallel across Calendar, Gmail, GitHub, and Slack, recovers from faults, and cryptographically proves every action.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Interactive Preset Benchmark Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#93C5FD] uppercase tracking-wider">
            <Zap className="h-4 w-4 text-[#38BDF8]" />
            <span>Select a Pre-Engineered Mission Benchmark:</span>
          </div>
          <span className="text-xs font-mono text-[rgba(219,234,254,0.6)] hidden sm:inline">
            Click card to load prompt
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRESET_GOALS.map((preset) => {
            const isSelected = activePreset === preset.id;
            return (
              <div
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`cursor-pointer rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'nexus-glass-card border-[#38BDF8] ring-2 ring-[#38BDF8]/30 shadow-[0_0_25px_rgba(56,189,248,0.25)] scale-[1.02]'
                    : 'nexus-glass-card border-[rgba(147,197,253,0.14)] hover:border-[rgba(147,197,253,0.35)] hover:scale-[1.01]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${preset.tagColor}`}>
                      {preset.tag}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="h-4 w-4 text-[#38BDF8]" />
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1.5 line-clamp-1">
                    {preset.title}
                  </h3>
                  <p className="text-xs text-[rgba(219,234,254,0.75)] leading-relaxed line-clamp-3">
                    {preset.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-[rgba(147,197,253,0.12)] flex items-center justify-between text-[11px] font-mono text-[rgba(219,234,254,0.6)]">
                  <span className="truncate max-w-[150px]">{preset.target}</span>
                  <ArrowRight className={`h-3.5 w-3.5 transition-transform ${isSelected ? 'text-[#38BDF8] translate-x-1' : ''}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Spacious Command & Mission Configuration Box */}
      <form
        onSubmit={handleSubmit}
        className="nexus-glass-card p-6 sm:p-8 rounded-3xl border border-[rgba(147,197,253,0.22)] shadow-2xl space-y-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-[rgba(147,197,253,0.14)] gap-3">
          <div className="flex items-center space-x-3">
            <span className="h-3 w-3 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#EAF2FF]">
              Autonomous Goal Prompt
            </span>
          </div>

          <label className="flex items-center space-x-2.5 px-3 py-1.5 rounded-full bg-[#0B1F4D]/90 border border-[rgba(147,197,253,0.25)] text-xs font-mono cursor-pointer text-[#EAF2FF] hover:border-[#38BDF8]/60 transition-colors">
            <input
              type="checkbox"
              checked={requireApproval}
              onChange={(e) => setRequireApproval(e.target.checked)}
              className="rounded border-[rgba(147,197,253,0.3)] bg-[#06142F] text-[#2563EB] focus:ring-0 focus:ring-offset-0"
            />
            <span className="flex items-center space-x-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-[#F59E0B]" />
              <span>Human Approval Checkpoint</span>
            </span>
          </label>
        </div>

        <textarea
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          rows={3}
          disabled={isLoading}
          placeholder="Enter what you want NEXUS to autonomously accomplish across your applications..."
          className="w-full bg-[#06142F]/70 border border-[rgba(147,197,253,0.18)] focus:border-[#38BDF8] rounded-2xl p-4 text-[#EAF2FF] placeholder-[rgba(219,234,254,0.4)] focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/30 text-sm sm:text-base leading-relaxed resize-none transition-all"
        />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
          <div className="text-xs text-[rgba(219,234,254,0.7)] font-mono flex items-center space-x-2">
            <Clock className="h-4 w-4 text-[#38BDF8]" />
            <span>Multi-agent parallel execution • Cryptographic verification standard</span>
          </div>

          <button
            type="submit"
            disabled={isLoading || !goal.trim()}
            className={`w-full sm:w-auto inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-full text-sm font-semibold tracking-wide transition-all shadow-xl ${
              isLoading
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-white text-[#071225] hover:bg-[#F0F6FF] hover:shadow-[0_0_30px_rgba(56,189,248,0.4)] active:scale-95'
            }`}
          >
            <Send className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="font-bold tracking-tight">
              {isLoading ? 'EXECUTING MISSION...' : 'EXECUTE MISSION'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

