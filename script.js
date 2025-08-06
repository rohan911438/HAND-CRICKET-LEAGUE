// Game state variables
let playerScore = 0;
let systemScore = 0;
let innings = 1; // 1: user batting, 2: system batting (user bowling)

// DOM element references
const status1 = document.getElementById("status1");
const numberPad = document.getElementById('numberPad');
const welcomeScreen = document.getElementById('welcomeScreen');
const gameScreen = document.getElementById('gameScreen');
const tossResultEl = document.getElementById("tossResult");
const batBowlChoiceEl = document.getElementById("batBowlChoice");
const playerScoreEl = document.getElementById("score");
const systemScoreEl = document.getElementById("sysScore");
const userHandImg = document.getElementById('userHandImg');
const compHandImg = document.getElementById('compHandImg');
const userHandScoreEl = document.getElementById('userHandScore');
const compHandScoreEl = document.getElementById('compHandScore');
const userChoiceEl = document.getElementById("userChoice");
const sysChoiceEl = document.getElementById("sysChoice");

// --- Mobile Experience Enhancements ---

document.addEventListener('gesturestart', (e) => e.preventDefault());
document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('touchstart', function() { this.style.transform = 'scale(0.95)'; });
        button.addEventListener('touchend', function() { this.style.transform = ''; });
    });
});

// --- Game Logic ---

/**
 * Centralized function to update the main status message based on the current game state.
 * @param {string|null} outcome - A special outcome to display temporarily (e.g., 'USER_OUT').
 */
function updateStatusMessage(outcome = null) {
    if (outcome === 'USER_OUT') {
        status1.innerText = "You are OUT! Your turn to bowl.";
    } else if (innings === 1) {
        status1.innerText = "You are Batting...";
    } else if (innings === 2) {
        status1.innerText = "You are Bowling...";
    }
}

/**
 * Handles the coin toss.
 * @param {string} userCall - "Heads" or "Tails".
 */
function toss(userCall) {
    const result = Math.random() < 0.5 ? "Heads" : "Tails";
    tossResultEl.innerText = `Toss Result: ${result}`;

    if (userCall === result) {
        tossResultEl.innerText += " — You won the toss!";
        batBowlChoiceEl.style.display = "block";
    } else {
        const compChoice = Math.random() < 0.5 ? "Bat" : "Ball";
        tossResultEl.innerText += ` — System won and chose to ${compChoice}.`;
        const userPlay = compChoice === "Ball" ? "Bat" : "Ball";
        setTimeout(() => startGame(userPlay), 2000);
    }
}

/**
 * Starts the game after the toss decision.
 * @param {string} choice - "Bat" or "Ball".
 */
function choosePlay(choice) {
    startGame(choice);
}

/**
 * Initializes the game screen and state.
 * @param {string} userPlay - The action the user will perform ("Bat" or "Ball").
 */
function startGame(userPlay) {
    innings = (userPlay === "Bat") ? 1 : 2;
    welcomeScreen.style.display = "none";
    gameScreen.style.display = "block";
    
    updateStatusMessage();
    updateScoresUI();
    resetHandsToShake();
}

/**
 * Processes a single "delivery" in the game.
 * @param {number} userChoice - The number the user played (0-6).
 */
function Score(userChoice) {
    resetHandsToShake();
    numberPad.style.pointerEvents = 'none';

    setTimeout(() => {
        const sysChoice = Math.floor(Math.random() * 7);
        updateHandImages(userChoice, sysChoice);
        userChoiceEl.innerText = "Player: " + userChoice;
        sysChoiceEl.innerText = "System: " + sysChoice;

        if (innings === 1) { // User is batting
            if (userChoice === sysChoice) {
                innings = 2; // Change innings
                updateStatusMessage('USER_OUT');
                setTimeout(() => {
                    updateStatusMessage();
                    resetHandsToShake();
                }, 2000);
            } else {
                playerScore += userChoice;
                updateStatusMessage();
            }
        } else { // User is bowling (System is batting)
            if (userChoice === sysChoice) {
                endGame(); // System is out
            } else {
                systemScore += sysChoice;
                if (systemScore > playerScore) {
                    endGame(); // System wins by chasing score
                } else {
                    updateStatusMessage();
                }
            }
        }
        
        updateScoresUI();
        numberPad.style.pointerEvents = 'auto';
    }, 500);
}

/**
 * Ends the game and displays the result.
 */
function endGame() {
    let msg = "";
    if (playerScore > systemScore) {
        msg = `🎉 YOU WON by ${playerScore - systemScore} runs!`;
    } else if (systemScore > playerScore) {
        msg = `💻 SYSTEM WON by ${systemScore - playerScore} runs!`;
    } else {
        msg = "🤝 It's a TIE!";
    }
    status1.innerHTML = `${msg}<br><button onclick="resetGame()">Play Again</button>`;
    numberPad.style.display = 'none';
}

/**
 * Resets the game to its initial state.
 */
function resetGame() {
    playerScore = 0;
    systemScore = 0;
    innings = 1;

    playerScoreEl.innerText = 'YOUR SCORE: 0';
    systemScoreEl.innerText = 'SYSTEM SCORE: 0';
    userChoiceEl.innerText = 'Player: ';
    sysChoiceEl.innerText = 'System: ';
    status1.innerText = '';
    
    numberPad.style.display = 'block';
    gameScreen.style.display = 'none';
    welcomeScreen.style.display = 'flex';
    
    tossResultEl.innerText = '';
    batBowlChoiceEl.style.display = 'none';
}

// --- UI Helper Functions ---

function updateScoresUI() {
    playerScoreEl.innerText = `YOUR SCORE: ${playerScore}`;
    systemScoreEl.innerText = `SYSTEM SCORE: ${systemScore}`;
    userHandScoreEl.innerText = `Your Score: ${playerScore}`;
    compHandScoreEl.innerText = `System Score: ${systemScore}`;
}

function setHandImage(imgId, val, who) {
    const imgMap = { 0: 'zero', 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'thumb' };
    const imgName = `${imgMap[val]}_${who}.jpg`;
    const imgElem = document.getElementById(imgId);
    imgElem.src = 'hand_gestures/' + imgName;
    imgElem.alt = `${who} hand showing ${val}`;
}

function animateHandShake(imgId) {
    const img = document.getElementById(imgId);
    img.classList.remove('hand-shake');
    void img.offsetWidth;
    img.classList.add('hand-shake');
}

function resetHandsToShake() {
    setHandImage('userHandImg', 0, 'player');
    setHandImage('compHandImg', 0, 'computer');
    animateHandShake('userHandImg');
    animateHandShake('compHandImg');
}

function updateHandImages(userVal, compVal) {
    setHandImage('userHandImg', userVal, 'player');
    setHandImage('compHandImg', compVal, 'computer');
    userHandImg.classList.remove('hand-shake');
    compHandImg.classList.remove('hand-shake');
}
