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

function handleBlockSubmit() {
    let site = document.getElementById("site");
    chrome.runtime.sendMessage({
        message: "addBlock", 
        blockSite: site, 
    }, function(response) {
        console.log("Sent block site");
      });
}

window.onload = function () {
    let tasksubmit = document.getElementById("tasksubmit");
    tasksubmit.addEventListener("click", handleTaskSubmit);
    let blocksubmit = document.getElementById("blocksubmit");
    blocksubmit.addEventListener("click", handleTaskSubmit);
}