export interface TaskNode {
  id: string;
  type: string;
  title: string;
  description: string;
  agent: string;
  tool: string;
  dependencies: string[];
  status: 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED' | 'RETRYING' | 'PARTIAL' | 'VERIFIED' | 'WAITING_APPROVAL';
  input_payload: Record<string, any>;
  output_payload: Record<string, any>;
  error?: string;
  retry_count: number;
  verification_state: 'UNVERIFIED' | 'VERIFYING' | 'VERIFIED' | 'FAILED' | 'SKIPPED';
  verification_evidence: Record<string, any>;
  verification_rule: string;
  duration_ms: number;
  requires_approval: boolean;
  is_approved: boolean;
}

export interface AgentLogEntry {
  id: string;
  timestamp: string;
  agent: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';
  message: string;
  task_id?: string;
  details?: Record<string, any>;
}

export interface Mission {
  id: string;
  goal: string;
  status: 'INITIALIZING' | 'PLANNING' | 'EXECUTING' | 'VERIFYING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  mode: 'DEMO' | 'LIVE';
  created_at: string;
  updated_at: string;
  tasks: Record<string, TaskNode>;
  agent_logs: AgentLogEntry[];
  final_report: Record<string, any>;
  verified_count: number;
  total_actions: number;
  recovery_count: number;
}

export interface Integration {
  id: string;
  name: string;
  type: string;
  configured: boolean;
  status: string;
  description: string;
}

export interface EvaluationResult {
  timestamp: string;
  metrics: {
    total_missions: number;
    successful_missions: number;
    failed_missions: number;
    mission_success_rate: number;
    tool_success_rate: number;
    verification_rate: number;
    recovery_rate: number;
    total_recoveries_executed: number;
    avg_execution_time_seconds: number;
  };
  test_records: Array<{
    scenario_id: string;
    name: string;
    category: string;
    difficulty: string;
    input_goal: string;
    expected_steps: number;
    actual_steps: number;
    tool_success_count: number;
    verification_success_count: number;
    recoveries: number;
    final_success: boolean;
    failure_reason: string | null;
    execution_time_ms: number;
  }>;
}

const API_BASE = '/api';

export async function createMission(goal: string, mode: string = 'DEMO'): Promise<{ mission_id: string; mission: Mission }> {
  const res = await fetch(`${API_BASE}/missions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ goal, mode, auto_execute: false })
  });
  if (!res.ok) throw new Error('Failed to initialize mission');
  return res.json();
}

export async function executeMission(missionId: string, autoApprove: boolean = true): Promise<Mission> {
  const res = await fetch(`${API_BASE}/missions/${missionId}/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ auto_approve: autoApprove })
  });
  if (!res.ok) throw new Error('Failed to start execution');
  return res.json();
}

export async function approveTask(missionId: string, taskId: string): Promise<Mission> {
  const res = await fetch(`${API_BASE}/missions/${missionId}/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task_id: taskId })
  });
  if (!res.ok) throw new Error('Failed to approve task');
  return res.json();
}

export async function getMission(missionId: string): Promise<Mission> {
  const res = await fetch(`${API_BASE}/missions/${missionId}`);
  if (!res.ok) throw new Error('Failed to fetch mission');
  return res.json();
}

export async function getIntegrations(): Promise<Integration[]> {
  const res = await fetch(`${API_BASE}/integrations`);
  if (!res.ok) throw new Error('Failed to fetch integrations');
  return res.json();
}

export async function runEvaluations(limit: number = 28): Promise<EvaluationResult> {
  const res = await fetch(`${API_BASE}/evaluations/run?limit=${limit}`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to execute evaluation suite');
  return res.json();
}

export async function getLatestEvaluations(): Promise<EvaluationResult> {
  const res = await fetch(`${API_BASE}/evaluations/latest`);
  if (!res.ok) throw new Error('Failed to fetch evaluation results');
  return res.json();
}

export function subscribeToMission(
  missionId: string,
  onEvent: (event: { type: string; data: any }) => void
): () => void {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.host;
  const wsUrl = `${protocol}//${host}/ws/missions/${missionId}`;
  
  const ws = new WebSocket(wsUrl);

  ws.onmessage = (e) => {
    try {
      const data = JSON.parse(e.data);
      onEvent(data);
    } catch (err) {
      console.error('Failed to parse WS message', err);
    }
  };

  return () => {
    ws.close();
  };
}
