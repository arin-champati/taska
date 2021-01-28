function handleSettingsSubmit() {
    // Default values
    let sPoints = 15;
    let lPoints = 30;
    let sDuration = 15;
    let lDuration = 30;

    let sPointsInput = document.getElementById("sPoints");
    let lPointsInput = document.getElementById("lPoints");
    let sDurationInput = document.getElementById("sDuration");
    let lDurationInput = document.getElementById("lDuration");

    sPoints = sPointsInput.value ? sPointsInput.value : sPoints;
    lPoints = lPointsInput.value ? lPointsInput.value : lPoints;
    sDuration = sDurationInput.value ? sDurationInput.value : sDuration;
    lDuration = lDurationInput.value ? lDurationInput.value : lDuration;

    chrome.storage.sync.set({'sPoints': sPoints, 'lPoints': lPoints,
        'sDuration':sDuration, 'lDuration':lDuration}, function() {
        console.log('Updated settings');
    });
}

window.onload = function () {
    let submit = document.getElementById("settings-sub");
    submit.addEventListener("submit", handleSettingsSubmit);
}