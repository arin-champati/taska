// Initialize block list
chrome.storage.sync.get(['blockList'], function(result) {
    if (!result.blockList) {
        chrome.storage.sync.set({'blockList': []}, function() {
            console.log('Initialize block list');
        });
    }
});


// Initialize task list
chrome.storage.sync.get(['taskList'], function(result) {
    if (!result.taskList) {
        chrome.storage.sync.set({'taskList': []}, function() {
            console.log('Initialize task list');
        });
    }
});

function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }

// overall points by user
let points = 10;

// whether or not to enable blocking
let blockingEnabled = true;

class Task {
    constructor(name, description, deadline, reward) {
        this.taskID = uuidv4();
        this.name = name;
        this.description = description;
        this.deadline = deadline;
        this.reward = reward;
        this.complete = false
    }

    // check if deadline has passed
    pastDeadline() {
        return Date.now() > this.deadline;
    }

    // finish the task
    completeTask() {
        this.complete = true;
        points += this.reward;
    }
}

// toString for debugging purposes
Task.prototype.toString = function() {
    return this.name;
}

// Block sites
function handleTabChange(activeInfo) {
    // Gives details of the active tab in the current window.
    chrome.tabs.query({'active':true,'currentWindow':true},function(array_of_tabs){
        // get list of blocked sites from storage
        let currentUrl = array_of_tabs[0].url;
        chrome.storage.sync.get(['blockList'], function(result) {
            let blockList = result.blockList;
            for (let i = 0; i < blockList.length; i++) {
                // if url in blocked sites list, pass message to content (for blocking)
                if (currentUrl.includes(blockList[i]) && blockingEnabled) {
                    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                        var activeTab = tabs[0];
                        chrome.tabs.sendMessage(activeTab.id, {"blockLink": currentUrl});
                    });
                }
            }
        });
    });
}

chrome.tabs.onActivated.addListener(handleTabChange);
chrome.tabs.onUpdated.addListener(handleTabChange);

// Add site to block list
function addBlockSite(siteUrl) {
    // disable buttons here
    chrome.storage.sync.get(['blockList'], function(result) {
        result.blockList.push(siteUrl);
        chrome.storage.sync.set({'blockList': result.blockList}, function() {
            console.log('Added ' + siteUrl + ' to block list');
            // enable buttons here
        });
    });
}

// removes a site from the block list
function removeBlockSite(siteUrl) {
    chrome.storage.sync.get(['blockList'], function(result) {
        let index = -1;
        let blockList = result.blockList;
        for(let i = 0; i < blockList.length; i++) {
            if(blockList[i] === siteUrl) {
                index = i;
                break;
            }
        }
        if(index != -1) {
            blockList.splice(index, 1);
            chrome.storage.sync.set({'blockList': blockList}, function() {
                alert('Removed ' + siteUrl + ' from the block list');
            });
        } else {
            alert("removing invalid task");
        }
    });
}

// adds a task to the task list
// returns the uuid of the task
function addTask(taskName, taskDescription, taskDeadline, taskReward) {
    // disable buttons here
    let task = new Task(taskName, taskDescription, taskDeadline, taskReward);
    chrome.storage.sync.get(['taskList'], function(result) {
        result.taskList.push(task);
        chrome.storage.sync.set({'taskList': result.taskList}, function() {
            console.log('Added ' + task.name + ' to task list with id '+ task.taskID);
            // enable buttons here
        });
    });
    return task.taskID;
}

// removes a task from the task list by uuid
function removeTask(taskID) {
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
                alert('Removed ' + taskID + ' from the task list');
            });
        } else {
            alert("removing invalid task");
        }
    });
}

// spend points to unblock all the sites
// temporarily equate 1 point to 1 minute
// I have no idea if this works
function unblockSites(cost) {
    if (points < cost) {
        alert("Not enough points, " + (cost - points) + " more required")
    } else {
        points -= cost;
        blockingEnabled = false;
        setTimeout(blockSites, 1000*60*cost);
    }
}

// block sites again
function blockSites() {
    blockingEnabled = true;
}


// test site to block
addBlockSite("youtube.com");

// test unblocking sites
unblockSites(0.5);

// // test task
// let id = addTask("testTask", "test description", Date.now(), 12);
// // weird async shit
// function wrapper() {
//     addTask("testTask2", "test description", Date.now(), 13);
// }
// setTimeout(wrapper, 1000);

// function wrapper2() {
//     removeTask(id)
// }
// setTimeout(wrapper2, 1000);
