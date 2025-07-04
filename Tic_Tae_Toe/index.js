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
   [6,6,8],
 ];
boxes.forEach((box) =>{
 box.addEventListener("click",() =>{
    if(turn0){
     box.innerText = "O";
     turn0 = false;
    }
    else{
      box.innerText = "X";
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
   if(pos1 != "" && pos1 === pos2 && pos2 === pos3){
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
  msg.innerText = `Player ${winner} wins! 🎉`;
  msgContainer.classList.remove("hide");
  msgContainer.classList.add("show");
  confetti({
    particleCount: 150,
    spread: 100,
    origin: { y: 0.6 },
  });
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
