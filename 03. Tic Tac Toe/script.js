// Access elements ----------------------------

// Current Player info :-
const gameInfo = document.querySelector(".game-info");

// boxes :-
const boxes = document.querySelectorAll(".box");

// new game button :-
const newGameBtn = document.querySelector(".btn");


// Variables needed -----------------------------

//   1. current-player (default -> x)
let currentPlayer;
//   2. grid (array) (default -> empty array)
let gameGrid;
//   3. winning positions
//      (3 in x-direction , 3 in y-direction, 2 diagonal)
const winPositions = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
];


// Initialise game ------------------------------

//   Current Player - X , empty grid , new-game btn hidden
function initGame() {
    currentPlayer = "X";
    // Also set content at UI
    gameInfo.innerText = `Current Player - ${currentPlayer}`;
    // Update array with empty values
    gameGrid = ["", "", "", "", "", "", "", "", ""];
    // Also update UI --> empty boxes & cursor-pointer
    boxes.forEach((box) => {
        box.innerText = "";
        box.classList.remove("win");
        box.style.pointerEvents = "all";
    });
    // Also hide the new-game button
    newGameBtn.classList.remove("active");
}

initGame(); // call as page-loads


// Add Event Listeners --------------------------

boxes.forEach((box, index) => {
    box.addEventListener("click", ()=> {
        handleClick(index);
        // Sending index, as 2-cases possible
        //   1. Click on an empty box
        //   2. Click on an occupied box
    })
});


function handleClick(index) {
    // If empty box  -->  add X or O (as per user)
    if(gameGrid[index] === "") {
        // Mark box on UI
        boxes[index].innerHTML = currentPlayer;
        // Also, remove cursor pointer from this box
        boxes[index].style.pointerEvents = "none";
        // After that, mark that box occupied
        gameGrid[index] = currentPlayer;
        // Finally, check if game ends
        var check = checkGameOver();
        if(check === false) {
            // Switch currentPlayer after each-turn
            // Also, show it on UI
            switchPlayer();
        }
        // Else, no need to swith player
        // Just pause screen here, waiting for user-action
    }
    else {
        // Else  -->  Do nothing (just return)
        return;
    }
}


// Swaps between 2-players --------------------

function switchPlayer() {
    // Switch currentPlayer variable's value
    if(currentPlayer === "X") {
        currentPlayer = "O";
    }
    else {
        currentPlayer = "X";
    }
    // Also update currentPlayer on UI
    gameInfo.innerText = `Current Player - ${currentPlayer}`;
}


// Check if Game ends ----------------------

function checkGameOver() {
    for(var i=0; i<winPositions.length; i++) {
        // Check for each win-position
        var gameEnd = true;
        var mark1 = gameGrid[winPositions[i][0]];
        if(mark1 === "") {
            continue; // next iteration
        }
        for(var j=0; j<winPositions[i].length; j++) {
            if(gameGrid[winPositions[i][j]] === "") {
                // Empty box
                gameEnd = false;
                break;
            }
            else if(gameGrid[winPositions[i][j]] !== mark1) {
                gameEnd = false;
                break;
            }
        }
        if(gameEnd === true) {
            // A winPositions[i] found completely filled
            // mark this position --> green
            makeBoxesGreen(winPositions[i]);
            // Also start showing new game btn
            newGameBtn.classList.add("active");
            // Also update game-info at top
            gameInfo.innerText = `Winner Player - ${currentPlayer}`;
            // Also disable clicking remaining empty positions
            boxes.forEach((box) => {
                if(box.innerText === "") {
                    box.style.pointerEvents = "none";
                }
            })
            return true;
        }
    }
    // Check if game --> Draw ?
    var count = 0;
    for(var i=0; i<9; i++) {
        count += (gameGrid[i] === "");
    }
    if(count === 0) {
        // No empty grid remaining
        // And also, no winner till here
        // Show game tied on UI
        gameInfo.innerText = `Game Tied !`;
        // Start showing new-game button
        newGameBtn.classList.add("active");
        return true; // as game ends :)
    }
    // If reached here --> means game hasn't ended
    return false; // Do nothing, just continue game
}


function makeBoxesGreen(winPosition) {
    winPosition.forEach((index) => {
        boxes[index].classList.add("win");
    })
}


// New-game button  -->  initializes game

newGameBtn.addEventListener("click", initGame);