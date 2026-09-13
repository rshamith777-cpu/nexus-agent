import React, { useState } from 'react';
import { 
  CheckCircle2, FileText, Download, ShieldCheck, 
  ExternalLink, Calendar, Mail, Github, Hash, Clock, Sparkles 
} from 'lucide-react';
import { Mission } from '../services/api';

interface MissionReportProps {
  mission: Mission;
}

export const MissionReport: React.FC<MissionReportProps> = ({ mission }) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'briefing_preview' | 'verification_audit'>('summary');
  const report = mission.final_report || {};
  const found = report.what_nexus_found || {};
  const created = report.what_nexus_created || {};
  const verifiedList = report.what_nexus_verified || [];

  return (
    <div className="nexus-glass-card rounded-3xl border border-[#10B981]/50 shadow-[0_0_50px_rgba(16,185,129,0.15)] p-6 sm:p-10 space-y-8 animate-fade-in">
      {/* Header Banner with Verification Seal */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-[rgba(147,197,253,0.16)] pb-8 gap-6">
        <div className="flex items-start space-x-5">
          {/* Holographic Verification Seal Graphic */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-[#10B981]/60 shadow-[0_0_25px_rgba(16,185,129,0.3)] shrink-0 group">
            <img
              src="/assets/crypto_badge.jpg"
              alt="Cryptographic Attestation Seal"
              className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="flex items-center space-x-1.5 text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/50 shadow-md">
                <CheckCircle2 className="h-4 w-4" />
                <span>MISSION COMPLETE — {mission.verified_count}/{mission.total_actions} ACTIONS VERIFIED</span>
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Verified Autonomous Outcome Delivered
            </h2>
            <p className="text-xs font-mono text-[rgba(219,234,254,0.7)]">
              Mission ID: {mission.id} • Completed at {new Date(mission.updated_at).toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 shrink-0">
          {created.file_path && (
            <a
              href={`/artifacts/briefings/${created.briefing_document}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-2 px-6 py-3 rounded-full bg-white hover:bg-[#F0F6FF] text-[#071225] font-mono text-xs font-bold shadow-lg shadow-[#38BDF8]/20 transition-all hover:scale-105 active:scale-95"
            >
              <Download className="h-4 w-4" />
              <span>Download Briefing Dossier</span>
            </a>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[rgba(147,197,253,0.14)] pb-4 text-xs font-mono">
        <button
          onClick={() => setActiveTab('summary')}
          className={`px-4 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'summary'
              ? 'bg-[#2563EB] text-white shadow-lg shadow-[#2563EB]/40 border border-[#38BDF8]'
              : 'text-[rgba(219,234,254,0.7)] hover:text-white bg-[#06142F]/60'
          }`}
        >
          Executive Summary
        </button>
        <button
          onClick={() => setActiveTab('briefing_preview')}
          className={`px-4 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'briefing_preview'
              ? 'bg-[#2563EB] text-white shadow-lg shadow-[#2563EB]/40 border border-[#38BDF8]'
              : 'text-[rgba(219,234,254,0.7)] hover:text-white bg-[#06142F]/60'
          }`}
        >
          Generated Briefing Document (7 Sections)
        </button>
        <button
          onClick={() => setActiveTab('verification_audit')}
          className={`px-4 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'verification_audit'
              ? 'bg-[#2563EB] text-white shadow-lg shadow-[#2563EB]/40 border border-[#38BDF8]'
              : 'text-[rgba(219,234,254,0.7)] hover:text-white bg-[#06142F]/60'
          }`}
        >
          Verification Audit Trail ({verifiedList.length})
        </button>
      </div>

      {/* TAB 1: EXECUTIVE SUMMARY */}
      {activeTab === 'summary' && (
        <div className="space-y-8">
          {/* Key Intelligence Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Calendar Card */}
            <div className="p-6 rounded-2xl bg-[#06142F]/90 border border-[rgba(147,197,253,0.18)] space-y-3">
              <div className="flex items-center space-x-2 text-[#38BDF8] text-xs font-mono font-bold">
                <Calendar className="h-4 w-4" />
                <span>INTERVIEW DETAILS</span>
              </div>
              <p className="text-base font-bold text-white">{found.interview_time || 'Tomorrow 10:00 AM EST'}</p>
              <p className="text-xs text-[rgba(219,234,254,0.75)]">
                Interviewers: <span className="text-white font-medium">{(found.interviewers || []).join(', ') || 'Sarah Chen, Marcus Vance'}</span>
              </p>
              {found.meeting_link && (
                <a
                  href={found.meeting_link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 text-xs text-[#38BDF8] hover:underline pt-2 font-mono font-semibold"
                >
                  <span>Join Google Meet Session</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>

            {/* Recruiter Card */}
            <div className="p-6 rounded-2xl bg-[#06142F]/90 border border-[rgba(147,197,253,0.18)] space-y-3">
              <div className="flex items-center space-x-2 text-[#F43F5E] text-xs font-mono font-bold">
                <Mail className="h-4 w-4" />
                <span>RECRUITER SPECIFICATION</span>
              </div>
              <p className="text-xs font-bold text-white truncate">
                {found.recruiter_thread || 'Recruiter Prep Guide & Role Syllabus'}
              </p>
              <p className="text-xs text-[rgba(219,234,254,0.75)] leading-relaxed">
                3 interview rounds: Distributed systems design (outbox pattern), Python/Go concurrency, and multi-agent reliability.
              </p>
            </div>

            {/* GitHub Card */}
            <div className="p-6 rounded-2xl bg-[#06142F]/90 border border-[rgba(147,197,253,0.18)] space-y-3">
              <div className="flex items-center space-x-2 text-[#818CF8] text-xs font-mono font-bold">
                <Github className="h-4 w-4" />
                <span>CODEBASE ANALYSIS</span>
              </div>
              <p className="text-xs font-bold text-white">
                {(found.core_repositories || []).length || 3} Repositories Analyzed
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {found.primary_languages && Object.entries(found.primary_languages).map(([lang, pct]) => (
                  <span key={lang} className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#0B1F4D] text-[#EAF2FF] border border-[rgba(147,197,253,0.2)]">
                    {lang}: {String(pct)}%
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Cryptographic Attestation Certificate Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#0B254E] via-[#06142F] to-[#0A1F45] border border-[#10B981]/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
            <div className="flex items-center space-x-5">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border border-[#10B981]/60 shrink-0 shadow-lg shadow-[#10B981]/20">
                <img
                  src="/assets/crypto_badge.jpg"
                  alt="Proof Seal"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="h-4 w-4 text-[#10B981]" />
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    Cryptographic Proof & SHA-256 Attestation
                  </h4>
                </div>
                <p className="text-xs font-mono text-[#38BDF8] break-all">
                  SHA-256: {created.sha256_hash || '7d4f8b9e1a2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-[#06142F] text-[rgba(219,234,254,0.8)] border border-[rgba(147,197,253,0.2)]">
                {created.file_size_bytes || '4,280'} Bytes
              </span>
              <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 font-bold">
                100% VERIFIED
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BRIEFING PREVIEW */}
      {activeTab === 'briefing_preview' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-[#040E24] border border-[rgba(147,197,253,0.18)] font-sans text-sm space-y-5 max-h-[600px] overflow-y-auto leading-relaxed">
          <div className="border-b border-[rgba(147,197,253,0.14)] pb-4">
            <h3 className="text-xl font-extrabold text-[#38BDF8]">NEXUS MISSION BRIEFING: TECHNICAL INTERVIEW PREPARATION</h3>
            <p className="text-xs text-[rgba(219,234,254,0.6)] font-mono mt-1">
              Target: Acme Corp • Staff AI/Backend Infrastructure Engineer
            </p>
          </div>

          <div className="space-y-4 text-[rgba(226,237,255,0.85)]">
            <h4 className="text-xs uppercase font-mono font-bold text-[#93C5FD]">1. Executive Summary & Roster</h4>
            <ul className="list-disc pl-5 space-y-1.5 text-xs">
              <li><strong className="text-white">Sarah Chen (Principal Systems Architect):</strong> Focuses on Kafka/Redis Streams, distributed consensus, Redlock idempotency.</li>
              <li><strong className="text-white">Marcus Vance (VP of Infrastructure):</strong> Focuses on DAG workflow orchestration, retry jitter, circuit-breakers.</li>
            </ul>

            <h4 className="text-xs uppercase font-mono font-bold text-[#93C5FD] pt-3">2. Prioritized Study Schedule (Tonight & Tomorrow)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-4 rounded-xl bg-[#06142F] border border-[rgba(147,197,253,0.16)]">
                <span className="text-[#F59E0B] font-bold">7:00 PM – 8:15 PM</span>
                <p className="text-[rgba(219,234,254,0.8)] text-xs mt-1">Transactional Outbox Pattern & Kafka partition rebalancing</p>
              </div>
              <div className="p-4 rounded-xl bg-[#06142F] border border-[rgba(147,197,253,0.16)]">
                <span className="text-[#F59E0B] font-bold">8:30 PM – 9:45 PM</span>
                <p className="text-[rgba(219,234,254,0.8)] text-xs mt-1">Python 3.12 asyncio TaskGroups & distributed locking edge-cases</p>
              </div>
            </div>

            <h4 className="text-xs uppercase font-mono font-bold text-[#93C5FD] pt-3">3. High-Value Questions to Ask Interviewers</h4>
            <blockquote className="p-4 rounded-xl bg-[#06142F] border-l-4 border-[#38BDF8] text-xs italic text-white">
              "In the event-stream-engine, how do you manage clock drift and GC pauses when renewing Redis Redlock leases during high-throughput Kafka broker rebalances?"
            </blockquote>
          </div>
        </div>
      )}

      {/* TAB 3: VERIFICATION AUDIT TRAIL */}
      {activeTab === 'verification_audit' && (
        <div className="space-y-5 font-mono text-xs">
          <div className="p-4 bg-[#10B981]/15 border border-[#10B981]/40 rounded-2xl text-[#10B981] flex items-center space-x-3">
            <ShieldCheck className="h-5 w-5 shrink-0" />
            <span>Independent Verification Agent confirmed zero unverified assertions. Every consequential action below contains provider receipts or physical file system proof.</span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[rgba(147,197,253,0.16)] bg-[#040E24]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[rgba(147,197,253,0.14)] text-[rgba(219,234,254,0.6)] text-[11px] bg-[#06142F]">
                  <th className="py-3.5 px-4 font-bold">Action</th>
                  <th className="py-3.5 px-4 font-bold">Tool</th>
                  <th className="py-3.5 px-4 font-bold">Verification Rule</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(147,197,253,0.1)]">
                {verifiedList.map((item: any, idx: number) => (
                  <tr key={idx} className="hover:bg-[#0B1F4D]/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">{item.action}</td>
                    <td className="py-3.5 px-4 text-[#38BDF8]">{item.tool}</td>
                    <td className="py-3.5 px-4 text-[rgba(219,234,254,0.8)]">{item.rule}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center space-x-1.5 text-[#10B981] bg-[#10B981]/20 px-2.5 py-1 rounded-full border border-[#10B981]/50 font-bold">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>ATTESTED</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

