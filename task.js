function handleTaskSubmit() {
    let name = document.getElementById("task").value;
    let descr = document.getElementById("task_description").value;
    let date = document.getElementById("date").value;
    let time = document.getElementById("time").value;
    let datetime = new Date(date + " " + time);
    let reward = parseFloat(document.getElementById("reward").value);

    chrome.runtime.sendMessage({
        message: "addTask", 
        taskName: name, 
        taskDescription: descr,
        taskDateTime: datetime,
        taskReward: reward
    }, function(response) {
        console.log("Sent Task");
      });
}

window.onload = function () {
    let tasksubmit = document.getElementById("tasksubmit");
    tasksubmit.addEventListener("submit", handleTaskSubmit);
}