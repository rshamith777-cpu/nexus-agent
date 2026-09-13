import React from 'react';
import { X, CheckCircle2, AlertTriangle, ShieldCheck, Clock, RotateCw, Terminal, FileCode } from 'lucide-react';
import { TaskNode } from '../services/api';

interface ActionInspectorProps {
  task: TaskNode | null;
  onClose: () => void;
}

export const ActionInspector: React.FC<ActionInspectorProps> = ({ task, onClose }) => {
  if (!task) return null;

  return (
    <div className="nexus-glass-card p-6 sm:p-8 rounded-3xl border border-[#38BDF8]/40 shadow-2xl space-y-6 animate-fade-in">
      <div className="flex items-center justify-between border-b border-[rgba(147,197,253,0.14)] pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-[#06142F] border border-[rgba(147,197,253,0.2)] text-[#38BDF8]">
            <Terminal className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Action Telemetry & Proof Inspector
            </h3>
            <span className="text-[10px] font-mono text-[rgba(219,234,254,0.6)]">Task ID: {task.id}</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-xl text-[rgba(219,234,254,0.6)] hover:text-white hover:bg-[#06142F] transition-colors border border-transparent hover:border-[rgba(147,197,253,0.2)]"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Header Info */}
      <div className="bg-[#06142F]/90 p-5 rounded-2xl border border-[rgba(147,197,253,0.16)] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-sm font-bold text-white">{task.title}</span>
          <span className={`text-[10px] font-mono font-bold px-3 py-1 rounded-full border self-start sm:self-auto ${
            task.verification_state === 'VERIFIED'
              ? 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/50'
              : task.status === 'RUNNING'
              ? 'bg-[#38BDF8]/20 text-[#38BDF8] border-[#38BDF8]/50 animate-pulse'
              : 'bg-[#0B1F4D] text-[rgba(219,234,254,0.7)] border-[rgba(147,197,253,0.2)]'
          }`}>
            {task.verification_state === 'VERIFIED' ? '✓ VERIFIED ACTION' : task.status}
          </span>
        </div>
        <div className="text-xs font-mono text-[rgba(219,234,254,0.7)] flex flex-wrap gap-x-6 gap-y-2 pt-2 border-t border-[rgba(147,197,253,0.1)]">
          <span>Agent: <strong className="text-[#38BDF8]">{task.agent}</strong></span>
          <span>Tool: <strong className="text-[#93C5FD]">{task.tool}</strong></span>
          <span>Duration: <strong className="text-[#10B981]">{Math.round(task.duration_ms)}ms</strong></span>
          <span>Retries: <strong className="text-[#F59E0B]">{task.retry_count}</strong></span>
        </div>
      </div>

      {/* Verification Proof & Rule with Crypto Badge */}
      <div className="p-5 rounded-2xl bg-[#06142F] border border-[#10B981]/40 flex flex-col sm:flex-row items-start gap-4">
        {task.verification_state === 'VERIFIED' && (
          <div className="w-14 h-14 rounded-xl overflow-hidden border border-[#10B981]/50 shrink-0 shadow-md">
            <img
              src="/assets/crypto_badge.jpg"
              alt="Verified Badge"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex-1 space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#10B981]">
            <ShieldCheck className="h-4 w-4" />
            <span>Independent Verification Proof</span>
          </div>
          <p className="text-xs text-[rgba(219,234,254,0.85)] font-mono">
            <span className="text-[#93C5FD]">Rule:</span> {task.verification_rule || 'Valid execution state confirmed'}
          </p>
          {task.verification_evidence && Object.keys(task.verification_evidence).length > 0 && (
            <div className="p-3 bg-[#040E24] rounded-xl border border-[rgba(147,197,253,0.12)] text-[11px] font-mono text-[#38BDF8] overflow-x-auto">
              <pre>{JSON.stringify(task.verification_evidence, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>

      {/* Input / Output Payloads */}
      <div className="space-y-4 font-mono text-xs">
        <div>
          <span className="text-[11px] font-semibold text-[#93C5FD] mb-1.5 block">Input Payload:</span>
          <div className="p-3.5 bg-[#040E24] rounded-xl border border-[rgba(147,197,253,0.14)] text-[rgba(219,234,254,0.85)] overflow-x-auto max-h-40">
            <pre>{JSON.stringify(task.input_payload, null, 2)}</pre>
          </div>
        </div>

        <div>
          <span className="text-[11px] font-semibold text-[#93C5FD] mb-1.5 block">Output Payload / Artifact:</span>
          <div className="p-3.5 bg-[#040E24] rounded-xl border border-[rgba(147,197,253,0.14)] text-[#38BDF8] overflow-x-auto max-h-56">
            <pre>{JSON.stringify(task.output_payload, null, 2)}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

