console.log("CONTENT LOADED");

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      alert("RECEIVED MESSAGE");
      alert(request);
      // block webpage content
        if(request.blockLink) {
            document.body.innerHTML = "";
        }
    }
  );