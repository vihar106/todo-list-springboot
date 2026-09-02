const API_URL = "http://localhost:8085/tasks";

let tasks = [];
let editingTaskId = null;


// ======================================================
// PAGE LOAD
// ======================================================

document.addEventListener("DOMContentLoaded", function () {

    loadTasks();

    // Add Task button
    const addTaskBtn = document.getElementById("addTaskBtn");

    if (addTaskBtn) {
        addTaskBtn.addEventListener("click", function () {
            openAddModal();
        });
    }

    // Close button
    const closeModalBtn = document.getElementById("closeModal");

    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", closeModal);
    }

    // Cancel button
    const cancelBtn = document.getElementById("cancelBtn");

    if (cancelBtn) {
        cancelBtn.addEventListener("click", closeModal);
    }

    // Form
    const form = document.getElementById("taskForm");

    if (form) {
        form.addEventListener("submit", saveTask);
    }

    // Search
    const searchInput = document.getElementById("searchInput");

    if (searchInput) {
        searchInput.addEventListener("input", filterTasks);
    }

    // Status filter
    const statusFilter = document.getElementById("statusFilter");

    if (statusFilter) {
        statusFilter.addEventListener("change", filterTasks);
    }

    // Priority filter
    const priorityFilter = document.getElementById("priorityFilter");

    if (priorityFilter) {
        priorityFilter.addEventListener("change", filterTasks);
    }

    // Refresh
    const refreshBtn = document.getElementById("refreshBtn");

    if (refreshBtn) {
        refreshBtn.addEventListener("click", function () {

            resetFilters();

            loadTasks();
        });
    }
});


// ======================================================
// GET ALL TASKS
// ======================================================

async function loadTasks() {

    try {

        console.log("Fetching:", API_URL);

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(
                "GET failed: HTTP " + response.status
            );
        }

        tasks = await response.json();

        console.log("Tasks received:", tasks);

        displayTasks(tasks);

    } catch (error) {

        console.error("GET ALL ERROR:", error);

        const taskList = document.getElementById("taskList");

        if (taskList) {

            taskList.innerHTML = `
                <div class="empty">
                    Cannot connect to backend.
                    <br>
                    Make sure Spring Boot is running on port 8085.
                </div>
            `;
        }
    }
}


// ======================================================
// GET TASK BY ID
// ======================================================

async function getTaskById(id) {

    try {

        const response =
            await fetch(`${API_URL}/${id}`);

        if (!response.ok) {

            if (response.status === 404) {
                alert("Task not found");
                return null;
            }

            throw new Error(
                "HTTP " + response.status
            );
        }

        return await response.json();

    } catch (error) {

        console.error("GET BY ID ERROR:", error);

        alert("Unable to get task");

        return null;
    }
}


// ======================================================
// DISPLAY TASKS
// ======================================================

function displayTasks(taskArray) {

    const taskList =
        document.getElementById("taskList");

    if (!taskList) {

        console.error(
            "ERROR: taskList element not found"
        );

        return;
    }


    // No tasks
    if (!taskArray || taskArray.length === 0) {

        taskList.innerHTML = `
            <div class="empty">
                No tasks found
            </div>
        `;

        return;
    }


    taskList.innerHTML = taskArray.map(function (task) {

        const status =
            getStatusName(task.statusId);

        const priority =
            getPriorityName(task.priorityId);


        return `

            <article class="card">

                <div class="card-header">

                    <h3>
                        ${escapeHtml(task.title)}
                    </h3>

                </div>


                <p>
                    ${escapeHtml(
                        task.description || "No description"
                    )}
                </p>


                <div class="meta">

                    <span class="badge">
                        ${status}
                    </span>

                    <span class="badge">
                        ${priority}
                    </span>

                    ${
                        task.dueDate
                        ?
                        `
                        <span class="badge">
                            Due: ${escapeHtml(task.dueDate)}
                        </span>
                        `
                        :
                        ""
                    }

                </div>


                <p class="created-by">

                    Created by:
                    ${escapeHtml(task.createdBy || "")}

                </p>


                <div class="actions">

                    <button
                        class="secondary"
                        onclick="editTask(${task.id})">

                        Edit

                    </button>


                    <button
                        class="delete"
                        onclick="deleteTask(${task.id})">

                        Delete

                    </button>

                </div>

            </article>

        `;

    }).join("");
}


