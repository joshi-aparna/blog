---
title: Agentic Memory - Mem0, MemGPT, A-Mem
date: 2026-09-20 00:00:00-05:30
description: # Add post description (optional)
img: ./agentic_memory.png # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [tech] # add tag
---

# Agentic Memory Evolution

## 1. Mem0

Mem0 uses a dedicated middleware layer to manage memory before and after an LLM call.

The memory layer could be deterministic or not. It can potentially incorporate different types of memory, such as conversational, session, user, and agentic memory.

The memory layer is pluggable and can be used with any agent.

### Conversational memory

Conversational memory stays only in the context.

As the context window fills up, older messages in the session are truncated from the context.

However, facts from previous conversations are not necessarily lost. At every turn, the memory management layer extracts relevant facts and persists them in a database.

The exact conversation itself is not persisted (unless infer=False).

### Episodic memory

Episodic memory is scoped at the `run_id` level.

The extraction pipeline extracts metadata such as timestamps and graph snapshots.

### Semantic memory

Semantic memory is scoped at the `user_id` level.

The extraction layer persists this information in a vector store.

### Knowledge graph

Mem0 has four layers of memory based on how long the information lives:

1. **User memory** — permanent
2. **Session memory** — episodic memory
3. **Agentic memory** — shared knowledge base across users and sessions
4. **Sensory memory** — immediate conversation buffer that sits in the context window and is not persisted anywhere

User memory and agent memory are stored in vector databases, with relationships between them.

---

## 2. MemGPT

MemGPT is inspired by operating systems that have different layers of memory, such as RAM and hard disk.

The idea is to create a hierarchical memory system.

It has:

- **Core memory** — part of every LLM call
- **Archival memory** — searchable
- **Recall memory** — sequential raw conversation

The key difference is that the memory content is completely handled by the agent using tools.

There is no intermediate memory layer managing the memory for the agent. Memory management is therefore tightly coupled to the agent itself.

### Conversational memory

Conversational memory is present in a FIFO queue.

When the context starts filling up, older conversation is summarized.

### Episodic memory

This is the recall memory.

It is essentially a literal database of raw chronological events.

No semantic search is performed here.

### Semantic memory

Semantic memory is stored in the working context as human memory and persona memory.

If it gets too large, it is pushed to archival memory.

The context window therefore looks roughly like:

```text
+------------------------------------------------------+
| System prompt | Working context (persona) | FIFO queue |
+------------------------------------------------------+
                     Context window
```

---

## 3. A-mem

A-mem is inspired by note-taking methods such as **Zettelkasten**, where notes form a hierarchy and are connected to one another.

### Atomic memories

Every fact is atomic and can be connected to other facts.

Every memory an atomic memory.

The immediate next step is to enrich the text with a structured schema so that it becomes a better base for semantic memory.

### Creating links

Next, links are generated.

The top `k` existing notes are compared with the new note, and links are created if a relationship exists.

If a link is made, older notes can also be edited with additional information such as tags or keywords if needed.

### Context handling

Only one or two turns of conversation are persisted in the context window.

After the context window slides, the conversation is converted into an atomic note and becomes part of the knowledge graph with a `session_id` tag.

Small language models are used for fast note-taking.

Both A-mem and Mem0 use LLMs/SLMs for the memory layer.

## Mem0 vs A-mem

One way I see the difference between Mem0 and A-mem:

**Mem0:**

- Every conversation extracts facts to be stored or updated.
- Mem0 has a more structured approach to creating links between facts.
- It extracts entities to identify common entities before creating edges.

**A-mem:**

- Stores atomic notes and relationships between them.
- It does not use the same explicit entity-extraction structure as Mem0.


|                   | Mem0                                          | A-MEM                                  |
| ----------------- | --------------------------------------------- | -------------------------------------- |
| Basic unit        | Memory/fact                                   | Note                                   |
| Organization      | Retrieval-oriented memory store               | Interconnected memory network          |
| Linking           | Entity-aware relationships / graph mechanisms | Similarity-based note links            |
| Evolution         | Extract/update/deduplicate memories           | New memories can modify existing notes |
| Memory management | Dedicated memory layer                        | Agentic memory construction            |
| Core idea         | **Remember useful facts**                     | **Build an evolving network of notes** |

---

## Mem0 vs MemGPT vs A-mem

One way to think about the evolution is:
```
    MemGPT
      ↓
    Hierarchical memory
      ↓
    Agent manages memory using tools


    Mem0
      ↓
    Dedicated memory management layer
      ↓
    Memory extraction + storage happens around LLM calls


    A-mem
      ↓
    Memory as interconnected atomic notes
      ↓
    New memories create links and evolve existing notes
```
The interesting progression is that memory moves from being primarily a **storage hierarchy** toward becoming an **active, evolving knowledge structure**.

<img width="1312" height="1199" alt="image" src="https://github.com/user-attachments/assets/535789e1-1954-4b67-bfbb-5c5acb292dd6" />

