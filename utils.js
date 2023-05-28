const checkForWin = (board) => {
  // Check for horizontal wins
  for (let i = 0; i < 3; i++) {
    if (board[i][0] === board[i][1] && board[i][1] === board[i][2] && board[i][0] !== "-") {
      return board[i][0];
    }
  }

  // Check for vertical wins
  for (let i = 0; i < 3; i++) {
    if (board[0][i] === board[1][i] && board[1][i] === board[2][i] && board[0][i] !== "-") {
      return board[0][i];
    }
  }

  // Check for diagonal wins
  if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] !== "-") {
    return board[0][0];
  }
  if (board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[0][2] !== "-") {
    return board[0][2];
  }
  // If no one wins
  return "-";
};

const isTie = (board) => {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === "-") {
        return false;
      }
    }
  }
  return true;
};

const minimax = (board, depth, isMaximizing) => {
  let result = checkForWin(board);
  if (result !== "-") {
    return result === "O" ? 10 : result === "X" ? -10 : 0;
  }

  if (isTie(board)) {
    return 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === "-") {
          board[i][j] = "O";
          bestScore = Math.max(bestScore, minimax(board, depth + 1, false));
          board[i][j] = "-";
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === "-") {
          board[i][j] = "X";
          bestScore = Math.min(bestScore, minimax(board, depth + 1, true));
          board[i][j] = "-";
        }
      }
    }
    return bestScore;
  }
};

const getAIMove = (board) => {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === "-") {
        board[i][j] = "O";
        let score = minimax(board, 0, false);
        board[i][j] = "-";
        if (score > bestScore) {
          bestScore = score;
          move = [i, j];
        }
      }
    }
  }

  // Place the AI's mark in the chosen cell
  board[move[0]][move[1]] = "O";
  return board;
};

// export getAIMove
module.exports = getAIMove;
