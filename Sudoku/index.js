let newgame = document.querySelector(".newgame");
let resetbtn = document.querySelector(".reset-btn");
let solve = document.querySelector(".solution");
let hint = document.querySelector(".hint-btn");
let undo = document.querySelector(".undo");
let timerDisplay = document.querySelector(".timer-display");
let pause = document.querySelector(".pause");
let start = document.querySelector(".play");
let pop = document.querySelector(".pops");
let ask = document.querySelector(".ask");


// adding timer functions
let timerInterval;
let seconds = 0;
let isTimerRunning = false;

function formatTime(totalSeconds){
  const minutes = Math.floor(totalSeconds/60);
  const seconds = totalSeconds%60;
  return `${minutes.toString().padStart(2,'0')} : ${seconds.toString().padStart(2,'0')}`;
}

function updateTimerDisplay(){
  timerDisplay.textContent = formatTime(seconds);
}

function startTimer(){
  if(!isTimerRunning){
    isTimerRunning =true;
    timerInterval = setInterval(() =>{
      seconds++;
      updateTimerDisplay();
    },1000);
    pause.style.display = "inline-block";
    start.style.display = "none";
  }
}

function pauseTimer(){
  if(isTimerRunning){
    clearInterval(timerInterval);
    isTimerRunning = false;
    pause.style.display = "none";
    start.style.display = "inline-block";
  }
}

function resetTimer(){
  pauseTimer();
  seconds = 0;
  updateTimerDisplay();
}

function intializeTimerControls(){
  pause.style.display = "none";
  start.style.display = "inline-block";
  start.addEventListener("click",startTimer);
  pause.addEventListener("click",pauseTimer);
}



let moveHistory = [];

document.addEventListener("DOMContentLoaded",intializeGame);



function intializeGame(){
  const grid = document.getElementById("s-grid");
  grid.innerHTML = "";
  intializegrid();
  loadPuzzle();
  intializeTimerControls();
  resetTimer();
}
function intializegrid(){
  const grid = document.getElementById("s-grid");
  for(let i = 0 ; i<81 ; i++){
    const cell = document.createElement('div');
    cell.classList.add("cells");
    cell.setAttribute("data-row",Math.floor(i/9));
    cell.setAttribute("data-col",i%9);
    cell.setAttribute("index",i);
    cell.addEventListener("click",() => handleCellClick(cell));
    grid.appendChild(cell);
  }
}

function loadPuzzle(){
  const randomPuzzle = hardSudokus[Math.floor(Math.random()*hardSudokus.length)];
  const currentSolution = findSolution(randomPuzzle);
  const cells = document.querySelectorAll(".cells");
  cells.forEach((cell,index) =>{
     const row = Math.floor(index/9);
     const col = (index%9);
     const value = randomPuzzle.puzzle[row][col];
     if(value !== 0){
      cell.textContent = value;
      cell.classList.add("clue");
      cell.style.color = "white";
      cell.style.fontWeight = "bold";
     }
     else{
      cell.textContent = '';
      cell.classList.remove("clue");
     }
  })
}

function findSolution(randomPuzzle){
  const  puzzle =  JSON.parse(JSON.stringify(randomPuzzle.puzzle));
  solveSudoku(puzzle);
  return puzzle;
}

