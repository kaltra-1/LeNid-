// =========================
// CONFIGURATION
// =========================
if (typeof BASE_URL === 'undefined') {
  var BASE_URL = "http://127.0.0.1:5185/api";
}

let visits = [];
let properties = [];
let agents = [];
let editVisitId = null;
let visitSearchText = "";

// =========================
// INITIALIZATION
// =========================

async function startApp() {
    try {
        // Load all data in parallel to ensure foreign keys are ready
        [properties, agents, visits] = await Promise.all([
            fetchData("properties"),
            fetchData("agents"),
            fetchData("visits")
        ]);

        loadSelectOptions();
        displayVisits();
    } catch (error) {
        console.error("Initialization failed:", error);
    }
}

async function fetchData(endpoint) {
    const response = await fetch(`${BASE_URL}/${endpoint}`);
    if (!response.ok) throw new Error(`Failed to fetch ${endpoint}`);
    return await response.json();
}

startApp();

// =========================
// UI RENDERING (DROPDOWNS)
// =========================

function loadSelectOptions() {
    const pSelect = document.getElementById("vProperty");
    const aSelect = document.getElementById("vAgent");
    const editP = document.getElementById("editVProperty");
    const editA = document.getElementById("editVAgent");

    if (!pSelect || !aSelect) return;

    // Reset with default prompt
    const propDefault = '<option value="" disabled selected>Select a Property</option>';
    const agentDefault = '<option value="" disabled selected>Select an Agent</option>';

    [pSelect, editP].forEach(el => { if(el) el.innerHTML = propDefault; });
    [aSelect, editA].forEach(el => { if(el) el.innerHTML = agentDefault; });

    properties.forEach(p => {
        const html = `<option value="${p.id}">${p.title} (${p.location})</option>`;
        if(pSelect) pSelect.innerHTML += html;
        if(editP) editP.innerHTML += html;
    });

    agents.forEach(a => {
        const html = `<option value="${a.id}">${a.name}</option>`;
        if(aSelect) aSelect.innerHTML += html;
        if(editA) editA.innerHTML += html;
    });
}

// =========================
// TABLE RENDERING
// =========================

function displayVisits() {
    const table = document.getElementById("visitsTable");
    if (!table) return;
    table.innerHTML = "";

    const filtered = visits.filter(v => {
        const agent = agents.find(a => a.id == v.agentId);
        const prop = properties.find(p => p.id == v.propertyId);
        const clientName = v.visitorName || ""; 

        return (
            clientName.toLowerCase().includes(visitSearchText) ||
            (agent && agent.name.toLowerCase().includes(visitSearchText)) ||
            (prop && prop.title.toLowerCase().includes(visitSearchText))
        );
    });

    filtered.forEach(v => {
        const prop = properties.find(p => p.id == v.propertyId);
        const agent = agents.find(a => a.id == v.agentId);
        const displayDate = v.visitDate ? v.visitDate.split('T')[0] : 'N/A'; // Format for UI

        table.innerHTML += `
        <tr>
            <td>${v.id}</td>
            <td>${prop ? prop.title : 'Deleted Property'}</td>
            <td>${agent ? agent.name : 'Deleted Agent'}</td>
            <td>${v.visitorName}</td>
            <td>${displayDate}</td>
            <td>
                <button class="btn btn-sm btn-primary me-2" onclick="openEditVisit(${v.id})">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteVisit(${v.id})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>`;
    });
}

// =========================
// SEARCH & CRUD
// =========================

document.getElementById("visitSearch")?.addEventListener("input", (e) => {
    visitSearchText = e.target.value.toLowerCase();
    displayVisits();
});

document.getElementById("addVisitForm")?.addEventListener("submit", async function(e) {
    e.preventDefault();

    const newVisit = {
        propertyId: Number(document.getElementById("vProperty").value),
        agentId: Number(document.getElementById("vAgent").value),
        visitorName: document.getElementById("vClient").value,
        visitDate: document.getElementById("vDate").value 
    };

    const response = await fetch(`${BASE_URL}/visits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVisit)
    });

    if (response.ok) {
        await startApp(); // Re-fetch all to ensure synchronization
        this.reset();
        bootstrap.Modal.getInstance(document.getElementById("addVisitModal")).hide();
    }
});

function openEditVisit(id) {
    editVisitId = id;
    const v = visits.find(v => v.id === id);
    if (!v) return;

    document.getElementById("editVProperty").value = v.propertyId;
    document.getElementById("editVAgent").value = v.agentId;
    document.getElementById("editVClient").value = v.visitorName;
    document.getElementById("editVDate").value = v.visitDate ? v.visitDate.split('T')[0] : "";

    new bootstrap.Modal(document.getElementById("editVisitModal")).show();
}

document.getElementById("editVisitForm")?.addEventListener("submit", async function (e) {
    e.preventDefault();

    const updatedVisit = {
        id: editVisitId,
        propertyId: Number(document.getElementById("editVProperty").value),
        agentId: Number(document.getElementById("editVAgent").value),
        visitorName: document.getElementById("editVClient").value,
        visitDate: document.getElementById("editVDate").value
    };

    const response = await fetch(`${BASE_URL}/visits/${editVisitId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedVisit)
    });

    if (response.ok) {
        await startApp();
        bootstrap.Modal.getInstance(document.getElementById("editVisitModal"))?.hide();
    }
});

async function deleteVisit(id) {
    if (!confirm("Are you sure?")) return;
    
    const response = await fetch(`${BASE_URL}/visits/${id}`, { method: 'DELETE' });
    if (response.ok) {
        visits = visits.filter(v => v.id !== id);
        displayVisits();
    }
}