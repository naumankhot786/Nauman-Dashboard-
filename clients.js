import { db } from "./firebase.js";

import {
collection,
addDoc,
getDocs,
updateDoc,
deleteDoc,
doc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const popup = document.getElementById("clientPopup");
const table = document.getElementById("clientTable");

const nameInput = document.getElementById("clientName");
const companyInput = document.getElementById("clientCompany");
const phoneInput = document.getElementById("clientPhone");
const emailInput = document.getElementById("clientEmail");

let editId = null;

// Open Popup
document.getElementById("openForm").onclick = () => {

    editId = null;

    nameInput.value = "";
    companyInput.value = "";
    phoneInput.value = "";
    emailInput.value = "";

    popup.style.display = "flex";

};

// Close Popup
document.getElementById("closePopup").onclick = () => {

    popup.style.display = "none";

};
// Save / Update Client
document.getElementById("saveClient").onclick = async () => {

    const name = nameInput.value.trim();
    const company = companyInput.value.trim();
    const phone = phoneInput.value.trim();
    const email = emailInput.value.trim();

    if (!name || !company || !phone || !email) {
        alert("Please fill all fields.");
        return;
    }

    const clientData = {
        name,
        company,
        phone,
        email
    };

    try {

        if (editId) {

            // Update Client
            await updateDoc(
                doc(db, "clients", editId),
                clientData
            );

            alert("Client Updated Successfully");

        } else {

            // Add Client
            await addDoc(
                collection(db, "clients"),
                clientData
            );

            alert("Client Added Successfully");

        }

        popup.style.display = "none";

        nameInput.value = "";
        companyInput.value = "";
        phoneInput.value = "";
        emailInput.value = "";

        editId = null;

        loadClients();

    } catch (error) {

        alert(error.message);

    }

};
// Load Clients
async function loadClients() {

    table.innerHTML = "";

    const snapshot = await getDocs(collection(db, "clients"));

    snapshot.forEach((item) => {

        const data = item.data();

        table.innerHTML += `
        <tr>

            <td>${data.name}</td>

            <td>${data.company}</td>

            <td>${data.phone}</td>

            <td>${data.email}</td>

            <td>

                <button class="action-btn edit-btn"
                onclick="editClient(
                '${item.id}',
                '${data.name}',
                '${data.company}',
                '${data.phone}',
                '${data.email}'
                )">
                ✏️
                </button>

                <button class="action-btn delete-btn"
                onclick="deleteClient('${item.id}')">
                🗑️
                </button>

                <button class="whatsapp-btn"
                onclick="window.open('https://wa.me/${data.phone}')">
                💬
                </button>

                <button class="call-btn"
                onclick="window.location.href='tel:${data.phone}'">
                📞
                </button>

                <button class="email-btn"
                onclick="window.location.href='mailto:${data.email}'">
                📧
                </button>

            </td>

        </tr>
        `;

    });

}

// Edit Client
window.editClient = (
id,
name,
company,
phone,
email
)=>{

    editId = id;

    nameInput.value = name;
    companyInput.value = company;
    phoneInput.value = phone;
    emailInput.value = email;

    popup.style.display = "flex";

};
// Delete Client
window.deleteClient = async (id) => {

    const ok = confirm("Delete this client?");

    if (!ok) return;

    try {

        await deleteDoc(doc(db, "clients", id));

        alert("Client Deleted");

        loadClients();

    } catch (error) {

        alert(error.message);

    }

};

// Search Client
document.getElementById("searchClient").addEventListener("keyup", () => {

    const search = document
        .getElementById("searchClient")
        .value
        .toLowerCase();

    const rows = table.getElementsByTagName("tr");

    for (let row of rows) {

        row.style.display =
            row.innerText.toLowerCase().includes(search)
            ? ""
            : "none";

    }

});

// Load Clients on Page Open
loadClients();