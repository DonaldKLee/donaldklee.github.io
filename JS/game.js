// Runs every second when the game starts
function gameUpdateScore() {
    const gameScore = document.getElementById("gameScore");
    gameScore.innerHTML = parseInt(gameScore.innerHTML) + 1;
}

function gameAddObstacles() {
    const screen = document.getElementById("gameScreen");
    const obstacle = document.createElement("span");
    // 70% of a ground obstacle
    if (Math.random() <= 0.7) {
        obstacle.classList.add("gameGroundObstacle")
        // obstacle.style.width = Math.floor((Math.random() * 100) + 20)+ "px";
        // obstacle.style.width = "30px";
    }
    else {
        obstacle.classList.add("gameAirObstacle")
        // obstacle.style.width = "30px";
    }
    // dark and light mode
    obstacle.classList.add("theme_text");
    // add animation for obstacle to move left

    // remove from child when it's out of the screen

    screen.appendChild(obstacle)
}

function startGame() {
    document.getElementById("body").addEventListener("keypress", function (event) {
        if (event.key.toLowerCase() === "a") {
            // Up
            document.getElementById("gameCharacter").style.top = "160px";
            document.getElementById("gameCharacter").style.transform = "rotate(0deg)";
            // After sometime, go back to starting position
            // document.getElementById("gameCharacter").style.top = "210px";
        }
        if (event.key.toLowerCase() === "d") {
            // Down
            document.getElementById("gameCharacter").style.transform = "rotate(70deg)";
            document.getElementById("gameCharacter").style.top = "220px";
            // After sometime, go back to starting position
            // document.getElementById("gameCharacter").style.top = "210px";
        }
    })
    // Add key listeners to character
    const score = setInterval(gameUpdateScore, 100)
    const obstacles = setInterval(gameAddObstacles, 1200)
    // interval to clear obstacles out of bounds?

    // When game ends, clear interval
    // clearInterval(gameplay)
}

// Make this a button click event
startGame()