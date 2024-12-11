const textbox = document.getElementById("textbox");
const noTasksText = document.getElementById("noTasksText");
const taskContainer = document.getElementById("taskContainer");
const totalTasksText = document.getElementById("totalTasks");
const calendarBtn = document.getElementById("calendarBtn");

let taskCounter = 0;

//load localstorage on website load
window.onload = function () {
    loadTasks();
};

function addTask(){
    
    //get task text
    const taskText = textbox.value.trim();
    if (taskText === "") return;

    //make no task text invisible
    noTasksText.style.display = "none";
    
    //get date
    const formattedDate = getDate(calendarBtn.value);

    //create task box
    const task = document.createElement("div");
    task.classList.add("task");
    task.setAttribute("id", `task${taskCounter}`);

    const taskDesc = document.createElement("div");
    taskDesc.classList.add("taskDesc");
    
    const taskName = document.createElement("p");
    taskName.textContent = taskText;
    taskName.classList.add("taskName");

    taskDesc.appendChild(taskName);

    if (formattedDate !== ""){
        const taskDate = document.createElement("label");
        taskDate.textContent = formattedDate;
        taskDate.classList.add("taskDate");

        taskDesc.appendChild(taskDate);
    }

    const completeBtn = document.createElement("button");
    completeBtn.textContent = "✔";
    completeBtn.classList.add("completeBtn");
    completeBtn.onclick = () => completeTask(task);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.classList.add("deleteBtn");
    deleteBtn.onclick = () => deleteTask(task);

    task.appendChild(completeBtn);
    task.appendChild(taskDesc);
    task.appendChild(deleteBtn);

    taskContainer.appendChild(task);

    //set task total up top and increment taskcounter
    const uncompletedTasks = taskContainer.querySelectorAll(".task:not(.completed)").length;
    totalTasksText.textContent = uncompletedTasks;
    taskCounter++;

    //save to localstorage
    saveTasks();

    //sort tasks
    sortTasks();

    textbox.value = "";
    calendarBtn.value = "";
}

textbox.addEventListener("keydown", function(event){
    if (event.key === "Enter"){
        event.preventDefault();
        addTask();
    }
});

function completeTask(task){
    
    const taskDesc = task.querySelector(".taskDesc p");
    const completeBtn = task.querySelector(".completeBtn");

    task.classList.add("completed");
    taskDesc.style.textDecoration = "line-through";

    completeBtn.remove();

    //set task total up top
    const totalTasksCompleted = document.querySelectorAll(".completed").length;

    //update total tasks to show only uncompleted tasks
    const uncompletedTasks = taskContainer.querySelectorAll(".task:not(.completed)").length;
    totalTasksText.textContent = uncompletedTasks;
    
    //sort completed task to bottom
    sortTasks();

    //save to localstorage
    saveTasks();

}

function deleteTask(task){
    task.remove();

    if (taskContainer.children.length === 1){
        noTasksText.style.display = "flex";
    }
    //set task total up top
    const uncompletedTasks = taskContainer.querySelectorAll(".task:not(.completed)").length;
    totalTasksText.textContent = uncompletedTasks;

    //save to localstorage
    saveTasks();
}

function getDate(dateString){
    const date = new Date(dateString + "T00:00:00")

    if (isNaN(date.getTime())) {
        return "";
    }

    const options = {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    };

    const currentYear = new Date().getFullYear();

    const formattedDate = date.toLocaleDateString('en-US', options);

    if (date.getFullYear() !== currentYear){
        return `${formattedDate}, ${date.getFullYear()}`;
    }
    else{
        return formattedDate;
    }
}

function sortTasks(){
    const tasks = Array.from(taskContainer.children);

    //sort tasks
    tasks.sort((a, b) => {
        const isCompletedA = a.classList.contains("completed");
        const isCompletedB = b.classList.contains("completed");

        if (isCompletedA && !isCompletedB) return 1;
        if (!isCompletedA && isCompletedB) return -1;

        const dateTextA = a.querySelector(".taskDate")?.textContent || null;
        const dateTextB = b.querySelector(".taskDate")?.textContent || null;

        const dateA = dateTextA ? new Date(dateTextA) : null;
        const dateB = dateTextB ? new Date(dateTextB) : null;

        if (!isCompletedA && !isCompletedB){
            if (dateA && !dateB) return -1;
            if (!dateA && dateB) return 1;
            if (dateA && dateB) return dateA - dateB;
        }
        return 0;
    });

    tasks.forEach(task => taskContainer.appendChild(task));
}

function saveTasks(){
    const tasks = [];
    taskContainer.querySelectorAll(".task").forEach((task) => {
        const taskName = task.querySelector(".taskName").textContent;
        const taskDate = task.querySelector(".taskDate")?.textContent || "";
        const isCompleted = task.classList.contains("completed");

        tasks.push({ taskName, taskDate, isCompleted });
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks(){
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    if (tasks.length === 0){
        noTasksText.style.display = "flex";
    }
    else{
        noTasksText.style.display = "none";
    }

    tasks.forEach(({ taskName, taskDate, isCompleted }) => {
        const task = document.createElement("div");
        task.classList.add("task");
        if (isCompleted) task.classList.add("completed");

        const taskDesc = document.createElement("div");
        taskDesc.classList.add("taskDesc");

        const taskNameElement = document.createElement("p");
        taskNameElement.textContent = taskName;
        taskNameElement.classList.add("taskName");
        if (isCompleted) taskNameElement.style.textDecoration = "line-through";

        taskDesc.appendChild(taskNameElement);

        if (taskDate !== ""){
            const taskDateElement = document.createElement("label");
            taskDateElement.textContent = taskDate;
            taskDateElement.classList.add("taskDate");
            taskDesc.appendChild(taskDateElement);
        }

        const completeBtn = document.createElement("button");
        completeBtn.textContent = "✔";
        completeBtn.classList.add("completeBtn");
        completeBtn.onclick = () => completeTask(task);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "X";
        deleteBtn.classList.add("deleteBtn");
        deleteBtn.onclick = () => deleteTask(task);

        if (!isCompleted) task.appendChild(completeBtn);

        task.appendChild(taskDesc);
        task.appendChild(deleteBtn);
        taskContainer.appendChild(task);
    });

    sortTasks();

    const uncompletedTasks = taskContainer.querySelectorAll(".task:not(.completed)").length;
    totalTasksText.textContent = uncompletedTasks;
}