function handleBlockSubmit() {
    let site = document.getElementById("site");
    chrome.runtime.sendMessage({
        message: "addBlock", 
        blockSite: site, 
    }, function(response) {
        console.log("Sent block site");
      });
}

window.onload = function () {
    let blocksubmit = document.getElementById("blocksubmit");
    blocksubmit.addEventListener("click", handleBlockSubmit);
}