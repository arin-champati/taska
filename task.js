function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      );
}

class Task {
    constructor(name, description, deadline, reward) {
        this.taskID = uuidv4();
        this.name = name;
        this.description = description;
        this.deadline = deadline;
        this.reward = reward;
        this.complete = false
    }
}


function handleTaskSubmit() {
    // get task attributes
    let name = document.getElementById("task").value;
    let descr = document.getElementById("task_description").value;
    let date = document.getElementById("date").value;
    let time = document.getElementById("time").value;
    let datetime = date + " " + time;
    let reward = parseFloat(document.getElementById("reward").value);

    // add task to tasklist
    let task = new Task(name, descr, datetime, reward);
    // TODO: disable buttons here
    chrome.storage.sync.get(['taskList'], function(result) {
        result.taskList.push(task);
        chrome.storage.sync.set({'taskList': result.taskList}, function() {
            console.log('Added ' + task.name + ' to task list with id '+ task.taskID);
            // TODO: enable buttons here
        });
    });
}

window.onload = function () {
    let tasksubmit = document.getElementById("tasksubmit");
    tasksubmit.addEventListener("submit", handleTaskSubmit);
}