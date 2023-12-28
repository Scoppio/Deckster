
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
    constructor(players) {
      this.players = players
      this.activePlayer = 0
    }
  
    shuffleAllDecks() {
      this.players.forEach((player, index) => {
        this.shuffleDeck(index)
      })
    }

    eachPlayerDrawSeven() {
      this.players.forEach((player, index) => {
        for (let i = 0; i < 7; i++) {
          this.drawCardFromDeck(index)
        }
      })
    }

    shuffleDeck(playerNumber) {
      shuffle(this.players[playerNumber].library)
    }
  
    drawCardFromDeck(playerNumber) {
      const card = this.players[playerNumber].library.pop()
      this.players[playerNumber].hand.push(card)
    }
    
    putRandomCardIntoBattlefield(playerNumber) {
      const card = this.players[playerNumber].hand.pop()
      this.players[playerNumber].battlefield.push(card)
    }
    
    cardsOnTheTable(playerNumber) {
      const numberOfCards = this.players[playerNumber].battlefield.length
      const numberOfLands = this.players[playerNumber].battlefield.filter((card) => card.type.includes("Land")).length
      const numberOfCreatures = this.players[playerNumber].battlefield.filter((card) => card.type.includes("Creature")).length
      const numberOfPlaneswalkers = this.players[playerNumber].battlefield.filter((card) => card.type.includes("Planeswalker")).length
      const numberOfArtefacts = this.players[playerNumber].battlefield.filter((card) => card.type.includes("Artefact")).length
      const numberOfOtherCards = numberOfCards - numberOfLands - numberOfCreatures - numberOfPlaneswalkers - numberOfArtefacts

      return `${numberOfCards} cards on the table, ${numberOfLands} lands, ${numberOfCreatures} creatures, ${numberOfPlaneswalkers} planeswalkers, ${numberOfArtefacts} artefacts, ${numberOfOtherCards} other cards`
    }

  }