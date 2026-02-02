// Ensure BASE_URL is defined if not already global
if (typeof BASE_URL === 'undefined') {
  var BASE_URL = "http://127.0.0.1:5185/api";
}

async function initDashboardCharts() {
    try {
        // 1. Fetch real data from your SQL backend
        const [properties, visits] = await Promise.all([
            fetch(`${BASE_URL}/properties`).then(res => res.json()),
            fetch(`${BASE_URL}/visits`).then(res => res.json())
        ]);

        // 2. VISITS PER MONTH CHART
        const visitsByMonth = Array(12).fill(0);
        visits.forEach(v => {
            // Ensure we use the C# model property 'visitDate'
            const date = v.visitDate ? new Date(v.visitDate) : null;
            if (date) visitsByMonth[date.getMonth()]++;
        });

        new Chart(document.getElementById("visitsChart"), {
            type: "bar",
            data: {
                labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
                datasets: [{
                    label: "Visits",
                    data: visitsByMonth,
                    backgroundColor: "#0d6efd"
                }]
            }
        });

        // 3. PROPERTIES BY LOCATION CHART
        const locationCounts = {};
        properties.forEach(p => {
            locationCounts[p.location] = (locationCounts[p.location] || 0) + 1;
        });

        new Chart(document.getElementById("locationChart"), {
            type: "pie",
            data: {
                labels: Object.keys(locationCounts),
                datasets: [{
                    data: Object.values(locationCounts),
                    backgroundColor: ["#ffc107", "#0d6efd", "#198754", "#dc3545", "#6f42c1"]
                }]
            }
        });

        // 4. RECENT ACTIVITY LISTS
        const recentPropList = document.getElementById("recentProperties");
        if (recentPropList) {
            properties.slice(-5).reverse().forEach(p => {
                recentPropList.innerHTML += `<li class="list-group-item">${p.title} — ${p.location}</li>`;
            });
        }

        const upcomingList = document.getElementById("upcomingVisits");
        if (upcomingList) {
            visits
                .filter(v => new Date(v.visitDate) >= new Date())
                .sort((a, b) => new Date(a.visitDate) - new Date(b.visitDate))
                .slice(0, 5)
                .forEach(v => {
                    const d = v.visitDate ? v.visitDate.split('T')[0] : 'N/A';
                    upcomingList.innerHTML += `<li class="list-group-item">${v.visitorName} — ${d}</li>`;
                });
        }

    } catch (error) {
        console.error("Chart loading failed:", error);
    }
}

// Start the loading process
initDashboardCharts();