import React from 'react';
import { ShieldAlert, Check, X, Send, AlertTriangle } from 'lucide-react';
import { TaskNode } from '../services/api';

interface HumanApprovalModalProps {
  task: TaskNode | null;
  onApprove: (taskId: string) => void;
  onCancel: () => void;
}

export const HumanApprovalModal: React.FC<HumanApprovalModalProps> = ({ task, onApprove, onCancel }) => {
  if (!task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel max-w-lg w-full p-6 rounded-2xl border border-amber-500/60 shadow-2xl shadow-amber-500/10 space-y-4">
        <div className="flex items-center space-x-3 text-amber-400">
          <div className="p-2 rounded-lg bg-amber-950/80 border border-amber-600/60">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Human Approval Checkpoint</h3>
            <p className="text-xs text-amber-300/80 font-mono">Consequential External Action Required</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Action:</span>
            <span className="text-white font-bold">{task.title}</span>
          </div>
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Target Integration:</span>
            <span className="text-sky-400">{task.tool}</span>
          </div>
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Target Channel:</span>
            <span className="text-emerald-400">#interview-prep</span>
          </div>
          <p className="text-xs text-slate-300 pt-2 border-t border-slate-800">
            NEXUS is requesting authorization to post the final verified interview briefing package and prioritized study schedule to your communication channel.
          </p>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-xs font-mono text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700"
          >
            Cancel Action
          </button>
          <button
            onClick={() => onApprove(task.id)}
            className="flex items-center space-x-2 px-5 py-2 rounded-lg text-xs font-mono font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
          >
            <Check className="h-4 w-4" />
            <span>AUTHORIZE & DISPATCH</span>
          </button>
        </div>
      </div>
    </div>
  );
};
