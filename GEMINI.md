# Surfing Dashboard Project Instructions

## Environment
- Primary WSL2: `/home/mebuntu/repos/castles_1/`
- GitHub Repo: `loni415/castles_1` (Private)
- Custom Domain: `lukasfiller.com`

## Key Rules
- **Lukas Persona**: Brief, caveman style, non-coder.
- **Data Source**: Always use NDBC Station 51202 Table #5.
- **Chart Colors**: Red (Current), Blue (Baseline Threshold).
- **Core Metrics**: WVHT, SwH, SwP, WWH, WWP.
- **Baselines (Good avg)**: 
  - WVHT: 8.06' | SwH: 3.5' | SwP: 12.74s | WWH: 7.1' | WWP: 8.63s

## Tooling
- `scripts/fetch_noaa.py`: Scraper.
- `.github/workflows/update_data.yml`: Hourly automation.
- Use `mempalace` for session diaries.

## Workflow
1. Explain plan to Lukas simply.
2. Update `docs/PROJECT_STATE.md` after milestones.
3. Keep code simple (No framework, just Chart.js).
4. Auto-update `data.json` via GitHub Actions (no local cron needed).
