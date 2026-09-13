import pytest
from app.evaluations.runner import EvaluationRunner

@pytest.mark.asyncio
async def test_evaluation_runner_batch():
    runner = EvaluationRunner()
    results = await runner.run_suite(limit=5)
    
    assert "metrics" in results
    assert results["metrics"]["total_missions"] == 5
    assert results["metrics"]["successful_missions"] == 5
    assert results["metrics"]["mission_success_rate"] == 100.0
    assert results["metrics"]["tool_success_rate"] >= 95.0
    assert len(results["test_records"]) == 5
