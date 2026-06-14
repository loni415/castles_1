#!/usr/bin/env python3
"""
NOAA Buoy Data Fetcher
Fetches hourly observations from NDBC buoy 51202 (Mokapu Point, HI)
Outputs JSON with 24-hour history (parsed from NOAA station page HTML).
"""

import requests
from datetime import datetime
import re
import json

BUOY_ID = "51202"
STATION_URL = f"https://www.ndbc.noaa.gov/station_page.php?station={BUOY_ID}"

def fetch_station_page():
    """Fetch NOAA station page HTML."""
    headers = {
        "User-Agent": "Mozilla/5.0 (compatible; NOAA Dashboard Bot)"
    }
    resp = requests.get(STATION_URL, headers=headers, timeout=30)
    resp.raise_for_status()
    return resp.text

def parse_noaa_table(html):
    """
    Parse NOAA Station Page Table #5 (hourly observations).
    Format: <- wave height - [WAVI   06/09/2026 HST Iv 29 - 05:00] WVHT: 3.000 SvP: 8.90 SwH: 1.470
    """
    # Find table with " hourly " in header
    pattern = r'hourly\s+data:\s*\[?\s*([^]]+(?:\])?)(?=\[?[^]]+WVHT)'
    idx = html.lower().find('hourly')
    if idx == -1:
        return []
    
    # Extract observations from a window after "hourly"
    start = max(0, idx - 200)
    end = min(len(html), idx + 8000)
    context = html[start:end]
    
    observations = []
    # Match rows: timestamp + data
    row_pattern = r'\[(.*?IV.*?)\]\s+WVHT:\s*([0-9.]+)\s+SvP:\s*([0-9.]+)\s+SwH:\s*([0-9.]+)'
    
    for match in re.finditer(row_pattern, context):
        row_text = match.group(1)
        wvht = float(match.group(2))
        svp = float(match.group(3))
        sw_h = float(match.group(4))
        
        # Parse timestamp (format: YYYY-MM-DD HST Time )
        ts_match = re.search(r'(\d{4})-(-?)(\d{1,2})/(\d{1,2})\s*(HST)?\s*(\d{1,2}:\d{2})', row_text)
        if not ts_match:
            continue
        
        year, sign, month, day, _, hour = ts_match.groups()
        # Handle negative offset (e.g., -5 days)
        offset_days = 0
        if sign == '-':
            offset_days = int(day)
            day = month
            month = 0
            year = 0
        
        try:
            month = int(month or month)
            day = int(day or day)
            hour = int(hour[:2])
            minute = int(hour[3:5]) if len(hour) > 3 else 0
            
            # Calculate datetime (base date 2026-06-10 - adjust by offset)
            base = datetime(2026, 6, 10)
            if offset_days:
                base = base - timedelta(days=offset_days)
            
            ts = datetime(base.year, base.month, base.day + day, hour, minute)
            
            observations.append({
                "station_id": BUOY_ID,
                "timestamp": ts.isoformat(),
                "time_hst": f"{hour:02d}:{minute:02d}",
                "wvht_ft": wvht,
                "svp": svp,
                "sw_h_ft": sw_h
            })
        except (ValueError, TypeError):
            continue
    
    # Sort by timestamp
    observations.sort(key=lambda x: x["timestamp"])
    return observations

def get_24h_history():
    """Get last 24 hours of observations."""
    html = fetch_station_page()
    all_obs = parse_noaa_table(html)
    
    # Get last 24 observations (24h window from most recent)
    if all_obs:
        recent = all_obs[-24:]
    else:
        return []
    
    return recent

def main():
    """Output JSON for frontend."""
    history = get_24h_history()
    print(json.dumps(history, indent=2))

if __name__ == "__main__":
    main()