function solveSudoku(board){
  for(let row = 0 ; row < 9; row++){
    for(let col = 0 ; col<9 ; col++){
      if(board[row][col] === 0){
        for(let num = 1; num<=9 ; num++){
          if(isSafe(board,row,col,num)){
            board[row][col] = num;
            if(solveSudoku(board)) return true;
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function isSafe(board,row,col,num){
  for(let x = 0; x<9 ; x++){
    if(board[row][x] === num || board[x][col] === num ||
      board[3*Math.floor(row/3) + Math.floor(x/3)][3*Math.floor(col/3) + x%3] === num
    ){
      return false;
    }
  }
  return true;
}

let selectedCell = null;
function handleCellClick(cell){
  if(cell.classList.contains("clue")) return ;
  if(selectedCell){
    selectedCell.classList.remove("selected");
  }
  selectedCell = cell;
  cell.classList.add("selected");

  // storing current value 
  const currentValue = cell.textContent;
  moveHistory.push({
    cell,previousValue : currentValue,
    index : cell.getAttribute("index")
  });
  
  if(moveHistory.length > 50){
    moveHistory.shift();
  }
}
document.addEventListener("keydown",(e) =>{
  if(!selectedCell || selectedCell.classList.contains("clue")) return;
  const key = e.key;
  const previousValue = selectedCell.textContent;
  if(key >= '1' && key <='9'){
    moveHistory.push({
      cell : selectedCell,
      previousValue : previousValue,
      index : selectedCell.getAttribute("index")
    });
    selectedCell.textContent = key;
    selectedCell.style.color = "black";
  }
  else if(key === "Backspace" || key === "Delete" || key === "0"){
    moveHistory.push({
      cell : selectedCell,
      previousValue : previousValue,
      index : selectedCell.getAttribute("index")
    })
    selectedCell.textContent = "";
  }
});


//  Implementing buttons effect

undo.addEventListener("click",()=>{
  if(moveHistory.length === 0){
    alert("Nothing to undo!");
    return ;
  }
  const lastMove = moveHistory.pop();
  const {cell,previousValue,wasHint} = lastMove;
  
  if(wasHint){
    cell.textContent = "";
    cell.style.color = "black";
  }
  else{
    cell.textContent = previousValue;
    if(previousValue === ""){
      cell.style.color = "black";
    }
    else{
      cell.style.color = "black";
    }
  }
  if(selectedCell){
    selectedCell.classList.remove("selected");
  }
  selectedCell = cell;
  cell.classList.add("selected");
  cell.style.transform = "scale(1.1)";
  setTimeout(() =>{
    cell.style.transform = "scale(1)";
  },200);
});

let customInput = false;
ask.addEventListener("click",()=>{
  customInput = true;
  const cells = document.querySelectorAll(".cells");
  cells.forEach((cell,index) =>{
    cell.textContent = '';
    cell.classList.remove("clue");
    cell.style.color = "black";
    cell.style.fontWeight = "normal";
  });
});

solve.addEventListener("click",()=>{
  pauseTimer();
  const cells = document.querySelectorAll(".cells");
  let userPuzzle = Array.from({length:9},()=>Array(9).fill(0));
  cells.forEach((cell,index) =>{
    const value = parseInt(cell.textContent);
    const row = Math.floor(index/9);
    const col = index%9;
    if(!isNaN(value) && value>=1 && value <= 9){  
      userPuzzle[row][col] = value;
    }
  });

  if(solveSudoku(userPuzzle)){
    cells.forEach((cell,index) =>{
      const row = Math.floor(index/9);
      const col = index%9;
      const solvedValue = userPuzzle[row][col];
      cell.textContent = userPuzzle[row][col];

      if(!cell.classList.contains("clue")){
      cell.style.color = customInput ? "black" : "green";
      }
    });
  }
  else{
    alert("Not valid solution exists for the provided puzzle");
  }
  cells.forEach((cell,index) =>{
    cell.classList.add("clue");
  });
})

newgame.addEventListener("click",()=>{
  customInput = false;
  intializeGame();
  start.style.display = "inline-block";
  pause.style.display = "none";
})

resetbtn.addEventListener("click",()=>{
  customInput = false;
  const cells = document.querySelectorAll(".cells");
  cells.forEach((cell,index) =>{
    if(!(cell.classList.contains("clue"))){
      cell.innerHTML = "";
    }
  });
});

hint.addEventListener("click",()=>{
  const cells = document.querySelectorAll(".cells");
  const currentPuzzle = Array.from({length : 9},() => Array(9).fill(0));
  cells.forEach((cell,index) =>{
    const row = Math.floor(index/9);
    const col = index%9;
    const value = parseInt(cell.textContent);
    if(!isNaN(value) && value >= 1 && value <= 9){
      currentPuzzle[row][col] = value;
    }
  });
  let solvedPuzzle = JSON.parse(JSON.stringify(currentPuzzle));
  if(!solveSudoku(solvedPuzzle)){
    alert("This puzzle cannot be solved!");
    return ;
  }
  const emptyCells = [];
  cells.forEach((cell,index) =>{
    const row = Math.floor(index/9);
    const col  = index%9;
    if(currentPuzzle[row][col] === 0 && !cell.classList.contains("clue")){
      emptyCells.push({cell,row,col,correctValue: solvedPuzzle[row][col]});
    }
  });
 if(emptyCells.length === 0){
  alert("No empty cells left to provide hints!");
  return;
 }
 const randomCell = emptyCells[Math.floor(Math.random()*emptyCells.length)];

 randomCell.cell.textContent = randomCell.correctValue;
 randomCell.cell.style.color = "green";
 moveHistory.push({
  cell:randomCell.cell,
  previousValue : "",
  index : randomCell.cell.getAttribute("index"),
  wasHint : true,
 })
 randomCell.cell.style.transform = "scale(1.2)";
 setTimeout(() =>{
  randomCell.cell.style.transform = "scale(1)";
 },300);
});

const hardSudokus = [
  {
    puzzle:
  [
      [0, 0, 0, 0, 0, 0, 0, 1, 2],
      [0, 0, 0, 0, 3, 5, 0, 0, 0],
      [0, 0, 0, 7, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 3, 0, 0],
      [9, 0, 0, 0, 0, 0, 0, 0, 8],
      [0, 0, 2, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 7, 0, 0, 0],
      [0, 0, 0, 4, 1, 0, 0, 0, 0],
      [7, 4, 0, 0, 0, 0, 0, 0, 0],
    ]
  },
  {
    puzzle:
 [
      [0, 0, 0, 0, 0, 0, 9, 0, 7],
      [0, 0, 0, 0, 6, 0, 0, 0, 0],
      [0, 0, 4, 0, 0, 3, 0, 0, 0],
      [0, 0, 0, 0, 4, 0, 0, 0, 3],
      [5, 0, 0, 0, 0, 0, 0, 0, 9],
      [7, 0, 0, 0, 3, 0, 0, 0, 0],
      [0, 0, 0, 2, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 5, 0, 0, 0, 0],
      [3, 0, 5, 0, 0, 0, 0, 0, 0],
    ]
  },
  {
    puzzle:
  [
      [0, 0, 0, 0, 0, 0, 2, 0, 0],
      [0, 8, 0, 0, 0, 7, 0, 9, 0],
      [6, 0, 2, 0, 0, 0, 5, 0, 0],
      [0, 7, 0, 0, 6, 0, 0, 0, 0],
      [0, 0, 0, 9, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 2, 0, 0, 4, 0],
      [0, 0, 5, 0, 0, 0, 6, 0, 3],
      [0, 9, 0, 4, 0, 0, 0, 7, 0],
      [0, 0, 6, 0, 0, 0, 0, 0, 0],
    ]
  },
  {
    puzzle:
  [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 3, 0, 5, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 6, 0, 0],
      [0, 3, 0, 7, 0, 0, 0, 0, 0],
      [9, 0, 0, 0, 0, 0, 0, 0, 2],
      [0, 0, 0, 0, 0, 9, 0, 4, 0],
      [0, 0, 7, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 6, 0, 7, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]
  },
{
  puzzle:
     [
      [8, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 3, 6, 0, 0, 0, 0, 0],
      [0, 7, 0, 0, 9, 0, 2, 0, 0],
      [0, 5, 0, 0, 0, 7, 0, 0, 0],
      [0, 0, 0, 0, 4, 5, 7, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 3, 0],
      [0, 0, 1, 0, 0, 0, 0, 6, 8],
      [0, 0, 8, 5, 0, 0, 0, 1, 0],
      [0, 9, 0, 0, 0, 0, 4, 0, 0],
    ]
  },
  {
 puzzle:
 [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 6, 0, 0, 0, 0, 0, 3],
      [0, 7, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 8, 0, 0, 0],
      [0, 0, 0, 7, 0, 5, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 2, 0],
      [4, 0, 0, 0, 0, 0, 6, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]
  },
  {
    puzzle:
 [
      [0, 0, 0, 0, 0, 0, 4, 0, 0],
      [0, 6, 0, 0, 0, 0, 0, 0, 3],
      [0, 0, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 9, 0, 0, 0, 0],
      [5, 0, 0, 0, 0, 0, 0, 0, 6],
      [0, 0, 0, 2, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 7, 0, 0],
      [3, 0, 0, 0, 0, 0, 0, 2, 0],
      [0, 0, 2, 0, 0, 0, 0, 0, 0],
    ]
  },
  {
    puzzle:
  [
      [1, 0, 0, 0, 0, 7, 0, 9, 0],
      [0, 3, 0, 0, 2, 0, 0, 0, 8],
      [0, 0, 9, 6, 0, 0, 5, 0, 0],
      [0, 0, 5, 3, 0, 0, 9, 0, 0],
      [0, 1, 0, 0, 8, 0, 0, 0, 2],
      [6, 0, 0, 0, 0, 4, 0, 0, 0],
      [3, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 4, 1, 0, 0, 0, 0, 0, 7],
      [0, 0, 7, 0, 0, 0, 3, 0, 0],
    ]
  },
  {
    puzzle:
   [
      [0, 0, 0, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 2, 0],
      [0, 0, 0, 0, 0, 0, 3, 0, 0],
      [0, 0, 0, 0, 0, 4, 0, 0, 0],
      [0, 0, 0, 0, 5, 0, 0, 0, 0],
      [0, 0, 0, 6, 0, 0, 0, 0, 0],
      [0, 0, 7, 0, 0, 0, 0, 0, 0],
      [0, 8, 0, 0, 0, 0, 0, 0, 0],
      [9, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
  },
  {
    puzzle:
  [
      [0, 0, 0, 0, 0, 1, 0, 0, 0],
      [4, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 2, 0, 0, 0, 0, 6, 0, 0],
      [0, 0, 0, 0, 5, 0, 4, 0, 7],
      [0, 0, 8, 0, 0, 0, 3, 0, 0],
      [2, 0, 5, 0, 8, 0, 0, 0, 0],
      [0, 0, 9, 0, 0, 0, 0, 3, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 5],
      [0, 0, 0, 3, 0, 0, 0, 0, 0],
    ]
  },
  {
    puzzle:
  [
      [0, 0, 0, 0, 0, 0, 8, 0, 5],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 7, 0, 0, 0, 6, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 6, 0],
      [0, 0, 0, 3, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 2, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 9, 0, 0, 0],
      [6, 0, 0, 0, 0, 0, 0, 3, 0],
    ]
  },
  {
    puzzle:
  [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 8, 0, 0, 0, 0, 0],
      [0, 7, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 3, 0],
      [0, 0, 1, 0, 2, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 7],
      [0, 0, 0, 0, 0, 0, 0, 6, 0],
      [0, 0, 0, 0, 0, 3, 0, 0, 0],
      [0, 0, 0, 0, 0, 5, 0, 0, 0],
    ]
  },
  {
    puzzle:
   [
      [0, 0, 0, 0, 0, 0, 2, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 6, 0],
      [0, 0, 1, 0, 9, 0, 0, 0, 0],
      [0, 0, 0, 5, 0, 0, 4, 0, 7],
      [0, 0, 0, 1, 0, 9, 0, 0, 0],
      [2, 0, 6, 0, 0, 7, 0, 0, 0],
      [0, 0, 0, 0, 4, 0, 1, 0, 0],
      [0, 7, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 2, 0, 0, 0, 0, 0, 0],
    ]
  },
  {
    puzzle:
   [
      [0, 0, 0, 6, 0, 0, 4, 0, 0],
      [7, 0, 0, 0, 0, 3, 6, 0, 0],
      [0, 0, 0, 0, 9, 1, 0, 8, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 5, 0, 1, 8, 0, 0, 0, 3],
      [0, 0, 0, 3, 0, 6, 0, 4, 5],
      [0, 4, 0, 2, 0, 0, 0, 6, 0],
      [9, 0, 3, 0, 0, 0, 0, 0, 0],
      [0, 2, 0, 0, 0, 0, 1, 0, 0],
    ]
  },
  {
    puzzle:
   [
      [0, 0, 0, 0, 0, 0, 0, 1, 2],
      [0, 0, 0, 0, 3, 0, 0, 0, 0],
      [0, 0, 0, 7, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 3, 0, 0],
      [9, 0, 0, 0, 0, 0, 0, 0, 8],
      [0, 0, 2, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 7, 0, 0, 0],
      [0, 0, 0, 4, 1, 0, 0, 0, 0],
      [7, 4, 0, 0, 0, 0, 0, 0, 0],
    ]
  },
  {
    puzzle:
   [
      [0, 0, 0, 0, 0, 0, 9, 0, 7],
      [0, 0, 0, 0, 6, 0, 0, 0, 0],
      [0, 0, 4, 0, 0, 3, 0, 0, 0],
      [0, 0, 0, 0, 4, 0, 0, 0, 3],
      [5, 0, 0, 0, 0, 0, 0, 0, 9],
      [7, 0, 0, 0, 3, 0, 0, 0, 0],
      [0, 0, 0, 2, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 5, 0, 0, 0, 0],
      [3, 0, 5, 0, 0, 0, 0, 0, 0],
    ]
  },
  {
    puzzle:
   [
      [8, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 3, 6, 0, 0, 0, 0, 0],
      [0, 7, 0, 0, 9, 0, 2, 0, 0],
      [0, 5, 0, 0, 0, 7, 0, 0, 0],
      [0, 0, 0, 0, 4, 5, 7, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 3, 0],
      [0, 0, 1, 0, 0, 0, 0, 6, 8],
      [0, 0, 8, 5, 0, 0, 0, 1, 0],
      [0, 9, 0, 0, 0, 0, 4, 0, 0],
    ]
  },
  {
    puzzle:
   [
      [0, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 9],
      [0, 0, 0, 0, 0, 3, 0, 0, 0],
      [0, 0, 8, 0, 0, 0, 0, 0, 0],
      [0, 7, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 6, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 4, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [2, 0, 0, 0, 0, 0, 0, 0, 0],
    ]
  },
  {
    puzzle:
   [
      [0, 0, 0, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 2, 0],
      [0, 0, 0, 0, 0, 0, 3, 0, 0],
      [0, 0, 0, 0, 0, 4, 0, 0, 0],
      [0, 0, 0, 0, 5, 0, 0, 0, 0],
      [0, 0, 0, 6, 0, 0, 0, 0, 0],
      [0, 0, 7, 0, 0, 0, 0, 0, 0],
      [0, 8, 0, 0, 0, 0, 0, 0, 0],
      [9, 0, 0, 0, 0, 0, 0, 0, 0],
    ]
  }
];
