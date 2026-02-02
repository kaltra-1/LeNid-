// =========================
// CONFIGURATION
// =========================
if (typeof BASE_URL === 'undefined') {
  var BASE_URL = "http://127.0.0.1:5185/api";
}

let agents = [];
let visits = []; // Needed for visit counts
let editAgentId = null;
let agentSearchText = "";

const agentsTable = document.getElementById("agentsTable");

// =========================
// INITIALIZATION
// =========================
async function initAgents() {
    // Fetch visits first so we can calculate the badge counts
    await fetchVisits();
    await fetchAgents();
}

initAgents();

// =========================
// DATA FETCHING
// =========================

async function fetchVisits() {
    try {
        const response = await fetch(`${BASE_URL}/visits`);
        if (response.ok) visits = await response.json();
    } catch (error) {
        console.error("Error fetching visits for counts:", error);
    }
}

async function fetchAgents() {
    try {
        const response = await fetch(`${BASE_URL}/agents`);
        if (!response.ok) throw new Error("Failed to fetch agents");
        agents = await response.json();
        displayAgents();
    } catch (error) {
        console.error("API Error:", error);
        // Fallback to empty list if API is down
        agents = [];
        displayAgents();
    }
}

// =========================
// DISPLAY AGENTS
// =========================
function displayAgents() {
    if (!agentsTable) return;
    agentsTable.innerHTML = "";

    const filtered = agents.filter(a =>
        a.name.toLowerCase().includes(agentSearchText) ||
        a.phone.toLowerCase().includes(agentSearchText) ||
        a.email.toLowerCase().includes(agentSearchText)
    );

    filtered.forEach(agent => {
        // Calculate visits from the loaded visits array
        const visitCount = visits.filter(v => v.agentId === agent.id).length;

        agentsTable.innerHTML += `
            <tr>
                <td>${agent.id}</td>
                <td>${agent.name}</td>
                <td>${agent.phone}</td>
                <td>${agent.email}</td>
                <td><span class="badge bg-info">${visitCount}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary me-2" onclick="openEditAgent(${agent.id})">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteAgent(${agent.id})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}

// =========================
// SEARCH
// =========================
document.getElementById("agentSearch")?.addEventListener("input", (e) => {
    agentSearchText = e.target.value.toLowerCase();
    displayAgents();
});

// =========================
// ADD AGENT
// =========================
document.getElementById("addAgentForm")?.addEventListener("submit", async function (e) {
    e.preventDefault();

    const newAgent = {
        name: document.getElementById("aName").value,
        phone: document.getElementById("aPhone").value,
        email: document.getElementById("aEmail").value
    };

    try {
        const response = await fetch(`${BASE_URL}/agents`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newAgent)
        });

        if (response.ok) {
            await fetchAgents(); // Refresh the list from the database
            this.reset();
            bootstrap.Modal.getInstance(document.getElementById("addAgentModal"))?.hide();
        }
    } catch (error) {
        console.error("Error adding agent:", error);
    }
});

// =========================
// DELETE AGENT
// =========================
async function deleteAgent(id) {
    if (!confirm("Are you sure you want to delete this agent?")) return;

    try {
        const response = await fetch(`${BASE_URL}/agents/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            agents = agents.filter(a => a.id !== id);
            displayAgents();
        }
    } catch (error) {
        console.error("Error deleting agent:", error);
    }
}

// =========================
// OPEN EDIT AGENT
// =========================
function openEditAgent(id) {
    editAgentId = id;
    const a = agents.find(agent => agent.id === id);
    if (!a) return;

    document.getElementById("editAName").value = a.name;
    document.getElementById("editAPhone").value = a.phone;
    document.getElementById("editAEmail").value = a.email;

    new bootstrap.Modal(document.getElementById("editAgentModal")).show();
}

// =========================
// SAVE EDITED AGENT
// =========================
document.getElementById("editAgentForm")?.addEventListener("submit", async function (e) {
    e.preventDefault();

    const updatedAgent = {
        id: editAgentId,
        name: document.getElementById("editAName").value,
        phone: document.getElementById("editAPhone").value,
        email: document.getElementById("editAEmail").value
    };

    try {
        const response = await fetch(`${BASE_URL}/agents/${editAgentId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedAgent)
        });

        if (response.ok) {
            await fetchAgents(); // Refresh from DB
            bootstrap.Modal.getInstance(document.getElementById("editAgentModal"))?.hide();
        }
    } catch (error) {
        console.error("Error updating agent:", error);
    }
});