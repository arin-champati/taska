// toggle whether or not to block sites on button click
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


// template for displaying a task
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


// display the tasks currently on the task list
function updateTaskList(taskList) {
	let parent = document.getElementById("task-table");
	parent.innerHTML = "";
	for (let i = 0; i < taskList.length; i++) {
		let task = taskList[i];
		let d = new Date(task.deadline);
		let date = (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
		let time = (d.getHours() % 12) + ":" + (d.getMinutes() < 10 ? "0" : "") + 
			d.getMinutes() + " " + (d.getHours() / 12 == 0 ? "A" : "P" ) + "M";
		let current = fillTemplate(i, task.name, date, time, task.description, task.reward, task.taskID, task.complete)
		parent.innerHTML += current;
	}

	// Button handlers for complete task buttons
	let completes = document.getElementsByClassName("complete-task");
	for(let i = 0; i < completes.length; i++) {
		completes[i].addEventListener("click", handleTaskComplete);
	}

	// Button handlers for remove task buttons
	let deletes = document.getElementsByClassName("delete-task");
	for(let i = 0; i < deletes.length; i++) {
		deletes[i].addEventListener("click", handleTaskRemove);
	}
}


// handle successful completion of tasks
function handleTaskComplete() {
	// TODO: disable buttons temporarily
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
			
			// update displayed points
			let points_el = document.getElementById("points-total");
			points_el.innerHTML = "Current Points: " + (result.points + points);
			// update displayed tasklist
			updateTaskList(taskList);
		});
	});

}


// remove a task without completing it
function handleTaskRemove() {
	let taskID = this.parentNode.parentNode.id;
	chrome.storage.sync.get(['taskList'], function(result) {
        let index = -1;
        let taskList = result.taskList;
        for(let i = 0; i < taskList.length; i++) {
            if(taskList[i].taskID === taskID) {
                index = i;
                break;
            }
        }
        if(index != -1) {
            taskList.splice(index, 1);
            chrome.storage.sync.set({'taskList': taskList}, function() {
                console.log('Removed ' + taskID + ' from the task list');
                // Update displayed task list
                updateTaskList(taskList);
            });
        } else {
            alert("removing invalid task");
        }
    });
}


window.onload = function () {
	let working_button = document.getElementById("working-button");
	working_button.addEventListener("click", toggleWorking);

	chrome.storage.sync.get(['taskList', 'blockingEnabled', 'points'], function(result) {
		// display task list
		updateTaskList(result.taskList);

		// display current points
		let points = document.getElementById("points-total");
		points.innerHTML = "Current Points: " + result.points;

		let blockingEnabled = result.blockingEnabled;
		if (blockingEnabled) {
			document.getElementById("working-button").value="Stop working!";
		} else {
			document.getElementById("working-button").value="Start working!";
		}

	});

}