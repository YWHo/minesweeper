'use strict';

document.addEventListener('DOMContentLoaded', startGame)

// Define your `board` object here!
var board = {}
var boardDimension = 5;
var initialTime;
var timeInterval; // time since game start
var timerStarted = false;

// Main entry point for the game
function startGame() {

  // Add button click listener
  document.getElementById('resetButton').onclick = newGame;

  newGame();

}

// Generate new game with everything reset
function newGame() {

  console.log('new game');
  resetTimer(); // 
  resetBoard();

  boardDimension = document.getElementById("difficultyLevel").value;


  generateBoard(boardDimension);
  showNumUnmarkedMines();
  setupEventListener();

  // Don't remove this function call: it makes the game work!
  lib.initBoard()

}


function resetBoard() {
  var boardNode = document.getElementsByClassName('board')[0];

  // reset visual;
  boardNode.innerHTML = '';

  // remove event listeners
  var clone = boardNode.cloneNode(true)
  boardNode.parentNode.replaceChild(clone, boardNode)
}


// Initial setup of event listener
function setupEventListener() {

  var boardNode = document.getElementsByClassName('board')[0]
  boardNode.addEventListener("click", checkForWin);
  boardNode.addEventListener("contextmenu", checkForWin);
  boardNode.addEventListener("contextmenu", showNumUnmarkedMines);
  boardNode.addEventListener("click", startTimer);
  boardNode.addEventListener("contextmenu", startTimer);
  boardNode.addEventListener("click", stopTimer);
}

// Define this function to look for a win condition:
//
// 1. Are all of the cells that are NOT mines visible?
// 2. Are all of the mines marked?
function checkForWin(evt) {
  if (evt.button == 2) { // right mouse click
    evt.preventDefault();
  }

  let win = true;

  for (let i = 0; i < board.cells.length; i++) {
    let cell = board.cells[i];

    if (cell.isMarked) {
      if (cell.isMine) {
        // all good, do nothing
      } else {
        // the mine is wrongly marked
        win = false;
        break;
      }
    } else if (cell.hidden) {
      // still got hidden cells
      win = false;
      break;
    }
  }

  if (!win) {
    return;
  }

  // You can use this function call to declare a winner (once you've
  // detected that they've won, that is!)
  clearInterval(timeInterval)
  lib.displayMessage('You win!')
  document.getElementById("cheerSound").play();
}

// Show number of unmarked mines at top left of the scoreboard
function showNumUnmarkedMines(evt) {
  if (evt != undefined && evt.button == 2) { // right mouse click
    evt.preventDefault();
  }

  let marked = 0;
  Array.from(board.cells).forEach(function (cell) {
    if (cell.isMarked) {
      marked += 1;
    }
  });

  let remaining = getTotalMines() - marked;
  document.getElementById('bombRemaining').innerHTML = remaining.toString();
}

function resetTimer() {
  clearInterval(timeInterval);
  timerStarted = false;
  document.getElementById("timer").innerHTML = "00:00";
}

//  Show count up ticking of the timer at the top right of the scoreboard
function showTimerTicking() {
  let timeNow = new Date().getTime();
  let timeDiff = Math.floor((timeNow - initialTime) / 1000);
  document.getElementById("timer").innerHTML = getMinSecStr(timeDiff);
}

// Given the number of seconds, return min::sec format
function getMinSecStr(givenSeconds) {
  let sec = givenSeconds % 60;
  let min = Math.floor(givenSeconds / 60);

  let secStr = sec.toString();
  if (sec < 10) {
    secStr = "0" + secStr;
  }

  let minStr = min.toString();
  if (min < 10) {
    minStr = "0" + minStr;
  }

  return minStr + ":" + secStr;
}

// Start the timer that refresh at every seconds,
// when any cell is clicked first time
function startTimer(evt) {
  if (evt.button == 2) { // right mouse click
    evt.preventDefault();
  }

  if (timerStarted) return;

  var idx = getCellIndex(getRow(evt.target), getCol(evt.target))
  if (idx == null) return;

  initialTime = new Date().getTime();
  timeInterval = setInterval(showTimerTicking, 1000);

  timerStarted = true;
}

// Stop the timer losing is detected
function stopTimer(evt) {
  var idx = getCellIndex(getRow(evt.target), getCol(evt.target))
  if (idx == null) return;

  if (board.cells[idx].isMine) {
    clearInterval(timeInterval);
    document.getElementById("booSound").play();
  }

}


// Define this function to count the number of mines around the cell
// (there could be as many as 8). You don't have to get the surrounding
// cells yourself! Just use `lib.getSurroundingCells`: 
//
//   var surrounding = lib.getSurroundingCells(cell.row, cell.col)
//
// It will return cell objects in an array. You should loop through 
// them, counting the number of times `cell.isMine` is true.
function countSurroundingMines(cell) {
  var surroundingCells = lib.getSurroundingCells(cell.row, cell.col)
  var count = 0

  if (Array.isArray(surroundingCells)) {
    Array.from(surroundingCells).forEach(function (aCell) {
      if (aCell.isMine) {
        count += 1
      }
    });

  }
  return count;
}


/// automatically generate the board
function generateBoard(dimension) {
  if (dimension < 3) {
    dimension = 3;
  }

  board.cells = []; // Reset cells

  // layout cell without mines
  for (let row = 0; row < dimension; row++) {
    for (let col = 0; col < dimension; col++) {
      let cell = {
        "row": row,
        "col": col,
        isMine: false,
        hidden: true,
      }
      board.cells.push(cell);
    }
  }

  plantMines();
  showSurroundingMines()

}


/// show surround mines
function showSurroundingMines() {
  for (let i = 0; i < board.cells.length; i++) {
    let cell = board.cells[i];
    cell["surroundingMines"] = countSurroundingMines(cell);
  }
}

// Given a list of cells, plant the mines
function plantMines() {
  if (board.cells.length == 0) {
    return;
  }

  let totalCells = board.cells.length
  let totalMines = Math.ceil(totalCells * 0.2); // 20% of cells have mines
  setTotalMines(totalMines);

  while (totalMines > 0) {
    let location = Math.floor(Math.random() * totalCells)
    if (board.cells[location].isMine == false) {
      board.cells[location].isMine = true;
      totalMines -= 1;
    }
  }

}

function setTotalMines(num) {
  board.totalMines = num;
}

function getTotalMines() {
  if (board.hasOwnProperty("totalMines") && board.totalMines > 0) {
    return board.totalMines;
  } else {
    return 0;
  }
}