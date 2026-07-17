import { auth, db } from "./firebase.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// Login Check
onAuthStateChanged(auth, async(user)=>{

    if(!user){
        window.location.href="login.html";
        return;
    }

    loadAnalytics();

});

// Load Analytics
async function loadAnalytics(){

    // Clients
    const clients = await getDocs(collection(db,"clients"));
    document.getElementById("clientsTotal").textContent = clients.size;

    // Projects
    const projects = await getDocs(collection(db,"projects"));
    document.getElementById("projectsTotal").textContent = projects.size;

    // Messages
    const messages = await getDocs(collection(db,"messages"));
    document.getElementById("messagesTotal").textContent = messages.size;

    // Revenue
    const payments = await getDocs(collection(db,"payments"));

    let total = 0;

    payments.forEach((item)=>{

        const data = item.data();

        total += Number(data.paidAmount || 0);

    });

    document.getElementById("revenueTotal").textContent =
        "₹" + total.toLocaleString("en-IN");

}