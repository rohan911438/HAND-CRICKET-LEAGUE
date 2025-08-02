
let scr = 0;
let syscr = 0;
let userBat = true;
let sysBat = false;
let userChoice = 0;
let innings = 1; // 1: user batting, 2: computer batting

const s1 = document.getElementById("status1");
const s2 = document.getElementById("status2");
const s3 = document.getElementById("status3");

// Prevent zoom on double tap for better mobile experience
document.addEventListener('gesturestart', function (e) {
    e.preventDefault();
});

// Prevent context menu on long press for better mobile UX
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

// Add touch feedback for better mobile interaction
function addTouchFeedback(element) {
    element.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.95)';
    });
    
    element.addEventListener('touchend', function() {
        this.style.transform = '';
    });
}

// Initialize mobile enhancements when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    // Add touch feedback to all buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(addTouchFeedback);
});

// Toss handling
function toss(userCall) {
    const result = Math.random() < 0.5 ? "Heads" : "Tails";
    const tossResult = document.getElementById("tossResult");

    tossResult.innerText = `Toss Result: ${result}`;
    
    if (userCall === result) {
        tossResult.innerText += " — You won the toss!";
        document.getElementById("batBowlChoice").style.display = "block";
    } else {
        const compChoice = Math.random() < 0.5 ? "Bat" : "Ball";
        tossResult.innerText += ` — System won the toss and chose to ${compChoice}`;
        
        setTimeout(() => {
            startGame(compChoice === "Ball" ? "Bat" : "Ball");
        }, 2000);
    }
}

function choosePlay(choice) {
    startGame(choice);
}

function startGame(userPlay) {
    if (userPlay === "Bat") {
        userBat = true;
        sysBat = false;
    } else {
        userBat = false;
        sysBat = true;
    }

    document.getElementById("welcomeScreen").style.display = "none";
    document.getElementById("gameScreen").style.display = "block";
    s1.innerText = userBat ? "You are Batting..." : "System is Batting...";
    // Show closed fist with shake at start
    setHandImage('userHandImg', 0, 'player');
    setHandImage('compHandImg', 0, 'computer');
    animateHandShake('userHandImg');
    animateHandShake('compHandImg');
    document.getElementById('userHandScore').innerText = 'Your Score: 0';
    document.getElementById('compHandScore').innerText = 'System Score: 0';
}

// Main game logic
function Score(val) {
    // Show shake with closed fist before showing the selected gesture
    setHandImage('userHandImg', 0, 'player');
    setHandImage('compHandImg', 0, 'computer');
    animateHandShake('userHandImg');
    animateHandShake('compHandImg');

    // Disable number pad during animation
    document.getElementById('numberPad').style.pointerEvents = 'none';

    setTimeout(() => {
        userChoice = val;
        const sysChoice = Math.floor(Math.random() * 7); // 0-6

        // Show hand areas
        document.getElementById('userHandArea').style.display = 'block';
        document.getElementById('compHandArea').style.display = 'block';

        // Show selected hand gestures (static, no shake)
        setHandImage('userHandImg', userChoice, 'player');
        setHandImage('compHandImg', sysChoice, 'computer');
        document.getElementById('userHandImg').classList.remove('hand-shake');
        document.getElementById('compHandImg').classList.remove('hand-shake');

        // Update scores below images
        document.getElementById('userHandScore').innerText = `Your Score: ${scr}`;
        document.getElementById('compHandScore').innerText = `System Score: ${syscr}`;

        document.getElementById("userChoice").innerText = "Player: " + userChoice;
        document.getElementById("sysChoice").innerText = "System: " + sysChoice;

        if (innings === 1) {
            // User batting
            if (userChoice === sysChoice) {
                userBat = false;
                sysBat = true;
                innings = 2;
                s1.innerText = "You are OUT! Now Computer bats.";
                setTimeout(() => {
                    s1.innerText = "System is Batting...";
                    document.getElementById('score').innerText = `YOUR SCORE: ${scr}`;
                    // Reset hands to closed fist for new innings with shake
                    setHandImage('userHandImg', 0, 'player');
                    setHandImage('compHandImg', 0, 'computer');
                    animateHandShake('userHandImg');
                    animateHandShake('compHandImg');
                }, 2000);
            } else {
                scr += userChoice;
                document.getElementById("score").innerText = `YOUR SCORE: ${scr}`;
                s1.innerText = "You are Batting..";
            }
        } else if (innings === 2) {
            // Computer batting
            if (userChoice === sysChoice) {
                sysBat = false;
                endGame();
            } else {
                syscr += sysChoice;
                document.getElementById("sysScore").innerText = `SYSTEM SCORE: ${syscr}`;
                if (syscr > scr) {
                    endGame();
                } else {
                    s1.innerText = "System is Batting...";
                }
            }
        }
        // Re-enable number pad
        document.getElementById('numberPad').style.pointerEvents = 'auto';
    }, 500); // 0.5s shake before showing gesture
}

