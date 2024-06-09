const how_to_play_link = document.querySelector(".js_how_to_play");
const instructions_div = document.querySelector(".js_instructions");
const gridElement = document.querySelector(".js_grid"); 
const gridBlocks = gridElement.children;
const score = document.querySelector(".js_score");
const best = document.querySelector(".js_best");
const game_status_div = document.querySelector(".js_div_game_status");
const intervalArr = [-1,-1,-1,-1];
let changestoGrid = 0;

let game_over = true;
let grid = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
let before_grid =  [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
let scoreObj = JSON.parse(localStorage.getItem("score"));
if (scoreObj==null){
    scoreObj={
    currentScore :0,
    bestScore :0
    }
};

updateScore();

function updateScore(){
    score.innerText = scoreObj.currentScore;
    best.innerText = scoreObj.bestScore;
}

how_to_play_link.addEventListener("click",()=>{
    if (how_to_play_link.innerText=="How to play"){
        showInstructions();
    }
    else{
        hideInstructions();
    }
});

document.querySelector(".js_new_game_button").addEventListener("click",()=>newGame());

document.body.addEventListener("keydown",(event)=>{
    if (game_over!=true){
        switch (event.key) {
            case "ArrowDown":
                    moveDown();
                    postMove();
                    break;
            case "ArrowLeft":
                    moveLeft();
                    postMove();
                    break;
            case "ArrowRight":
                    moveRight();
                    postMove();
                    break;
            case "ArrowUp":
                    moveUp();
                    postMove();
                    break;
        }
    }
});

function showInstructions(){
    how_to_play_link.innerText="Hide instructions";
    how_to_play_link.classList.add("hide_instruction");
    instructions_div.classList.add("instructions_block");
    instructions_div.classList.remove("instructions_none");
};

function hideInstructions(){
    how_to_play_link.innerText="How to play";
    how_to_play_link.classList.remove("hide_instruction");
    instructions_div.classList.add("instructions_none");
    instructions_div.classList.remove("instructions_block");
}

function newGame(){
    gridElement.classList.remove("grid_game_over");
    game_status_div.innerText="";
    game_status_div.classList.remove("div_game_won");
    game_status_div.classList.remove("div_game_over");

    intervalArr.forEach((value,index)=>{
        if (value!=-1) {
            clearInterval(value);
            intervalArr[index]=-1;
        }
    });
    if (game_over==false){
        scoreObj.currentScore=0;
        localStorage.setItem("score",JSON.stringify(scoreObj));
    }
    else{
        scoreObj = JSON.parse(localStorage.getItem("score"));
        if (scoreObj==null){
            scoreObj={
            currentScore :0,
            bestScore :0
            }
        };        
    }
    updateScore();
    console.log("new_game");
    game_over=false;
    
    updateScore();
    clearGrid();
    grid = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
    before_grid =  [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
    generateRandom2();
    generateRandom2();
    displayGrid();
}

function checkGameOver(){
    let temp = grid.slice();
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          if (grid[row][col]==0){
            return false; //not over yet
          };
        }   
     }
    changestoGrid=0;
    moveUp();
    if (changestoGrid==0){//grid still unchanged?
        moveDown();
        if (changestoGrid==0){ //grid still unchanged?
            moveLeft();
            if (changestoGrid==0) { //grid still unchanged?
                moveRight();
                if (changestoGrid==0) { //grid still unchanged?
                    return true;
                } else{return false;}
            } else{return false;}
        } else{return false;}
    } else{return false;}
}
function showGameStatus(param) {
    gridElement.classList.add("grid_game_over");
    if (param()) {
        game_status_div.classList.add("div_game_won");  
        intervalArr[0] = setInterval(()=>{
            game_status_div.innerText = "game won!";
        },400); 
        intervalArr[1] = setInterval(()=>{
            game_status_div.innerText = "";
        },800); 
    }
    else{
        game_status_div.classList.add("div_game_over");  
        intervalArr[2] = setInterval(()=>{
            game_status_div.innerText = "game over!";
        },400); 
        intervalArr[3] = setInterval(()=>{
            game_status_div.innerText = "";
        },800); 
    }
}

let checkWon = ()=> {
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (grid[row][col==2048]){return true;}
        }
    }
    return false;
}
function clearGrid(){
    Array.from(gridBlocks).forEach((value) => {
        value.innerText="";
    });
}

function displayGrid(){
    clearGrid();
    for (let row=0;row<4;row++){
        for (let col = 0; col < 4; col++) {
            if (grid[row][col]!=0){
                let block = document.querySelector(`.js_grid_r${row}c${col}`);
                block.innerText=grid[row][col];
                if (grid[row][col]==2*before_grid[row][col]){
                    block.classList.add("grid_block_animation");
                    setTimeout(() => {
                    block.classList.remove("grid_block_animation");
                    }, 400);
                }
            }   
        }
    }
}
function generateRandom2(){
    let random_row = 0;
    let random_col = 0; 
    do
    {
        random_row = Math.floor(Math.random()*4);
        random_col = Math.floor(Math.random()*4);
    }   
    while(grid[random_row][random_col]!=0);
    grid[random_row][random_col]=2;
}

