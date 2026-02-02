// =========================
// CONFIGURATION
// =========================
if (typeof BASE_URL === 'undefined') {
  var BASE_URL = "http://127.0.0.1:5185/api";
}

let properties = [];
let editId = null;
let searchText = "";

const table = document.getElementById("propertiesTable");

// =========================
// DATA FETCHING
// =========================

async function fetchProperties() {
    try {
        const response = await fetch(`${BASE_URL}/properties`);
        if (!response.ok) throw new Error("Failed to fetch properties");
        properties = await response.json();
        displayProperties();
    } catch (error) {
        console.error("API Error:", error);
        // Fallback to localStorage if API is down
        properties = JSON.parse(localStorage.getItem("properties")) || [];
        displayProperties();
    }
}

// Initial Load
fetchProperties();

// =========================
// DISPLAY PROPERTIES
// =========================
function displayProperties() {
    if (!table) return;
    table.innerHTML = "";

    const filtered = properties.filter(p =>
        p.title.toLowerCase().includes(searchText) ||
        p.location.toLowerCase().includes(searchText) ||
        p.price.toString().includes(searchText)
    );

    filtered.forEach(p => {
        table.innerHTML += `
            <tr>
                <td>${p.id}</td>
                <td>${p.title}</td>
                <td>${p.location}</td>
                <td>${p.type}</td>
                <td>${p.bedrooms}</td>
                <td>${p.price}</td>
                <td>
                    <button class="btn btn-sm btn-primary me-2" onclick="openEdit(${p.id})">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProperty(${p.id})">
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
document.getElementById("propertySearch")?.addEventListener("input", (e) => {
    searchText = e.target.value.toLowerCase();
    displayProperties();
});

// =========================
// ADD PROPERTY
// =========================
document.getElementById("addPropertyForm")?.addEventListener("submit", async function (e) {
    e.preventDefault();

    const newProperty = {
        title: pTitle.value,
        location: pLocation.value,
        type: pType.value,
        bedrooms: Number(pBedrooms.value),
        price: Number(pPrice.value)
    };

    try {
        const response = await fetch(`${BASE_URL}/properties`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProperty)
        });

        if (response.ok) {
            const savedProperty = await response.json();
            properties.push(savedProperty);
            displayProperties();
            this.reset();
            // Close modal if using Bootstrap
            bootstrap.Modal.getInstance(document.getElementById("addPropertyModal"))?.hide();
        }
    } catch (error) {
        console.error("Error adding property:", error);
    }
});

// =========================
// DELETE PROPERTY
// =========================
async function deleteProperty(id) {
    if (!confirm("Are you sure you want to delete this property?")) return;

    try {
        const response = await fetch(`${BASE_URL}/properties/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            properties = properties.filter(p => p.id !== id);
            displayProperties();
        }
    } catch (error) {
        console.error("Error deleting property:", error);
    }
}

// =========================
// OPEN EDIT 
// =========================
function openEdit(id) {
    editId = id;
    const p = properties.find(item => item.id === id);
    if (!p) return;

    document.getElementById("editTitle").value = p.title;
    document.getElementById("editLocation").value = p.location;
    document.getElementById("editType").value = p.type;
    document.getElementById("editBedrooms").value = p.bedrooms;
    document.getElementById("editPrice").value = p.price;

    new bootstrap.Modal(document.getElementById("editPropertyModal")).show();
}

// =========================
// SAVE EDITED PROPERTY
// =========================
document.getElementById("editPropertyForm")?.addEventListener("submit", async function (e) {
    e.preventDefault();

    const updatedProperty = {
        id: editId,
        title: editTitle.value,
        location: editLocation.value,
        type: editType.value,
        bedrooms: Number(editBedrooms.value),
        price: Number(editPrice.value)
    };

    try {
        const response = await fetch(`${BASE_URL}/properties/${editId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedProperty)
        });

        if (response.ok) {
            const index = properties.findIndex(p => p.id === editId);
            properties[index] = updatedProperty;
            displayProperties();
            bootstrap.Modal.getInstance(document.getElementById("editPropertyModal"))?.hide();
        }
    } catch (error) {
        console.error("Error updating property:", error);
    }
});