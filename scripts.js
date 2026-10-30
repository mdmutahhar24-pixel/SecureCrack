const letters = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const numbers = "23456789";
const symbols = "!@#$%^&*";

const passwordLength = 5;

let passwords = [];
let selectedPassword = "";
let revealedCharacters = [];
let attempts = 0;
let gameOver = false;

const passwordButtons = document.querySelectorAll(".btns button");
const hintButton = document.querySelector("body > button");
const hintDisplay = document.getElementById("hint");
const answerInput = document.querySelector(".answer input");
const guessButton = document.querySelector(".answer button");

function randomCharacter(pool) {
    return pool[Math.floor(Math.random() * pool.length)];
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

function generatePassword() {
    const characters = [
        randomCharacter(letters),
        randomCharacter(letters),
        randomCharacter(letters),
        randomCharacter(numbers),
        randomCharacter(symbols)
    ];

    shuffle(characters);

    if (!letters.includes(characters[0])) {
        const letterIndex = characters.findIndex(character =>
            letters.includes(character)
        );

        [characters[0], characters[letterIndex]] =
            [characters[letterIndex], characters[0]];
    }

    return characters.join("");
}

function createPassword() {
    return generatePassword();
}

function getPasswordInfo(password) {
    const numberCount = [...password].filter(character =>
        numbers.includes(character)
    ).length;

    const symbolCount = [...password].filter(character =>
        symbols.includes(character)
    ).length;

    return {
        length: password.length,
        firstCharacter: password[0],
        numberCount,
        symbolCount
    };
}

function startGame() {
    passwords = [
        createPassword(),
        createPassword(),
        createPassword()
    ];

    selectedPassword = passwords[0];

    attempts = 0;
    gameOver = false;

    revealedCharacters = Array(passwordLength).fill(false);

    answerInput.value = "";
    answerInput.disabled = false;
    guessButton.disabled = false;
    hintButton.disabled = false;

    passwordButtons.forEach((button, index) => {
        button.style.backgroundColor =
            index === 0 ? "#333333" : "black";
    });

    showPasswordInfo();
}

function showPasswordInfo() {
    const info = getPasswordInfo(selectedPassword);

    hintDisplay.textContent =
        `Length: ${info.length} | ` +
        `Starts with: ${info.firstCharacter} | ` +
        `Numbers: ${info.numberCount} | ` +
        `Symbols: ${info.symbolCount}`;
}

function selectPassword(index) {
    selectedPassword = passwords[index];

    revealedCharacters = Array(passwordLength).fill(false);

    answerInput.value = "";

    passwordButtons.forEach((button, buttonIndex) => {
        button.style.backgroundColor =
            buttonIndex === index ? "#333333" : "black";
    });

    showPasswordInfo();
}

function giveHint() {
    if (gameOver) return;

    const unrevealed = [];

    for (let i = 0; i < selectedPassword.length; i++) {
        if (!revealedCharacters[i]) {
            unrevealed.push(i);
        }
    }

    if (unrevealed.length === 0) {
        hintDisplay.textContent = selectedPassword;
        return;
    }

    const index =
        unrevealed[Math.floor(Math.random() * unrevealed.length)];

    revealedCharacters[index] = true;

    let hint = "";

    for (let i = 0; i < selectedPassword.length; i++) {
        if (revealedCharacters[i]) {
            hint += selectedPassword[i];
        } else {
            hint += " _";
        }
    }

    hintDisplay.textContent = `Hint: ${hint}`;
}

function checkGuess() {
    if (gameOver) return;

    const guess = answerInput.value;

    if (guess === selectedPassword) {
        hintDisplay.textContent =
            `Good job agent, you took ${attempts + 1} attempt(s).`;

        gameOver = true;

        answerInput.disabled = true;
        guessButton.disabled = true;
        hintButton.disabled = true;

        return;
    }

    attempts++;

    hintDisplay.textContent =
        `Wrong. Try again agent. Attempts: ${attempts}`;
}

passwordButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
        selectPassword(index);
    });
});

hintButton.addEventListener("click", giveHint);

guessButton.addEventListener("click", checkGuess);

answerInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        checkGuess();
    }
});

startGame();