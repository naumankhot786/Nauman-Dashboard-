import { auth, db } from "./firebase.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// Login Check
onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    await loadDashboard();

});

// Dashboard Data
async function loadDashboard() {

    // Clients
    const clients = await getDocs(collection(db, "clients"));
    document.getElementById("clientsCount").textContent = clients.size;

// Projects
const projects = await getDocs(collection(db, "projects"));

document.getElementById("projectsCount").textContent = projects.size;

let completed = 0;

projects.forEach((doc) => {

    const data = doc.data();

    if (data.status === "Completed") {
        completed++;
    }

});

document.getElementById("completedProjects").textContent = completed;

    // Messages
    const messages = await getDocs(collection(db, "messages"));
    document.getElementById("messagesCount").textContent = messages.size;

    // Revenue
    const payments = await getDocs(collection(db, "payments"));

    let totalRevenue = 0;

    payments.forEach((doc) => {
        const data = doc.data();
        totalRevenue += Number(data.paidAmount || 0);
    });

    document.getElementById("revenue").textContent =
        "₹" + totalRevenue.toLocaleString("en-IN");
}
new Chart(document.getElementById("dashboardChart"), {

    type: "bar",

    data: {

        labels: [
            "Clients",
            "Projects",
            "Messages",
            "Completed"
        ],

        datasets: [{

            label: "Nauman Labs",

            data: [
                clients.size,
                projects.size,
                messages.size,
                completed
            ]

        }]

    }

});
// Logout
document.getElementById("logout").addEventListener("click", async (e) => {

    e.preventDefault();

    if (confirm("Logout from Nauman Labs?")) {

        await signOut(auth);

        window.location.href = "login.html";

    }

});