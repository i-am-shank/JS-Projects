// Initialisation -----------------------------

// Setting canvas-dimensions
var canvas = document.getElementById("mycanvas");
var height = document.height,
    width = document.width;
var W = (canvas.width = 750);
var H = (canvas.height = 650);
var cellSize = 37;
// Creating canvas.context
var pen = canvas.getContext("2d");
var gameOver = true;
var gamePlayed = false;
var score = 0;
var score1 = document.getElementsByClassName("score")[0];

// Buttons
var startBtn = document.getElementsByClassName("start-btn")[0];
var upBtn = document.getElementsByClassName("up-btn")[0];
var leftBtn = document.getElementsByClassName("left-btn")[0];
var rightBtn = document.getElementsByClassName("right-btn")[0];
var downBtn = document.getElementsByClassName("down-btn")[0];

// Game Initialisation -----------------------------

function init() {
    // Create the food object
    food = getRandomFood();

    // Create the snake object
    snake = {
        initLen: 5,
        color: "green",
        cells: [],
        direction: "right",

        createSnake: function () {
            // Initialise the snake.cells-array
            for (var i = this.initLen; i > 0; i--) {
                this.cells.push({
                    x: i,
                    y: 0,
                });
            }
        },

        drawSnake: function () {
            // Define snake's color
            pen.fillStyle = this.color;

            // Fill all the cells inside snake.cells-array
            snake.cells.forEach((cell) => {
                pen.fillRect(
                    cell.x * cellSize,
                    cell.y * cellSize,
                    cellSize - 2,
                    cellSize - 2
                );
            });
        },

        updateSnake: function () {
            // console.log("Updating snake");

            var headX = this.cells[0].x;
            var headY = this.cells[0].y;

            // Also check if snake has eaten food, if yes then just don't pop out the tail & the head-addition step is as it is.

            // console.log(headX, food.x, headY, food.y);

            if (headX === food.x && headY === food.y) {
                console.log("Food eaten");

                // Increase & update score
                score += 10;
                score1.innerText = score;

                // Also after food eaten, generate a new food object.
                food = getRandomFood();
            } else {
                // Remove the last entry(tail of snake) from snake.cell[]
                this.cells.pop();
            }

            // & add a new entry in snake.cell[] beginning, in front of head
            var nextX, nextY;

            // console.log("Here to update direction");
            // Update according to the direction property
            if (this.direction == "right") {
                // console.log("r");
                // As have to move +1 in x-dir from head
                nextX = headX + 1;
                nextY = headY;
            } else if (this.direction == "left") {
                // console.log("l");
                nextX = headX - 1;
                nextY = headY;
            } else if (this.direction == "up") {
                // console.log("u");
                nextX = headX;
                nextY = headY - 1;
            } else {
                // "down" direction
                // console.log("d");
                nextX = headX;
                nextY = headY + 1;
            }

            // Update the new heading
            this.cells.unshift({
                x: nextX,
                y: nextY,
            });
            // console.log(headX, headY, " ", nextX, nextY);

            // Game-over conditions :-
            // 1. Boundary wall hit
            // 2. Snake bitten itself (except head, 0th index)
            var check1 =
                nextX < 0 ||
                nextY < 0 ||
                nextX * cellSize > W - cellSize ||
                nextY * cellSize > H;

            var check2 = false;
            for (var i = 1; i < snake.cells.length; i++) {
                var cell = snake.cells[i];
                if (cell.x == nextX && cell.y == nextY) {
                    check2 = true;
                    break;
                }
            }
            if (check1 || check2) {
                // console.log("gameOver -> true");
                gameOver = true;
                gamePlayed = true;
            }
        },
    };

    snake.createSnake();

    function keyPressed(e) {
        // console.log(e.key);
        // If direction changed --> update direction
        //     (if not the opposite direction)
        if (
            (snake.direction == "left" && e.key === "ArrowRight") ||
            (snake.direction == "right" && e.key === "ArrowLeft") ||
            (snake.direction == "up" && e.key === "ArrowDown") ||
            (snake.direction == "down" && e.key === "ArrowUp")
        ) {
            // console.log(this.direction, " ~~~ ", e.key);
            // Opposite direction instructions
            return; // Don't do anything
        }
        if (e.key == "ArrowRight") {
            snake.direction = "right";
        } else if (e.key == "ArrowLeft") {
            snake.direction = "left";
        } else if (e.key == "ArrowUp") {
            snake.direction = "up";
        } else if (e.key == "ArrowDown") {
            snake.direction = "down";
        } else if (e.key == "Enter") {
            startGame();
        }
        // console.log(this.direction);
    }

    function moveUp() {
        if (snake.direction == "down") {
            // can't move in opposite direction
            return;
        }
        snake.direction = "up";
    }

    function moveLeft() {
        if (snake.direction == "right") {
            return;
        }
        snake.direction = "left";
    }

    function moveRight() {
        if (snake.direction == "left") {
            return;
        }
        snake.direction = "right";
    }

    function moveDown() {
        if (snake.direction == "up") {
            return;
        }
        snake.direction = "down";
    }

    function startGame() {
        if (gameOver == true) {
            // restarting variable set
            gameOver = false;
            // Reset the snake's position
            while (snake.cells.length > 0) {
                snake.cells.pop();
            }
            snake.createSnake();
            // also reset the direction to "right"
            snake.direction = "right";
            // Then execute following setInterval for game-looping
            gameVar = setInterval(gameLoop, 100);
            // console.log("start-game");
        } else {
            // Game already happening
            return;
        }
    }

    // Add an Event Listener --> to "keydown"-event.
    document.addEventListener("keydown", keyPressed);

    // Add Event Listeners --> to "arrow"-btns
    upBtn.addEventListener("click", moveUp);
    leftBtn.addEventListener("click", moveLeft);
    rightBtn.addEventListener("click", moveRight);
    downBtn.addEventListener("click", moveDown);

    // Add Event Listeners --> to "startBtn"
    startBtn.addEventListener("click", startGame);
}

