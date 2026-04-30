---
title: Local LLM Blog Digest
date: 2026-04-30 00:00:00-05:30
description: # Add post description (optional)
img: ./blogdigest.png # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [tech] # add tag
---
I built a small system to generate a **daily blog digest using a local LLM and Notion**. Here’s the technical walkthrough—kept simple and practical.

---

### 1. RSS ingestion

Defined a `feeds.yaml` with sources and limits.

Used `feedparser` to pull entries and filtered:

* only recent posts
* limited per day

---

### 2. Content extraction

For each post:

* fetched the article URL
* extracted clean text using `newspaper3k`

Key constraint:

* trimmed content (~1500 chars) to keep LLM input bounded

---

### 3. Local LLM summarization

Instead of external APIs, used Ollama:

* model: `gemma4:e4b`
* invoked via HTTP (`/api/generate`)
* prompt enforced structured JSON output

Handled common issues:

* markdown-wrapped JSON
* inconsistent formatting → cleaned before parsing

---

### 🔧 Prerequisite: Running the model

Before summarization works, you need a local model running via Ollama.

```bash id="lg3c5j"
ollama run gemma4:e4b
```

This starts a local server at:

```text id="twh0nt"
http://localhost:11434
```

The script sends prompts to `/api/generate` and receives summaries.

---

### 4. Notion integration

Used Notion API via `notion-client` to:

* create one page per day
* structure content with headings + paragraphs
* include clickable links

Important fix:

* switched to timezone-aware datetime (`datetime.now().astimezone()`)
  to avoid incorrect dates

---

### 5. Configuration + secrets

* `.env` for API keys (`python-dotenv`)
* CLI args for feeds + database ID
* avoided hardcoding

---

### 6. Automation

Wrapped execution in a shell script:

* uses absolute paths
* logs per run (timestamped)
* avoids reliance on shell environment

Scheduled with cron:

* learned macOS quirks (permissions, environment isolation)
* fixed via explicit paths + permissions

Added system wake using `pmset` to ensure execution window.

---

### 7. Reliability fixes

* handled LLM output variability
* added logging for observability

---

### 8. Packaging

* created `requirements.txt`
* documented setup in README
* pushed to GitHub

---

### Final system

```text id="kj5p1f"
RSS → extract → local LLM → structured output → Notion
```

Runs locally, no external LLM dependency, and produces a clean daily digest with minimal maintenance.

---

**Key lessons:**

* control input size early
* don’t trust LLM output format blindly
* cron on macOS needs explicit handling
* keep config and secrets separate

You can find the core code repository here: https://github.com/joshi-aparna/local-llm-blog-digest
