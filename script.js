const listOfAllDice = document.querySelectorAll('.die');
const scoreInputs = document.querySelectorAll('#score-options input');
const scoreSpans = document.querySelectorAll('#score-options span');
const currentRound = document.getElementById('current-round');
const currentRoundRolls = document.getElementById('current-round-rolls');
const totalScore = document.getElementById('total-score');
const scoreHistory = document.getElementById('score-history');
const rollDiceBtn = document.getElementById('roll-dice-btn');
const keepScoreBtn = document.getElementById('keep-score-btn');
const rulesBtn = document.getElementById('rules-btn');
const rulesContainer = document.querySelector('.rules-container');

let diceValuesArr = [];
let isModalShowing = false;
let rolls = 0;
let score = 0;
let total = 0;
let round = 1;

const rollDice = () => {
    diceValuesArr = [];

    for (let i = 0; i < 5; i++) {
        const randomDieValue = Math.floor(Math.random() * 6) + 1;
        diceValuesArr.push(randomDieValue);
    };

    listOfAllDice.forEach((die, index) => die.textContent = diceValuesArr[index]);
}

const updateStats = () => {
    currentRound.textContent = round;
    currentRoundRolls.textContent = rolls;
}

const updateRadioOption = (index, score) => {
    scoreInputs[index].disabled = false;
    scoreInputs[index].value = score;
    scoreSpans[index].textContent = `, score = ${score}`;
};

const updateScore = (selectedValue, achieved) => {
    score += parseInt(selectedValue);
    totalScore.textContent = score;
    scoreHistory.innerHTML += `<li>${achieved} : ${selectedValue}</li>`
};

const getHighestDuplicates = (array) => {
    const diceValuesMap = new Map();
    let sumOfDice = 0;

    for (const el of array) {
        diceValuesMap.set(el, (diceValuesMap.get(el) || 0) + 1);
        sumOfDice += el;
    };

    for (const [el, val] of diceValuesMap) {
        if (val >= 4) {
            updateRadioOption(1, sumOfDice);
        }
        if (val >= 3) {
            updateRadioOption(0, sumOfDice);
        } else {
            updateRadioOption(5, 0);
        }
    };
};

const detectFullHouse = (arr) => {

    const counts = {};

    for (const num of arr) {
        counts[num] = counts[num] ? counts[num] + 1 : 1;
    }

    const hasThreeOfAKind = Object.values(counts).includes(3);
    const hasPair = Object.values(counts).includes(2);

    if (hasThreeOfAKind && hasPair) {
        updateRadioOption(2, 25);
    } else {
        updateRadioOption(5, 0);
    }

};

const checkForStraights = (arr) => {
    let sorted = arr.sort((a, b) => a - b);
    let counter = 0;
    for (let i = 0; i < 5; i++) {
        if (sorted[i] + 1 == sorted[i + 1]) { counter++ }
        else { counter === 1 }
    }

    if (counter === 4) {
        updateRadioOption(4, 40)
        updateRadioOption(3, 30)
    };
    if (counter === 3) {
        updateRadioOption(3, 30)
    }
    if (counter < 3) {
        updateRadioOption(5, 0)
    }
};

const resetRadioOptions = () => {
    for (const input of scoreInputs) {
        input.disabled = true;
        input.checked = false;
    };
    for (const span of scoreSpans) {
        span.textContent = '';
    };
};

const resetGame = () => {
    listOfAllDice.forEach((die) => die.textContent = 0);
    score = 0;
    rolls = 0;
    round = 1;
    totalScore.textContent = score;
    scoreHistory.innerHTML = ``;
    currentRoundRolls.textContent = rolls;
    currentRound.textContent = round;
    resetRadioOptions();
};

rollDiceBtn.addEventListener('click', () => {
    if (rolls === 3) {
        alert('You have made three rolls this round. Please select a score.');
    } else {
        resetRadioOptions();
        rolls++;
        rollDice();
        updateStats();
        getHighestDuplicates(diceValuesArr);
        detectFullHouse(diceValuesArr);
        checkForStraights(diceValuesArr);
    }
});

rulesBtn.addEventListener('click', () => {
    isModalShowing = !isModalShowing;
    rulesContainer.style.display = isModalShowing ? 'block' : 'none';
    rulesBtn.innerText = isModalShowing ? 'Hide rules' : 'Show rules';
});

keepScoreBtn.addEventListener('click', () => {
    const selectedOption = Array.from(scoreInputs).find(input => input.checked);

    if (selectedOption) {
        const selectedValue = selectedOption.value;
        const achieved = selectedOption.id;
        rolls = 0;
        round++;
        updateStats();
        updateScore(selectedValue, achieved);
        resetRadioOptions();
        if (round > 6) {
            setTimeout(() => {
                alert(`Game over! Your final score is ${score}`);
                resetGame();
            }, 500);
        }
    } else {
        alert('Please select an option.')
    }
});

