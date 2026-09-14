import React, { useState } from 'react';
import { 
  Send, Zap, Clock, ShieldCheck, Sparkles, CheckCircle2, 
  Calendar, Mail, Github, Send as SlackIcon, Search, ShieldAlert, Cpu
} from 'lucide-react';

interface MissionInputProps {
  onStartMission: (goal: string, humanApproval: boolean) => void;
  isLoading: boolean;
  activeMissionGoal?: string;
}

const PRESET_GOALS = [
  {
    id: 'acme',
    tag: 'FLAGSHIP PREP',
    tagColor: 'text-[#38BDF8] border-[#38BDF8]/40 bg-[#0B1F4D]/90',
    glowColor: 'hover:border-[#38BDF8] hover:shadow-[0_0_25px_rgba(56,189,248,0.3)]',
    activeRing: 'border-[#38BDF8] ring-2 ring-[#38BDF8]/40 shadow-[0_0_30px_rgba(56,189,248,0.35)]',
    title: "Acme Technical Interview",
    image: "/assets/mission_dashboard.png",
    short: "Synthesizes Calendar, Gmail & GitHub into a verified study dossier",
    apps: ['calendar', 'gmail', 'github', 'slack'],
    goal: "Prepare me for tomorrow's technical interview at Acme. Find the interview details, gather relevant information from my email and GitHub, research the company, identify what I should study, create a preparation briefing and study plan, and notify me when it's ready."
  },
  {
    id: 'stripe',
    tag: 'SYSTEM DESIGN',
    tagColor: 'text-indigo-300 border-indigo-500/40 bg-indigo-950/80',
    glowColor: 'hover:border-indigo-400 hover:shadow-[0_0_25px_rgba(129,140,248,0.3)]',
    activeRing: 'border-indigo-400 ring-2 ring-indigo-400/40 shadow-[0_0_30px_rgba(129,140,248,0.35)]',
    title: "Stripe Ledger Architecture",
    image: "/assets/action_telemetry.png",
    short: "Audits payment ledger repositories & produces signed architecture guide",
    apps: ['calendar', 'github', 'slack'],
    goal: "Prepare me for next week's technical interview at Stripe. Find the calendar invite, analyze payment ledger repos, create a study guide, and verify completion."
  },
  {
    id: 'datadog',
    tag: 'OBSERVABILITY',
    tagColor: 'text-emerald-300 border-emerald-500/40 bg-emerald-950/80',
    glowColor: 'hover:border-emerald-400 hover:shadow-[0_0_25px_rgba(16,185,129,0.3)]',
    activeRing: 'border-emerald-400 ring-2 ring-emerald-400/40 shadow-[0_0_30px_rgba(16,185,129,0.35)]',
    title: "Datadog APM & Tracing",
    image: "/assets/reliability_console.png",
    short: "Correlates commit traces with recruiter syllabus & study schedule",
    apps: ['calendar', 'gmail', 'research', 'slack'],
    goal: "Prepare me for tomorrow's architecture interview at Datadog. Check calendar, synthesize observability repo commits, generate briefing, and notify."
  },
  {
    id: 'cloudflare',
    tag: 'FAULT HEALING',
    tagColor: 'text-amber-300 border-amber-500/40 bg-amber-950/80',
    glowColor: 'hover:border-amber-400 hover:shadow-[0_0_25px_rgba(245,158,11,0.3)]',
    activeRing: 'border-amber-400 ring-2 ring-amber-400/40 shadow-[0_0_30px_rgba(245,158,11,0.35)]',
    title: "Cloudflare Network Recovery",
    image: "/assets/audit_trail.png",
    short: "Simulates transient API rate limits with automatic jitter backoff",
    apps: ['calendar', 'recovery', 'slack'],
    goal: "Prepare me for interview at Cloudflare. Trigger transient retry on calendar lookup, recover automatically, and complete verified briefing."
  },
  {
    id: 'kubernetes',
    tag: 'INFRA AUDIT',
    tagColor: 'text-rose-300 border-rose-500/40 bg-rose-950/80',
    glowColor: 'hover:border-rose-400 hover:shadow-[0_0_25px_rgba(244,63,94,0.3)]',
    activeRing: 'border-rose-400 ring-2 ring-rose-400/40 shadow-[0_0_30px_rgba(244,63,94,0.35)]',
    title: "Kubernetes Zero-Downtime",
    image: "/assets/integrations_ecosystem.png",
    short: "Audits cluster codebases & dispatches verified deployment report",
    apps: ['github', 'research', 'slack'],
    goal: "Run infrastructure audit for Kubernetes deployment. Check repository configurations, analyze container security, and dispatch briefing."
  },
  {
    id: 'agent_network',
    tag: 'MULTI-AGENT DAG',
    tagColor: 'text-purple-300 border-purple-500/40 bg-purple-950/80',
    glowColor: 'hover:border-purple-400 hover:shadow-[0_0_25px_rgba(192,132,252,0.3)]',
    activeRing: 'border-purple-400 ring-2 ring-purple-400/40 shadow-[0_0_30px_rgba(192,132,252,0.35)]',
    title: "Multi-Agent Consensus",
    image: "/assets/agents_network.jpg",
    short: "Parallel DAG orchestration with cryptographic SHA-256 attestation",
    apps: ['calendar', 'gmail', 'github', 'slack'],
    goal: "Execute multi-agent consensus workflow. Coordinate calendar, email, and codebase audits, verify cryptographic signatures, and report status."
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

  const renderAppIcon = (app: string) => {
    switch (app) {
      case 'calendar': return <span key={app} title="Google Calendar"><Calendar className="h-3.5 w-3.5 text-sky-400" /></span>;
      case 'gmail': return <span key={app} title="Gmail"><Mail className="h-3.5 w-3.5 text-rose-400" /></span>;
      case 'github': return <span key={app} title="GitHub"><Github className="h-3.5 w-3.5 text-slate-100" /></span>;
      case 'slack': return <span key={app} title="Slack"><SlackIcon className="h-3.5 w-3.5 text-emerald-400" /></span>;
      case 'research': return <span key={app} title="Web Research"><Search className="h-3.5 w-3.5 text-amber-400" /></span>;
      case 'recovery': return <span key={app} title="Recovery Engine"><ShieldAlert className="h-3.5 w-3.5 text-amber-400" /></span>;
      default: return <span key={app} title="Specialist Agent"><Cpu className="h-3.5 w-3.5 text-purple-400" /></span>;
    }
  };


  return (
    <div className="w-full space-y-10">
      {/* 1. Cinematic Operations Banner */}
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
              Select a visual benchmark below or customize your goal. NEXUS schedules the DAG, executes in parallel across apps, and cryptographically proves every action.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Visual-First Mission Benchmark Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#93C5FD] uppercase tracking-wider">
            <Zap className="h-4 w-4 text-[#38BDF8]" />
            <span>Select Mission Outcome:</span>
          </div>
          <span className="text-xs font-mono text-[rgba(219,234,254,0.6)]">
            6 Pre-engineered scenarios
          </span>
        </div>

        {/* 6 Clean, Unique, Visual-First Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PRESET_GOALS.map((preset) => {
            const isSelected = activePreset === preset.id;
            return (
              <div
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`cursor-pointer rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col justify-between group nexus-glass-card ${
                  isSelected ? `${preset.activeRing} scale-[1.02]` : `border-[rgba(147,197,253,0.18)] ${preset.glowColor} hover:scale-[1.01]`
                }`}
              >
                {/* Visual Header Image with Subtle Vignette */}
                <div className="relative h-36 w-full overflow-hidden bg-[#06142F]">
                  <img
                    src={preset.image}
                    alt={preset.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-65"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#06142F] via-[#06142F]/40 to-transparent" />

                  {/* Top Badge & Checkmark */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border backdrop-blur-md ${preset.tagColor}`}>
                      {preset.tag}
                    </span>
                    {isSelected && (
                      <div className="p-1 rounded-full bg-[#38BDF8] text-[#06142F] shadow-lg">
                        <CheckCircle2 className="h-3.5 w-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Body - Punchy & Minimal Info */}
                <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-[#38BDF8] transition-colors line-clamp-1">
                      {preset.title}
                    </h3>
                    <p className="text-xs text-[rgba(219,234,254,0.75)] mt-1 line-clamp-2 leading-relaxed">
                      {preset.short}
                    </p>
                  </div>

                  {/* Clean Connected Apps Icons Strip */}
                  <div className="pt-2.5 border-t border-[rgba(147,197,253,0.12)] flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">Apps:</span>
                      <div className="flex items-center space-x-1.5 p-1 rounded-lg bg-[#06142F]/80 border border-[rgba(147,197,253,0.15)]">
                        {preset.apps.map(app => renderAppIcon(app))}
                      </div>
                    </div>

                    <span className={`text-[11px] font-mono font-semibold transition-colors ${
                      isSelected ? 'text-[#38BDF8]' : 'text-slate-400 group-hover:text-white'
                    }`}>
                      {isSelected ? 'SELECTED' : 'LOAD ➔'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Command & Mission Execution Box */}
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
          className="w-full bg-[#06142F]/70 border border-[rgba(147,197,253,0.18)] focus:border-[#38BDF8] rounded-2xl p-4 text-[#EAF2FF] placeholder-[rgba(219,234,254,0.4)] focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/30 text-sm sm:text-base leading-relaxed resize-none transition-all font-sans"
        />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
          <div className="text-xs text-[rgba(219,234,254,0.7)] font-mono flex items-center space-x-2">
            <Clock className="h-4 w-4 text-[#38BDF8]" />
            <span>Multi-agent parallel execution • SHA-256 verification standard</span>
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
