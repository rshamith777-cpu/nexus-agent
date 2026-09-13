import React, { useRef, useEffect } from 'react';
import { Terminal, ShieldAlert, CheckCircle, Info, Cpu, Activity } from 'lucide-react';
import { AgentLogEntry } from '../services/api';

interface AgentActivityLogProps {
  logs: AgentLogEntry[];
}

export const AgentActivityLog: React.FC<AgentActivityLogProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getAgentColor = (agent: string) => {
    if (agent.includes('COMMANDER')) return 'text-purple-300 bg-purple-950/70 border-purple-600/50';
    if (agent.includes('PLANNER')) return 'text-indigo-300 bg-indigo-950/70 border-indigo-600/50';
    if (agent.includes('CALENDAR')) return 'text-[#38BDF8] bg-[#0B1F4D]/90 border-[#38BDF8]/40';
    if (agent.includes('GMAIL')) return 'text-rose-300 bg-rose-950/70 border-rose-600/50';
    if (agent.includes('GITHUB')) return 'text-slate-200 bg-slate-800/80 border-slate-600/50';
    if (agent.includes('INTELLIGENCE')) return 'text-cyan-300 bg-cyan-950/70 border-cyan-600/50';
    if (agent.includes('DOCUMENT')) return 'text-amber-300 bg-amber-950/70 border-amber-600/50';
    if (agent.includes('NOTIFICATION')) return 'text-emerald-300 bg-emerald-950/70 border-emerald-600/50';
    if (agent.includes('VERIFICATION')) return 'text-emerald-300 bg-emerald-900/80 border-emerald-500';
    if (agent.includes('RECOVERY')) return 'text-amber-300 bg-amber-950/90 border-amber-500 animate-pulse';
    return 'text-[#38BDF8] bg-[#0B1F4D] border-[rgba(147,197,253,0.3)]';
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'SUCCESS':
        return <CheckCircle className="h-4 w-4 text-[#10B981] flex-shrink-0" />;
      case 'WARN':
        return <ShieldAlert className="h-4 w-4 text-[#F59E0B] flex-shrink-0" />;
      case 'ERROR':
        return <ShieldAlert className="h-4 w-4 text-[#F43F5E] flex-shrink-0" />;
      default:
        return <Info className="h-4 w-4 text-[#38BDF8] flex-shrink-0" />;
    }
  };

  return (
    <div className="nexus-glass-card rounded-3xl border border-[rgba(147,197,253,0.18)] p-6 sm:p-7 h-full flex flex-col shadow-2xl">
      <div className="flex items-center justify-between border-b border-[rgba(147,197,253,0.14)] pb-4 mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-[#06142F] border border-[rgba(147,197,253,0.2)] text-[#38BDF8]">
            <Terminal className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">Agent Activity Stream</h3>
            <span className="text-[10px] font-mono text-[rgba(219,234,254,0.6)]">Real-time WebSocket events</span>
          </div>
        </div>
        <span className="text-[11px] font-mono text-[#38BDF8] px-2.5 py-1 rounded-full bg-[#06142F] border border-[rgba(147,197,253,0.18)]">
          {logs.length} events
        </span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[520px] font-mono text-xs">
        {logs.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-[rgba(219,234,254,0.5)] space-y-2">
            <Cpu className="h-10 w-10 text-[rgba(147,197,253,0.3)] animate-pulse" />
            <span className="text-xs">Awaiting mission dispatch...</span>
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="p-3.5 rounded-2xl bg-[#06142F]/80 border border-[rgba(147,197,253,0.14)] hover:border-[rgba(147,197,253,0.3)] transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getLevelIcon(log.level)}
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold border ${getAgentColor(log.agent)}`}>
                    {log.agent.replace('_AGENT', '')}
                  </span>
                </div>
                <span className="text-[10px] text-[rgba(219,234,254,0.6)]">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>

              <p className="text-[rgba(226,237,255,0.9)] text-xs leading-relaxed pl-6">
                {log.message}
              </p>

              {log.details && Object.keys(log.details).length > 0 && (
                <div className="mt-2 ml-6 p-2.5 rounded-xl bg-[#040E24] border border-[rgba(147,197,253,0.1)] text-[11px] text-[#93C5FD] overflow-x-auto">
                  <pre>{JSON.stringify(log.details, null, 2)}</pre>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

