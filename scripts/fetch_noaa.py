import requests
from bs4 import BeautifulSoup
import json
import os
import sys

# NDBC Station 51202 (Mokapu Point, Hawaii)
STATION_ID = "51202"
URL = f"https://www.ndbc.noaa.gov/station_page.php?station={STATION_ID}"

def fetch_data():
    print(f"Fetching data from {URL}...")
    try:
        response = requests.get(URL, timeout=15)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find all tables
        # Table #5 is usually 'Previous observations'
        tables = soup.find_all('table')
        if len(tables) < 5:
            print(f"Error: Only found {len(tables)} tables. Expected at least 5.")
            # Fallback: look for table with 'Previous observations' in caption or summary
            target_table = None
            for t in tables:
                if "Previous observations" in t.text:
                    target_table = t
                    break
            if not target_table:
                sys.exit(1)
        else:
            target_table = tables[4]
        
        rows = target_table.find_all('tr')
        if not rows:
            print("Error: Table is empty.")
            sys.exit(1)
            
        # Headers are in the first row
        headers = [th.text.strip() for th in rows[0].find_all(['th', 'td'])]
        
        data = []
        for row in rows[1:]:
            cols = row.find_all(['td', 'th'])
            if len(cols) >= len(headers):
                item = {}
                for i in range(len(headers)):
                    # Use header names as keys
                    # Clean up header names (remove units etc for JSON safety if needed, 
                    # but Lukas likes it simple)
                    val = cols[i].text.strip()
                    item[headers[i]] = val
                data.append(item)
        
        # Ensure the output directory exists (now root)
        output_path = os.path.join(os.path.dirname(__file__), '../data.json')
        with open(output_path, 'w') as f:
            json.dump(data, f, indent=2)
        
        print(f"Successfully saved {len(data)} entries to {output_path}")
        
    except Exception as e:
        print(f"An error occurred: {e}")
        sys.exit(1)

if __name__ == "__main__":
    fetch_data()
