import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { VantageLanding } from './components/VantageLanding';
import { MissionInput } from './components/MissionInput';
import { MissionGraph } from './components/MissionGraph';
import { AgentActivityLog } from './components/AgentActivityLog';
import { ActionInspector } from './components/ActionInspector';
import { HumanApprovalModal } from './components/HumanApprovalModal';
import { MissionReport } from './components/MissionReport';
import { ReliabilityConsole } from './components/ReliabilityConsole';
import { ArchitectureView } from './components/ArchitectureView';
import { IntegrationsView } from './components/IntegrationsView';
import { 
  Mission, TaskNode, createMission, executeMission, 
  approveTask, getMission, subscribeToMission 
} from './services/api';

export function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'mission' | 'reliability' | 'architecture' | 'integrations'>('home');
  const [mode, setMode] = useState<'DEMO' | 'LIVE'>('DEMO');
  const [currentMission, setCurrentMission] = useState<Mission | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [approvalTask, setApprovalTask] = useState<TaskNode | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Elapsed timer during execution
  useEffect(() => {
    let interval: any = null;
    if (isExecuting) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setElapsedSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isExecuting]);

  // Subscribe to real-time events when currentMission is active
  useEffect(() => {
    if (!currentMission?.id) return;

    const unsubscribe = subscribeToMission(currentMission.id, (event) => {
      getMission(currentMission.id)
        .then((updated) => {
          setCurrentMission(updated);
          const waiting = Object.values(updated.tasks).find(t => t.status === 'WAITING_APPROVAL');
          setApprovalTask(waiting || null);

          if (updated.status === 'COMPLETED' || updated.status === 'FAILED') {
            setIsExecuting(false);
          }
        })
        .catch(console.error);
    });

    return () => unsubscribe();
  }, [currentMission?.id]);

  const handleStartMission = async (goal: string, humanApproval: boolean) => {
    setIsExecuting(true);
    setElapsedSeconds(0);
    setSelectedTaskId(null);

    try {
      const initRes = await createMission(goal, mode);
      setCurrentMission(initRes.mission);

      const autoApprove = !humanApproval;
      const executed = await executeMission(initRes.mission_id, autoApprove);
      setCurrentMission(executed);

      const waiting = Object.values(executed.tasks).find(t => t.status === 'WAITING_APPROVAL');
      if (waiting) {
        setApprovalTask(waiting);
      } else if (executed.status === 'COMPLETED') {
        setIsExecuting(false);
      }
    } catch (err) {
      console.error('Mission failed to start', err);
      setIsExecuting(false);
    }
  };

  const handleApproveAction = async (taskId: string) => {
    if (!currentMission) return;
    setApprovalTask(null);
    setIsExecuting(true);
    try {
      const updated = await approveTask(currentMission.id, taskId);
      setCurrentMission(updated);
      if (updated.status === 'COMPLETED') {
        setIsExecuting(false);
      }
    } catch (err) {
      console.error('Action approval failed', err);
      setIsExecuting(false);
    }
  };

  const handleLaunchFromHero = () => {
    setActiveTab('mission');
    if (!currentMission) {
      // Auto-start flagship mission
      handleStartMission(
        "Prepare me for tomorrow's technical interview at Acme. Find the interview details, gather relevant information from my email and GitHub, research the company, identify what I should study, create a preparation briefing and study plan, and notify me when it's ready.",
        false
      );
    }
  };

  const selectedTask = (currentMission && selectedTaskId)
    ? currentMission.tasks[selectedTaskId] || null
    : null;

  return (
    <div className="min-h-screen bg-[#06142F] text-[#EAF2FF] flex flex-col font-sans selection:bg-[#2563EB] selection:text-white">
      {/* 1. Canonical Vantage Landing Page View */}
      {activeTab === 'home' && (
        <VantageLanding
          onLaunchMission={handleLaunchFromHero}
          onNavigate={(tab) => setActiveTab(tab)}
          onOpenIntegrations={() => setActiveTab('integrations')}
          activeTab={activeTab}
        />
      )}

      {/* 2. Full Application Views (Missions, Reliability, Architecture, Integrations) */}
      {activeTab !== 'home' && (
        <>
          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            mode={mode}
            setMode={setMode}
            isRunning={isExecuting}
          />

          <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 sm:px-8 lg:px-12 py-10 space-y-10 animate-fade-in">
            {activeTab === 'mission' && (
              <div className="space-y-10">
                {/* Mission Input Header & Cinematic Operations Banner */}
                <MissionInput
                  onStartMission={handleStartMission}
                  isLoading={isExecuting}
                  activeMissionGoal={currentMission?.goal}
                />

                {/* If a mission is running or exists, display live mission control telemetry */}
                {currentMission && (
                  <div className="nexus-glass-card p-6 sm:p-7 rounded-3xl border border-[rgba(147,197,253,0.22)] shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="flex items-center space-x-4">
                      <span className={`h-4 w-4 rounded-full shrink-0 ${
                        currentMission.status === 'COMPLETED' ? 'bg-[#10B981] shadow-[0_0_12px_#10B981]' :
                        currentMission.status === 'EXECUTING' ? 'bg-[#38BDF8] animate-ping' :
                        currentMission.status === 'FAILED' ? 'bg-[#F43F5E]' : 'bg-[#F59E0B]'
                      }`} />
                      <div>
                        <div className="flex items-center space-x-3">
                          <span className="text-xs font-mono text-[#38BDF8] font-bold uppercase tracking-wider">
                            MISSION // {currentMission.id}
                          </span>
                          <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                            currentMission.status === 'COMPLETED' ? 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/50' :
                            currentMission.status === 'EXECUTING' ? 'bg-[#38BDF8]/20 text-[#38BDF8] border-[#38BDF8]/50 animate-pulse' :
                            'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/50'
                          }`}>
                            {currentMission.status}
                          </span>
                        </div>
                        <p className="text-sm sm:text-base font-semibold text-white mt-1 line-clamp-2 max-w-2xl">
                          {currentMission.goal}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 text-xs font-mono shrink-0">
                      <div className="text-right">
                        <span className="text-[rgba(219,234,254,0.6)] block text-[10px] uppercase">Cryptographic Proofs</span>
                        <span className="text-[#10B981] font-bold text-base">
                          {currentMission.verified_count} / {currentMission.total_actions}
                        </span>
                      </div>
                      {isExecuting && (
                        <div className="text-right pl-4 border-l border-[rgba(147,197,253,0.16)]">
                          <span className="text-[rgba(219,234,254,0.6)] block text-[10px] uppercase">Execution Timer</span>
                          <span className="text-[#38BDF8] font-bold text-base">{elapsedSeconds}s</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Main View: DAG Graph & Activity Log */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <MissionGraph
                      tasks={currentMission ? currentMission.tasks : {}}
                      selectedTaskId={selectedTaskId}
                      onSelectTask={(tid) => setSelectedTaskId(tid)}
                    />
                  </div>
                  <div className="lg:col-span-1">
                    <AgentActivityLog logs={currentMission ? currentMission.agent_logs : []} />
                  </div>
                </div>

                {/* Action Inspector Drawer if a node is selected */}
                {selectedTask && (
                  <ActionInspector
                    task={selectedTask}
                    onClose={() => setSelectedTaskId(null)}
                  />
                )}

                {/* Final Mission Report if completed */}
                {currentMission && currentMission.status === 'COMPLETED' && (
                  <MissionReport mission={currentMission} />
                )}
              </div>
            )}

            {activeTab === 'reliability' && <ReliabilityConsole />}
            {activeTab === 'architecture' && <ArchitectureView />}
            {activeTab === 'integrations' && <IntegrationsView />}
          </main>

          {/* Footer */}
          <footer className="border-t border-[rgba(147,197,253,0.14)] py-6 bg-[#06142F]">
            <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between text-xs text-[rgba(219,234,254,0.6)] font-mono gap-3">
              <span>NEXUS Mission Control • Multi-App AI Agent Hackathon</span>
              <span>Turn outcomes into verified actions across your apps.</span>
            </div>
          </footer>
        </>
      )}

      {/* Human-in-the-loop Approval Modal */}
      {approvalTask && (
        <HumanApprovalModal
          task={approvalTask}
          onApprove={handleApproveAction}
          onCancel={() => setApprovalTask(null)}
        />
      )}
    </div>
  );
}

export default App;
