import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const popup = document.getElementById("paymentPopup");
const table = document.getElementById("paymentTable");

const invoice = document.getElementById("invoiceNo");
const client = document.getElementById("paymentClient");
const amount = document.getElementById("paymentAmount");
const status = document.getElementById("paymentStatus");
const date = document.getElementById("paymentDate");

let editId = null;

// Open Popup
document.getElementById("openPaymentForm").onclick = () => {
    popup.style.display = "flex";
};

// Close Popup
document.getElementById("closePayment").onclick = () => {
    popup.style.display = "none";
};
// Save Payment
document.getElementById("savePayment").onclick = async () => {

    if (
        invoice.value.trim() === "" ||
        client.value.trim() === "" ||
        amount.value.trim() === ""
    ) {
        alert("Please fill all fields.");
        return;
    }

    const paymentData = {
        invoice: invoice.value,
        client: client.value,
        paidAmount: amount.value,
        status: status.value,
        date: date.value
    };

    try {

        if (editId) {

            await updateDoc(
                doc(db, "payments", editId),
                paymentData
            );

            editId = null;
            alert("Payment Updated");

        } else {

            await addDoc(
                collection(db, "payments"),
                paymentData
            );

            alert("Payment Added");
        }

        popup.style.display = "none";

        invoice.value = "";
        client.value = "";
        amount.value = "";
        status.value = "Pending";
        date.value = "";

        loadPayments();

    } catch (e) {

        alert(e.message);

    }

};
// Load Payments
async function loadPayments() {

    table.innerHTML = "";

    const snapshot = await getDocs(collection(db, "payments"));

    snapshot.forEach((item) => {

        const data = item.data();

        table.innerHTML += `
        <tr>

            <td>${data.invoice}</td>
            <td>${data.client}</td>
            <td>₹${data.paidAmount}</td>
            <td>${data.status}</td>
            <td>${data.date}</td>

            <td>

                <button class="action-btn edit-btn"
                onclick="editPayment(
                '${item.id}',
                '${data.invoice}',
                '${data.client}',
                '${data.paidAmount}',
                '${data.status}',
                '${data.date}'
                )">
                ✏️
                </button>

                <button class="action-btn delete-btn"
                onclick="deletePayment('${item.id}')">
                🗑️
                </button>

            </td>

        </tr>
        `;

    });

}

// Edit Payment
window.editPayment = (
id,
inv,
cli,
amt,
sts,
dt
)=>{

    editId = id;

    invoice.value = inv;
    client.value = cli;
    amount.value = amt;
    status.value = sts;
    date.value = dt;

    popup.style.display = "flex";

};

// Delete Payment
window.deletePayment = async(id)=>{

    if(!confirm("Delete this payment?")) return;

    await deleteDoc(doc(db,"payments",id));

    loadPayments();

};

// Search
document.getElementById("searchPayment").addEventListener("keyup",()=>{

    const search=document.getElementById("searchPayment").value.toLowerCase();

    const rows=table.getElementsByTagName("tr");

    for(let row of rows){

        row.style.display=
        row.innerText.toLowerCase().includes(search)
        ?"":"none";

    }

});

// Load Data
loadPayments();