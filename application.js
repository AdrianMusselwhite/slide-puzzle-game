/* Adrian Musselwhite */

const rows = 3;
const columns = 3;

let moveCount = 0;

// Gameboard array and gameboard elements
const gameBoard = [1,2,3,4,5,6,7,8,0];
const gameBoardElements = document.getElementsByClassName("gridsquares");

const gameBoardElementsLength = gameBoardElements.length;
const gameBoardLength = gameBoard.length;

// Array used to record move history
const moveHistory = [];

// Set click listeners for the reset and solve buttons
document.getElementById("resetButton").addEventListener("click",shuffleBoard);
document.getElementById("solveButton").addEventListener("click",solveBoard);

shuffleBoard();
setClickListeners();

// Sets a click listener for each tile on the board
function setClickListeners(){

    for (let i = 0; i < gameBoardElementsLength; i++){

        gameBoardElements[i].addEventListener("click",checkValidThenMove);

    }

}

// Removes all click listeners for the tiles on the board
function removeClickListener(){

    for (let i = 0; i < gameBoardElementsLength; i++){

        gameBoardElements[i].removeEventListener("click", checkValidThenMove);

    }

}

// Checks if the numbers are in correct order
// Returns true if solved and false if unsolved
function checkWin(){

    for (let i = 0; i < gameBoardElementsLength; i++){
        
        if (gameBoard[i] != i + 1){
            return false;
        }
        
    }

    winFunction();

    return true;

}

// Sets up and displays win message
function winFunction(){

    let win = document.getElementById("winScreen");

    // Remove the click listeners for tiles and reset/solve button
    removeClickListener();
    document.getElementById("resetButton").removeEventListener("click",shuffleBoard);
    document.getElementById("solveButton").removeEventListener("click",solveBoard);

    // Add class that changes display to block
    win.classList.add("visable");

    // Add class with opacity 100 as
    setTimeout(function (){
        win.classList.add("visableVisual");
    }, 0);

}

// Removes win message and reset games when play again is clicked
function playAgain(){

    let win = document.getElementById("winScreen");

    // Remove class that had opacity 100
    win.classList.remove("visableVisual");
    
    // Remove class that changes display to block
    // also add click listeners for tiles and shuffle then board
    setTimeout(function (){
        win.classList.remove("visable");
        setClickListeners();  
        shuffleBoard();
    }, 500);

}

// First checks if valid then moves tile when clicked
function checkValidThenMove(){

    const boardTile = this;

    boardTile.style.transition = "0.1s";

    // Get the number of the tile clicked and its original position
    let numberToMove = boardTile.innerHTML;
    let originalRow = Math.floor((numberToMove - 1) / columns);
    let originalCol = (numberToMove - 1) % columns;

    let moveRow;
    let moveCol;
    let moveNumberPosition;

    let emptyRow;
    let emptyCol;
    let emptyPosition;

    // Find position of the number to move and the empty position
    for (let i = 0; i < gameBoardLength; i++){

        if (gameBoard[i] == numberToMove){
            moveRow = Math.floor(i / columns);
            moveCol = i % columns;
            moveNumberPosition = i;
        }
        else if (gameBoard[i] == 0){
            emptyRow = Math.floor(i / columns);
            emptyCol = i % columns;
            emptyPosition = i;
        } 
    }

    // Return false if move is invalid (difference in position is greater than 1)
    if (Math.abs(emptyRow - moveRow) + Math.abs(emptyCol - moveCol) != 1){
        return false;
    }

    // Add to move history
    moveHistory.push(boardTile);

    // Update gameboard
    gameBoard[emptyPosition] = gameBoard[moveNumberPosition];
    gameBoard[moveNumberPosition] = 0;

    // Find the distance from original position to the new position
    let distForC = emptyCol - originalCol;
    let distForR = emptyRow - originalRow;

    // Move the board tile
    boardTile.style.transform = "translate(" + (114 * (distForC)).toString() + "%, " + (114 * (distForR)).toString() + "%)";

    // Increase move count then update the move score on screen
    moveCount++;
    document.getElementById("movesScore").innerHTML = "Moves: " + moveCount;

    // Check for win
    checkWin();

    return true;

}

