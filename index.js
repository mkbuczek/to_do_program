const textbox = document.getElementById("textbox");
const noTasksText = document.getElementById("noTasksText");
const taskContainer = document.getElementById("taskContainer");
const totalTasksText = document.getElementById("totalTasks");
const calendarBtn = document.getElementById("calendarBtn");

let taskCounter = 0;

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

    // Update total tasks to show only uncompleted tasks
    const uncompletedTasks = taskContainer.querySelectorAll(".task:not(.completed)").length;
    totalTasksText.textContent = uncompletedTasks;
    
    console.log(totalTasksCompleted)

}

function deleteTask(task){
    task.remove();

    if (taskContainer.children.length === 1){
        noTasksText.style.display = "flex";
    }
    //set task total up top
    const uncompletedTasks = taskContainer.querySelectorAll(".task:not(.completed)").length;
    totalTasksText.textContent = uncompletedTasks;
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