// ======================================================
// FILTER TASKS
// ======================================================

function filterTasks() {

    const searchInput =
        document.getElementById("searchInput");

    const statusFilter =
        document.getElementById("statusFilter");

    const priorityFilter =
        document.getElementById("priorityFilter");


    const search =
        searchInput
        ? searchInput.value.toLowerCase().trim()
        : "";


    const selectedStatus =
        statusFilter
        ? String(statusFilter.value)
        : "";


    const selectedPriority =
        priorityFilter
        ? String(priorityFilter.value)
        : "";


    console.log(
        "Search:",
        search,
        "Status:",
        selectedStatus,
        "Priority:",
        selectedPriority
    );


    const filteredTasks = tasks.filter(function (task) {


        // ----------------------------------------------
        // SEARCH
        // ----------------------------------------------

        const title =
            String(task.title || "")
                .toLowerCase();


        const description =
            String(task.description || "")
                .toLowerCase();


        const searchMatch =
            search === "" ||
            title.includes(search) ||
            description.includes(search);


        // ----------------------------------------------
        // STATUS
        // ----------------------------------------------

        const taskStatus =
            String(task.statusId);


        const statusMatch =
            selectedStatus === "" ||
            taskStatus === selectedStatus;


        // ----------------------------------------------
        // PRIORITY
        // ----------------------------------------------

        const taskPriority =
            String(task.priorityId);


        const priorityMatch =
            selectedPriority === "" ||
            taskPriority === selectedPriority;


        // ----------------------------------------------
        // FINAL
        // ----------------------------------------------

        return (
            searchMatch &&
            statusMatch &&
            priorityMatch
        );

    });


    console.log(
        "Filtered tasks:",
        filteredTasks
    );


    displayTasks(filteredTasks);
}


// ======================================================
// RESET FILTERS
// ======================================================

function resetFilters() {

    const searchInput =
        document.getElementById("searchInput");

    const statusFilter =
        document.getElementById("statusFilter");

    const priorityFilter =
        document.getElementById("priorityFilter");


    if (searchInput) {
        searchInput.value = "";
    }


    if (statusFilter) {
        statusFilter.value = "";
    }


    if (priorityFilter) {
        priorityFilter.value = "";
    }
}


// ======================================================
// OPEN ADD MODAL
// ======================================================

function openAddModal() {

    editingTaskId = null;


    const form =
        document.getElementById("taskForm");

    if (form) {
        form.reset();
    }


    const modalTitle =
        document.getElementById("modalTitle");

    if (modalTitle) {
        modalTitle.textContent = "Add Task";
    }


    // Default values

    const status =
        document.getElementById("statusId");

    if (status) {
        status.value = "1";
    }


    const priority =
        document.getElementById("priorityId");

    if (priority) {
        priority.value = "1";
    }


    const modal =
        document.getElementById("modal");

    if (modal) {
        modal.classList.remove("hidden");
    }
}


// ======================================================
// OPEN EDIT MODAL
// ======================================================

async function editTask(id) {

    const task =
        await getTaskById(id);


    if (!task) {
        return;
    }


    editingTaskId = task.id;


    document.getElementById("taskId").value =
        task.id || "";


    document.getElementById("title").value =
        task.title || "";


    document.getElementById("description").value =
        task.description || "";


    document.getElementById("statusId").value =
        task.statusId || "1";


    document.getElementById("priorityId").value =
        task.priorityId || "1";


    document.getElementById("dueDate").value =
        task.dueDate || "";


    document.getElementById("completionDate").value =
        task.completionDate || "";


    document.getElementById("createdBy").value =
        task.createdBy || "";


    document.getElementById("updatedBy").value =
        task.updatedBy || "";


    const modalTitle =
        document.getElementById("modalTitle");

    if (modalTitle) {
        modalTitle.textContent = "Edit Task";
    }


    const modal =
        document.getElementById("modal");

    if (modal) {
        modal.classList.remove("hidden");
    }
}


// ======================================================
// CLOSE MODAL
// ======================================================

