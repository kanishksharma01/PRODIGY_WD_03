let boxes = document.querySelectorAll(".box");
let resetbtn = document.querySelector("#reset-btn");
let gamebtn = document.querySelector("#NEWGAME");
let msgcontainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");

let turn0 = true; // true = "O" (Player), false = "X" (AI)
const winpattern = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

const resetGame = () => {
    turn0 = true;  // Player starts with 'O'
    enableBoxes();
    msgcontainer.classList.add("hide");
    updateTurnMessage();
};

const disableBoxes = () => {
    for (let box of boxes) {
        box.classList.add('disabled');
        box.removeEventListener('click', handleClick);
    }
};

const enableBoxes = () => {
    for (let box of boxes) {
        box.classList.remove('disabled');
        box.innerText = "";
        box.addEventListener('click', handleClick);
    }
};

const showWinner = (winner) => {
    msg.innerText = `CONGRATULATIONS, WINNER IS ${winner}`;
    msgcontainer.classList.remove("hide");
    disableBoxes();
};

const checkWinner = () => {
    for (let pattern of winpattern) {
        let pos1val = boxes[pattern[0]].innerText;
        let pos2val = boxes[pattern[1]].innerText;
        let pos3val = boxes[pattern[2]].innerText;

        if (pos1val !== "" && pos2val !== "" && pos3val !== "") {
            if (pos1val === pos2val && pos2val === pos3val) {
                showWinner(pos1val);
                return true; // Stop checking after finding a winner
            }
        }
    }
    return false;
};

const checkDraw = () => {
    for (let box of boxes) {
        if (box.innerText === "") {
            return false; // If any box is empty, it's not a draw
        }
    }
    showWinner("No one, it's a DRAW!");
    return true;
};

const updateTurnMessage = () => {
    msg.innerText = `Player ${turn0 ? "O" : "X"}'s Turn`;
};

// Function to make AI move
const aiMove = () => {
    let bestMove = getBestMove();
    boxes[bestMove].innerText = "X";
    boxes[bestMove].removeEventListener('click', handleClick);
    turn0 = true; // Switch back to the player's turn
    checkWinner();
    checkDraw();
    updateTurnMessage();
};

// Function to get the best move for the AI (Simple Strategy)
const getBestMove = () => {
    // Check if AI can win or block the player
    let move = findBestMove("X");
    if (move !== -1) return move;

    move = findBestMove("O");
    if (move !== -1) return move;

    // If no immediate winning or blocking move, pick a random empty spot
    let availableMoves = [];
    boxes.forEach((box, index) => {
        if (box.innerText === "") {
            availableMoves.push(index);
        }
    });
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
};

// Function to check for a winning or blocking move for a given player
const findBestMove = (player) => {
    for (let pattern of winpattern) {
        let values = pattern.map(index => boxes[index].innerText);
        let emptyIndex = pattern.find(index => boxes[index].innerText === "");

        // If one box is empty and the other two boxes are the same (player's move), it's a winning/blocking move
        if (values.filter(val => val === player).length === 2 && emptyIndex !== undefined) {
            return emptyIndex;
        }
    }
    return -1; // No winning or blocking move found
};

const handleClick = (event) => {
    const box = event.target;
    if (box.innerText !== "") return; // Ignore if the box is already filled

    // Player's move
    if (turn0) {
        box.innerText = "O";
        turn0 = false; // Switch to AI's turn
        box.removeEventListener('click', handleClick);
        checkWinner();
        checkDraw();
        updateTurnMessage();
        
        // AI makes its move after player
        if (!checkWinner() && !checkDraw()) {
            setTimeout(aiMove, 500); // Delay AI move for a smooth transition
        }
    }
};

boxes.forEach((box) => {
    box.addEventListener("click", handleClick);
});

gamebtn.addEventListener("click", resetGame);
resetbtn.addEventListener("click", resetGame);
