const boardElement = document.getElementById('gameBoard');
const statusElement = document.getElementById('status');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');

let board = [];
let uicells = [];
let row = 6;
let col = 7;
const playerRed = 1;
const playerYellow = 2;
let currentPlayer = playerRed;
let gameActive = false;
let columnHeight = [5, 5, 5, 5, 5, 5, 5];

window.onload = generateBoard;

function generateBoard() {
    boardElement.innerHTML = '';
    for (let r = 0; r < row; ++r) {
        board[r] = [];
        uicells[r] = [];
        for (let c = 0; c < col; ++c) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r;
            cell.dataset.col = c;
            uicells[r][c] = cell;
            cell.addEventListener('click', handleCellClick);
            boardElement.appendChild(cell);
        }
    }
}

startButton.addEventListener('click', startGame);

function startGame (){
    board = Array.from({length:row}, () => Array(col).fill(null));
    columnHeight = Array(col).fill(row-1);
    currentPlayer = playerRed;
    gameActive = true;
    if(currentPlayer === playerRed){
        statusElement.textContent = "Red player's turn."
    } else{
        statusElement.textContent = "Yellow player's turn."
    }
    boardElement.classList.remove('disabled');
    generateBoard();   
}

function handleCellClick(event){
    if(!gameActive)
        return;
    const collumn = parseInt(event.target.dataset.col);
    const rowIndex = columnHeight[collumn];
    if(rowIndex < 0)
        return;
    board[rowIndex][collumn] = currentPlayer;
    --columnHeight[collumn];
    const cell = uicells[rowIndex][collumn];
    cell.classList.add(currentPlayer === playerRed? 'red' : 'yellow');
    if(checkWin(rowIndex, collumn)){
        showMessage (currentPlayer === playerRed ? "Red player wins!" : "Yellow player wins!");
        gameActive = false;
        return;
    }
    if(columnHeight.every(h => h<0)){
        showMessage("It's a draw!");
        gameActive = false;
        return;
    }
    currentPlayer = currentPlayer === playerRed ? playerYellow : playerRed;
    statusElement.textContent = currentPlayer === playerRed ? "Red player's turn" : "Yellow player's turn";
}

function checkWin(rowIndex,collumn){
    return (
        checkDirections(rowIndex, collumn, 0, 1) ||
        checkDirections(rowIndex, collumn, 1, 0) ||
        checkDirections(rowIndex, collumn, 1, 1) ||
        checkDirections(rowIndex, collumn, 1, -1))
}

function checkDirections (rowIndex, collumn, dr, dc){
    let count = 1;
    count += countCells(rowIndex, collumn, dr, dc);
    count += countCells(rowIndex, collumn, -dr,-dc);
    return count >= 4;
}

function countCells(rowIndex, collumn, dr, dc){
    let r = rowIndex + dr;
    let c = collumn + dc;
    let count = 0;
    while (r >= 0 && r < row && c >= 0 && c < col && board[r][c] === currentPlayer){
        ++count;
        r += dr;
        c += dc;
    }
     return count;
}

function showMessage (text){
    const messageBox = document.getElementById("messageBoard");
    const messageText = document.getElementById("messageText");
    messageText.textContent = text;
    messageBox.classList.remove('hidden');
}

function closeMessage(){
    const messageBox = document.getElementById("messageBoard");
     messageBox.classList.add('hidden');
}

restartButton.addEventListener('click', restartGame);

function restartGame(){
    closeMessage();
    startGame();
}