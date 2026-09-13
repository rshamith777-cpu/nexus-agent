# NEXUS MISSION BRIEFING: TECHNICAL INTERVIEW PREPARATION
**Target Company:** Acme Corp  
**Target Role:** Staff AI/Backend Infrastructure Engineer  
**Date & Time:** 2026-09-14 10:00:00 EST (90 Minutes)  
**Meeting Link:** [https://meet.google.com/acm-tech-arch-994](https://meet.google.com/acm-tech-arch-994)  
**Interviewers:** Sarah Chen (Principal Systems Architect), Marcus Vance (VP of Infrastructure Engineering)  
**Status:** AUTONOMOUSLY ASSEMBLED & CRYPTOGRAPHICALLY VERIFIED

---

## 1. EXECUTIVE SUMMARY & INTERVIEW ROSTER
- **Sarah Chen (Principal Systems Architect)**: Focuses on distributed consensus, event streaming, and Kafka/Redis scaling. Recently committed Redis Redlock deduplication to `event-stream-engine`.
- **Marcus Vance (VP of Infrastructure Engineering)**: Focuses on architectural resilience, circuit breakers, DAG orchestration, and team execution. Recently committed retry backoff fixes to `workflow-orchestrator-core`.

---

## 2. RECRUITER SPECIFICATION & ROLE CONTEXT (FROM GMAIL)
From Jessica Lin (Recruiting):
- **Round 1 (45 min): Distributed System Design**  
  Designing an idempotent, outbox-pattern event processing pipeline handling 100M+ webhooks daily with guaranteed zero duplicate state mutations.
- **Round 2 (30 min): Concurrency & Reliability Deep-Dive**  
  Python 3.12 `asyncio` taskgroups, structured concurrency, GIL boundaries, worker thread pools, and Go microservice boundaries.
- **Round 3 (15 min): Candidate Q&A & Cultural Alignment**  
  Discussion of production failures, on-call reliability philosophies, and engineering culture.

---

## 3. ACME CODEBASE ARCHITECTURE & COMMIT INSIGHTS (FROM GITHUB)
Analyzed 3 core Acme repositories:
1. `acme-corp/event-stream-engine` (Python 48.5%, Rust 12.1%):
   - Ingestion layer using Redis Streams with consumer groups.
   - Idempotency key table partitioned by organization ID.
2. `acme-corp/workflow-orchestrator-core` (TypeScript 33.2%):
   - Explicit state machine with strict Directed Acyclic Graph (DAG) task dependencies.
   - Automated retry with exponential jitter on third-party webhook timeouts.
3. `acme-corp/multi-agent-integrations-sdk` (Python):
   - Multi-provider connectors for Calendar, Gmail, Slack, and GitHub.

---

## 4. SYSTEM DESIGN TOPICS & KNOWLEDGE GAP ANALYSIS
Key concepts you MUST review tonight:
1. **Transactional Outbox Pattern**: Dual-write problem between Postgres and Kafka. Explain CDC (Change Data Capture / Debezium) vs polling outbox worker.
2. **Distributed Deduplication (Idempotency)**: Unique request IDs stored in Redis with short TTL (e.g. 24h), falling back to DB unique constraints.
3. **Dead-Letter Queues (DLQ) & Poison Pills**: Automated quarantine, replay tools, and alerting thresholds.
4. **Structured Concurrency in Python 3.11/3.12**: Replacing naked `asyncio.create_task` with `asyncio.TaskGroup` to guarantee exception propagation.

---

## 5. PRIORITIZED STUDY SCHEDULE (HOUR-BY-HOUR)
- **Tonight 7:00 PM – 8:15 PM**: *Distributed Messaging Architecture*  
  Review Transactional Outbox, Kafka partition rebalancing, and Redis Stream Consumer Groups.
- **Tonight 8:30 PM – 9:45 PM**: *Concurrency & Failure Modes*  
  Review Python `asyncio.TaskGroup`, race conditions, and distributed locking edge-cases.
- **Tonight 10:00 PM – 10:45 PM**: *Acme Codebase Empathy*  
  Review Sarah Chen and Marcus Vance's recent commit histories on their public repos.
- **Tomorrow 8:30 AM – 9:15 AM**: *System Design Dry-Run*  
  Sketch architecture for a 100k req/sec webhook ingestion engine with outbox publisher on whiteboard.
- **Tomorrow 9:45 AM**: *Pre-Flight Setup*  
  Join Google Meet link, test audio/camera, have 3 targeted questions ready.

---

## 6. HIGH-IMPACT QUESTIONS TO ASK INTERVIEWERS
1. *For Sarah:* "I saw your recent work on Redlock deduplication in the event stream engine. At 100M events/day, how do you manage clock drift and GC pauses when renewing distributed lock leases?"
2. *For Marcus:* "Given your strict 99.99% reliability SLA on autonomous agent workflows, what is your team's threshold for automated self-healing vs human-in-the-loop escalation?"
3. *General:* "What was the most surprising post-mortem incident your infrastructure team handled in the last quarter?"

---

## 7. VERIFICATION AUDIT TRAIL & ATTESTATION
- **Mission ID:** mission_631ca64f
- **Calendar Event:** VERIFIED (Event ID: evt_acme_tech_2026_994)
- **Gmail Recruiter Thread:** VERIFIED (Thread ID: th_acme_recruiting_8812)
- **GitHub Repositories:** VERIFIED (3 repos, 4 languages, 3 commits inspected)
- **Research Sources:** VERIFIED (2 engineering articles analyzed)
- **Generated Timestamp:** 2026-09-13 14:40:43 UTC
