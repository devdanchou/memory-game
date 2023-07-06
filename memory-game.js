"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

const FOUND_MATCH_WAIT_MSECS = 1000;
const COLORS = [
  "red", "blue", "green", "orange", "purple",
  "red", "blue", "green", "orange", "purple",
];

const colors = shuffle(COLORS);

let flippedCards = [];

/** Shuffle array items in-place and return shuffled array. */

function shuffle(items) {
  // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.

  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

let score = 0;

initializeGame(colors); // ask

function initializeGame(colors) { // ask
  resetScore();
  createCards(colors);
  setUpRestart();
}

function resetScore(score) {
  score = 0;
  document.querySelector(".score").textContent = score;
}

/** Create card for every color in colors (each will appear twice)
 *
 * Each div DOM element will have:
 * - a class with the value of the color
 * - a click event listener for each card to handleCardClick
 */


function createCards(colors) {
  const gameBoard = document.getElementById("game");

  for (let color of colors) {
    let card = document.createElement('div');
    card.id = color;
    card.addEventListener('click', (event) => handleCardClick(event, color));
    gameBoard.append(card);
  }
}

function setUpRestart() {
  const restartBtn = document.querySelector(".restart");
  restartBtn.addEventListener('click', handleRestartClick);
}

/** Flip a card face-up. */
function flipCard(card, color) {
  card.classList.toggle('flipped');
  flippedCards.push({card, color});
}



/** Flip a card face-down. */
function unFlipCard(card) {
  card.classList.toggle('flipped');
  flippedCards.pop();
}

/** Handle clicking on a card: this could be first-card or second-card. */

function handleCardClick(evt, color) {
  const target = evt.target;
  console.log({target});
  console.log({flippedCards});
  console.log({classList: target.classList})
  if (target.classList.length > 0) {
    alert('Card already flipped! Flip another!');
    return;
  }

  if (flippedCards.length < 2 ||
    flippedCards.length % 2 === 1 ||
    isMatchingPair()) {
    flipCard(target, color);
  }

  if (flippedCards.length >= 2 && flippedCards.length % 2 === 0) {
    if (!isMatchingPair()) {
      setTimeout(() => {
        unFlipCard(flippedCards[flippedCards.length - 1].card);
        unFlipCard(flippedCards[flippedCards.length - 1].card);
      }, FOUND_MATCH_WAIT_MSECS);
    } else if (isMatchingPair()) {
      score += 100 / (colors.length / 2);
      document.querySelector(".score").textContent = score;
    }
  }
}

function isMatchingPair() {
  return flippedCards[flippedCards.length - 1].color === flippedCards[flippedCards.length - 2].color;
}

function handleRestartClick(evt) {
  resetScore();
  resetFlippedCards();
}

function resetFlippedCards() {
  while (flippedCards.length > 0) {
    unFlipCard(flippedCards[flippedCards.length - 1].card);
  }
}