function moveUp(){
    before_grid = JSON.parse(JSON.stringify(grid));
    for (let col=0;col<4;col++){
        for (let row = 0; row < 3; row++) {
            let value = grid[row][col];
            let nextRow = false;
            let index = row+1;
            while ((!nextRow) && (index<4)){
                if (value!=0){
                    if (value == grid[index][col]){
                        grid[row][col]=value*2;
                        scoreObj.currentScore +=value*2;
                        changestoGrid++;
                        if (scoreObj.currentScore>scoreObj.bestScore){
                            scoreObj.bestScore=scoreObj.currentScore;
                        }
                        updateScore();
                        grid[index][col]=0;
                        nextRow=true;
                    }
                    else{
                        if (grid[index][col]==0){index++;}
                        else{nextRow=true;}
                    }
                }
                else{
                    if (value != grid[index][col]){
                        value = grid[index][col];
                        grid[row][col]=value;
                        grid[index][col]=0;
                        index++;
                    }
                    else{
                        index++;
                    }
                }
            }
        }
    }
}

function moveDown(){
    before_grid = JSON.parse(JSON.stringify(grid));
    for (let col=0;col<4;col++){
        for (let row = 3; row >0; row--) {
            let value = grid[row][col];
            let nextRow = false;
            let index = row-1;
            while ((!nextRow) && (index>-1)){
                if (value!=0){
                    if (value == grid[index][col]){
                        grid[row][col]=value*2;
                        changestoGrid++;
                        scoreObj.currentScore +=value*2;
                        if (scoreObj.currentScore>scoreObj.bestScore){
                            scoreObj.bestScore=scoreObj.currentScore;
                        }
                        updateScore();
                        grid[index][col]=0;
                        nextRow=true;
                    }
                    else{
                        if (grid[index][col]==0){index--;}
                        else{nextRow=true;}
                    }
                }
                else{
                    if (value != grid[index][col]){
                        value = grid[index][col];
                        grid[row][col]=value;
                        grid[index][col]=0;
                        index--;
                    }
                    else{
                        index--;
                    }
                }
            }
        }
    }
}

function moveRight(){
    before_grid = JSON.parse(JSON.stringify(grid));
    for (let row=0;row<4;row++){
        for (let col = 3; col >0; col--) {
            let value = grid[row][col];
            let nextCol = false;
            let index = col-1;
            while ((!nextCol) && (index>-1)){
                if (value!=0){
                    if (value == grid[row][index]){
                        grid[row][col]=value*2;
                        changestoGrid++;
                        scoreObj.currentScore +=value*2;
                        if (scoreObj.currentScore>scoreObj.bestScore){
                            scoreObj.bestScore=scoreObj.currentScore;
                        }
                        updateScore();
                        grid[row][index]=0;
                        nextCol=true;
                    }
                    else{
                        if (grid[row][index]==0){index--;}
                        else{nextCol=true;}
                    }
                }
                else{
                    if (value != grid[row][index]){
                        value = grid[row][index];
                        grid[row][col]=value;
                        grid[row][index]=0;
                        index--;
                    }
                    else{
                        index--;
                    }
                }
            }
        }
    }
}

function moveLeft(){
    before_grid = JSON.parse(JSON.stringify(grid));
    console.log(before_grid);
    for (let row=0;row<4;row++){
        for (let col = 0; col < 3; col++) {
            let value = grid[row][col];
            let nextCol = false;
            let index = col+1;
            while ((!nextCol) && (index<4)){
                if (value!=0){
                    if (value == grid[row][index]){
                        grid[row][col]=value*2;
                        changestoGrid++;
                        scoreObj.currentScore +=value*2;
                        if (scoreObj.currentScore>scoreObj.bestScore){
                            scoreObj.bestScore=scoreObj.currentScore;
                        }
                        updateScore();
                        grid[row][index]=0;
                        nextCol=true;
                    }
                    else{
                        if (grid[row][index]==0){index++;}
                        else{nextCol=true;}
                    }
                }
                else{
                    if (value != grid[row][index]){
                        value = grid[row][index];
                        grid[row][col]=value;
                        grid[row][index]=0;
                        index++;
                    }
                    else{
                        index++;
                    }
                }
            }
        }
    }
}

function postMove() {
    displayGrid();
    if (checkGameOver()){
        game_over=true;
        scoreObj.currentScore=0;
        localStorage.setItem("score",JSON.stringify(scoreObj));
        showGameStatus(checkWon);
    }
    else{
        generateRandom2();
        displayGrid();
    }
}