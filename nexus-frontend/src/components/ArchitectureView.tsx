import React, { useState } from 'react';
import { 
  Layers, ArrowDown, Cpu, ShieldCheck, CheckCircle2, 
  RotateCw, Terminal, FileText, Send, Database, Workflow 
} from 'lucide-react';

interface ArchComponent {
  id: string;
  name: string;
  badge: string;
  role: string;
  inputs: string;
  outputs: string;
  resilience: string;
}

const ARCH_COMPONENTS: ArchComponent[] = [
  {
    id: "commander",
    name: "Commander Agent",
    badge: "INTENT UNDERSTANDING",
    role: "Ingests raw natural language user objectives, extracts target companies/domains, determines constraints, and enforces human-in-the-loop policies.",
    inputs: "User natural language goal (e.g. 'Prepare me for tomorrow's interview at Acme')",
    outputs: "Typed Mission Specification with target entities and constraints",
    resilience: "Input sanitization, prompt injection defenses, entity fallback defaults"
  },
  {
    id: "planner",
    name: "Planner Agent",
    badge: "DAG TOPOLOGY GENERATOR",
    role: "Decomposes the mission specification into a strictly validated Directed Acyclic Graph (DAG) of task nodes with explicit dependency edges.",
    inputs: "Mission Specification",
    outputs: "8-node Task DAG with tool bindings, verification rules, and concurrency flags",
    resilience: "Cycle prevention, topological validation, concurrency clustering"
  },
  {
    id: "orchestrator",
    name: "Mission Orchestrator (DAG Engine)",
    badge: "STATE MACHINE EXECUTOR",
    role: "Authoritative backend executor that schedules ready nodes, manages parallel worker waves, emits real-time WebSocket events, and enforces safety checkpoints.",
    inputs: "Task DAG and mission state",
    outputs: "State transitions, task lifecycle telemetry, event bus streams",
    resilience: "In-flight task recovery, non-blocking asynchronous event bus, persistent state"
  },
  {
    id: "specialists",
    name: "App Specialist Agents",
    badge: "MULTI-APP INTERFACE",
    role: "Specialized tool-aware agents for Google Calendar, Gmail, GitHub, Web Research, and Slack with real API adapters and deterministic demo fallbacks.",
    inputs: "Task input payloads (queries, org names, channels)",
    outputs: "Structured API responses, raw artifacts, and duration metrics",
    resilience: "Adapter circuit-breakers, timeout handlers, credential detection"
  },
  {
    id: "n8n",
    name: "n8n Automation Bridge",
    badge: "DETERMINISTIC PIPELINES",
    role: "Executes deterministic multi-app webhooks, cross-app payload piping, and scheduled automation without polluting agent reasoning.",
    inputs: "Trigger webhooks from NEXUS backend",
    outputs: "Multi-app integration execution payloads",
    resilience: "Webhook retry, persistent workflow execution history, node isolation"
  },
  {
    id: "verifier",
    name: "Verification Agent",
    badge: "INDEPENDENT AUDITOR",
    role: "Independently inspects outputs post-action. Verifies meeting links, message IDs, repository commits, and computes SHA-256 file hashes. Zero unverified claims.",
    inputs: "Tool outputs and execution context",
    outputs: "VerificationResult (VERIFIED / FAILED) and cryptographic evidence",
    resilience: "Independent audit rules, separate from tool execution code"
  },
  {
    id: "recovery",
    name: "Recovery Agent",
    badge: "SELF-HEALING CONTROLLER",
    role: "Diagnoses failures, broadens narrow queries, applies exponential backoff with jitter on rate limits, and switches to fallback notification channels.",
    inputs: "Failure diagnostics and task error messages",
    outputs: "Adapted input payload, retry strategy, and backoff timing",
    resilience: "Maximum retry limits, query simplification, channel fallback"
  },
  {
    id: "report",
    name: "Mission Report Synthesizer",
    badge: "FINAL ATTESTATION",
    role: "Compiles verified outcomes into an executive briefing document, prioritized study schedule, and attestation badge with audit receipts.",
    inputs: "All verified task payloads and evidence inventory",
    outputs: "Markdown dossier, cryptographic hash, Slack summary card",
    resilience: "Cryptographic hash generation, multi-format export (MD, JSON)"
  }
];

