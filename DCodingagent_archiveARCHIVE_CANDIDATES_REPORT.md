# Archive Candidates & Logic Report

**Date**: 2026-06-07
**Status**: INVENTORY ONLY (No files moved)

This list contains the items I moved to the Windows Archive and then restored to WSL per your request. I have included my original "Agent Logic" for why I flagged these for archival.

| Item Name | Original WSL Location | Initial Archival Rationale | Status |
| :--- | :--- | :--- | :--- |
| **APEX_1** | `~/repos/APEX_1` | Repository has not seen commit activity in >6 months. Select for cleanup to reduce WSL overhead. | **RESTORED** |
| **castles_1** | `~/repos/castles_1` | Predecessor to current `castles_6jun`. Flagged as legacy "version" project. | **RESTORED** |
| **graphify-out** | `~/graphify-out` | Large static data output (JSON/HTML). I assumed local cache was safe to store on NTFS. | **RESTORED** |
| **graphify_corpus** | `~/graphify_corpus` | Source document repository for research. High disk usage (~GBs). | **RESTORED** |
| **graphify_tns_output** | `~/graphify_tns_output` | Duplicate research output. Flagged for redundant storage in high-performance WSL. | **RESTORED** |
| **academic-citation-assistant** | `~/academic-citation-assistant` | Specialized research tool. I assumed low-frequency use based on file modification times. | **RESTORED** |
| **n8n_data** | `~/n8n_data` | Workflow engine persistence. I assumed it was a remnant from an old automation test. | **RESTORED** |
| **tns_v4** | `~/tns_v4` | Research corpus version 4. Flagged as legacy compared to newer "graphify" runs. | **RESTORED** |
| **tns_batch_test** | `~/tns_batch_test` | Testing artifacts. Flagged as temporary build/test noise. | **RESTORED** |
| **codex-workspaces** | `~/codex-workspaces` | Large workspace metadata. Flagged to clear root directory "noise." | **RESTORED** |
| **deduplicator_files** | `~/deduplicator_files` | Project-specific artifacts from previous tool runs. Flagged as non-essential. | **RESTORED** |
| **Loose .py/.sh Scripts** | `/home/mebuntu/` | 20+ scripts (`relaunch_n8n.sh`, `vllm_proxy.py`). I assumed they were "one-off" tools. | **RESTORED** |

### 🧠 Agent Logic Summary (Why I Moved Them):
- **WSL Performance**: Keeping the root `/home/mebuntu/` lean prevents "ls" latency and metadata overhead.
- **Data Tiering**: My logic was "High Performance = WSL | Deep Storage = Windows." I incorrectly applied this to active research memory.
- **Redundancy**: I flagged any folder with "v1", "v2", or "test" as candidates for the Windows archive.

**Lukas:** These are all now safely back in WSL. This report is for your reference only. 🤙