// Drawing shapes -----------------------------

function draw() {
    pen.clearRect(0, 0, W, H);
    snake.drawSnake();

    // Also draw the food
    pen.fillStyle = food.color;
    pen.fillRect(
        food.x * cellSize,
        food.y * cellSize,
        cellSize - 2,
        cellSize - 2
    );
}

// Updating shape-positions -------------------

function update() {
    snake.updateSnake();
}

// Getting random-food ----------------------

function getRandomFood() {
    // generate random x,y-coordinates of food
    // x-coordinate in range [0, (W-cellSize)]
    // dividing by cellSize & rounding => matching with head-coord. could be easy.
    // (else hundreds of random-nos. possible.. difficult to check if snake has eaten the food)
    var foodX = Math.round((Math.random() * (W - 1 - cellSize)) / cellSize);
    var foodY = Math.round((0.9999 * (H - cellSize)) / cellSize);
    // console.log("foodX = ", foodX, "foodY = ", foodY);

    // Creating food object :----
    var food = {
        x: foodX,
        y: foodY,
        color: "brown",
    };
    return food;
}

// Game loop ==============================

function gameLoop() {
    draw();
    update();
    // console.log(gameOver);
    if (gameOver == true) {
        clearInterval(gameVar);
        if (gamePlayed == true) {
            pen.font = "50px Arial";
            pen.fillStyle = "red";
            pen.fillText("--- GAME OVER ---", 145, 325);
        } else {
            pen.font = "55px Roboto";
            pen.fillStyle = "orange";
            pen.fillText("START PLAYING !!", 145, 225);
        }
    } else {
        // Game is being played
        // Change the start-button's text
        startBtn.innerText = "Restart Game";
    }
}

// =========================================
//          Function Calls :-
// =========================================

init();

var gameVar = setInterval(gameLoop, 100);
