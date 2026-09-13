# NEXUS — 2-Minute Demo Script
## Multi-App AI Agent Hackathon Presentation

**Target Duration:** 2 Minutes (120 Seconds)  
**Presenter:** Single Presenter or Voiceover  
**Screen Setup:** Browser open to `http://localhost:5173` showing NEXUS Command Center.

---

### [0:00 – 0:15] The Problem: Fragile "Text-Only" Agents
- **Screen:** Show NEXUS Hero Landing Page.
- **Voiceover:**
  > "Today's AI agents have a fatal flaw: they talk a big game in text, but when it comes to doing real work across your actual apps, they hallucinate, fail silently, and offer zero proof of completion. If an agent says it scheduled your meeting or analyzed your codebase, did it actually happen?"

---

### [0:15 – 0:35] The Goal: Autonomous Outcome Dispatch
- **Screen:** Click on the preset prompt: *"Acme Technical Interview Prep"*.
- **Voiceover:**
  > "Meet NEXUS: Autonomous Mission Control. With NEXUS, you don't dictate individual tasks. You give it an outcome:
  > *'Prepare me for tomorrow's technical interview at Acme. Find the details, gather info from my email and GitHub, research the company, create a study plan, and notify me.'*
  > I click **EXECUTE MISSION**."

---

### [0:35 – 1:10] Multi-App Execution & Live DAG
- **Screen:** Mission Graph animates. Watch Calendar, Gmail, GitHub, and Research nodes turn from Pending to Running (pulsing blue) to Verified (green checkmark). The Agent Activity Log streams live events.
- **Voiceover:**
  > "Watch what happens in real time. The Commander Agent parses the objective. The Planner generates an 8-stage execution graph.
  > NEXUS fans out concurrent requests:
  > First, the Calendar Agent scans Google Calendar, finding the 10 AM interview with Principal Architect Sarah Chen.
  > Concurrently, the Gmail Agent queries recruiter threads, pulling the syllabus on transactional outbox patterns.
  > The GitHub Agent inspects Acme's real repositories, identifying that Sarah Chen committed Redis Redlock deduplication two days ago.
  > And the Intelligence Agent cross-correlates the recruiter's questions with the actual code."

---

### [1:10 – 1:30] Human-in-the-Loop & Delivery
- **Screen:** If Human Approval is toggled, modal pops up. Click **AUTHORIZE & DISPATCH**. Slack notification dispatches.
- **Voiceover:**
  > "For consequential actions—like messaging team channels—NEXUS supports human-in-the-loop checkpoints.
  > I authorize the dispatch. The Slack Agent posts the briefing card to our team channel with verified receipts."

---

### [1:30 – 1:45] The Differentiator: Independent Verification
- **Screen:** Click into the **Mission Complete** report. Show the **Verification Audit Trail** tab and the **SHA-256 hash**. Click a node to show the **Action Telemetry Inspector**.
- **Voiceover:**
  > "Here is the key differentiator: NEXUS is **verification-first**.
  > Notice this attestation badge: **8 out of 8 actions verified**.
  > An independent auditor verified the Google Meet URL, verified the recruiter email message ID, verified repository commit SHAs, and cryptographically hashed the generated 7-section study plan with SHA-256. Zero simulated claims."

---

### [1:45 – 2:00] Reliability Console & Conclusion
- **Screen:** Click the **Reliability & Eval** tab. Show the metrics cards and the 28 benchmark scenarios.
- **Voiceover:**
  > "Under the hood, our Reliability Engine tested 28 benchmark scenarios across edge cases, rate limits, and network drops, achieving a 100% mission verification rate with automated fault recovery.
  > NEXUS doesn't just tell you what to do. It does the work across your apps—and proves it happened."

---

## Key Demo Checkpoints
| Timestamp | Visual Action | Key Point to Emphasize |
| :--- | :--- | :--- |
| **0:15** | Click preset prompt | Outcome-driven, not prompt-engineering |
| **0:40** | Live DAG node status transitions | Real asynchronous state machine, concurrent extraction |
| **1:05** | Inspect GitHub commit details | Deep cross-app intelligence synthesis |
| **1:35** | Show SHA-256 hash & audit table | Cryptographic proof vs fake text generation |
| **1:50** | Reliability Console 28 tests | 100% verifiable evaluation benchmark |
