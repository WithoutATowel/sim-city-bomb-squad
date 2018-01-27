var totalTime = 30;
var timeRemaining = 0;
var gameOver = false;
var wiresToCut = [];
var snd = null;
var success = null;

var delay = null;
var timer = null;

var wiresCut = {
	blue : false,
	green : false,
	red : false,
	white : false,
	yellow : false
}

function checkForWin() {
	return wiresToCut.length > 0 ? false : true;
}

function endGame(win) {
	gameOver = true;
	clearTimeout(delay);
	clearInterval(timer);
	if (win) {
		console.log("You saved the city!");
		document.getElementsByClassName("timerbox")[0].style.color = "green";
		snd = new Audio("sounds/CrowdYay.wav");
		success = new Audio("sounds/success.ogg"); 
		snd.play();
		success.play();
	} else {
		console.log("BOOM!!!");
		document.body.classList.remove("unexploded");
		document.body.classList.add("exploded");
		snd = new Audio("sounds/BldgExplode.wav");
		snd.play();
	}
}

function detonate() {
	endGame(false);
}

function cutWire() {
	if (!wiresCut[this.id] && !gameOver) {
		this.src = "img/cut-" + this.id + "-wire.png";
		wiresCut[this.id] = true;
		snd = new Audio("sounds/Electricity.wav"); 
		snd.play()
		var wireIndex = wiresToCut.indexOf(this.id);
		if (wireIndex > -1) {
			wiresToCut.splice(wireIndex, 1);
			if(checkForWin()) {
				endGame(true);
			}
		} else {
			delay = setTimeout(detonate, 750);
		}
	}
}

function reset() {
	var wireImages = document.getElementsByClassName('imagebox')[0].children;
	for (var i = 0; i < wireImages.length; i++) {
		wireImages[i].src = "img/uncut-" + wireImages[i].id + "-wire.png";
	}
	document.body.classList.remove("exploded");
	document.body.classList.add("unexploded");
	document.getElementsByClassName("timerbox")[0].style.color = "red";
	wiresCut = {
		blue : false,
		green : false,
		red : false,
		white : false,
		yellow : false
	};
	gameOver = false;
	success.pause();
	snd.pause();
	initGame();
}

function updateClock() {
	timeRemaining--;
	if (timeRemaining > 0) {
		timeString = (timeRemaining / 100) > 10 ? (timeRemaining / 100).toFixed(2) : "0" + (timeRemaining / 100).toFixed(2);
		document.querySelector(".timerbox p").innerText = "0:00:" + timeString;	
	} else {
		detonate();
	}	
}

function initGame() {
	timeRemaining = totalTime * 100;
	var allColors = Object.keys(wiresCut);

	wiresToCut = allColors.filter(function(index) {
		var rand = Math.random();
		if (rand > 0.5) {
			return true;
		} else {
			return false;
		}
	});
	console.log(wiresToCut);
	timer = setInterval(updateClock, 10)
	snd = new Audio("sounds/Siren.wav"); 
	snd.play()
}

document.addEventListener("DOMContentLoaded", function() {
	document.getElementById("blue").addEventListener("click", cutWire);
	document.getElementById("green").addEventListener("click", cutWire);
	document.getElementById("red").addEventListener("click", cutWire);
	document.getElementById("white").addEventListener("click", cutWire);
	document.getElementById("yellow").addEventListener("click", cutWire);
	document.getElementById("reset").addEventListener("click", reset);
});

initGame()

