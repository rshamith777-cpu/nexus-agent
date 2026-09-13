from enum import Enum
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field
from datetime import datetime

class TaskStatus(str, Enum):
    PENDING = "PENDING"
    RUNNING = "RUNNING"
    SUCCESS = "SUCCESS"
    FAILED = "FAILED"
    RETRYING = "RETRYING"
    PARTIAL = "PARTIAL"
    VERIFIED = "VERIFIED"
    WAITING_APPROVAL = "WAITING_APPROVAL"

class MissionStatus(str, Enum):
    INITIALIZING = "INITIALIZING"
    PLANNING = "PLANNING"
    EXECUTING = "EXECUTING"
    VERIFYING = "VERIFYING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"

class AgentRole(str, Enum):
    COMMANDER = "COMMANDER"
    PLANNER = "PLANNER"
    CALENDAR_AGENT = "CALENDAR_AGENT"
    GMAIL_AGENT = "GMAIL_AGENT"
    GITHUB_AGENT = "GITHUB_AGENT"
    RESEARCH_AGENT = "RESEARCH_AGENT"
    INTELLIGENCE_AGENT = "INTELLIGENCE_AGENT"
    DOCUMENT_AGENT = "DOCUMENT_AGENT"
    NOTIFICATION_AGENT = "NOTIFICATION_AGENT"
    VERIFICATION_AGENT = "VERIFICATION_AGENT"
    RECOVERY_AGENT = "RECOVERY_AGENT"

class VerificationState(str, Enum):
    UNVERIFIED = "UNVERIFIED"
    VERIFYING = "VERIFYING"
    VERIFIED = "VERIFIED"
    FAILED = "FAILED"
    SKIPPED = "SKIPPED"

class TaskNode(BaseModel):
    id: str
    type: str
    title: str
    description: str
    agent: AgentRole
    tool: str
    dependencies: List[str] = Field(default_factory=list)
    status: TaskStatus = TaskStatus.PENDING
    input_payload: Dict[str, Any] = Field(default_factory=dict)
    output_payload: Dict[str, Any] = Field(default_factory=dict)
    error: Optional[str] = None
    retry_count: int = 0
    max_retries: int = 2
    verification_state: VerificationState = VerificationState.UNVERIFIED
    verification_evidence: Dict[str, Any] = Field(default_factory=dict)
    verification_rule: str = ""
    duration_ms: float = 0.0
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    requires_approval: bool = False
    is_approved: bool = False

class AgentLogEntry(BaseModel):
    id: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    agent: AgentRole
    level: str = "INFO" # INFO, WARN, ERROR, SUCCESS
    message: str
    task_id: Optional[str] = None
    details: Dict[str, Any] = Field(default_factory=dict)

class Mission(BaseModel):
    id: str
    goal: str
    status: MissionStatus = MissionStatus.INITIALIZING
    mode: str = "DEMO" # "DEMO" or "LIVE"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    tasks: Dict[str, TaskNode] = Field(default_factory=dict)
    execution_order: List[str] = Field(default_factory=list)
    agent_logs: List[AgentLogEntry] = Field(default_factory=list)
    final_report: Dict[str, Any] = Field(default_factory=dict)
    verified_count: int = 0
    total_actions: int = 0
    recovery_count: int = 0

class VerificationResult(BaseModel):
    task_id: str
    verified: bool
    rule: str
    expected: str
    actual: str
    evidence: Dict[str, Any] = Field(default_factory=dict)
    message: str = ""
