import React from 'react';
import { 
  Calendar, Mail, Github, Globe, Brain, FileText, 
  Send, ShieldCheck, CheckCircle2, Clock, AlertTriangle, 
  RotateCw, ArrowDown, Sparkles 
} from 'lucide-react';
import { TaskNode } from '../services/api';

interface MissionGraphProps {
  tasks: Record<string, TaskNode>;
  selectedTaskId: string | null;
  onSelectTask: (taskId: string) => void;
}

export const MissionGraph: React.FC<MissionGraphProps> = ({ tasks, selectedTaskId, onSelectTask }) => {
  const getToolIcon = (tool: string) => {
    if (tool.includes('calendar')) return <Calendar className="h-5 w-5 text-[#38BDF8]" />;
    if (tool.includes('gmail')) return <Mail className="h-5 w-5 text-[#F43F5E]" />;
    if (tool.includes('github')) return <Github className="h-5 w-5 text-white" />;
    if (tool.includes('research') || tool.includes('web')) return <Globe className="h-5 w-5 text-[#38BDF8]" />;
    if (tool.includes('intel') || tool.includes('synthesize')) return <Brain className="h-5 w-5 text-[#A78BFA]" />;
    if (tool.includes('document') || tool.includes('briefing')) return <FileText className="h-5 w-5 text-[#38BDF8]" />;
    if (tool.includes('slack') || tool.includes('notification')) return <Send className="h-5 w-5 text-[#10B981]" />;
    return <ShieldCheck className="h-5 w-5 text-[#38BDF8]" />;
  };

  const getStatusBadge = (task: TaskNode) => {
    switch (task.status) {
      case 'VERIFIED':
        return (
          <span className="flex items-center space-x-1.5 text-[11px] font-mono text-[#10B981] bg-[#10B981]/15 px-2.5 py-1 rounded-full border border-[#10B981]/40">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span className="font-bold">VERIFIED</span>
          </span>
        );
      case 'RUNNING':
        return (
          <span className="flex items-center space-x-1.5 text-[11px] font-mono text-[#38BDF8] bg-[#38BDF8]/15 px-2.5 py-1 rounded-full border border-[#38BDF8]/40 animate-pulse">
            <RotateCw className="h-3.5 w-3.5 animate-spin" />
            <span className="font-bold">RUNNING</span>
          </span>
        );
      case 'RETRYING':
        return (
          <span className="flex items-center space-x-1.5 text-[11px] font-mono text-[#F59E0B] bg-[#F59E0B]/15 px-2.5 py-1 rounded-full border border-[#F59E0B]/50 animate-bounce">
            <RotateCw className="h-3.5 w-3.5 animate-spin" />
            <span className="font-bold">RETRY #{task.retry_count}</span>
          </span>
        );
      case 'WAITING_APPROVAL':
        return (
          <span className="flex items-center space-x-1.5 text-[11px] font-mono text-[#F59E0B] bg-[#F59E0B]/20 px-2.5 py-1 rounded-full border border-[#F59E0B] animate-pulse">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span className="font-bold">APPROVAL REQ</span>
          </span>
        );
      case 'FAILED':
        return (
          <span className="flex items-center space-x-1.5 text-[11px] font-mono text-[#F43F5E] bg-[#F43F5E]/15 px-2.5 py-1 rounded-full border border-[#F43F5E]/40">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span className="font-bold">FAILED</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center space-x-1.5 text-[11px] font-mono text-[rgba(219,234,254,0.5)] bg-[#0B1F4D]/60 px-2.5 py-1 rounded-full border border-[rgba(147,197,253,0.15)]">
            <Clock className="h-3.5 w-3.5" />
            <span>PENDING</span>
          </span>
        );
    }
  };

  const stage1 = [tasks['task_calendar'], tasks['task_gmail'], tasks['task_github'], tasks['task_research']].filter(Boolean);
  const stage2 = [tasks['task_intelligence']].filter(Boolean);
  const stage3 = [tasks['task_document']].filter(Boolean);
  const stage4 = [tasks['task_notification']].filter(Boolean);
  const stage5 = [tasks['task_verification']].filter(Boolean);

  const hasTasks = Object.keys(tasks).length > 0;

  const renderNode = (task: TaskNode) => {
    if (!task) return null;
    const isSelected = selectedTaskId === task.id;
    const isVerified = task.status === 'VERIFIED';
    const isRunning = task.status === 'RUNNING';

    return (
      <div
        key={task.id}
        onClick={() => onSelectTask(task.id)}
        className={`relative cursor-pointer transition-all duration-300 p-5 rounded-2xl border text-left flex flex-col justify-between space-y-3 ${
          isSelected
            ? 'nexus-glass-card border-[#38BDF8] ring-2 ring-[#38BDF8]/40 shadow-[0_0_30px_rgba(56,189,248,0.3)] scale-[1.02]'
            : isVerified
            ? 'bg-[#0A1A3A]/90 border-[#10B981]/40 hover:border-[#10B981]/70 shadow-lg'
            : isRunning
            ? 'bg-[#0D2450]/90 border-[#38BDF8] shadow-[0_0_20px_rgba(56,189,248,0.25)]'
            : 'bg-[#071736]/70 border-[rgba(147,197,253,0.14)] hover:border-[rgba(147,197,253,0.3)]'
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-[#06142F] border border-[rgba(147,197,253,0.2)]">
              {getToolIcon(task.tool)}
            </div>
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-white block">
                {task.agent.replace('_AGENT', '')}
              </span>
              <span className="text-[10px] font-mono text-[rgba(219,234,254,0.6)] truncate max-w-[110px] block">
                {task.tool}
              </span>
            </div>
          </div>
          {getStatusBadge(task)}
        </div>

        <div>
          <h4 className="text-xs font-semibold text-[#EAF2FF] line-clamp-2 leading-relaxed">
            {task.title}
          </h4>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-[rgba(219,234,254,0.7)] pt-3 border-t border-[rgba(147,197,253,0.12)]">
          <span className="text-[#38BDF8] text-[10px] font-semibold uppercase">
            {task.verification_rule || 'ATTESTATION'}
          </span>
          <span className="font-bold">
            {task.duration_ms > 0 ? `${Math.round(task.duration_ms)}ms` : '--'}
          </span>
        </div>
      </div>
    );
  };

  if (!hasTasks) {
    return (
      <div className="nexus-glass-card rounded-3xl p-8 border border-[rgba(147,197,253,0.18)] shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/2 rounded-2xl overflow-hidden border border-[rgba(147,197,253,0.2)] relative group shadow-xl">
            <img
              src="/assets/agents_network.jpg"
              alt="Multi-Agent Network Visual"
              className="w-full h-56 object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#06142F] via-[#06142F]/40 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-mono text-[rgba(219,234,254,0.9)]">
              <span>8 SPECIALIZED AGENTS ACTIVE</span>
              <span className="text-[#38BDF8]">DAG READY</span>
            </div>
          </div>

          <div className="w-full md:w-1/2 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0B1F4D] border border-[#38BDF8]/40 text-[#38BDF8] text-xs font-mono">
              <Sparkles className="h-3.5 w-3.5" />
              <span>ORCHESTRATION PIPELINE STANDBY</span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Awaiting Mission Launch
            </h3>
            <p className="text-xs sm:text-sm text-[rgba(219,234,254,0.78)] leading-relaxed">
              When you launch a mission above, NEXUS decomposes your goal into an authoritative 5-stage Directed Acyclic Graph. Nodes execute in parallel, stream live telemetry, recover from faults, and produce verified cryptographic receipts.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="nexus-glass-card p-6 sm:p-8 rounded-3xl border border-[rgba(147,197,253,0.2)] shadow-2xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[rgba(147,197,253,0.14)] pb-5 gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-[#0B1F4D] border border-[#38BDF8]/40 text-[#38BDF8]">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Mission Execution Graph (DAG)
            </h2>
            <p className="text-xs font-mono text-[rgba(219,234,254,0.7)]">
              Parallel execution waves • Topological state machine resolution
            </p>
          </div>
        </div>

        <span className="text-xs font-mono px-3 py-1.5 rounded-full bg-[#06142F] border border-[rgba(147,197,253,0.2)] text-[#93C5FD]">
          Click any node to inspect telemetry & proof
        </span>
      </div>

      {/* DAG Stages Layout */}
      <div className="space-y-8">
        {/* Stage 1: External App Specialization (Concurrent Roots) */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#38BDF8]">
            <span className="h-2 w-2 rounded-full bg-[#38BDF8] animate-pulse" />
            <span className="font-bold tracking-wider uppercase">
              STAGE 01 — CONCURRENT APP EXTRACTION (Calendar, Gmail, GitHub, Web Intelligence)
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stage1.map(renderNode)}
          </div>
        </div>

        {/* Arrow connector */}
        <div className="flex justify-center">
          <div className="p-2 rounded-full bg-[#0B1F4D]/80 border border-[rgba(147,197,253,0.2)] text-[#38BDF8]">
            <ArrowDown className="h-4 w-4" />
          </div>
        </div>

        {/* Stage 2: Intelligence Synthesis */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#A78BFA]">
            <span className="h-2 w-2 rounded-full bg-[#A78BFA] animate-pulse" />
            <span className="font-bold tracking-wider uppercase">
              STAGE 02 — CROSS-APP INTELLIGENCE SYNTHESIS & GAP ANALYSIS
            </span>
          </div>
          <div className="max-w-2xl mx-auto">
            {stage2.map(renderNode)}
          </div>
        </div>

        {/* Arrow connector */}
        <div className="flex justify-center">
          <div className="p-2 rounded-full bg-[#0B1F4D]/80 border border-[rgba(147,197,253,0.2)] text-[#38BDF8]">
            <ArrowDown className="h-4 w-4" />
          </div>
        </div>

        {/* Stage 3 & 4: Document Creation & Slack Dispatch */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#38BDF8]">
            <span className="h-2 w-2 rounded-full bg-[#38BDF8] animate-pulse" />
            <span className="font-bold tracking-wider uppercase">
              STAGE 03 & 04 — BRIEFING ARTIFACT ASSEMBLY & CHANNEL DISPATCH
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {stage3.map(renderNode)}
            {stage4.map(renderNode)}
          </div>
        </div>

        {/* Arrow connector */}
        <div className="flex justify-center">
          <div className="p-2 rounded-full bg-[#0B1F4D]/80 border border-[rgba(147,197,253,0.2)] text-[#10B981]">
            <ArrowDown className="h-4 w-4" />
          </div>
        </div>

        {/* Stage 5: Independent Verification Audit */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#10B981]">
            <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="font-bold tracking-wider uppercase">
              STAGE 05 — INDEPENDENT VERIFICATION & CRYPTOGRAPHIC ATTESTATION
            </span>
          </div>
          <div className="max-w-2xl mx-auto">
            {stage5.map(renderNode)}
          </div>
        </div>
      </div>
    </div>
  );
};

