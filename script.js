document.addEventListener("DOMContentLoaded", () => {
    const cardsArray = [
        { name: "1", img: "images/1.png" },
        { name: "2", img: "images/2.png" },
        { name: "3", img: "images/3.png" },
        { name: "4", img: "images/4.png" },
        { name: "5", img: "images/5.png" },
        { name: "6", img: "images/6.png" },
        { name: "1", img: "images/1.png" },
        { name: "2", img: "images/2.png" },
        { name: "3", img: "images/3.png" },
        { name: "4", img: "images/4.png" },
        { name: "5", img: "images/5.png" },
        { name: "6", img: "images/6.png" },
    ];

    const difficultyLevels = {
        easy: { pairs: 4, time: 60 },   // 1 minuto
        medium: { pairs: 8, time: 180 }, // 3 minutos
        hard: { pairs: 12, time: 300 }  // 5 minutos
    };

    const gameBoard = document.getElementById("game-board");
    const restartButton = document.getElementById("restart");
    const difficultySelector = document.getElementById("difficulty");
    const timerDisplay = document.getElementById("timer");

    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let timer;
    let timeRemaining = 0;
    let timeInterval;

    function shuffle(array) {
        array.sort(() => 0.5 - Math.random());
    }

    function startTimer() {
        timerDisplay.textContent = formatTime(timeRemaining);
        timeInterval = setInterval(() => {
            timeRemaining--;
            timerDisplay.textContent = formatTime(timeRemaining);
            if (timeRemaining <= 0) {
                clearInterval(timeInterval);
                alert('Tempo esgotado! Tente novamente.');
                restartGame();
            }
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timeInterval);
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    function createBoard(difficulty) {
        gameBoard.innerHTML = '';
        stopTimer();

        const selectedLevel = difficultyLevels[difficulty];
        timeRemaining = selectedLevel.time;
        startTimer();

        const selectedCards = cardsArray.slice(0, selectedLevel.pairs);
        const gameCards = selectedCards.concat(selectedCards);
        shuffle(gameCards);

        gameCards.forEach((card) => {
            const cardElement = document.createElement("div");
            cardElement.classList.add("memory-card");
            cardElement.dataset.name = card.name;
            cardElement.innerHTML = `
                <img class="front-face" src="${card.img}" alt="${card.name}">
                <div class="back-face"></div>
            `;
            cardElement.addEventListener("click", flipCard);
            gameBoard.appendChild(cardElement);
        });
        setBoardSize(selectedLevel.pairs);
    }

    function setBoardSize(pairs) {
        const columns = Math.ceil(Math.sqrt(pairs * 2));
        gameBoard.style.gridTemplateColumns = `repeat(${columns}, 100px)`;
    }

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;

        this.classList.add("flip");

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
            return;
        }

        secondCard = this;
        checkForMatch();
    }

    function checkForMatch() {
        const isMatch = firstCard.dataset.name === secondCard.dataset.name;

        isMatch ? disableCards() : unflipCards();
    }

    function disableCards() {
        firstCard.removeEventListener("click", flipCard);
        secondCard.removeEventListener("click", flipCard);

        resetBoard();
    }

    function unflipCards() {
        lockBoard = true;

        setTimeout(() => {
            firstCard.classList.remove("flip");
            secondCard.classList.remove("flip");

            resetBoard();
        }, 1500);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    function restartGame() {
        const difficulty = difficultySelector.value;
        createBoard(difficulty);
    }

    restartButton.addEventListener("click", restartGame);
    difficultySelector.addEventListener("change", restartGame);

    restartGame();
});