const messageDisplay = document.getElementById("message-display");
const playerCardsDisplay = document.getElementById("player-cards");
const dealerCardsDisplay = document.getElementById("dealer-cards");
const sumDisplay = document.getElementById("sum-display");
const dealerScoreDisplay = document.getElementById("dealer-score-display");
const startGameBtn = document.getElementById("start-game");
const newCardBtn = document.getElementById("new-card");
const standBtn = document.getElementById("stand");
const purseDisplay = document.getElementById("purse");
const betDisplay = document.getElementById("bet");

let deckId = null;
let playerCards = [];
let dealerCards = [];
let numCards = 0;
let numDealerCards = 0;
let playerSum = 0;
let dealerSum = 0;
let gameOn = false;
let playerPurse = 1000;
let playerBet = 10;

const playerWin = () => {
  console.log("PLAYERWIN");
  playerPurse += playerBet * 2;
  purseDisplay.textContent = `Purse: $${playerPurse}`;
};

const pushGame = () => {
  console.log("PUSH");
  playerPurse += playerBet;
  purseDisplay.textContent = `Purse: $${playerPurse}`;
};

const dealerWin = () => {
  console.log("DEALERWIN");
  console.log("dealer wins");
};

const endGameDisplay = () => {
  if (playerSum > 21) {
    messageDisplay.textContent = "BUST! Dealer wins.";
    dealerWin();
  } else if (playerSum === dealerSum) {
    messageDisplay.textContent = "PUSH";
    pushGame();
  } else if (playerSum === 21) {
    messageDisplay.textContent = "21! You win!";
    playerWin();
  } else if (playerSum < dealerSum && dealerSum <= 21) {
    messageDisplay.textContent = "Dealer wins.";
    dealerWin();
  } else {
    messageDisplay.textContent = "You win!";
    playerWin();
  }
};

const endGame = () => {
  gameOn = false;
  document.querySelector(".dealer-hidden-card").innerHTML = `
        <img src=${dealerCards[0].images.png} class="card" />
      `;
  dealerSum = getSum(dealerCards);
  if (playerSum <= 21) {
    if (dealerSum < 17) {
      fillDealerHand();
    } else {
      dealerScoreDisplay.textContent = "Dealer: " + dealerSum;
      endGameDisplay();
    }
  } else {
    endGameDisplay();
  }
};

const checkGameStatus = () => {
  if (playerSum >= 21 || playerCards.length > 4) {
    endGame();
  }
};

const getDeck = async () => {
  playerCardsDisplay.innerHTML = "";
  dealerCardsDisplay.innerHTML = "";
  fetch("https://deckofcardsapi.com/api/deck/new/draw/?count=4")
    .then((res) => res.json())
    .then((data) => {
      deckId = data.deck_id;
      playerCards = [data.cards[0], data.cards[1]];
      dealerCards = [data.cards[2], data.cards[3]];
      const card1 = document.createElement("div");
      card1.classList.add("card-slot", "card1");
      const card2 = document.createElement("div");
      card2.classList.add("card-slot", "card2");
      const card3 = document.createElement("div");
      card3.classList.add("card-slot", "card1", "dealer-hidden-card");
      const card4 = document.createElement("div");
      card4.classList.add("card-slot", "card2");
      card1.innerHTML = `
        <img src=${playerCards[0].images.png} class="card" />
      `;
      card2.innerHTML = `
        <img src=${playerCards[1].images.png} class="card" />
      `;
      card3.innerHTML = `
        <img src="src/images/card-back.png" class="card" />
      `;
      card4.innerHTML = `
        <img src=${dealerCards[1].images.png} class="card" />
      `;
      playerCardsDisplay.appendChild(card1);
      playerCardsDisplay.appendChild(card2);
      dealerCardsDisplay.appendChild(card3);
      dealerCardsDisplay.appendChild(card4);
      numCards = 2;
      numDealerCards = 2;
      playerSum = getSum(playerCards);
      sumDisplay.textContent = "Player: " + playerSum;
      dealerScoreDisplay.textContent = "Dealer: " + getSum([data.cards[3]]);
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
  console.log("****new game****");
  messageDisplay.textContent = "Good luck!";
  playerPurse -= playerBet;
  purseDisplay.textContent = `Purse: $${playerPurse}`;
  getDeck();
  gameOn = true;
}

const drawNewCard = () => {
  if (gameOn) {
    let newCard = null;
    fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
      .then((res) => res.json())
      .then((data) => {
        numCards++;
        newCard = data.cards[0];
        playerCards.push(newCard);
        const newCardSlot = document.createElement("div");
        newCardSlot.classList.add("card-slot", `card${numCards}`);
        newCardSlot.innerHTML = `<img src=${newCard.images.png} class="card" />`;
        playerCardsDisplay.appendChild(newCardSlot);
        playerSum = getSum(playerCards);
        sumDisplay.textContent = "Player: " + playerSum;
        checkGameStatus();
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

const fillDealerHand = () => {
  let newCard = null;
  fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
    .then((res) => res.json())
    .then((data) => {
      numDealerCards++;
      newCard = data.cards[0];
      dealerCards.push(newCard);
      const newCardSlot = document.createElement("div");
      newCardSlot.classList.add("card-slot", `card${numDealerCards}`);
      newCardSlot.innerHTML = `<img src=${newCard.images.png} class="card" />`;
      dealerCardsDisplay.appendChild(newCardSlot);
      dealerSum = getSum(dealerCards);
      dealerScoreDisplay.textContent = "Dealer: " + dealerSum;
      if (dealerSum < 17) {
        fillDealerHand();
      } else {
        endGameDisplay();
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const stand = () => {
  if (gameOn) {
    endGame();
  }
};

startGameBtn.addEventListener("click", startGame);
newCardBtn.addEventListener("click", drawNewCard);
standBtn.addEventListener("click", stand);
