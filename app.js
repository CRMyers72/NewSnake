const gameBoard = document.getElementById("board");
let startButton = document.createElement("button");
startButton.innerHTML = "Start Game!";

let snakeToolbar = document.getElementById("snakeToolbar");
snakeToolbar.appendChild(startButton)[0];

let snake = [
  { x: 10, y: 5 },
  { x: 11, y: 5 },
];
let newSnakeSegment = 0;

let apple = document.createElement("div");
apple.classList.add("apple");
//was going to use this to have difficulty option. Leaving in to add later
let snakeDifficulty = 3;

let scoreDisplay = document.createElement("div");
scoreDisplay.id = "scoreDisplay";
let score = 0;
scoreDisplay.innerHTML = "Current Score: " + score;

let previousScore = 0;
let previousScoreDisplay = document.createElement("div");
previousScoreDisplay.id = "scoreDisplay";
previousScoreDisplay.innerHTML = "Last Score: " + previousScore;

let highScore = 0;
let highScoreDisplay = document.createElement("div");
highScoreDisplay.id = "scoreDisplay";
highScoreDisplay.innerHTML = "Highscore: " + highScore;

let userDirection = { x: 0, y: 0 };
let lastDirection = { x: 0, y: 0 };
lastDirection = userDirection;

let randomXCoord = createRandomX();
let randomYCoord = createRandomY();
let appleGridPoint = [{ x: createRandomX(), y: createRandomY() }];

growthAmount = 1;

let renderLoop = null;
//Functions for different grid data
//Function to limit game to grid borders
function checkBoundry(gameBoard) {
  if (snake[0].x < 1 || snake[0].x > 20 || snake[0].y < 1 || snake[0].y > 20) {
    return true;
  } else {
    return false;
  }
}

function createRandomX() {
  let randomXCoord = Math.floor(Math.random() * 20) + 1;
  return randomXCoord;
}
function createRandomY() {
  let randomYCoord = Math.floor(Math.random() * 20) + 1;
  return randomYCoord;
}

//Functions for accepting key input
window.addEventListener("keydown", function (event) {
  switch (event.key) {
    case "ArrowDown":
      if (userDirection.y == -1) {
        break;
      }
      userDirection.x = 0;
      userDirection.y = 1;
      break;
    case "ArrowUp":
      if (userDirection.y == 1) {
        break;
      }
      userDirection.x = 0;
      userDirection.y = -1;
      break;
    case "ArrowRight":
      if (userDirection.x == -1) {
        break;
      }
      userDirection.x = 1;
      userDirection.y = 0;
      break;
    case "ArrowLeft":
      if (userDirection.x == 1) {
        break;
      }
      userDirection.x = -1;
      userDirection.y = 0;
      break;
  }
});
//Update Loop - move snake or update state of board
function updateState() {
  //adds a tail to the snake after the snake eats
  addSnakeSegment();
  //movement
  // console.log(userDirection);
  // console.log(snake[0]);

  moveSnake();
  updateApple();
  if (checkBoundry(gameBoard)) {
    gameOver();
  }
  if (userDirection.x !== 0 || userDirection.y !== 0) {
    if (checkBite(gameBoard)) {
      gameOver();
    }
  }
}
let scoreUpdate = () => {
  score = snake.length - 1;
  scoreDisplay.innerHTML = "Current Score: " + score;
};

function updateApple() {
  if (snakeEats(appleGridPoint[0])) {
    //expand snake function
    snakeGrows(growthAmount);
    scoreUpdate();
    appleGridPoint = [{ x: createRandomX(), y: createRandomY() }];
  }
}

//Below this are functions for snake gameplay
function snakeGrows(number) {
  return (newSnakeSegment += number);
}
function gameOver() {
  clearInterval(renderLoop);
  userDirection = { x: 0, y: 0 };
  scoreKeeper();
  let restartButton = window.confirm(
    "Game over! Your score was " + score + " Press OK to play again!"
  );
  if (restartButton) {
    restartGame();
  } else {
    window.alert("GoodBye!");
  }
}
function addSnakeSegment() {
  for (let i = 0; i < newSnakeSegment; i++) {
    snake.push({ ...snake[snake.length - 1] });
  }
  newSnakeSegment = 0;
}
function moveSnake() {
  for (let i = snake.length - 2; i >= 0; i--) {
    snake[i + 1] = { ...snake[i] };
  }
  snake[0].x += userDirection.x;
  snake[0].y += userDirection.y;
}

function appleRelocate() {
  createRandomX();
  createRandomY();
  renderApple();
}
function increaseScore() {
  score += 1;
}
// Draw Loop
function renderState() {
  gameBoard.innerHTML = "";
  renderSnake(gameBoard);
  renderApple(gameBoard);
}
//Below this line are functions for snake building
//Render snake on board
function renderSnake() {
  snake.forEach((bodyPiece) => {
    const snakeSegment = document.createElement("div");
    snakeSegment.classList.add("snake");
    snakeSegment.style.gridRowStart = bodyPiece.y;
    snakeSegment.style.gridColumnStart = bodyPiece.x;
    gameBoard.appendChild(snakeSegment);
  });
}
function snakeEats(position) {
  return snake.some((bodyPiece) => {
    return (
      bodyPiece.x == appleGridPoint[0].x && bodyPiece.y == appleGridPoint[0].y
    );
  });
}
function checkBite() {
  for (let i = 1; i < snake.length; i++) {
    // console.log("this runs");
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      gameOver();
    }
  }
}
//Render apple onto the board
function renderApple() {
  appleGridPoint.forEach((Element) => {
    apple.style.gridRowStart = appleGridPoint[0].y;
    apple.style.gridColumnStart = appleGridPoint[0].x;
    gameBoard.appendChild(apple);
  });
}
function tick() {
  updateState();
  renderState(gameBoard);
}

function startGame() {
  startButton.remove();
  // snakeToolbar.appendChild(scoreTag)[0];
  snakeToolbar.appendChild(scoreDisplay)[0];
  snakeToolbar.appendChild(previousScoreDisplay)[1];
  snakeToolbar.appendChild(highScoreDisplay)[2];

  renderLoop = setInterval(() => tick(), 1000 / 5);
}
startButton.onclick = startGame;
//I was trying to get a good restart function to work but ran out of time. Leaving this in to work on later.
function scoreKeeper() {
  previousScore = score;
  previousScoreDisplay.innerHTML = "Last Score: " + previousScore;
  if (score > highScore) {
    highScore = score;
    highScoreDisplay.innerHTML = "Highscore: " + highScore;
  }
}

function resetSnake() {
  snake = [
    { x: 10, y: 5 },
    { x: 11, y: 5 },
  ];
  newSnakeSegment = 0;
  userDirection = { x: 0, y: 0 };
  score = 0;
  scoreDisplay.innerHTML = "Current Score: " + score;
  renderSnake();
}

function restartGame() {
  snake.forEach((bodyPiece) => {
    const snakeSegment = document.querySelectorAll(".snake");
    for (let i = 0; i < snakeSegment.length; i++) {
      gameBoard.removeChild(snakeSegment[i]);
    }
  });

  resetSnake();
  renderLoop = setInterval(() => tick(), 1000 / 5);
}
