
let jobs = JSON.parse(localStorage.getItem("jobs")) || [];

// Save profile
function saveProfile() {
    let profile = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        skills: document.getElementById("skills").value
    };

    localStorage.setItem("profile", JSON.stringify(profile));
    alert("Profile saved successfully!");
}

// Load profile
function loadProfile() {
    let profile = JSON.parse(localStorage.getItem("profile"));

    if (profile) {
        document.getElementById("name").value = profile.name || "";
        document.getElementById("email").value = profile.email || "";
        document.getElementById("skills").value = profile.skills || "";
    }
}

// Add new application
function addJob() {
    let company = document.getElementById("company").value.trim();
    let role = document.getElementById("role").value.trim();
    let date = document.getElementById("date").value;
    let status = document.getElementById("status").value;
    let activity = document.getElementById("activity").value.trim();

    if (!company || !role || !date) {
        alert("Please fill all required fields!");
        return;
    }

    let job = {
        id: Date.now(),
        company,
        role,
        date,
        status,
        activity
    };

    jobs.push(job);
    saveJobs();
    displayJobs();

    document.getElementById("company").value = "";
    document.getElementById("role").value = "";
    document.getElementById("date").value = "";
    document.getElementById("activity").value = "";
}

// Save applications
function saveJobs() {
    localStorage.setItem("jobs", JSON.stringify(jobs));
}

// Display applications
function displayJobs() {
    let list = document.getElementById("jobList");
    let search = document.getElementById("search").value.toLowerCase();

    let filtered = jobs.filter(job =>
        job.company.toLowerCase().includes(search) ||
        job.role.toLowerCase().includes(search)
    );

    list.innerHTML = "";

    if (filtered.length === 0) {
        list.innerHTML = "<p>No applications found.</p>";
    }

    filtered.forEach(job => {
        let card = document.createElement("div");
        card.className = "job";

        card.innerHTML = `
            <h3>${escapeHTML(job.company)}</h3>
            <p>Role: ${escapeHTML(job.role)}</p>
            <p>Date: ${escapeHTML(job.date)}</p>
            <p>Activity: ${escapeHTML(job.activity || "No notes")}</p>

            <label>Status:</label>
            <select onchange="updateStatus(${job.id}, this.value)">
                ${["Applied", "Interview", "Selected", "Rejected"].map(s =>
                    `<option ${job.status === s ? "selected" : ""}>${s}</option>`
                ).join("")}
            </select>

            <button onclick="deleteJob(${job.id})">Delete</button>
        `;

        list.appendChild(card);
    });

    updateDashboard();
}

// Prevent HTML injection in displayed text
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

// Update application status
function updateStatus(id, status) {
    let job = jobs.find(j => j.id === id);

    if (job) {
        job.status = status;
        saveJobs();
        displayJobs();
    }
}

// Delete application
function deleteJob(id) {
    if (confirm("Delete this application?")) {
        jobs = jobs.filter(job => job.id !== id);
        saveJobs();
        displayJobs();
    }
}

// Dashboard statistics
function updateDashboard() {
    document.getElementById("total").textContent = jobs.length;

    document.getElementById("applied").textContent =
        jobs.filter(j => j.status === "Applied").length;

    document.getElementById("interview").textContent =
        jobs.filter(j => j.status === "Interview").length;

    document.getElementById("selected").textContent =
        jobs.filter(j => j.status === "Selected").length;
}

// Start webpage
loadProfile();
displayJobs();
