function toggleWorking() {
	chrome.storage.sync.get(['blockingEnabled'], function(result) {
		let blockingEnabled = result.blockingEnabled;
		if(!blockingEnabled) {
			document.getElementById("working-button").value="Stop working!";
			chrome.runtime.sendMessage({
			    message: "startBlocking", 
			}, function(response) {
			    console.log("Sent start blocking");
			});
		}
		else {
			document.getElementById("working-button").value="Start working!";
			// send message to stop blocking
			chrome.runtime.sendMessage({
			    message: "stopBlocking", 
			}, function(response) {
			    console.log("Sent stop blocking");
			});
		}
	});
}

// ${complete ? `` : `<a class="bi bi-check-square complete-task dark-icon" role="button"></a>`}

function fillTemplate(index, name, date, time, desc, reward, task_id, complete) {
	return `<tr id="${task_id}">
	                <td class="task-name ${complete ? 'task-complete' : ''}" data-bs-toggle="collapse" href="#task-${index}" role="button" aria-expanded="false" aria-controls="task-${index}">${name}</td>
	                <td class="task-date" data-bs-toggle="collapse" href="#task-${index}" role="button" aria-expanded="false" aria-controls="task-${index}">${date}</td>
	                <td class="task-action no-collapse">
	                  <input class="complete-task" type='checkbox' ${complete ? 'checked' : ''}></input>
	                  <a class="bi bi-x delete-task" role="button"></a>
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
		let time = (d.getHours() % 12) + ":" + (d.getMinutes() < 10 ? "0" : "") + 
			d.getMinutes() + " " + (d.getHours() / 12 == 0 ? "A" : "P" ) + "M";
		let current = fillTemplate(i, task.name, date, time, task.description, task.reward, task.taskID, task.complete)
		parent.innerHTML += current;
	}
}

function updatePoints(value) {
	let points = document.getElementById("points-total");
	points.innerHTML = "Lifetime Points: " + value;
}

function handleTaskComplete() {
	let task_id = this.parentNode.parentNode.id;
	let points = 0;
	chrome.storage.sync.get(['points', 'taskList'], function(result) {
		let taskList = result.taskList;
		for (let i = 0; i < taskList.length; i++) {
			if (taskList[i].taskID === task_id) {
				points = (taskList[i].complete ? -1 : 1) * taskList[i].reward;
				taskList[i].complete = !taskList[i].complete;
				break;
			}
		}
		chrome.storage.sync.set({'points': result.points + points, 'taskList': taskList}, function() {
			console.log("Increased points by " + points);
			updatePoints(result.points + points);
			location.reload();
		});
	});

}

function handleTaskRemove() {
	let task_id = this.parentNode.parentNode.id;
	chrome.runtime.sendMessage({
	    message: "removeTask", 
	    removeTask: task_id, 
	}, function(response) {
	    console.log("Sent remove task");
	    location.reload()
	});
}

window.onload = function () {
	let working_button = document.getElementById("working-button");
	working_button.addEventListener("click", toggleWorking);

	chrome.storage.sync.get(['taskList', 'blockingEnabled', 'points'], function(result) {
		let taskList = result.taskList;
		updateTaskList(taskList);

		updatePoints(result.points);

		let blockingEnabled = result.blockingEnabled;
		if (blockingEnabled) {
			document.getElementById("working-button").value="Stop working!";
		} else {
			document.getElementById("working-button").value="Start working!";
		}

		let completes = document.getElementsByClassName("complete-task");
		for(let i = 0; i < completes.length; i++) {
			completes[i].addEventListener("click", handleTaskComplete);
		}

		let deletes = document.getElementsByClassName("delete-task");
		for(let i = 0; i < deletes.length; i++) {
			deletes[i].addEventListener("click", handleTaskRemove);
		}
	});

}