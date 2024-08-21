const cells = document.querySelectorAll('.cell');
const playerVsPlayerButton = document.getElementById('playerVsPlayer');
const playerVsAIButton = document.getElementById('playerVsAI');
const restartButton = document.getElementById('restartGame');
const xScoreElement = document.getElementById('xScore');
const oScoreElement = document.getElementById('oScore');
const messagePopup = document.getElementById('messagePopup');

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let vsAI = false;
let xScore = 0;
let oScore = 0;

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

playerVsPlayerButton.addEventListener('click', () => {
    vsAI = false;
    resetGame();
});

playerVsAIButton.addEventListener('click', () => {
    vsAI = true;
    resetGame();
});

restartButton.addEventListener('click', resetGame);

cells.forEach((cell, index) => {
    cell.addEventListener('click', () => handleCellClick(index));
});

function handleCellClick(index) {
    if (gameBoard[index] !== '' || !gameActive) return;

    updateCell(index);
    if (checkWinner()) return;
    
    if (vsAI && currentPlayer === 'O' && gameActive) {
        setTimeout(() => {
            aiMove();
            checkWinner();
        }, 500);
    }
}

function updateCell(index) {
    gameBoard[index] = currentPlayer;
    cells[index].classList.add(currentPlayer);
    cells[index].textContent = currentPlayer;
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function checkWinner() {
    let roundWon = false;
    
    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        gameActive = false;
        updateScore(currentPlayer === 'X' ? 'O' : 'X');
        showPopup(`${currentPlayer === 'X' ? 'O' : 'X'} wins!`);
        showConfetti();
        return true;
    } else if (!gameBoard.includes('')) {
        gameActive = false;
        showPopup('It\'s a draw!');
        return true;
    }
    return false;
}

function aiMove() {
    let bestMove = getBestMove();
    updateCell(bestMove);
}

function getBestMove() {
    let availableMoves = gameBoard.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);

    // Check if AI can win
    for (let i = 0; i < availableMoves.length; i++) {
        let move = availableMoves[i];
        gameBoard[move] = 'O';
        if (checkWin('O')) {
            gameBoard[move] = '';
            return move;
        }
        gameBoard[move] = '';
    }

    // Check if player can win
    for (let i = 0; i < availableMoves.length; i++) {
        let move = availableMoves[i];
        gameBoard[move] = 'X';
        if (checkWin('X')) {
            gameBoard[move] = '';
            return move;
        }
        gameBoard[move] = '';
    }

    // Choose the center if available
    if (gameBoard[4] === '') return 4;

    // Choose a random corner if available
    let corners = [0, 2, 6, 8];
    for (let i = 0; i < corners.length; i++) {
        if (availableMoves.includes(corners[i])) return corners[i];
    }

    // Choose a random move
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

function checkWin(player) {
    return winningCombinations.some(combination => {
        return combination.every(index => gameBoard[index] === player);
    });
}

function updateScore(winner) {
    if (winner === 'X') {
        xScore++;
        xScoreElement.textContent = xScore;
    } else {
        oScore++;
        oScoreElement.textContent = oScore;
    }
}

function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('X', 'O');
    });
    currentPlayer = 'X';
    gameActive = true;
    hidePopup(); // Hide popup when resetting the game
}

function showPopup(message) {
    messagePopup.textContent = message;
    messagePopup.classList.add('show');
}

function hidePopup() {
    messagePopup.classList.remove('show');
}

function showConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
}