export const ArchitectureView: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>("orchestrator");
  const selectedComp = ARCH_COMPONENTS.find(c => c.id === selectedId) || ARCH_COMPONENTS[0];

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 animate-fade-in">
      <div className="border-b border-[rgba(147,197,253,0.16)] pb-6">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#0B1F4D] border border-[rgba(147,197,253,0.3)] text-[#38BDF8] text-xs font-mono mb-3">
          <Layers className="h-4 w-4" />
          <span>SYSTEM ARCHITECTURE & DESIGN</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          NEXUS Multi-Agent Execution Pipeline
        </h1>
        <p className="text-[rgba(226,237,255,0.8)] text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
          Verification-first architecture with clean separation between agent reasoning, authoritative DAG state machine orchestration, and deterministic n8n automation bridges.
        </p>
      </div>

      {/* Visual System Architecture Banner */}
      <div className="relative w-full h-64 sm:h-80 rounded-3xl overflow-hidden border border-[rgba(147,197,253,0.22)] shadow-2xl group bg-[#06142F]">
        <img
          src="/assets/agents_network.jpg"
          alt="Autonomous Agent Network Visualization"
          className="w-full h-full object-cover object-center opacity-70 group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06142F] via-[#06142F]/75 to-transparent flex items-center p-8 sm:p-12">
          <div className="max-w-xl space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#38BDF8] font-bold px-3 py-1 rounded-full bg-[#0B1F4D]/90 border border-[#38BDF8]/40 inline-block">
              Authoritative DAG Engine
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
              State Machine with Independent Cryptographic Verification
            </h3>
            <p className="text-xs sm:text-sm text-[rgba(219,234,254,0.85)] font-mono">
              UNDERSTAND → PLAN → ACT → VERIFY → RECOVER → REPORT
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Flow Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Visual Pipeline Flow */}
        <div className="lg:col-span-2 space-y-4">
          <div className="text-xs font-mono text-[#93C5FD] uppercase tracking-wider mb-2">
            Select a pipeline component to inspect specification:
          </div>

          <div className="space-y-3">
            {ARCH_COMPONENTS.map((comp, idx) => {
              const isSelected = selectedId === comp.id;
              return (
                <div key={comp.id}>
                  <div
                    onClick={() => setSelectedId(comp.id)}
                    className={`cursor-pointer p-5 rounded-2xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'nexus-glass-card border-[#38BDF8] ring-2 ring-[#38BDF8]/40 shadow-[0_0_25px_rgba(56,189,248,0.25)] scale-[1.01]'
                        : 'nexus-glass-card border-[rgba(147,197,253,0.14)] hover:border-[rgba(147,197,253,0.35)]'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-xl bg-[#06142F] flex items-center justify-center text-[#38BDF8] font-mono text-xs font-bold border border-[rgba(147,197,253,0.2)]">
                        0{idx + 1}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{comp.name}</h4>
                        <span className="text-[10px] font-mono text-[#38BDF8] font-semibold">{comp.badge}</span>
                      </div>
                    </div>

                    <span className="text-xs font-mono text-[rgba(219,234,254,0.6)] hover:text-white transition-colors">
                      Inspect →
                    </span>
                  </div>

                  {idx < ARCH_COMPONENTS.length - 1 && (
                    <div className="flex justify-center py-1.5 text-[#38BDF8]/40">
                      <ArrowDown className="h-4 w-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep-Dive Component Inspector */}
        <div className="nexus-glass-card p-8 rounded-3xl border border-[#38BDF8]/40 h-fit sticky top-28 space-y-6 shadow-2xl">
          <div className="border-b border-[rgba(147,197,253,0.14)] pb-4">
            <span className="text-[10px] font-mono text-[#38BDF8] font-bold uppercase tracking-wider block">
              {selectedComp.badge}
            </span>
            <h3 className="text-xl font-extrabold text-white mt-1">
              {selectedComp.name}
            </h3>
          </div>

          <div>
            <span className="text-xs font-semibold text-[#93C5FD] block mb-2 font-mono">Core Responsibility:</span>
            <p className="text-xs text-[rgba(219,234,254,0.85)] leading-relaxed font-sans">
              {selectedComp.role}
            </p>
          </div>

          <div className="space-y-4 font-mono text-xs pt-4 border-t border-[rgba(147,197,253,0.14)]">
            <div>
              <span className="text-[11px] text-[rgba(219,234,254,0.7)] block mb-1">Input Contract:</span>
              <div className="p-3.5 rounded-xl bg-[#06142F] border border-[rgba(147,197,253,0.16)] text-[#38BDF8] text-[11px] leading-relaxed">
                {selectedComp.inputs}
              </div>
            </div>

            <div>
              <span className="text-[11px] text-[rgba(219,234,254,0.7)] block mb-1">Output Contract:</span>
              <div className="p-3.5 rounded-xl bg-[#06142F] border border-[rgba(147,197,253,0.16)] text-[#10B981] text-[11px] leading-relaxed">
                {selectedComp.outputs}
              </div>
            </div>

            <div>
              <span className="text-[11px] text-[rgba(219,234,254,0.7)] block mb-1">Reliability & Fault Tolerance:</span>
              <div className="p-3.5 rounded-xl bg-[#06142F] border border-[rgba(147,197,253,0.16)] text-[#F59E0B] text-[11px] leading-relaxed">
                {selectedComp.resilience}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
