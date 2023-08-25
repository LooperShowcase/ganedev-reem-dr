const cardsContainer = document.getElementById("cards");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;

fetch("./data/cards.json")
  .then((res) => res.json())
  .then((data) => {
    cards = [...data, ...data];

    console.log(cards);
    shuffleCards();
    generateCards();
  });

function shuffleCards() {
  let temp;
  let currentIndex = cards.length;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    temp = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temp;
  }
}

function generateCards() {
  for (let card of cards) {
    const cardElement = document.createElement("div");

    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
    <div class = "front">
        <img class="front-image" src=${card.image}>
    </div>
    <div class="back"></div>
    `;
    cardsContainer.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
  }
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }
  secondCard = this;
  lockBoard = true;
  checkForMatch();
  document.getElementById("score").textContent = score;
}

function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;

  if (isMatch) {
    disableCards();
  } else {
    unflipCards();
  }
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  score++;
  if (score === cards.length / 2){
    startConfetti();
  }
  unlockBoard();

}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    unlockBoard();
}, 1000);
}

function unlockBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function restart (){
    cardsContainer.innerHTML = "";
    score = 0;
    shuffleCards();
    generateCards();
    document.getElementById('score').textContent = score;
    stopConfetti();
}