function closeModal() {

    const modal =
        document.getElementById("modal");

    if (modal) {
        modal.classList.add("hidden");
    }


    editingTaskId = null;
}


// ======================================================
// CREATE / UPDATE
// ======================================================

async function saveTask(event) {

    event.preventDefault();


    const title =
        document.getElementById("title")
            .value
            .trim();


    const description =
        document.getElementById("description")
            .value
            .trim();


    const statusId =
        Number(
            document.getElementById("statusId").value
        );


    const priorityId =
        Number(
            document.getElementById("priorityId").value
        );


    const dueDate =
        document.getElementById("dueDate").value
        || null;


    const completionDate =
        document.getElementById("completionDate").value
        || null;


    const createdBy =
        document.getElementById("createdBy")
            .value
            .trim();


    const updatedBy =
        document.getElementById("updatedBy")
            .value
            .trim();


    // ----------------------------------------------
    // VALIDATION
    // ----------------------------------------------

    if (title.length < 3) {

        alert(
            "Title must contain at least 3 characters."
        );

        return;
    }


    if (!statusId) {

        alert("Please select status.");

        return;
    }


    if (!priorityId) {

        alert("Please select priority.");

        return;
    }


    if (!createdBy) {

        alert("Created By is required.");

        return;
    }


    // ----------------------------------------------
    // REQUEST BODY
    // ----------------------------------------------

    const task = {

        title: title,

        description: description,

        statusId: statusId,

        dueDate: dueDate,

        priorityId: priorityId,

        completionDate: completionDate,

        createdBy: createdBy,

        updatedBy: updatedBy || createdBy

    };


    console.log("Sending task:", task);


    try {

        let response;


        // ------------------------------------------
        // UPDATE
        // ------------------------------------------

        if (editingTaskId !== null) {

            response = await fetch(
                `${API_URL}/${editingTaskId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(task)
                }
            );

        }


        // ------------------------------------------
        // CREATE
        // ------------------------------------------

        else {

            response = await fetch(
                API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(task)
                }
            );

        }


        const result =
            await response.text();


        console.log(
            "Backend response:",
            result
        );


        if (!response.ok) {

            throw new Error(
                result ||
                "HTTP " + response.status
            );
        }


        // ------------------------------------------
        // SUCCESS
        // ------------------------------------------

        alert(
            editingTaskId !== null
                ? "Task updated successfully"
                : "Task created successfully"
        );


        closeModal();


        // Reset filters so new task is visible
        resetFilters();


        // Fetch latest database data
        await loadTasks();


    } catch (error) {

        console.error(
            "SAVE ERROR:",
            error
        );


        alert(
            "Unable to save task.\n\n" +
            error.message
        );
    }
}


// ======================================================
// DELETE
// ======================================================

async function deleteTask(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this task?"
        );


    if (!confirmDelete) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );


        const result =
            await response.text();


        console.log(
            "Delete response:",
            result
        );


        if (!response.ok) {

            throw new Error(
                result ||
                "HTTP " + response.status
            );
        }


        alert(
            "Task deleted successfully"
        );


        await loadTasks();


    } catch (error) {

        console.error(
            "DELETE ERROR:",
            error
        );


        alert(
            "Unable to delete task.\n\n" +
            error.message
        );
    }
}


// ======================================================
// STATUS
// ======================================================

function getStatusName(id) {

    switch (Number(id)) {

        case 1:
            return "TODO";

        case 2:
            return "IN_PROGRESS";

        case 3:
            return "DONE";

        default:
            return "UNKNOWN";
    }
}


// ======================================================
// PRIORITY
// ======================================================

function getPriorityName(id) {

    switch (Number(id)) {

        case 1:
            return "LOW";

        case 2:
            return "MEDIUM";

        case 3:
            return "HIGH";

        default:
            return "UNKNOWN";
    }
}


// ======================================================
// HTML SECURITY
// ======================================================

function escapeHtml(value) {

    return String(value ?? "")

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");
}


// ======================================================
// CLOSE MODAL WHEN CLICKING OUTSIDE
// ======================================================

window.addEventListener("click", function (event) {

    const modal =
        document.getElementById("modal");

    if (
        modal &&
        event.target === modal
    ) {

        closeModal();

    }

});