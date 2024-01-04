
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
    constructor(players, player) {
      this.players = players
      this.player = player
      this.activePlayer = 0
      this.player_number = 0
    }

    get active_player() {
      return this.players[this.activePlayer]
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
      if (card.is_land) {
        this.players[playerNumber].land_zone_battlefield.push(card)
      }
      else if (card.is_sorcery || card.is_instant) {
        this.players[playerNumber].front_battlefield.push(card)
      }
      else {
        this.players[playerNumber].back_battlefield.push(card)
      }
    }
    
    cardsOnTheTable(playerNumber) {
      const battlefieldZones = ['land_zone_battlefield', 'front_battlefield', 'back_battlefield']
      const numberOfCards = battlefieldZones.reduce((acc, zone) => acc + this.players[playerNumber][zone].length, 0)
      const numberOfLands = battlefieldZones.reduce((acc, zone) => acc + this.players[playerNumber][zone].filter((card) => card.is_land).length, 0)
      const numberOfCreatures = battlefieldZones.reduce((acc, zone) => acc + this.players[playerNumber][zone].filter((card) => card.is_creature).length, 0)
      const numberOfPlaneswalkers = battlefieldZones.reduce((acc, zone) => acc + this.players[playerNumber][zone].filter((card) => card.is_planeswalker).length, 0)
      const numberOfArtefacts = battlefieldZones.reduce((acc, zone) => acc + this.players[playerNumber][zone].filter((card) => card.is_artifact).length, 0)
      const numberOfOtherCards = numberOfCards - numberOfLands - numberOfCreatures - numberOfPlaneswalkers - numberOfArtefacts

      return `${this.players[playerNumber].name} battlefield, ${numberOfCards} cards, ${numberOfLands} lands, ${numberOfCreatures} creatures, ${numberOfPlaneswalkers} planeswalkers, ${numberOfArtefacts} artefacts, ${numberOfOtherCards} other cards`
    }

    moveSelectedToHand(playerNumber) {
      playerNumber = playerNumber || this.player_number
      const card = this.players[playerNumber].selected.pop()
      this.players[playerNumber].hand.push(card)
    }

    moveSelectedToGraveyard(playerNumber) {
      playerNumber = playerNumber || this.player_number
      const card = this.players[playerNumber].selected.pop()
      this.players[playerNumber].graveyard.push(card)
    }

    moveSelectedToExile(playerNumber) {
      playerNumber = playerNumber || this.player_number
      const card = this.players[playerNumber].selected.pop()
      this.players[playerNumber].exile.push(card)
    }

    moveSelectedToLibrary(playerNumber) {
      playerNumber = playerNumber || this.player_number
      const card = this.players[playerNumber].selected.pop()
      this.players[playerNumber].library.push(card)
    }

    moveSelectedToCommandZone(playerNumber) {
      playerNumber = playerNumber || this.player_number
      const card = this.players[playerNumber].selected.pop()
      this.players[playerNumber].commanderZone.push(card)
    }

    tapUntapSelected(playerNumber) {
      playerNumber = playerNumber || this.player_number
      this.players[playerNumber].selectedCards.forEach((card) => {card.tapped = !card.tapped})
    }

    scry(playerNumber) {

    }

    addCounterOnSelected(playerNumber) {
      playerNumber = playerNumber || this.player_number
      this.players[playerNumber].selectedCards.forEach((card) => {card.counters = card.counters + 1})
    }

    removeCounterOnSelected(playerNumber) {
      playerNumber = playerNumber || this.player_number
      const card = this.players[playerNumber].selectedCards
      card.counters = card.counters - 1
      this.players[playerNumber].selectedCards.push(card)
    }

    untapAll(playerNumber) {
      playerNumber = playerNumber || this.player_number
      this.players[playerNumber].battlefield.forEach((card) => {
        card.tapped = false
      })
    }

    drawCard(playerNumber) {
      playerNumber = playerNumber || this.player_number
      this.drawCardFromDeck(playerNumber)
    }

    passTurn() {
      this.activePlayer = (this.activePlayer + 1) % this.players.length
    }

    addLife(playerNumber) {
      playerNumber = playerNumber || this.player_number
      this.players[playerNumber].life = this.players[playerNumber].life + 1
    }

    removeLife(playerNumber) {
      playerNumber = playerNumber || this.player_number
      this.players[playerNumber].life = this.players[playerNumber].life - 1
    }

    setLife(value, playerNumber) {
      playerNumber = playerNumber || this.player_number
      this.players[playerNumber].life = value
    }

    getCardFrom(source) {
      const sourceZone = source.droppableId;
      const sourceIndex = source.index;
      const card = this.player[sourceZone][sourceIndex]
      this.player.selectedCard = card;
      return card
    }

    cancelCardMove() {
      const card = this.player.selectedCard;
      this.player.selectedCard = null;
      return card
    }

    moveCardTo(source, destination) {
      const sourceZone = source.droppableId;
      const sourceIndex = source.index;
      const card = this.player[sourceZone][sourceIndex]
      this.player.selectedCard = card;
      this.player[sourceZone].splice(sourceIndex, 1);

      const destinationZone = destination.droppableId;
      const destinationIndex = destination.index;
      this.player[destinationZone].splice(destinationIndex, 0, card);
      this.player.selectedCard = null;
      return card;
    }
  }