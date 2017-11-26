document.addEventListener('DOMContentLoaded', startGame)

// Define your `board` object here!
var board = {
  "cells" : [{"row": 0, "col": 0, isMine: false, hidden: true},
            {"row": 0, "col":1, isMine: false, hidden: true}, 
            {"row": 0, "col":2, isMine: false, hidden: true},
            {"row": 1, "col":0, isMine: true, hidden: true}, 
            {"row": 1, "col":1, isMine: false, hidden: true}, 
            {"row": 1, "col":2, isMine: true, hidden: true},
            {"row": 2, "col":0, isMine: false, hidden: true}, 
            {"row": 2, "col":1, isMine: false, hidden: true}, 
            {"row": 2, "col":2, isMine: false, hidden: true}]
}

function startGame () {
  for(i = 0; i < board.cells.length; i++) {
    let cell = board.cells[i];
    cell["surroundingMines"] = countSurroundingMines(cell);
  }

  // Add event listener
  document.addEventListener("click", checkForWin);
  document.addEventListener("contextmenu", checkForWin);

  // Don't remove this function call: it makes the game work!
  lib.initBoard()
}

// Define this function to look for a win condition:
//
// 1. Are all of the cells that are NOT mines visible?
// 2. Are all of the mines marked?
function checkForWin (evt) {

  if (evt.button == 2) { // right mouse click
    evt.preventDefault();
  }

  let win = true;

  for(i = 0; i < board.cells.length; i++) {
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
    console.log("not yet win");
    return;
  }

  console.log("Win!");
  // You can use this function call to declare a winner (once you've
  // detected that they've won, that is!)
  lib.displayMessage('You win!')
}


// Define this function to count the number of mines around the cell
// (there could be as many as 8). You don't have to get the surrounding
// cells yourself! Just use `lib.getSurroundingCells`: 
//
//   var surrounding = lib.getSurroundingCells(cell.row, cell.col)
//
// It will return cell objects in an array. You should loop through 
// them, counting the number of times `cell.isMine` is true.
function countSurroundingMines (cell) {
  var surroundingCells = lib.getSurroundingCells(cell.row, cell.col)
  var count = 0

  if (Array.isArray(surroundingCells)) {
    Array.from(surroundingCells).forEach( function(aCell) {
      if (aCell.isMine) {
        count += 1
      }
    });
    
  }
  return count;
}


