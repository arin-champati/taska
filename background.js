chrome.runtime.onInstalled.addListener(function() {
    // Initialize block list
    chrome.storage.sync.set({'blockList': []}, function() {
        console.log('Initialize block list');
    });
    // Initialize task list
    chrome.storage.sync.set({'taskList': []}, function() {
        console.log('Initialize task list');
    });
    // Initialize points for user
    chrome.storage.sync.set({'points': 0}, function() {
        console.log('Initialized points to 0');
    });
    // Disable blocking on startup
    chrome.storage.sync.set({'blockingEnabled': false}, function() {
        console.log('Set blockingEnabled to false');
    });
    // Initialize settings
    // Default values
    let sPoints = 15;
    let lPoints = 30;
    let sDuration = 15;
    let lDuration = 30;
    chrome.storage.sync.set({'sPoints': sPoints, 'lPoints': lPoints,
    'sDuration':sDuration, 'lDuration':lDuration}, function() {
    console.log('Updated settings');
});
});



// Block sites
function handleTabChange(activeInfo) {
    // Gives details of the active tab in the current window.
    chrome.storage.sync.get(['blockingEnabled'], function(blockingResult) {
        chrome.tabs.query({'active':true,'currentWindow':true},function(array_of_tabs){
            // get list of blocked sites from storage
            let currentUrl = array_of_tabs[0].url;
            chrome.storage.sync.get(['blockList'], function(result) {
                let blockList = result.blockList;
                for (let i = 0; i < blockList.length; i++) {
                    // if url in blocked sites list, pass message to content (for blocking)
                    if (currentUrl.includes(blockList[i]) && blockingResult.blockingEnabled) {
                        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                            var activeTab = tabs[0];
                            chrome.tabs.sendMessage(activeTab.id, {"blockLink": currentUrl});
                        });
                    }
                }
            });
        });
    });
}

chrome.tabs.onActivated.addListener(handleTabChange);
chrome.tabs.onUpdated.addListener(handleTabChange);


// spend points to unblock all the sites
// temporarily equate 1 point to 1 minute
function unblockSites(time_limit) {
    chrome.storage.sync.get(['points'], function(result) {
        let points = result.points;
        if (time_limit && points == 0) {
            return;
        }

        chrome.storage.sync.set({'blockingEnabled': false}, function() {
            console.log('Set blockingEnabled to false');
        });

        if (time_limit) {
            setTimeout(blockSites, 1000*60*points);
            chrome.storage.sync.set({'points': 0}, function() {
                console.log('Set points to 0');
            });
            alert("Blocking disabled for " + points + " minutes")
        }
    });
}

// block sites again
function blockSites() {
    chrome.storage.sync.set({'blockingEnabled': true}, function() {
        console.log('Set blockingEnabled to true');
    });
}


// Receive request to add task
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message == "startBlocking") {
            blockSites();
        } else if (request.message == "override") {
            unblockSites(false);
        } else if (request.message == "stopBlocking") {
            unblockSites(true)
        }
        sendResponse({})
    }
    );