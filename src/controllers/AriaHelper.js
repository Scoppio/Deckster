
export default class AriaHelper {
  constructor(gameState) {
    this.gameState = gameState
  }

  cardsOnTheTable(playerNumber) {
    const player = this.gameState.getPlayer(playerNumber)
    if (!player) {
      return "Empty table for player number " + (playerNumber+1)
    }
    const battlefieldZones = ['land_zone_battlefield', 'front_battlefield', 'back_battlefield']
    const numberOfCards = battlefieldZones.reduce((acc, zone) => acc + player[zone].length, 0)
    const numberOfLands = battlefieldZones.reduce((acc, zone) => acc + player[zone].filter((card) => card.is_land).length, 0)
    const numberOfCreatures = battlefieldZones.reduce((acc, zone) => acc + player[zone].filter((card) => card.is_creature).length, 0)
    const numberOfPlaneswalkers = battlefieldZones.reduce((acc, zone) => acc + player[zone].filter((card) => card.is_planeswalker).length, 0)
    const numberOfArtefacts = battlefieldZones.reduce((acc, zone) => acc + player[zone].filter((card) => card.is_artifact).length, 0)
    const numberOfOtherCards = numberOfCards - numberOfLands - numberOfCreatures - numberOfPlaneswalkers - numberOfArtefacts

    return `${player.name} battlefield, ${numberOfCards} cards, ${numberOfLands} lands, ${numberOfCreatures} creatures, ${numberOfPlaneswalkers} planeswalkers, ${numberOfArtefacts} artefacts, ${numberOfOtherCards} other cards`
  }

  playerQuickGlance(playerNumber) {
    const player = this.gameState.getPlayer(playerNumber)
    if (!player) {
      return "Empty seat."
    }
    const isActivePlayer = this.gameState.activePlayer === playerNumber
    return `${player.name} ${isActivePlayer ? "active player" : ""}, ${player.life} life, ${player.hand.length} cards in hand, ${player.library.length} cards in library, ${player.graveyard.length} cards in graveyard, ${player.exile.length} cards in exile, ${player.commanderZone.length} cards in command zone, ${player.faceDown.length} cards face down pile.`
  }
}