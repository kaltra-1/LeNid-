// =========================
// CONFIGURATION
// =========================
// Ensure this port matches your HTTPS port in launchSettings.json
var BASE_URL = "http://127.0.0.1:5185/api";


window.onload = async () => {
    console.log("Dashboard initializing...");
    await loadDashboardStats();
};

// =========================
// DASHBOARD LOGIC
// =========================

async function loadDashboardStats() {
    try {
        // Fetching all data in parallel for speed
        // Note: fetch will now use the HTTPS URL to avoid CORS/Redirect issues
        const [propRes, agentRes, visitRes] = await Promise.all([
            fetch(`${BASE_URL}/properties`),
            fetch(`${BASE_URL}/agents`),
            fetch(`${BASE_URL}/visits`)
        ]);

        // Check if any request failed
        if (!propRes.ok || !agentRes.ok || !visitRes.ok) {
            throw new Error("One or more API endpoints failed to respond.");
        }

        const properties = await propRes.json();
        const agents = await agentRes.json();
        const visits = await visitRes.json();

        // Update the UI Counters
        // We use optional chaining and default to 0 in case arrays are null
        updateCounter("totalProperties", properties?.length || 0);
        updateCounter("totalAgents", agents?.length || 0);
        updateCounter("totalVisits", visits?.length || 0);

        console.log("Dashboard stats updated successfully.");

    } catch (error) {
        console.error("Failed to load dashboard data:", error);
        
        // Show 0 instead of leaving it blank if the server is down
        updateCounter("totalProperties", "!");
        updateCounter("totalAgents", "!");
        updateCounter("totalVisits", "!");

        // Use a non-blocking console warning instead of alert to improve UX
        console.warn("Please ensure your .NET Backend is running and CORS is enabled.");
    }
}

// Helper function to safely update text on the page
function updateCounter(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.innerText = value;
    }
}

// =========================
// SHARED CRUD HELPERS (Optional)
// =========================
// These match your visits.js logic so you can reuse them if needed

async function addProperty(newProperty) {
    try {
        const response = await fetch(`${BASE_URL}/properties`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProperty)
        });
        return await response.json();
    } catch (err) {
        console.error("Error adding property:", err);
    }
}