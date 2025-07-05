const clickSound = document.getElementById("click-sound");
const invalidSound = document.getElementById("invalid-sound");
const winSound = document.getElementById("win-sound");
const drawSound = document.getElementById("draw-sound");
const resetSound = document.getElementById("reset-sound");
let difficultyToggleBtn = document.getElementById("difficulty-toggle");
let boxes = document.querySelectorAll(".cells");
let resetbtn = document.querySelector("#reset-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let turn = document.querySelector(".status");
let playerO = document.querySelector(".playerO");
let playerX = document.querySelector(".playerX");
let closebtn = document.querySelector("#closebtn");
let scoreODisplay = document.querySelector("#o-score");
let scoreXDisplay = document.querySelector("#x-score");
let winline = document.querySelector("#winline");
let turn0 = true; // player X, playerO
let scoreO = 0,
  scoreX = 0;
let vsComputer = false;
let difficulty = "easy";
difficultyToggleBtn.addEventListener("click", () => {
  if (!vsComputer) return;
  difficulty = difficulty === "easy" ? "hard" : "easy";
  difficultyToggleBtn.innerText = `${
    difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
  }`;
  resetGame();
});

document.getElementById("mode-toggle").addEventListener("click", () => {
  vsComputer = !vsComputer;
  difficultyToggleBtn.style.display = vsComputer ? "inline-block" : "none";
  document.getElementById("mode-toggle").innerText = vsComputer
    ? "Play vs Player"
    : "Play vs Computer";
  playerX.innerText = vsComputer ? "Computer" : "Player X";
  resetGame();
  turn0 = true;
});
function playSound(sound, maxDuration = 3000) {
  // 500ms = 0.5 seconds
  try {
    sound.currentTime = 0;
    sound.volume = 0.3; // Set volume here too
    sound.play();

    // Stop after maxDuration milliseconds
    setTimeout(() => {
      sound.pause();
      sound.currentTime = 0;
    }, maxDuration);
  } catch (e) {
    console.error("Sound error:", e);
  }
}
const winpatterns = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8],
];
boxes.forEach((box, index) => {
  box.addEventListener("click", () => {
    if (box.innerText !== ""){
      playSound(invalidSound,200);
      return;
    }
    if (vsComputer) {
      if (!turn0) return;
      playerMove(index);
      if (vsComputer && !turn0 && !checkWinner()) {
        playerX.innerText = "Computer";
        setTimeout(computerMove, 500);
      }
    } else {
      if (turn0) {
        playerMove(index);
      } else {
        playerXmove(index);
      }
    }
  });
});
function playerXmove(index) {
  const box = boxes[index];
  box.innerText = "X";
  box.style.color = "red";
  box.style.textShadow = "0 0 10px #f00, 0 0 20px #f00";
  box.disabled = true;
  turn0 = true;
  playSound(clickSound,300);
  updateUIforplayerO();
  checkWinner();
}

function updateUIforplayerO() {
  playerX.classList.remove("glow");
  playerO.classList.add("glow");
  playerX.style.background = "red";
  playerO.style.background = "linear-gradient(135deg, #0056ce, #6c5ce7)";
  turn.innerText = "Player O's turn";
  turn.style.background = "linear-gradient(135deg, #0056ce, #6c5ce7)";
}
function updateUIforplayerX() {
  playerO.classList.remove("glow");
  playerX.classList.add("glow");
  playerO.style.background = "blue";
  playerX.style.background =
    "linear-gradient(135deg,rgb(230, 0, 0),rgb(180, 10, 16))";
  turn.innerText = "Player X's turn";
  turn.style.background =
    "linear-gradient(135deg,rgb(230, 0, 0),rgb(180, 10, 16))";
}
function playerMove(index) {
  const box = boxes[index];
  box.innerText = "O";
  box.style.color = "blue";
  box.style.textShadow = "0 0 10px #00f,0 0 20px #00f";
  box.disabled = true;
  turn0 = false;
  playSound(clickSound,300);
  updateUIforplayerX();
  checkWinner();
}

function computerMove() {
  if (turn0) return;
  const available = [];
  boxes.forEach((box, idx) => {
    if (box.innerText === "") available.push(idx);
  });

  if (available.length === 0) return;
  let move;
  if (difficulty === "easy") {
    move = available[Math.floor(Math.random() * available.length)];
  } else {
    const board = [...boxes].map((box) =>
      box.innerText === "" ? null : box.innerText
    );
    move = getBestMove(board);
  }
  if (move === undefined) {
    move = available[Math.floor(Math.random() * available.length)];
  }
  const box = boxes[move];
  box.innerText = "X";
  box.style.color = "red";
  box.style.textShadow = "0 0 10px #f00,0 0 20px #f00";
  box.disabled = true;
  turn0 = true;
  updateUIforplayerO();
  checkWinner();
}

// MIN-MAX algorithm for HARD
function getBestMove(board) {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      board[i] = "X"; // AI plays as X
      let score = minimax(board, 0, false);
      board[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(board, depth, isMaximizing) {
  const winner = evaluateBoard(board);
  if (winner !== null) {
    const scores = {
      X: 1,
      O: -1,
      draw: 0,
    };
    return scores[winner];
  }
  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = "X";
        best = Math.max(best, minimax(board, depth + 1, false));
        board[i] = null;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = "O";
        best = Math.min(best, minimax(board, depth + 1, true));
        board[i] = null;
      }
    }
    return best;
  }
}

