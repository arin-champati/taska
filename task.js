function handleTaskSubmit() {
    let name = document.getElementById("task");
    let descr = document.getElementById("task_description");
    let date = document.getElementById("date");
    let time = document.getElementById("time");
    let datetime = new Date(date + " " + time);
    let reward = parseFloat(document.getElementById("reward"));

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
    tasksubmit.addEventListener("click", handleTaskSubmit);
}