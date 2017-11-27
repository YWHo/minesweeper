document.addEventListener('DOMContentLoaded', startGame)

// Define your `board` object here!
var board = {}

function startGame() {

  // Add event listener
  document.addEventListener("click", checkForWin);
  document.addEventListener("contextmenu", checkForWin);
  document.addEventListener("contextmenu", showUnmarkedMines);

  // Add button click listener
  document.getElementById('resetButton').onclick = newGame;

  newGame();

}

function newGame() {

  console.log('new game');
  var boardNode = document.getElementsByClassName('board')[0];
  boardNode.innerHTML = ''; // reset visual;

  generateBoard(6);
  showUnmarkedMines();

  // Don't remove this function call: it makes the game work!
  lib.initBoard()

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

  for (i = 0; i < board.cells.length; i++) {
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
  lib.displayMessage('You win!')
}

// Show unmarked mines at top left of the scoreboard
function showUnmarkedMines(evt) {
  let marked = 0;
  Array.from(board.cells).forEach( function (cell) {
    if (cell.isMarked) {
      marked += 1;
    }
  });

  let remaining = getTotalMines() - marked;
  document.getElementById('bombRemaining').innerHTML = remaining.toString();   
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
function generateBoard(size) {
  if (size < 3) {
    size = 3;
  }

  board.cells = [];  // Reset cells

  // layout cell without mines
  for (row = 0; row < size; row++) {
    for (col = 0; col < size; col++) {
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
  for (i = 0; i < board.cells.length; i++) {
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