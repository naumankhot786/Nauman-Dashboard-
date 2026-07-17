import { auth, db } from "./firebase.js";

import {
collection,
getDocs,
deleteDoc,
doc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const container = document.querySelector(".message-box");

// Login Check
onAuthStateChanged(auth, (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    loadMessages();

});

// Load Messages
async function loadMessages() {

    container.innerHTML = "";

    const snapshot = await getDocs(collection(db, "messages"));

    if (snapshot.empty) {
        container.innerHTML = "<h3>No Messages Found</h3>";
        return;
    }

    snapshot.forEach((item) => {

        const data = item.data();

        container.innerHTML += `
        <div class="message-card">

            <h3>${data.name || "Unknown User"}</h3>

            <p><b>Email:</b> ${data.email || "-"}</p>

            <p>${data.message || ""}</p>

            <br>

            <button onclick="deleteMessage('${item.id}')">
            🗑️ Delete
            </button>

        </div>
        `;

    });

}

// Delete Message
window.deleteMessage = async(id)=>{

    if(!confirm("Delete this message?")) return;

    await deleteDoc(doc(db,"messages",id));

    loadMessages();

};