// Shuffles the tiles on the board
function shuffleBoard(){

    // Remove the click listeners for tiles and reset/solve button
    removeClickListener();
    document.getElementById("resetButton").removeEventListener("click",shuffleBoard);
    document.getElementById("solveButton").removeEventListener("click",solveBoard);

    // Move tiles back to original position
    resetBoard();
    
    // Used to keep track of shuffle
    const moveArray = [];
    const distForCArray = [];
    const distForRArray = [];

    let emptyRow = 2;
    let emptyCol = 2;
    let emptyPosition = 8;
    let lastNumberMoved = -1;
    let count = 0;

    // Loop fills moveArray, distForCArray and distForRArray with moves
    while (count < 25){

        // Generate a random position
        let moveNumberPosition = Math.floor(Math.random() * 9);

        // Change random position to row/col value
        let moveRow = Math.floor(moveNumberPosition / columns);
        let moveCol = moveNumberPosition % columns;
    
        // If the move is valid and not the same as the last number 
        if ((Math.abs(emptyRow - moveRow) + Math.abs(emptyCol - moveCol) == 1) && (lastNumberMoved != gameBoard[moveNumberPosition])){

            lastNumberMoved = gameBoard[moveNumberPosition];

            // Get the number of the tile clicked and its original position
            let numberToMove = gameBoard[moveNumberPosition];
            let originalRow = Math.floor((numberToMove - 1) / columns);
            let originalCol = (numberToMove - 1) % columns;

            // Update gameboard
            gameBoard[emptyPosition] = gameBoard[moveNumberPosition];
            gameBoard[moveNumberPosition] = 0;
    
            // Find the distance from original position to the new position
            let distForC = emptyCol - originalCol;
            let distForR = emptyRow - originalRow;
    
            // Update empty row position
            emptyRow = moveRow;
            emptyCol = moveCol;
            emptyPosition = moveNumberPosition;
    
            // Find correct tile element and add details to shuffle arrays
            for (let i = 0; i < gameBoardElementsLength; i++){
    
                if (gameBoardElements[i].innerHTML == numberToMove ){
                    moveArray.push(gameBoardElements[i]);
                    distForCArray.push(distForC);
                    distForRArray.push(distForR);
                    break;
                }
    
            }
            count++;
        }

    }

    let movesLength = moveArray.length;

    let i = 0;

    // Call moveFunc every 70ms
    let id = setInterval(moveFunc,70);

    function moveFunc(){
        
            // If all moves have been completed stop calling moveFunc
            // add click listeners back to the reset/solve button and board tiles
            if (i == movesLength){
                clearInterval(id);
                document.getElementById("resetButton").addEventListener("click",shuffleBoard);
                document.getElementById("solveButton").addEventListener("click",solveBoard);
                setClickListeners();
            }
            // Add the board tile to the move history then translate the tile
            else{
                let boardTile = moveArray[i];
                moveHistory.push(boardTile);
                boardTile.style.transition = "0.07s";
                boardTile.style.transform = "translate(" + (114 * (distForCArray[i])).toString() + "%, " + (114 * (distForRArray[i])).toString() + "%)";
                i++;
            }
    }
}

// Solves the game board
function solveBoard(){

    // Remove the click listeners for tiles and reset/solve button
    removeClickListener();
    document.getElementById("solveButton").removeEventListener("click",solveBoard);
    document.getElementById("resetButton").removeEventListener("click",shuffleBoard);

    // Used to keep track of solve moves
    let moveArray = []
    let distForCArray = [];
    let distForRArray = [];
    
    let l = moveHistory.length;

    // Loop through move history
    for (let j = 0; j < l; j++){

        // boardTile is board element to move
        let boardTile = moveHistory.pop();
    
        // Get the number of the tile clicked and its original position
        let numberToMove = boardTile.innerHTML;
        let originalRow = Math.floor((numberToMove - 1) / columns);
        let originalCol = (numberToMove - 1) % columns;
    
        let emptyRow;
        let emptyCol;
        let emptyPosition;
    
        // Find position of the number to move and the empty position
        for (let i = 0; i < gameBoardLength; i++){
    
            if (gameBoard[i] == numberToMove){
                moveRow = Math.floor(i / columns);
                moveCol = i % columns;
                moveNumberPosition = i;
            }
            else if (gameBoard[i] == 0){
                emptyRow = Math.floor(i / columns);
                emptyCol = i % columns;
                emptyPosition = i;
            } 
        }
    
        // Update gameboard
        gameBoard[emptyPosition] = gameBoard[moveNumberPosition];
        gameBoard[moveNumberPosition] = 0;
    
        // Find the distance from original position to the new position
        let distForC = emptyCol - originalCol;
        let distForR = emptyRow - originalRow;

        // Add tile element column distance and row distance to arrays
        moveArray.push(boardTile);
        distForCArray.push(distForC);
        distForRArray.push(distForR);

    }

    let movesLength = moveArray.length;

    let i = 0;

    // Call moveFunc every 70ms
    let id = setInterval(moveFunc,70);

    function moveFunc(){

        // If all moves have been completed stop calling moveFunc
        // call checkWin after a short delay
        if (i == movesLength){
            clearInterval(id);
            setTimeout(checkWin,400);
        }
        // Translate board tile
        else{
            let boardTile = moveArray[i];
            boardTile.style.transition = "0.07s";
            boardTile.style.transform = "translate(" + (114 * (distForCArray[i])).toString() + "%, " + (114 * (distForRArray[i])).toString() + "%)";
            i++;
        }
    }
}

function resetBoard(){

    let historyLength = moveHistory.length;

    // Remove everything from history 
    for (let i = 0; i < historyLength; i++){
        moveHistory.pop();
    }

    // Reset moveCount variable and change display on screen
    moveCount = 0;
    document.getElementById("movesScore").innerHTML = "Moves: 0";
    
    // Translate each tile and update gameBoard array
    for (let i = 0; i < gameBoardElementsLength; i++){
        gameBoardElements[i].style.transform = "translate(0px,0px)";
        gameBoard[i] = i + 1;
    }

    gameBoard[gameBoardLength - 1] = 0;

}

// Prints board in console
function showUpdatedBoard(){

    let st = "";

    for (let i = 0; i < gameBoard.length; i++){

        st += gameBoard[i];

        if (i % 3 == 2){
            console.log(st);
            st = "";
        }

    }
    console.log("\n");

}
