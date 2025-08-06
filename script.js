// Game state variables
let playerScore = 0;
let systemScore = 0;
let userChoice = 0;
let innings = 1; // 1: user batting, 2: system batting

// DOM element references
const status1 = document.getElementById("status1");
const status2 = document.getElementById("status2");
const status3 = document.getElementById("status3");
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

// Prevent zoom on double tap
document.addEventListener('gesturestart', (e) => e.preventDefault());

// Prevent context menu on long press
document.addEventListener('contextmenu', (e) => e.preventDefault());

// Add touch feedback to buttons on load
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        });
        button.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });
});

// --- Game Logic ---

// 1. Toss
function toss(userCall) {
    const result = Math.random() < 0.5 ? "Heads" : "Tails";
    tossResultEl.innerText = `Toss Result: ${result}`;

    if (userCall === result) {
        tossResultEl.innerText += " — You won the toss!";
        batBowlChoiceEl.style.display = "block";
    } else {
        const compChoice = Math.random() < 0.5 ? "Bat" : "Ball";
        tossResultEl.innerText += ` — System won the toss and chose to ${compChoice}.`;
        
        // If system chooses to Ball, user has to Bat, and vice-versa.
        const userPlay = compChoice === "Ball" ? "Bat" : "Ball";
        setTimeout(() => startGame(userPlay), 2000);
    }
}

// 2. User chooses to Bat or Bowl
function choosePlay(choice) {
    startGame(choice);
}

// 3. Start the Game
function startGame(userPlay) {
    // Set innings based on user's choice
    innings = (userPlay === "Bat") ? 1 : 2;

    welcomeScreen.style.display = "none";
    gameScreen.style.display = "block";
    
    status1.innerText = (innings === 1) ? "You are Batting..." : "You are Bowling...";
    
    // Initial UI setup
    updateScoresUI();
    resetHandsToShake();
}

// 4. A "delivery" is played
function Score(val) {
    resetHandsToShake();
    numberPad.style.pointerEvents = 'none'; // Disable buttons during play

    setTimeout(() => {
        userChoice = val;
        const sysChoice = Math.floor(Math.random() * 7); // 0-6

        updateHandImages(userChoice, sysChoice);
        userChoiceEl.innerText = "Player: " + userChoice;
        sysChoiceEl.innerText = "System: " + sysChoice;

        if (innings === 1) { // User is batting
            if (userChoice === sysChoice) {
                // User is OUT
                innings = 2;
                status1.innerText = "You are OUT! Your turn to bowl.";
                setTimeout(() => {
                    status1.innerText = "You are Bowling...";
                    updateScoresUI();
                    resetHandsToShake();
                }, 2000);
            } else {
                playerScore += userChoice;
                status1.innerText = "You are Batting...";
            }
        } else { // System is batting
            if (userChoice === sysChoice) {
                // System is OUT
                endGame();
            } else {
                systemScore += sysChoice;
                if (systemScore > playerScore) {
                    endGame(); // System wins by chasing score
                } else {
                    status1.innerText = "You are Bowling...";
                }
            }
        }
        
        updateScoresUI();
        numberPad.style.pointerEvents = 'auto'; // Re-enable buttons
    }, 500); // 0.5s for hand shake animation
}

// 5. End the Game
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

// 6. Reset Game
function resetGame() {
    playerScore = 0;
    systemScore = 0;
    userChoice = 0;
    innings = 1;

    // Reset UI elements
    playerScoreEl.innerText = 'YOUR SCORE: 0';
    systemScoreEl.innerText = 'SYSTEM SCORE: 0';
    userHandScoreEl.innerText = 'Your Score: 0';
    compHandScoreEl.innerText = 'System Score: 0';
    userChoiceEl.innerText = 'Player: ';
    sysChoiceEl.innerText = 'System: ';
    status1.innerText = '';
    status2.innerText = '';
    status3.innerText = '';
    
    numberPad.style.display = 'block';
    
    // Go back to welcome screen
    gameScreen.style.display = 'none';
    welcomeScreen.style.display = 'flex';
    
    // Reset toss UI
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
    const imgMap = {
        0: 'zero', 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'thumb'
    };
    const imgName = `${imgMap[val] || 'thumb'}_${who}.jpg`;
    const imgElem = document.getElementById(imgId);
    imgElem.src = 'hand_gestures/' + imgName;
    imgElem.alt = `${who} hand showing ${val}`;
}

function animateHandShake(imgId) {
    const img = document.getElementById(imgId);
    img.classList.remove('hand-shake');
    void img.offsetWidth; // Trigger reflow to restart animation
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