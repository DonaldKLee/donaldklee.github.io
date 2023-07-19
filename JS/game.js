/* Storing user's device details in a variable*/
let details = navigator.userAgent;
      
/* Creating a regular expression
containing some mobile devices keywords
to search it in details string*/
let regexp = /android|iphone|kindle|ipad/i;

/* Using test() method to search regexp in details
it returns boolean value*/
let isMobileDevice = regexp.test(details);
if (isMobileDevice) {
    document.getElementById("gameStartButton").innerHTML = "This game is not compatible with mobile devices :(";
    document.getElementById("gameStartButton").disabled = true;
}



const gameHighScore = localStorage.getItem('gameHighScore');
if (gameHighScore) {
    document.getElementById("gameHighScore").innerHTML = gameHighScore;
}

// Runs when the game ends
function gameOver() {
    clearInterval(scoreInterval)
    clearInterval(obstaclesInterval)
    clearInterval(jobInterval)
    
    // render game over
    document.getElementById("gameOverText").style.visibility = "visible";
    document.getElementById("gameOverText").style.fontSize = "4em";

    // render character disappears
    document.getElementById("gameCharacter").style.transform = "rotate(270deg)";

    // Updates new high score
    // if current score is greater then high score
    if (parseInt(document.getElementById("gameScore").innerHTML) >= parseInt(document.getElementById("gameHighScore").innerHTML)) {
        localStorage.setItem('gameHighScore', document.getElementById("gameScore").innerHTML);  
    }

    // render replay button
    document.getElementById("gameStartButton").style.transform = "scale(1)";
    document.getElementById("gameStartButton").innerHTML = "Play Again!";
    // enables start button
    document.getElementById("gameStartButton").disabled = false;
}

// Runs every second when the game starts
function gameUpdateScore() {
    const gameScore = document.getElementById("gameScore");
    gameScore.innerHTML = parseInt(gameScore.innerHTML) + 1;

    // if current score is greater then high score
    if (parseInt(document.getElementById("gameScore").innerHTML) > parseInt(document.getElementById("gameHighScore").innerHTML)) {
        document.getElementById("gameHighScore").innerHTML = gameScore.innerHTML;
    }
}

function gameAddObstacles() {
    const screen = document.getElementById("gameScreen");
    const obstacle = document.createElement("span");
    // 70% of a ground obstacle
    // if (Math.random() <= 0.7) {
    if (Math.random() <= 0.7) {
        obstacle.classList.add("gameGroundObstacle")
    }
    else {
        obstacle.classList.add("gameAirObstacle")
    }
    // dark and light mode
    obstacle.classList.add("theme_text");
    // remove from child when it's out of the screen
    obstacle.addEventListener("animationend", function() {
		this.remove();
    });

    screen.appendChild(obstacle)
}

// maybe just use event listeners instead to prevent lag?
function gameJob() {
    const screen = document.getElementById("gameScreen");
    const character = document.getElementById("gameCharacter").getBoundingClientRect();
    for (let i=0; i < screen.children.length; i++) {
        const obstacle = screen.children[i].getBoundingClientRect()
        
        // Air obstacle
        if (
                screen.children[i].classList.contains("gameAirObstacle")
                && // x
                (parseFloat(obstacle.x) < parseFloat(character.x) && parseFloat(character.x) < (parseFloat(obstacle.x) + parseFloat(obstacle.width)))
                && // y
                (parseFloat(obstacle.y) + parseFloat(obstacle.height)/2 - 2.5 > parseFloat(character.y))
            ) {
                console.log("character in between obstacle")
                gameOver()
            }
        else if (
            screen.children[i].classList.contains("gameGroundObstacle")
            && // x
            (parseFloat(obstacle.x) < parseFloat(character.x) && parseFloat(character.x) < (parseFloat(obstacle.x) + parseFloat(obstacle.width)/2))
            && // y
            (parseFloat(obstacle.y) - parseFloat(obstacle.height) < parseFloat(character.y))
        ) {
            console.log("character in between obstacle")
            gameOver()
        }
    }
}

function startGame() {
    // disables start button to prevent running intervals multiple times
    document.getElementById("gameStartButton").disabled = true;
    // clear all existing obstacles
    const screen = document.getElementById("gameScreen");
    for (let i=0; i < screen.children.length; i++) {
        if (screen.children[i].classList.contains("gameAirObstacle") || screen.children[i].classList.contains("gameGroundObstacle")) {
            screen.children[i].remove()
            i--; // because we removed something, so we go back to previus index as it decreases
        }
    }
    document.getElementById("gameStartButton").style.transform = "scale(0)";
    // reset game
    document.getElementById("gameOverText").style.visibility = "hidden";
    document.getElementById("gameOverText").style.fontSize = "0em";
    // reset score
    gameScore.innerHTML = 0;

    document.getElementById("gameCharacter").style.transform = "rotate(0deg)";
    document.getElementById("body").addEventListener("keypress", function (event) {
        if (event.key.toLowerCase() === "a") {
            // Up
            document.getElementById("gameCharacter").style.top = "160px";
            document.getElementById("gameCharacter").style.transform = "rotate(0deg)";
            // After sometime, go back to starting position
            setTimeout (function () {
                document.getElementById("gameCharacter").style.top = "210px";
                document.getElementById("gameCharacter").style.transform = "rotate(0deg)";
            }, 250);
        }
        if (event.key.toLowerCase() === "d") {
            // Down
            document.getElementById("gameCharacter").style.transform = "rotate(75deg)";
            document.getElementById("gameCharacter").style.top = "240px";
            // After sometime, go back to starting position
            setTimeout (function () {
                document.getElementById("gameCharacter").style.top = "210px";
                document.getElementById("gameCharacter").style.transform = "rotate(0deg)";
            }, 250);
        }
    })
    // Add key listeners to character
    scoreInterval = setInterval(gameUpdateScore, 100);
    obstaclesInterval = setInterval(gameAddObstacles, 1200);
    // interval to clear obstacles out of bounds and check for hits
    jobInterval = setInterval(gameJob, 100);
}