
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
      const numberOfLands = this.players[playerNumber].battlefield.filter((card) => card.is_land).length
      const numberOfCreatures = this.players[playerNumber].battlefield.filter((card) => card.is_creature).length
      const numberOfPlaneswalkers = this.players[playerNumber].battlefield.filter((card) => card.is_planeswalker).length
      const numberOfArtefacts = this.players[playerNumber].battlefield.filter((card) => card.is_artefact).length
      const numberOfOtherCards = numberOfCards - numberOfLands - numberOfCreatures - numberOfPlaneswalkers - numberOfArtefacts

      return `${this.players[playerNumber].name} battlefield, ${numberOfCards} cards, ${numberOfLands} lands, ${numberOfCreatures} creatures, ${numberOfPlaneswalkers} planeswalkers, ${numberOfArtefacts} artefacts, ${numberOfOtherCards} other cards`
    }

    moveSelectedToHand(playerNumber) {
      playerNumber = playerNumber || this.activePlayer
      const card = this.players[playerNumber].selected.pop()
      this.players[playerNumber].hand.push(card)
    }

    moveSelectedToGraveyard(playerNumber) {
      playerNumber = playerNumber || this.activePlayer
      const card = this.players[playerNumber].selected.pop()
      this.players[playerNumber].graveyard.push(card)
    }

    moveSelectedToExile(playerNumber) {
      playerNumber = playerNumber || this.activePlayer
      const card = this.players[playerNumber].selected.pop()
      this.players[playerNumber].exile.push(card)
    }

    moveSelectedToLibrary(playerNumber) {
      playerNumber = playerNumber || this.activePlayer
      const card = this.players[playerNumber].selected.pop()
      this.players[playerNumber].library.push(card)
    }

    moveSelectedToCommandZone(playerNumber) {
      playerNumber = playerNumber || this.activePlayer
      const card = this.players[playerNumber].selected.pop()
      this.players[playerNumber].commanderZone.push(card)
    }

    tapUntapSelected(playerNumber) {
      playerNumber = playerNumber || this.activePlayer
      const card = this.players[playerNumber].selected.pop()
      card.tapped = !card.tapped
      this.players[playerNumber].battlefield.push(card)
    }

    scry(playerNumber) {
      playerNumber = playerNumber || this.activePlayer
      const card = this.players[playerNumber].library.pop()
      this.players[playerNumber].library.push(card)
    }

    addCounterOnSelected(playerNumber) {
      playerNumber = playerNumber || this.activePlayer
      const card = this.players[playerNumber].battlefield.pop()
      card.counters = card.counters + 1
      this.players[playerNumber].battlefield.push(card)
    }

    removeCounterOnSelected(playerNumber) {
      playerNumber = playerNumber || this.activePlayer
      const card = this.players[playerNumber].battlefield.pop()
      card.counters = card.counters - 1
      this.players[playerNumber].battlefield.push(card)
    }

    untapAll(playerNumber) {
      playerNumber = playerNumber || this.activePlayer
      this.players[playerNumber].battlefield.forEach((card) => {
        card.tapped = false
      })
    }

    drawCard(playerNumber) {
      playerNumber = playerNumber || this.activePlayer
      this.drawCardFromDeck(playerNumber)
    }

    passTurn() {
      this.activePlayer = (this.activePlayer + 1) % this.players.length
    }

    addLife(playerNumber) {
      playerNumber = playerNumber || this.activePlayer
      this.players[playerNumber].life = this.players[playerNumber].life + 1
    }

    removeLife(playerNumber) {
      playerNumber = playerNumber || this.activePlayer
      this.players[playerNumber].life = this.players[playerNumber].life - 1
    }

    setLife(value, playerNumber) {
      playerNumber = playerNumber || this.activePlayer
      this.players[playerNumber].life = value
    }

    getActivePlayer() {
      return this.players[this.activePlayer]
    }

    getActivePlayerName() {
      return this.getActivePlayer().name
    }
  }