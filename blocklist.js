// TODO: make this work
var buttonsEnabled = true;

// add site to block list
function handleBlockSubmit() {
    let site = document.getElementById("site").value;
    // TODO: disable buttons here
    chrome.storage.sync.get(['blockList'], function(result) {
        result.blockList.push(site);
        chrome.storage.sync.set({'blockList': result.blockList}, function() {
            console.log('Added ' + site + ' to block list');
            // TODO: enable buttons here
        });
    });
}

// remove site from blocklist by url
function handleBlockRemove() {
    let site = this.parentNode.childNodes[0].nodeValue;
    chrome.storage.sync.get(['blockList'], function(result) {
        let index = -1;
        let blockList = result.blockList;
        for(let i = 0; i < blockList.length; i++) {
            if(blockList[i] === site) {
                index = i;
                break;
            }
        }
        if(index != -1) {
            blockList.splice(index, 1);
            chrome.storage.sync.set({'blockList': blockList}, function() {
                console.log('Removed ' + site + ' from the block list');
            });

            // update displayed block list
            location.reload();
        } else {
            console.log("removing invalid task");
        }
    });
}

function updateBlockList(siteList) {
    let parent = document.getElementById("site-list");
    for (let i = 0; i < siteList.length; i++) {
        let siteUrl = siteList[i];
        let listItem = document.createElement("li");
        listItem.innerText = siteUrl;
        listItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
        
        let removeButton = document.createElement("button");
        removeButton.classList.add("btn", "btn-sm", "btn-danger");
        removeButton.innerText = "Remove";
        removeButton.addEventListener("click", handleBlockRemove);

        listItem.appendChild(removeButton);

        parent.appendChild(listItem);
    }

}

window.onload = function () {
    let blocksubmit = document.getElementById("blocksubmit");
    blocksubmit.addEventListener("submit", handleBlockSubmit);


    chrome.storage.sync.get(['blockList'], function(result) {
        updateBlockList(result.blockList);
        console.log("Blocklist loaded")
    });
}