function endGame() {
    let msg = "";
    if (scr > syscr) {
        msg = `🎉 YOU WON by ${scr - syscr} runs!`;
    } else if (syscr > scr) {
        msg = `💻 SYSTEM WON by ${syscr - scr} runs!`;
    } else {
        msg = "🤝 It's a TIE!";
    }
    s1.innerHTML = msg + '<br><button onclick="resetGame()">Play Again</button>';
    document.getElementById('numberPad').style.display = 'none';
}

function resetGame() {
    // Reset all game state
    scr = 0;
    syscr = 0;
    userBat = true;
    sysBat = false;
    userChoice = 0;
    innings = 1;
    document.getElementById('score').innerText = 'YOUR SCORE: 0';
    document.getElementById('sysScore').innerText = 'SYSTEM SCORE: 0';
    document.getElementById('userHandArea').style.display = 'block';
    document.getElementById('compHandArea').style.display = 'block';
    setHandImage('userHandImg', 0, 'player');
    setHandImage('compHandImg', 0, 'computer');
    animateHandShake('userHandImg');
    animateHandShake('compHandImg');
    document.getElementById('userHandScore').innerText = 'Your Score: 0';
    document.getElementById('compHandScore').innerText = 'System Score: 0';
    document.getElementById('userChoice').innerText = 'Player: ';
    document.getElementById('sysChoice').innerText = 'System: ';
    document.getElementById('numberPad').style.display = 'block';
    s1.innerText = 'You are Batting...';
    s2.innerText = '';
    s3.innerText = '';
    // Go back to welcome screen
    document.getElementById('gameScreen').style.display = 'none';
    document.getElementById('welcomeScreen').style.display = 'flex';
    // Reset toss and bat/bowl choice UI
    document.getElementById('tossResult').innerText = '';
    document.getElementById('batBowlChoice').style.display = 'none';
}

function setHandImage(imgId, val, who) {
    // who: 'player' or 'computer'
    let imgName = '';
    switch(val) {
        case 0: imgName = 'zero_' + who + '.jpg'; break; // closed fist for 0
        case 1: imgName = 'one_' + who + '.jpg'; break;
        case 2: imgName = 'two_' + who + '.jpg'; break;
        case 3: imgName = 'three_' + who + '.jpg'; break;
        case 4: imgName = 'four_' + who + '.jpg'; break;
        case 5: imgName = 'five_' + who + '.jpg'; break;
        case 6: imgName = 'thumb_' + who + '.jpg'; break; // thumb for 6
        default: imgName = 'thumb_' + who + '.jpg';
    }
    const imgElem = document.getElementById(imgId);
    imgElem.src = 'hand_gestures/' + imgName;
    imgElem.alt = who + ' hand ' + val;
}

function animateHandShake(imgId) {
    const img = document.getElementById(imgId);
    img.classList.remove('hand-shake');
    void img.offsetWidth; // trigger reflow
    img.classList.add('hand-shake');
}

function userOut() {
    s1.innerHTML = "You are OUT!";
    userBat = false;
    sysBat = true;
    document.getElementById("userChoice").innerHTML = '';
    setTimeout(() => {
        s1.innerHTML = "System is Batting...";
    }, 3000);
}

function sysOut() {
    if (syscr > scr) {
        sysWin();
    } else {
        userWin();
    }
}

function userWin() {
    s1.innerHTML = '';
    s2.innerHTML = "🎉 YOU WON!<br>Reload to play again.";
    closeAll();
}

function sysWin() {
    s1.innerHTML = '';
    s3.innerHTML = "💻 SYSTEM WON!<br>Reload to play again.";
    closeAll();
}

function closeAll() {
    for (let i = 0; i <= 6; i++) {
        document.getElementById("btn" + i).style.visibility = "hidden";
    }
}
