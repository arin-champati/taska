function startWorking() {
	var text = document.getElementById("working-button").value;
	if (text == "Start working!") {
		document.getElementById("working-button").value="Stop working!";
	}
	else {
		document.getElementById("working-button").value="Start working!";
	}
};

function fillTemplate(index, name, date, time, desc, reward) {
	return `<tr data-bs-toggle="collapse" href="#task-${index}" role="button" aria-expanded="false" aria-controls="task-${index}">
	                <td class="task-name">${name}</td>
	                <td class="task-date">${date}</td>
	                <td class="task-action no-collapse">
	                  <a class="bi bi-check-square"></a>
	                  <a class="bi bi-x"></a>
	                </td>
	                
	              </tr>

	              <tr>
	                <td class="collapse" id="task-${index}" colspan="3">
	                  
	                  <table class="table table-borderless table-secondary task-detailed-info">
	                    <tr>
	                      <td class="task-description">${desc}</td>
	                      <td class="task-date">${time}</td>
	                      <td class="task-action">${reward} PTS</td>
	                    </tr>  
	                  </table>

	                </td>
	              </tr>`
}

function updateTaskList(taskList) {
	let parent = document.getElementById("task-table");
	for (let i = 0; i < taskList.length; i++) {
		let task = taskList[i];
		let d = new Date(task.deadline);
		let date = (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
		let time = (d.getHours() % 12) + ":" + d.getMinutes() + " " + (d.getHours() / 12 == 0 ? "A" : "P" ) + "M";
		let current = fillTemplate(i, task.name, date, time, task.description, task.reward)
		parent.innerHTML += current;
	}
}

window.onload = function () {
	let working_button = document.getElementById("working-button");
	working_button.addEventListener("click", startWorking);

	chrome.storage.sync.get(['taskList'], function(result) {
		let taskList = result.taskList;
		updateTaskList(taskList);
	});
}