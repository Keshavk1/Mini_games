 let boxes = document.querySelectorAll(".cells");
 let resetbtn = document.querySelector("#reset-btn");
 let newGamebtn = document.querySelector(".newgame");
 let msgContainer = document.querySelector(".msg-container");
 let msg = document.querySelector("#msg");
 let turn0 = true;  // player X, playerO
 const winpatterns = [
   [0,1,2],
   [0,3,6],
   [0,4,8],
   [1,4,7],
   [2,5,8],
   [2,4,6],
   [3,4,5],
   [6,7,8],
 ];
boxes.forEach((box) =>{
 box.addEventListener("click",() =>{
    if(turn0){
     box.innerText = "O";
     box.style.color = "blue";
     box.style.textShadow = "0 0 10px #00f,0 0 20px #00f";
     turn0 = false;
    }
    else{
      box.innerText = "X";
      box.style.color = "red";
      box.style.textShadow = "0 0 10px #f00,0 0 20px #f00";
      turn0 = true;
    }
    box.disabled = true;
    checkWinner();
 })
});

const checkWinner = () =>{
 for(pattern of winpatterns){
   let pos1 = boxes[pattern[0]].innerText;
   let pos2 = boxes[pattern[1]].innerText;
   let pos3 = boxes[pattern[2]].innerText;
   if(pos1 != "" && pos1 === pos2 && pos2 === pos3 && pos1 === pos3){
    showWinner(pos1);
    disabledAllBoxes();
    return;
   }
 }
 let allfilled = true;
 boxes.forEach((box) =>{
  if(box.innerText === "") allfilled = false;
 });
 if(allfilled){
    showWinner("Draw");
 }
};

const disabledAllBoxes = () =>{
 boxes.forEach((box) =>{
  box.disabled = true;
 });
};
const showWinner = (winner) => {
  if(winner === "Draw"){
    msg.innerText = `${winner}`;
  }
  else{
  msg.innerText = `Player ${winner} wins! 🎉`;
  confetti({
    particleCount: 150,
    spread: 100,
    origin: { y: 0.6 },
  });
}
  msgContainer.classList.remove("hide");
  msgContainer.classList.add("show");
}; 

newGamebtn.addEventListener("click",() =>{
 turn0 = !turn0;
 boxes.forEach((box) => {
   box.innerText = "";
   box.disabled = false;
 });
 msgContainer.classList.add("hide");
})
resetbtn.addEventListener("click" , ()=>{
 turn0 = !turn0;
 boxes.forEach((box)=>{
  box.innerText = "";
  box.disabled = false;
 });
 msgContainer.classList.add("hide");
})
