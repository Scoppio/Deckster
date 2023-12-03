
function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

export class GameStateController {
    constructor(gameState) {
      this.gameState = gameState
    }
  
    shuffleAllDecks() {
      this.gameState.players.forEach((player, index) => {
        this.shuffleDeck(index)
      })
    }

    eachPlayerDrawSeven() {
      this.gameState.players.forEach((player, index) => {
        for (let i = 0; i < 7; i++) {
          this.drawCardFromDeck(index)
        }
      })
    }

    shuffleDeck(playerNumber) {
      shuffle(this.gameState.players[playerNumber].deck)
    }
  
    drawCardFromDeck(playerNumber) {
      const card = this.gameState.players[playerNumber].deck.pop()
      this.gameState.players[playerNumber].hand.push(card)
    }
    
  }