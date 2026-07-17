import { db } from "./firebase.js";

import {
collection,
addDoc,
getDocs,
updateDoc,
deleteDoc,
doc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const popup = document.getElementById("projectPopup");
const table = document.getElementById("projectTable");

const projectName = document.getElementById("projectName");
const projectClient = document.getElementById("projectClient");
const projectStatus = document.getElementById("projectStatus");
const projectDeadline = document.getElementById("projectDeadline");
const projectProgress = document.getElementById("projectProgress");

// Open Popup
document.getElementById("openProjectForm").onclick = () => {

    popup.style.display = "flex";

};

// Close Popup
document.getElementById("closeProject").onclick = () => {

    popup.style.display = "none";

};

// Save Project
document.getElementById("saveProject").onclick = async () => {

    if (
        projectName.value === "" ||
        projectClient.value === ""
    ) {

        alert("Please fill all fields.");
        return;

    }

    await addDoc(collection(db, "projects"), {

        name: projectName.value,
        client: projectClient.value,
        status: projectStatus.value,
        deadline: projectDeadline.value,
        progress: projectProgress.value

    });

    alert("Project Added Successfully");

    popup.style.display = "none";

    projectName.value = "";
    projectClient.value = "";
    projectStatus.value = "Pending";
    projectDeadline.value = "";
    projectProgress.value = "";

    loadProjects();

};
// Load Projects
async function loadProjects() {

    table.innerHTML = "";

    const snapshot = await getDocs(collection(db, "projects"));

    snapshot.forEach((item) => {

        const data = item.data();

        table.innerHTML += `
        <tr>

        <td>${data.name}</td>

        <td>${data.client}</td>

        <td>${data.status}</td>

        <td>${data.deadline}</td>

        <td>${data.progress}%</td>

        <td>

        <button class="action-btn edit-btn"
        onclick="editProject(
        '${item.id}',
        '${data.name}',
        '${data.client}',
        '${data.status}',
        '${data.deadline}',
        '${data.progress}'
        )">
        ✏️
        </button>

        <button class="action-btn delete-btn"
        onclick="deleteProject('${item.id}')">
        🗑️
        </button>

        </td>

        </tr>
        `;

    });

}
let editId = null;

window.editProject = (
id,
name,
client,
status,
deadline,
progress
)=>{

editId = id;

projectName.value = name;
projectClient.value = client;
projectStatus.value = status;
projectDeadline.value = deadline;
projectProgress.value = progress;

popup.style.display = "flex";

};
// Save / Update Project
document.getElementById("saveProject").onclick = async () => {

    const projectData = {

        name: projectName.value.trim(),
        client: projectClient.value.trim(),
        status: projectStatus.value,
        deadline: projectDeadline.value,
        progress: projectProgress.value

    };

    if (!projectData.name || !projectData.client) {

        alert("Please fill all fields.");
        return;

    }

    try {

        if (editId) {

            await updateDoc(
                doc(db, "projects", editId),
                projectData
            );

            alert("Project Updated");

            editId = null;

        } else {

            await addDoc(
                collection(db, "projects"),
                projectData
            );

            alert("Project Added");

        }

        popup.style.display = "none";

        projectName.value = "";
        projectClient.value = "";
        projectStatus.value = "Pending";
        projectDeadline.value = "";
        projectProgress.value = "";

        loadProjects();

    } catch (error) {

        alert(error.message);

    }

};
// Delete Project
window.deleteProject = async (id) => {

    if (!confirm("Delete this project?")) return;

    await deleteDoc(doc(db, "projects", id));

    loadProjects();

};

// Search
document.getElementById("searchProject").addEventListener("keyup", () => {

    const value = document
        .getElementById("searchProject")
        .value
        .toLowerCase();

    const rows = table.getElementsByTagName("tr");

    for (let row of rows) {

        row.style.display =
            row.innerText.toLowerCase().includes(value)
            ? ""
            : "none";

    }

});

// Start
loadProjects();