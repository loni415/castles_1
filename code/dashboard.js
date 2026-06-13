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
        WVHT: parseFloat(latest["WVHTft"]),
        SwH: parseFloat(latest["SwHft"]),
        SwP: parseFloat(latest["SwPsec"]),
        WWH: parseFloat(latest["WWHft"]),
        WWP: parseFloat(latest["WWPsec"])
    };

    const isGood = Object.keys(THRESHOLDS).every(key => metrics[key] >= THRESHOLDS[key]);

    if (isGood) {
        statusEl.textContent = "🚀 GOOD CONDITIONS DETECTED";
        statusEl.style.backgroundColor = "#d4edda";
        statusEl.style.color = "#155724";
        statusEl.style.border = "2px solid #c3e6cb";
    } else {
        const failing = Object.keys(THRESHOLDS).filter(key => metrics[key] < THRESHOLDS[key]);
        statusEl.textContent = "⏳ SUB-OPTIMAL (" + failing.join(', ') + " below baseline)";
        statusEl.style.backgroundColor = "#fff3cd";
        statusEl.style.color = "#856404";
        statusEl.style.border = "2px solid #ffeeba";
    }
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
