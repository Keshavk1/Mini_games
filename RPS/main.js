let userscore = 0;
let computerscore = 0;
let pscore = document.querySelector("#pscore");
let cscore = document.querySelector("#cscore");
const choices = document.querySelectorAll(".choice");
let result = document.querySelector(".result");
// modular way of programming making functions.
const genCompChoice = () =>{
 const options = ["rock","paper","scissor"];
 const randIdx = Math.floor(Math.random()*options.length);
 return options[randIdx];
};

function drawGame(){
   result.innerText = "It's draw";
   result.style.backgroundColor = "white";
   result.style.color = "#7e4afc";
}

function showWinner(userWin){
 if(userWin){
  userscore++;
  result.innerText = "Congratulation you beat AI";
  result.style.color = "white";
  result.style.backgroundColor = "green";
  pscore.innerText = `${userscore}`;
 }
 else{
  computerscore++;
  result.innerText = "AI beats you.";
  result.style.color = "white";
  result.style.backgroundColor = "red";
  cscore.innerText =`${computerscore}`;
 }
}
const playGame = (userChoice) =>{
  const compchoice = genCompChoice();
  if(userChoice === compchoice){
    drawGame();
  }
  else{
   let userWin = true;
   if(userChoice === "rock"){
    userWin = (compchoice === "paper")? false : true;
   }
   else if(userChoice === "scissor"){
    userWin = (compchoice === "rock") ? false : true;
   }
   else{
    userWin = (compchoice === "scissor") ? false : true;
   }
   showWinner(userWin);
  }
}
choices.forEach((choice) =>{
 choice.addEventListener("click",()=>{
  const userchoice = choice.getAttribute("id");
  playGame(userchoice);
 })
})