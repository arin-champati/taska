//
// Block sites
function handleTabChange(activeInfo) {
    chrome.tabs.query({'active':true,'currentWindow':true},function(array_of_tabs){//Gives details of the active tab in the current window.
        // alert(array_of_tabs[0].url);
        // get list of blocked sites from storage
        let currentUrl = array_of_tabs[0].url
        chrome.storage.sync.get(['blockList'], function(blockList) {
            // console.log('Value currently is ' + result.key);
            
          });
        // if url in blocked sites list, pass message to content (for blocking)
        if(blockList.includes(currentUrl))
        chrome.tabs.sendMessage(activeTab.id, {"blockLink": currentUrl});
})}

chrome.tabs.onActivated.addListener(handleTabChange);