function handleBlockSubmit() {
    let site = document.getElementById("site").value;
    chrome.runtime.sendMessage({
        message: "addBlock", 
        blockSite: site, 
    }, function(response) {
        console.log("Sent block site");
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
        listItem.appendChild(removeButton);

        parent.appendChild(listItem);
    }

}

window.onload = function () {
    let blocksubmit = document.getElementById("blocksubmit");
    blocksubmit.addEventListener("submit", handleBlockSubmit);

    chrome.storage.sync.get(['blockList'], function(result) {
        let blockList = result.blockList;
        updateBlockList(blockList);
    });
}