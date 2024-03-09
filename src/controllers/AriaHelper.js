export default class AriaHelper {
  constructor(gameState) {
    this.gameState = gameState;
  }

  cardsOnTheTable(playerNumber) {
    const battlefieldZones = [
      "land_zone_battlefield",
      "front_battlefield",
      "back_battlefield",
    ];
    const numberOfCards = battlefieldZones.reduce(
      (acc, zone) => acc + this.gameState.players[playerNumber][zone].length,
      0,
    );
    const numberOfLands = battlefieldZones.reduce(
      (acc, zone) =>
        acc +
        this.gameState.players[playerNumber][zone].filter(
          (card) => card.is_land,
        ).length,
      0,
    );
    const numberOfCreatures = battlefieldZones.reduce(
      (acc, zone) =>
        acc +
        this.gameState.players[playerNumber][zone].filter(
          (card) => card.is_creature,
        ).length,
      0,
    );
    const numberOfPlaneswalkers = battlefieldZones.reduce(
      (acc, zone) =>
        acc +
        this.gameState.players[playerNumber][zone].filter(
          (card) => card.is_planeswalker,
        ).length,
      0,
    );
    const numberOfArtefacts = battlefieldZones.reduce(
      (acc, zone) =>
        acc +
        this.gameState.players[playerNumber][zone].filter(
          (card) => card.is_artifact,
        ).length,
      0,
    );
    const numberOfOtherCards =
      numberOfCards -
      numberOfLands -
      numberOfCreatures -
      numberOfPlaneswalkers -
      numberOfArtefacts;

    return `${this.gameState.players[playerNumber].name} battlefield, ${numberOfCards} cards, ${numberOfLands} lands, ${numberOfCreatures} creatures, ${numberOfPlaneswalkers} planeswalkers, ${numberOfArtefacts} artefacts, ${numberOfOtherCards} other cards`;
  }
}
