  function start_working()
  {
  	var text = document.getElementById("working-button").value;
  	if (text == "Start working!") {
  		document.getElementById("working-button").value="Stop working!";
  	}
  	else {
  		document.getElementById("working-button").value="Start working!";
  	}
  };

  window.onload = function () {
    let working_button = document.getElementById("working-button");
	working_button.addEventListener("click", start_working);
}