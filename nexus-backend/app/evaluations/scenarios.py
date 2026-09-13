from typing import List, Dict, Any

EVALUATION_SCENARIOS: List[Dict[str, Any]] = [
    {
        "id": "eval_01",
        "name": "Acme Technical Interview (Flagship Benchmark)",
        "goal": "Prepare me for tomorrow's technical interview at Acme. Find interview details, analyze recruiter emails and GitHub, create a briefing, and notify me.",
        "company": "Acme",
        "expected_steps": 8,
        "difficulty": "STANDARD",
        "category": "FLAGSHIP"
    },
    {
        "id": "eval_02",
        "name": "Stripe Infrastructure Engineering Prep",
        "goal": "Prepare me for next week's technical interview at Stripe. Find the invite, analyze payment ledger repos, create study guide, and verify.",
        "company": "Stripe",
        "expected_steps": 8,
        "difficulty": "STANDARD",
        "category": "FINTECH"
    },
    {
        "id": "eval_03",
        "name": "Datadog Distributed Tracing Systems Prep",
        "goal": "Prepare me for tomorrow's architecture interview at Datadog. Check calendar, synthesize observability repo commits, generate briefing, and notify.",
        "company": "Datadog",
        "expected_steps": 8,
        "difficulty": "STANDARD",
        "category": "OBSERVABILITY"
    },
    {
        "id": "eval_04",
        "name": "Snowflake Query Engine Systems Prep",
        "goal": "Prepare for Snowflake technical interview. Find recruiter notes, examine SQL parser repos, build prioritized plan, and verify execution.",
        "company": "Snowflake",
        "expected_steps": 8,
        "difficulty": "STANDARD",
        "category": "DATABASE"
    },
    {
        "id": "eval_05",
        "name": "Vercel Edge Computing Systems Prep",
        "goal": "Prepare for Vercel engineering interview. Inspect calendar event, analyze Next.js and Turbopack repos, compile study sheet, and notify.",
        "company": "Vercel",
        "expected_steps": 8,
        "difficulty": "STANDARD",
        "category": "DEVELOPER_TOOLS"
    },
    {
        "id": "eval_06",
        "name": "Flaky Network Recovery Simulation",
        "goal": "Prepare me for interview at Cloudflare. Trigger transient retry on calendar lookup, recover automatically, and complete briefing.",
        "company": "Cloudflare",
        "expected_steps": 8,
        "difficulty": "RECOVERY",
        "category": "RELIABILITY"
    },
    {
        "id": "eval_07",
        "name": "GitHub Search Query Broadening Recovery",
        "goal": "Prepare me for interview at Figma. Start with narrow repo query, auto-broaden to org scope upon empty results, and verify briefing.",
        "company": "Figma",
        "expected_steps": 8,
        "difficulty": "RECOVERY",
        "category": "RELIABILITY"
    },
    {
        "id": "eval_08",
        "name": "Slack Webhook Rate-Limit Backoff",
        "goal": "Prepare for technical interview at OpenAI. Handle simulated 429 webhook backoff with exponential retry, then confirm message receipt.",
        "company": "OpenAI",
        "expected_steps": 8,
        "difficulty": "RECOVERY",
        "category": "RELIABILITY"
    },
    {
        "id": "eval_09",
        "name": "Anthropic AI Alignment Systems Prep",
        "goal": "Prepare me for systems interview at Anthropic. Search email for prep guide, analyze public research papers, build briefing, and verify.",
        "company": "Anthropic",
        "expected_steps": 8,
        "difficulty": "ADVANCED",
        "category": "AI_LABS"
    },
    {
        "id": "eval_10",
        "name": "Airbnb Distributed Systems Prep",
        "goal": "Prepare for Airbnb backend interview. Check calendar for host service round, inspect repos, generate study schedule, and notify team.",
        "company": "Airbnb",
        "expected_steps": 8,
        "difficulty": "STANDARD",
        "category": "MARKETPLACE"
    },
    {
        "id": "eval_11",
        "name": "Uber Dispatch & Geospatial Engineering Prep",
        "goal": "Prepare for Uber engineering interview. Cross-reference calendar and recruiter thread, inspect H3 index repos, generate briefing.",
        "company": "Uber",
        "expected_steps": 8,
        "difficulty": "STANDARD",
        "category": "MOBILITY"
    },
    {
        "id": "eval_12",
        "name": "Palantir Foundry Data Platform Prep",
        "goal": "Prepare me for architecture interview at Palantir. Search email, inspect data pipeline patterns, create verified prep dossier.",
        "company": "Palantir",
        "expected_steps": 8,
        "difficulty": "STANDARD",
        "category": "ENTERPRISE"
    },
    {
        "id": "eval_13",
        "name": "Coinbase Crypto Protocol Engineering Prep",
        "goal": "Prepare me for security & blockchain interview at Coinbase. Check calendar, analyze wallet repos, verify all prep actions.",
        "company": "Coinbase",
        "expected_steps": 8,
        "difficulty": "STANDARD",
        "category": "CRYPTO"
    },
    {
        "id": "eval_14",
        "name": "Discord Real-Time Gateway Systems Prep",
        "goal": "Prepare for Discord systems interview. Find recruiter message on Elixir/Rust gateway scaling, analyze repos, generate study plan.",
        "company": "Discord",
        "expected_steps": 8,
        "difficulty": "STANDARD",
        "category": "COMMUNICATIONS"
    },
    {
        "id": "eval_15",
        "name": "Pinterest Graph Database Engineering Prep",
        "goal": "Prepare me for Pinterest systems interview. Check calendar event, inspect graph store architecture, compile verified briefing.",
        "company": "Pinterest",
        "expected_steps": 8,
        "difficulty": "STANDARD",
        "category": "SOCIAL"
    },
    {
        "id": "eval_16",
        "name": "Netflix Chaos & Resilience Engineering Prep",
        "goal": "Prepare for Netflix platform interview. Check calendar, analyze Simian Army patterns, generate study plan, and verify all tasks.",
        "company": "Netflix",
        "expected_steps": 8,
        "difficulty": "STANDARD",
        "category": "STREAMING"
    },
    {
        "id": "eval_17",
        "name": "Twilio Real-Time Communications API Prep",
        "goal": "Prepare for Twilio systems interview. Search recruiter emails, inspect webhook engine architecture, build briefing and verify.",
        "company": "Twilio",
        "expected_steps": 8,
        "difficulty": "STANDARD",
        "category": "COMMUNICATIONS"
    },
    {
        "id": "eval_18",
        "name": "Shopify High-Throughput Flash Sale Prep",
        "goal": "Prepare for Shopify backend interview. Check calendar for checkout scaling round, analyze Ruby/Go repos, compile briefing.",
        "company": "Shopify",
        "expected_steps": 8,
        "difficulty": "STANDARD",
        "category": "ECOMMERCE"
    },
    {
        "id": "eval_19",
        "name": "Elasticsearch Distributed Search Cluster Prep",
        "goal": "Prepare for Elastic systems interview. Scan calendar, analyze Lucene index repos, create verified study plan, and notify.",
        "company": "Elastic",
        "expected_steps": 8,
        "difficulty": "STANDARD",
        "category": "SEARCH"
    },
    {
        "id": "eval_20",
        "name": "HashiCorp Distributed Consensus Systems Prep",
        "goal": "Prepare for HashiCorp interview. Check email for Raft protocol notes, analyze Consul/Nomad repos, build briefing and verify.",
        "company": "HashiCorp",
        "expected_steps": 8,
        "difficulty": "STANDARD",
        "category": "INFRASTRUCTURE"
    },
    {
        "id": "eval_21",
        "name": "Supabase Realtime Postgres Systems Prep",
        "goal": "Prepare for Supabase technical interview. Check calendar event, inspect Elixir realtime engine, create study plan.",
        "company": "Supabase",
        "expected_steps": 8,
        "difficulty": "STANDARD",
        "category": "DATABASE"
    },
    {
        "id": "eval_22",
        "name": "Notion Collaborative Document Engine Prep",
        "goal": "Prepare for Notion engineering interview. Search recruiter threads, analyze block-tree data structure repos, compile verified briefing.",
        "company": "Notion",
        "expected_steps": 8,
        "difficulty": "STANDARD",
        "category": "PRODUCTIVITY"
    },
    {
        "id": "eval_23",
        "name": "Scale AI Data Annotation Infrastructure Prep",
        "goal": "Prepare for Scale AI technical interview. Find calendar invite, analyze machine learning pipeline repos, generate briefing.",
        "company": "ScaleAI",
        "expected_steps": 8,
        "difficulty": "STANDARD",
        "category": "AI_LABS"
    },
    {
        "id": "eval_24",
        "name": "Cockroach Labs Distributed SQL Prep",
        "goal": "Prepare for CockroachDB systems interview. Check recruiter guide, analyze multi-Raft and Spanner architecture, verify actions.",
        "company": "CockroachLabs",
        "expected_steps": 8,
        "difficulty": "STANDARD",
        "category": "DATABASE"
    },
    {
        "id": "eval_25",
        "name": "Temporal Workflow Orchestration Systems Prep",
        "goal": "Prepare for Temporal engineering interview. Check calendar, analyze deterministic workflow event history repos, compile briefing.",
        "company": "Temporal",
        "expected_steps": 8,
        "difficulty": "STANDARD",
        "category": "INFRASTRUCTURE"
    },
    {
        "id": "eval_26",
        "name": "Retool Low-Code Enterprise Platform Prep",
        "goal": "Prepare for Retool technical interview. Search email for frontend/backend integration specs, analyze repos, verify completion.",
        "company": "Retool",
        "expected_steps": 8,
        "difficulty": "STANDARD",
        "category": "DEVELOPER_TOOLS"
    },
    {
        "id": "eval_27",
        "name": "Sentry Error Monitoring Engine Prep",
        "goal": "Prepare for Sentry backend interview. Check calendar, inspect Snuba and ClickHouse ingestion repos, create briefing.",
        "company": "Sentry",
        "expected_steps": 8,
        "difficulty": "STANDARD",
        "category": "OBSERVABILITY"
    },
    {
        "id": "eval_28",
        "name": "Postman API Platform Systems Prep",
        "goal": "Prepare for Postman platform interview. Find calendar invite, analyze API runtime specs, compile verified study plan.",
        "company": "Postman",
        "expected_steps": 8,
        "difficulty": "STANDARD",
        "category": "DEVELOPER_TOOLS"
    }
]
