from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field
import time
from app.core.state import VerificationResult

class ToolResult(BaseModel):
    success: bool
    data: Dict[str, Any] = Field(default_factory=dict)
    error: Optional[str] = None
    duration_ms: float = 0.0
    evidence: Dict[str, Any] = Field(default_factory=dict)
    is_mock: bool = False

class BaseTool(ABC):
    name: str
    description: str
    requires_approval: bool = False

    @abstractmethod
    async def execute(self, payload: Dict[str, Any], context: Dict[str, Any], mode: str = "DEMO") -> ToolResult:
        """Executes the tool logic across real integration or mock adapter."""
        pass

    @abstractmethod
    async def verify(self, result: ToolResult, payload: Dict[str, Any], context: Dict[str, Any]) -> VerificationResult:
        """Independently verifies the external action outcome."""
        pass
