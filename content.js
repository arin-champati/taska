console.log("CONTENT LOADED");

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      // block webpage content
        if(request.blockLink) {
          document.body.innerHTML = 
          `
          You have blocked this website for while you are working.

          Unblock this website, or click the "Stop Working!" button to continue usage.
          `;
        }
    }
  );