document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const status = document.getElementById('status');
    const resetButton = document.getElementById('reset');
    const cells = Array.from(document.getElementsByClassName('cell'));
    let currentPlayer = 'X';
    let boardState = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;

    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Columns
        [0, 4, 8], [2, 4, 6]              // Diagonals
    ];

    const handleCellClick = (event) => {
        const cell = event.target;
        const index = cell.getAttribute('data-index');

        if (boardState[index] !== '' || !gameActive) {
            return;
        }

        boardState[index] = currentPlayer;
        cell.textContent = currentPlayer;

        if (checkWin()) {
            status.textContent = `Player ${currentPlayer} wins!`;
            gameActive = false;
            return;
        }

        if (boardState.every(cell => cell !== '')) {
            status.textContent = 'Draw!';
            gameActive = false;
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        status.textContent = `Turn: Player ${currentPlayer}`;
    };

    const checkWin = () => {
        return winningConditions.some(condition => {
            const [a, b, c] = condition;
            return boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c];
        });
    };

    const resetGame = () => {
        boardState = ['', '', '', '', '', '', '', '', ''];
        cells.forEach(cell => cell.textContent = '');
        currentPlayer = 'X';
        gameActive = true;
        status.textContent = `Turn: Player ${currentPlayer}`;
    };

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetButton.addEventListener('click', resetGame);
    status.textContent = `Turn: Player ${currentPlayer}`;
});