function evaluateBoard(board) {
  const wincombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let combo of wincombos) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      return board[a]; // "X" or "C"
    }
  }
  if (board.every((cell) => cell != null)) return "draw";
  return null; // game not over
}

const checkWinner = () => {
  for (pattern of winpatterns) {
    let pos1 = boxes[pattern[0]].innerText;
    let pos2 = boxes[pattern[1]].innerText;
    let pos3 = boxes[pattern[2]].innerText;
    if (pos1 != "" && pos1 === pos2 && pos2 === pos3 && pos1 === pos3) {
      showWinner(pos1);
      showWinline(pattern, pos1);
      disabledAllBoxes();
      return true;
    }
  }
  let allfilled = true;
  boxes.forEach((box) => {
    if (box.innerText === "") allfilled = false;
  });
  if (allfilled) {
    showWinner("Draw");
    return true;
  }
  return false;
};

const showWinline = (pattern, winner) => {
  const lines = {
    "0,1,2": {
      // top row
      top: "210px",
      left: "80px",
      width: "360px",
      rotate: "0deg",
    },
    "3,4,5": {
      // middle row
      top: "340px",
      left: "80px",
      width: "360px",
      rotate: "0deg",
    },
    "6,7,8": {
      // bottom row
      top: "480px",
      left: "80px",
      width: "360px",
      rotate: "0deg",
    },
    "0,3,6": {
      // left column
      top: "160px",
      left: "120px",
      width: "360px",
      rotate: "90deg",
    },
    "1,4,7": {
      // middle column
      top: "160px",
      left: "250px",
      width: "360px",
      rotate: "90deg",
    },
    "2,5,8": {
      // right column
      top: "160px",
      left: "390px",
      width: "360px",
      rotate: "90deg",
    },
    "0,4,8": {
      // diagonal top-left to bottom-right
      top: "160px",
      left: "70px",
      width: "509px", 
      rotate: "45deg",
    },
    "2,4,6": {
      // diagonal top-right to bottom-left
      top: "92%",
      left: "60px",
      width: "509px",
      rotate: "-45deg",
    },
  };

  const key = pattern.join(",");
  const style = lines[key];
  if (style) {
    if (winner === "O") {
      winline.style.background = "blue";
      winline.style.boxShadow = "0 0 20px blue";
    } else if (winner === "X") {
      winline.style.background = "red";
      winline.style.boxShadow = "0 0 20px red";
    }
    winline.style.display = "block";
    winline.style.top = style.top;
    winline.style.left = style.left;
    winline.style.width = style.width;
    winline.style.transform = `rotate(${style.rotate})`;
    winline.style.transformOrigin = "0 0";
  }
};

const disabledAllBoxes = () => {
  boxes.forEach((box) => {
    box.disabled = true;
  });
};
const showWinner = (winner) => {
  if (winner === "Draw") {
    msg.innerText = "It's a Draw";
    playSound(drawSound,300);
  } else {
   playSound(winSound,3000);
    if (winner === "X" && vsComputer) {
      msg.innerText = `Computer wins! 🎉 `;
    } else {
      msg.innerText = `Player ${winner} wins! 🎉`;
    }
      if (winner === "O") {
        scoreO++;
        scoreODisplay.innerText = Math.ceil(scoreO/2);
      } else if (winner === "X") {
        scoreX++;
        scoreXDisplay.innerText = scoreX;
      }
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
    });
  }
  msgContainer.classList.remove("hide");
  msgContainer.classList.add("show");
};

const resetBoard = () => {
  turn0 = true;
  boxes.forEach((box) => {
    box.innerText = "";
    box.disabled = false;
    box.style.color = "";
    box.style.textShadow = "";
  });
  playerO.style.background = "linear-gradient(135deg, #0056ce, #6c5ce7)";
  playerX.style.background =
    "linear-gradient(135deg,rgb(230, 0, 0),rgb(180, 10, 16))";
  msgContainer.classList.add("hide");
  turn.innerText = "Player O's turn";
  turn.style.background = " linear-gradient(135deg, #0056ce, #6c5ce7)";
  turn.style.color = "#ffffff";
  playerO.classList.add("glow");
  playerX.classList.remove("glow");
  winline.style.display = "none";
  playSound(resetSound,300);
};

const resetGame = () => {
  turn0 = true;
  boxes.forEach((box) => {
    box.innerText = "";
    box.disabled = false;
    box.style.color = "";
    box.style.textShadow = "";
  });
  playerO.style.background = "linear-gradient(135deg, #0056ce, #6c5ce7)";
  playerX.style.background =
    "linear-gradient(135deg,rgb(230, 0, 0),rgb(180, 10, 16))";
  msgContainer.classList.add("hide");
  turn.innerText = "Player O's turn";
  turn.style.background = " linear-gradient(135deg, #0056ce, #6c5ce7)";
  turn.style.color = "#ffffff";
  playerO.classList.add("glow");
  playerX.classList.remove("glow");
  scoreO = 0;
  scoreX = 0;
  scoreODisplay.innerText = 0;
  scoreXDisplay.innerText = 0;
  winline.style.display = "none";
  playSound(resetSound,300);
};
const removepop = () => {
  msgContainer.classList.add("hide");
  msgContainer.classList.remove("show");
};
closebtn.addEventListener("click", resetBoard);
resetbtn.addEventListener("click", resetGame);
