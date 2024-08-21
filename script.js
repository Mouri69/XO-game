const cells = document.querySelectorAll('.cell');
const playerVsPlayerButton = document.getElementById('playerVsPlayer');
const playerVsAIButton = document.getElementById('playerVsAI');
const restartButton = document.getElementById('restartGame');
const xScoreElement = document.getElementById('xScore');
const oScoreElement = document.getElementById('oScore');
const messagePopup = document.getElementById('messagePopup');
const confetti = document.getElementById('confetti');
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
            if (!checkWinner()) {
                // AI move completes; continue game if no winner
                gameActive = true;
            }
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
        showConfetti();
        setTimeout(() => showPopup(`${currentPlayer === 'X' ? 'O' : 'X'} wins!`), 100);
        return true;
    } else if (!gameBoard.includes('')) {
        gameActive = false;
        setTimeout(() => showPopup('It\'s a draw!'), 100);
        return true;
    }
    return false;
}

function aiMove() {
    let bestMove = getBestMove();
    updateCell(bestMove);
    checkWinner(); // Check if AI move results in a win
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
}

function showConfetti() {
    confetti.style.display = 'flex'; // Show confetti
    confetti.innerHTML = '';
    for (let i = 0; i < 20; i++) {
        const confettiPiece = document.createElement('div');
        confettiPiece.classList.add('confetti-piece');
        confettiPiece.style.left = `${Math.random() * 100}%`;
        confettiPiece.style.animation = `makeItRain ${Math.random() * 3 + 2}s linear`;
        confetti.appendChild(confettiPiece);
    }
    setTimeout(() => {
        confetti.style.display = 'none'; // Hide confetti after animation
    }, 4000); // Match duration with animation duration
}

function showPopup(message) {
    messagePopup.textContent = message;
    messagePopup.classList.add('show'); // Add class to show popup
    setTimeout(() => {
        messagePopup.classList.remove('show'); // Remove class to hide popup
    }, 3000); // Display message for 3 seconds
}

