// dashboard.js - Multi-Metric Surf Dashboard
const REFRESH_INTERVAL_MS = 3600000; // Hourly refresh

// Baseline Thresholds from NOAA_3.xlsx "stats" tab analysis
const THRESHOLDS = {
    WVHT: 8.06,
    SwH: 3.50,
    SwP: 12.74,
    WWH: 7.10,
    WWP: 8.63
};

async function fetchDataAndRender() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        
        // Show latest 24 observations for clarity (reverse for chronological order)
        const displayData = data.slice(0, 24).reverse();
        
        const labels = displayData.map(d => {
            const timeStr = d["TIME(HST)"];
            const parts = timeStr.split(' ');
            return parts[1] + ' ' + parts[2];
        });

        // Create charts for each metric
        renderChart('chart-WVHT', labels, displayData.map(d => parseFloat(d["WVHTft"])), THRESHOLDS.WVHT, 'Wave Height (ft)');
        renderChart('chart-SwH', labels, displayData.map(d => parseFloat(d["SwHft"])), THRESHOLDS.SwH, 'Swell Height (ft)');
        renderChart('chart-SwP', labels, displayData.map(d => parseFloat(d["SwPsec"])), THRESHOLDS.SwP, 'Swell Period (sec)');
        renderChart('chart-WWH', labels, displayData.map(d => parseFloat(d["WWHft"])), THRESHOLDS.WWH, 'Wind Wave Height (ft)');
        renderChart('chart-WWP', labels, displayData.map(d => parseFloat(d["WWPsec"])), THRESHOLDS.WWP, 'Wind Wave Period (sec)');

        // Update Status Indicator based on latest observation
        updateStatus(displayData[displayData.length - 1]);

    } catch (error) {
        console.error('Error loading data:', error);
    }
}

function updateStatus(latest) {
    const statusEl = document.getElementById('status-indicator');
    const metrics = {
        WVHT: { val: parseFloat(latest["WVHTft"]), label: "WVHT", unit: "ft" },
        SwH: { val: parseFloat(latest["SwHft"]), label: "SwH", unit: "ft" },
        SwP: { val: parseFloat(latest["SwPsec"]), label: "SwP", unit: "s" },
        WWH: { val: parseFloat(latest["WWHft"]), label: "WWH", unit: "ft" },
        WWP: { val: parseFloat(latest["WWPsec"]), label: "WWP", unit: "s" }
    };

    const isGood = Object.keys(THRESHOLDS).every(key => metrics[key].val >= THRESHOLDS[key]);

    let html = "";
    if (isGood) {
        statusEl.style.backgroundColor = "#e8f5e9";
        statusEl.style.color = "#2e7d32";
        statusEl.style.border = "2px solid #a5d6a7";
        html += `<div style="margin-bottom: 15px;">🚀 GOOD CONDITIONS DETECTED</div>`;
    } else {
        statusEl.style.backgroundColor = "#fffde7";
        statusEl.style.color = "#f57f17";
        statusEl.style.border = "2px solid #fff59d";
        html += `<div style="margin-bottom: 15px;">⏳ SUB-OPTIMAL CONDITIONS DETECTED</div>`;
    }

    html += `<div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 15px; font-size: 0.55em; font-weight: normal; color: #333;">`;
    
    Object.keys(THRESHOLDS).forEach(key => {
        const met = metrics[key];
        const thresh = THRESHOLDS[key];
        const passed = met.val >= thresh;
        const color = passed ? "#2e7d32" : "#c62828";
        const icon = passed ? "✓" : "✗";
        html += `
            <div style="background: rgba(255,255,255,0.75); padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.05); text-align: center; min-width: 150px;">
                <span style="font-weight: bold; color: ${color};">${icon} ${key}</span><br/>
                <span style="font-size: 1.25em; font-weight: bold; color: ${color};">${met.val}${met.unit}</span>
                <span style="color: #666; font-size: 0.9em;">(min ${thresh}${met.unit})</span>
            </div>
        `;
    });

    html += `</div>`;
    statusEl.innerHTML = html;
}

function renderChart(elementId, labels, dataPoints, thresholdValue, label) {
    const ctx = document.getElementById(elementId).getContext('2d');
    
    // Destroy existing chart if it exists (for refreshes)
    const existingChart = Chart.getChart(elementId);
    if (existingChart) existingChart.destroy();

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: label,
                    data: dataPoints,
                    borderColor: 'red',
                    backgroundColor: 'rgba(255, 0, 0, 0.05)',
                    borderWidth: 2.5,
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'Threshold',
                    data: new Array(labels.length).fill(thresholdValue),
                    borderColor: 'blue',
                    borderDash: [8, 4],
                    borderWidth: 1.5,
                    fill: false,
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false,
                    title: { display: false }
                },
                x: {
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45,
                        font: { size: 10 }
                    }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

// Initial Load
fetchDataAndRender();

// Hourly Auto-Refresh
setInterval(fetchDataAndRender, REFRESH_INTERVAL_MS);
