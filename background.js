// Initialize block list
chrome.storage.sync.set({'blockList': []}, function() {
  console.log('Initialize block list');
});


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
                if (currentUrl.includes(blockList[i])) {
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
    chrome.storage.sync.get(['blockList'], function(result) {
        result.blockList.push(siteUrl)
      chrome.storage.sync.set({'blockList': result.blockList}, function() {
        console.log('Added ' + siteUrl + ' to block list');
      });
    });
}

addBlockSite("youtube.com");
