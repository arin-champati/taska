console.log("CONTENT LOADED");

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      // block webpage content
        if(request.blockLink) {
          document.body.innerHTML = 
          `
          <h2>TASKA</h2>
          <p>Hello from the Taska Chrome Extension!</p>
          
          <p>You have blocked this website for while you are working.</p>

          <p>Unblock this website, or click the "Stop Working!" button to continue usage.</p>
          `;
        }
    }
  );