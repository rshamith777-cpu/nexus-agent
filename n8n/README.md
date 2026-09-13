# NEXUS & n8n Integration Guide

## 1. Architectural Separation of Concerns
NEXUS uses **n8n** for deterministic, reliable multi-app execution and webhook piping, while keeping agent reasoning, DAG planning, and verification logic authoritative in the NEXUS backend.

| Responsibility | Layer | Component |
| :--- | :--- | :--- |
| **Reasoning & Planning** | NEXUS Agent Layer | Commander, Planner & Intelligence Agents |
| **Orchestration & Verification** | NEXUS Backend | State Machine DAG Engine & Verification Agent |
| **Deterministic Automation** | n8n Engine | Webhook triggers, App Connectors, Scheduled Tasks |
| **External Integrations** | Live Apps / Mocks | Google Calendar, Gmail, GitHub, Slack |

---

## 2. Importing the Workflow
1. Open your n8n instance (e.g. `http://localhost:5678` or n8n Cloud).
2. Click **Add Workflow** -> **Import from File**.
3. Select [`nexus_interview_prep_workflow.json`](file:///c:/Users/SUMITH%20R/Desktop/multi%20agent/n8n/nexus_interview_prep_workflow.json).
4. Configure your credentials for Google Calendar, Gmail, GitHub, and Slack nodes (or test in test mode).
5. Activate the workflow and copy the Webhook URL.
6. Set the `N8N_WEBHOOK_URL` environment variable in `nexus-backend/.env`:
   ```bash
   N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/nexus-mission-trigger
   ```

---

## 3. Workflow Steps
1. **NEXUS Webhook Trigger**: Ingests mission trigger payload with company and role parameters.
2. **Google Calendar Node**: Queries upcoming interview event details and participant IDs.
3. **Gmail Node**: Pulls recruiter correspondence, preparation instructions, and attachments.
4. **GitHub Node**: Retrieves repository commit logs and architectural files.
5. **Slack Node**: Posts the formatted briefing card with interactive buttons to `#interview-prep`.
6. **Verification Response Node**: Returns delivery receipt and execution telemetry back to NEXUS.
