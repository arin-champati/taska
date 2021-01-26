//
// Block sites

function handleTabChange(activeInfo) {
    chrome.tabs.query({'active':true,'currentWindow':true},function(array_of_tabs){//Gives details of the active tab in the current window.
        // alert(array_of_tabs[0].url);
        // get list of blocked sites from storage
        let currentUrl = array_of_tabs[0].url;
        let blockList = ['youtube.com'];
        // chrome.storage.sync.get(['blockList'], function(blockList) {
            for (let i = 0; i < blockList.length; i++) {
                // if url in blocked sites list, pass message to content (for blocking)
                // alert ("Blocked: " + blockList[i]);
                if (currentUrl.includes(blockList[i])) {
                    // alert("Sending message");
                    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                        var activeTab = tabs[0];
                        chrome.tabs.sendMessage(activeTab.id, {"blockLink": currentUrl});
                });
            }
        }
        // });
    });
        
};

chrome.tabs.onActivated.addListener(handleTabChange);
chrome.tabs.onUpdated.addListener(handleTabChange);