# Project: Coastal Baronage (castles_1)

**Created:** 2026-06-05

## What Is It?

A web-based surfing conditions dashboard showing real-time NOAA buoy wave data vs historical "good surfing" reference. Shareable site for neighbors to check if waves are surfable.

## Project Location

- **WSL:** `/home/mebuntu/repos/castles_6jun/`
- **Windows:** `\\wsl.localhost\Ubuntu-24.04\home\mebuntu\repos\castles_6jun\`
- Google Sheets: https://docs.google.com/spreadsheets/d/1E5BqqPICFqFZO6aTVpoBp4NHezPIaO2uPLY_ty2K_Go

## Current Status: NEEDS CHARTS SCREENSHOT

I've learned the setup but need to see your "Charts" sheet to understand the visual style and chart design you want.

## Key Facts Learned

**Buoy Station: 51202 - Mokapu Point, Hawaii**
- Location: 21.414°N, 157.681°W
- Current wave: 9.2 ft
- Table #5 from NOAA page imports wave measurements

**Good Conditions Sheet:**
- All entries = historical GOOD surfing wave readings
- Used as reference thresholds to compare current conditions

**Google Sheets Sheets:**
1. Current Conditions
2. SW_NEXT_CONNECTION
3. Graphs
4. stats  
5. Good Conditions
6. **Charts** ← Need screenshot of this!

**Data Import:** Uses `IMPORTHTML("https://www.ndbc.noaa.gov/station_page.php?station=51202","table",5)`

## Next Step: Please Share "Charts" Sheet Screenshot

Take a screenshot from your browser showing the **"Charts"** tab from your Google Sheet. I need to see:
1. What the charts look like
2. Line styles, colors, thresholds
3. Any visual themes or effects you want

Once I have that, I'll design the full dashboard spec and we'll proceed step by step.
