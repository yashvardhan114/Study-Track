
document.addEventListener("DOMContentLoaded", function() {

    const taskForm = document.getElementById("task-form");
    const taskInput = document.getElementById("task-input");
    const taskDate = document.getElementById("task-date");
    console.log("Task Date Element:", taskDate);
    const taskList = document.getElementById("task-list");
    const subjectForm = document.getElementById("subject-form");
const subjectInput = document.getElementById("subject-input");
const subjectList = document.getElementById("subject-list");
const taskSubject = document.getElementById("task-subject");
const subjectFilter = document.getElementById("subject-filter");
const taskSearch = document.getElementById("task-search");
subjectFilter.addEventListener("change", function() {
    displayTasks();
});
taskSearch.addEventListener("input", function() {
    displayTasks();
});
const totalSubjects = document.getElementById("total-subjects");
    const upcomingTasks = document.getElementById("upcoming-tasks");
    const totalTasks = document.getElementById("total-tasks");
    const pendingTasks = document.getElementById("pending-tasks");
const completedTasks = document.getElementById("completed-tasks");
    // Load old and saved tasks
    let tasks = JSON.parse(localStorage.getItem("studyTasks")) || [];

    // Convert old tasks into new format
    tasks = tasks.map(function(task) {
        if (typeof task === "string") {
            return {
                name: task,
                completed: false
            };
        }
        return task;
    });

    // Save tasks
    function saveTasks() {
        localStorage.setItem("studyTasks", JSON.stringify(tasks));
    }

    // Display tasks
    function displayTasks() {
        const selectedSubject = subjectFilter
    ? subjectFilter.value
    : "all";

const filteredTasks = selectedSubject === "all"
    ? tasks
    : tasks.filter(function(task) {
        return task.subject === selectedSubject;
    });
    const searchText = taskSearch
    ? taskSearch.value.toLowerCase().trim()
    : "";

const searchedTasks = filteredTasks.filter(function(task) {
    return task.name.toLowerCase().includes(searchText);
});
        taskList.innerHTML = "";
        
      if (totalTasks) {
    totalTasks.textContent = tasks.length;
    if (pendingTasks) {
    pendingTasks.textContent =
        tasks.filter(task => !task.completed).length;
}

if (completedTasks) {
    completedTasks.textContent =
        tasks.filter(task => task.completed).length;
}
} 
        searchedTasks.forEach(function(task, index) {

            const taskDiv = document.createElement("div");
            taskDiv.className = "task";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.completed;

            const taskText = document.createElement("span");
            taskText.textContent = task.name;
            const dateText = document.createElement("small");

if (task.date) {
    dateText.textContent = "Due: " + task.date;
} else {
    dateText.textContent = "";
}

            if (task.completed) {
                taskText.style.textDecoration = "line-through";
                taskText.style.color = "gray";
            }

            checkbox.addEventListener("change", function() {
                tasks[index].completed = checkbox.checked;
                saveTasks();
                displayTasks();
            });
            // Edit Task Button
const editButton = document.createElement("button");
editButton.textContent = "Edit";
editButton.className = "edit-btn";

editButton.addEventListener("click", function() {
    const updatedTask = prompt(
        "Enter updated task name:",
        tasks[index].name
    );

    if (updatedTask === null || updatedTask.trim() === "") {
        return;
    }

    const newTaskName = updatedTask.trim();

    const isDuplicate = tasks.some(function(task, taskIndex) {
        return taskIndex !== index &&
            task.name.toLowerCase() === newTaskName.toLowerCase();
    });

    if (isDuplicate) {
        alert("This task already exists!");
        return;
    }

    tasks[index].name = newTaskName;

    saveTasks();
    displayTasks();
});
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.className = "delete-btn";

            deleteButton.addEventListener("click", function() {
                tasks.splice(index, 1);
                saveTasks();
                displayTasks();
            });

            taskDiv.appendChild(checkbox);
            taskDiv.appendChild(taskText);
            taskDiv.appendChild(dateText);
            const subjectText = document.createElement("small");

subjectText.textContent = task.subject
    ? "Subject: " + task.subject
    : "Subject: Not selected";

taskDiv.appendChild(subjectText);
            taskDiv.appendChild(editButton);
            taskDiv.appendChild(deleteButton);
            taskList.appendChild(taskDiv);
        });
        // Display Upcoming Tasks
if (upcomingTasks) {
    upcomingTasks.innerHTML = "";

    const today = new Date();
    const localToday = new Date(
        today.getTime() - today.getTimezoneOffset() * 60000
    ).toISOString().split("T")[0];

    const upcoming = tasks.filter(function(task) {
        return task.date && task.date >= localToday && !task.completed;
    });

    upcoming.forEach(function(task) {
        const taskDiv = document.createElement("div");
        taskDiv.className = "task";
        taskDiv.textContent = task.name + " - Due: " + task.date;

        upcomingTasks.appendChild(taskDiv);
    });
}
    }
// Store Subjects
let subjects = JSON.parse(localStorage.getItem("studySubjects")) || [];

// Save Subjects
function saveSubjects() {
    localStorage.setItem("studySubjects", JSON.stringify(subjects));
}

// Display Subjects
function displaySubjects() {
    subjectList.innerHTML = "";
    if (taskSubject) {
    taskSubject.innerHTML = '<option value="">Select Subject</option>';

    subjects.forEach(function(subject) {
        const option = document.createElement("option");
        option.value = subject;
        option.textContent = subject;

        taskSubject.appendChild(option);
    });
}
// Load subjects in Filter Dropdown
if (subjectFilter) {
    subjectFilter.innerHTML = '<option value="all">All Subjects</option>';

    subjects.forEach(function(subject) {
        const option = document.createElement("option");
        option.value = subject;
        option.textContent = subject;

        subjectFilter.appendChild(option);
    });
}
    if (totalSubjects) {
    totalSubjects.textContent = subjects.length;
}

    subjects.forEach(function(subject, index) {
        const subjectDiv = document.createElement("div");
        subjectDiv.className = "task";

        const subjectText = document.createElement("span");
        subjectText.textContent = subject;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", function() {
            subjects.splice(index, 1);
            saveSubjects();
            displaySubjects();
        });

        subjectDiv.appendChild(subjectText);
        subjectDiv.appendChild(deleteButton);

        subjectList.appendChild(subjectDiv);
    });
}

// Add Subject
subjectForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const subjectName = subjectInput.value.trim();

    if (subjectName === "") return;

    subjects.push(subjectName);

    saveSubjects();
    displaySubjects();

    subjectInput.value = "";
});

// Load Saved Subjects
displaySubjects();
    // Add new task
    taskForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const taskName = taskInput.value.trim();
        if (taskName === "") return;
        const isDuplicate = tasks.some(function(task) {
    return task.name.toLowerCase() === taskName.toLowerCase();
});

if (isDuplicate) {
    alert("This task already exists!");
    return;
}

        

        tasks.push({
            name: taskName,
            date: taskDate.value,
            subject: taskSubject.value,
            completed: false
        });

        saveTasks();
        displayTasks();

        taskInput.value = "";
    });

    saveTasks();
    displayTasks();

});
