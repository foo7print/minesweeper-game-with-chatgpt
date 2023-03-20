const BOARD_SIZE = 10;
const NUM_MINES = 10;

const board = document.getElementById("game-board");
const cells = [];
const resetButton = document.getElementById("reset-button");

function showResetButton() {
  resetButton.style.display = "block";
  resetButton.addEventListener("click", resetGame);
}

function hideResetButton() {
  resetButton.style.display = "none";
  resetButton.removeEventListener("click", resetGame);
}

function resetGame() {
  hideResetButton();
  window.location.reload();
}

function createBoard() {
  for (let i = 0; i < BOARD_SIZE; i++) {
    cells[i] = [];
    for (let j = 0; j < BOARD_SIZE; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.addEventListener("click", () => revealCell(i, j));
      cell.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        flagCell(cell);
      });

      board.appendChild(cell);
      cells[i][j] = cell;
    }
  }
}

function placeMines() {
  let count = 0;
  while (count < NUM_MINES) {
    const x = Math.floor(Math.random() * BOARD_SIZE);
    const y = Math.floor(Math.random() * BOARD_SIZE);
    if (!cells[x][y].classList.contains("mine")) {
      cells[x][y].classList.add("mine");
      count++;
    }
  }
}

function countAdjacentMines(x, y) {
  let count = 0;
  for (let i = x - 1; i <= x + 1; i++) {
    for (let j = y - 1; j <= y + 1; j++) {
      if (i === x && j === y) continue;
      if (
        i >= 0 &&
        i < BOARD_SIZE &&
        j >= 0 &&
        j < BOARD_SIZE &&
        cells[i][j].classList.contains("mine")
      ) {
        count++;
      }
    }
  }
  return count;
}

function checkWinCondition() {
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (
        !cells[i][j].classList.contains("mine") &&
        !cells[i][j].classList.contains("revealed")
      ) {
        return false;
      }
    }
  }
  return true;
}

function revealCell(x, y) {
  if (
    cells[x][y].classList.contains("revealed") ||
    cells[x][y].classList.contains("flagged")
  ) {
    return;
  }
  cells[x][y].classList.add("revealed");

  if (cells[x][y].classList.contains("mine")) {
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (cells[i][j].classList.contains("mine")) {
          cells[i][j].style.backgroundColor = "#f00";
        }
      }
    }
    alert("ゲームオーバー！");
    showResetButton();
    return;
  }

  const adjacentMines = countAdjacentMines(x, y);
  if (adjacentMines !== 0) {
    cells[x][y].setAttribute("data-number", adjacentMines);
    cells[x][y].textContent = adjacentMines;
  } else {
    for (let i = x - 1; i <= x + 1; i++) {
      for (let j = y - 1; j <= y + 1; j++) {
        if (i >= 0 && i < BOARD_SIZE && j >= 0 && j < BOARD_SIZE) {
          revealCell(i, j);
        }
      }
    }
  }

  // 勝利条件のチェック
  if (checkWinCondition()) {
    alert("おめでとうございます！勝ちました！");
    showResetButton();
  }
}

function flagCell(cell) {
  if (cell.classList.contains("revealed")) {
    return;
  }
  cell.classList.toggle("flagged");
}

createBoard();
placeMines();
