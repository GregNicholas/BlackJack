const messageDisplay = document.getElementById("message-display");
const cardsDisplay = document.getElementById("cards-display");
const sumDisplay = document.getElementById("sum-display");
const startGameBtn = document.getElementById("start-game");
const newCardBtn = document.getElementById("new-card");
const card1 = document.querySelector(".card1");
const card2 = document.querySelector(".card2");
let deckId = null;
let cards = [];
let numCards = 0;
let sum = 0;
let hasBlackJack = false;
let isAlive = false;

const checkGameStatus = () => {
  // if (sum === 21) {
  //   hasBlackJack = true;
  //   messageDisplay.textContent = "You have blackjack!";
  // }
  // if (sum > 21) {
  //   isAlive = false;
  //   messageDisplay.textContent = "Bust!";
  // }
};

const getDeck = async () => {
  cardsDisplay.innerHTML = "";
  fetch("https://deckofcardsapi.com/api/deck/new/draw/?count=2")
    .then((res) => res.json())
    .then((data) => {
      deckId = data.deck_id;
      cards = data.cards;
      const card1 = document.createElement("div");
      card1.classList.add("card-slot", "card1");
      const card2 = document.createElement("div");
      card2.classList.add("card-slot", "card2");
      card1.innerHTML = `
        <img src=${cards[0].images.png} class="card" />
      `;
      card2.innerHTML = `
        <img src=${cards[1].images.png} class="card" />
      `;
      cardsDisplay.appendChild(card1);
      cardsDisplay.appendChild(card2);
      numCards = 2;
      sum = getSum(cards);
      sumDisplay.textContent = sum;
      checkGameStatus();
    })
    .catch((err) => {
      console.log(err);
    });
};

const getSum = (arr) => {
  const values = {
    ACE: 11,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
    JACK: 10,
    QUEEN: 10,
    KING: 10
  };

  let numAces = arr.filter((c) => c.value === "ACE").length;
  console.log("ACES: ", numAces);

  let sum = arr.reduce((acc, cur) => {
    return acc + values[cur.value];
  }, 0);
  if (sum > 21) {
    while (numAces > 0 && sum > 21) {
      sum -= 10;
      numAces--;
    }
  }
  return sum;
};

function startGame() {
  messageDisplay.textContent = "Good luck!";
  getDeck();
  hasBlackJack = false;
  isAlive = true;
}

//continue working on new card
//create another card element and display
//sum cards
//check win or bust conditions
const drawNewCard = () => {
  if (isAlive && !hasBlackJack) {
    let newCard = null;
    fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
      .then((res) => res.json())
      .then((data) => {
        numCards++;
        newCard = data.cards[0];
        cards.push(newCard);
        console.log(cards);
        const newCardSlot = document.createElement("div");
        newCardSlot.classList.add("card-slot", `card${numCards}`);
        newCardSlot.innerHTML = `<img src=${newCard.images.png} class="card" />`;
        cardsDisplay.appendChild(newCardSlot);
        sum = getSum(cards);
        console.log(sum);
        sumDisplay.textContent = sum;
        checkGameStatus();
      })
      .catch((err) => {
        console.log(err);
      });

    // sum = getSum(cards);
    // sumDisplay.textContent = sum;
    // if (sum === 21) {
    //   hasBlackJack = true;
    // }
    // if (sum > 21) {
    //   isAlive = false;
    // }
  }
};

startGameBtn.addEventListener("click", startGame);
newCardBtn.addEventListener("click", drawNewCard);
