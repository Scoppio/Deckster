
export class CardPiles {
  constructor(cardPiles) {
    this.library = (cardPiles && [...cardPiles.library] )|| [];
    this.hand = (cardPiles && [...cardPiles.hand]) || [];
    this.exile = (cardPiles && [...cardPiles.exile]) || [];
    this.commander_zone = (cardPiles && [...cardPiles.commander_zone]) || [];
    this.faceDown = (cardPiles && [...cardPiles.faceDown]) || [];
    this.graveyard = (cardPiles && [...cardPiles.graveyard]) || [];
    this.libraryTop = (cardPiles && [...cardPiles.libraryTop]) || [];
    this.battlefield = (cardPiles && [...cardPiles.battlefield]) || [];
    this.libraryBottom = (cardPiles && [...cardPiles.libraryBottom]) || [];
    this.libraryBottomRandom = (cardPiles && [...cardPiles.libraryBottomRandom]) || [];
    this.sourceZone = (cardPiles && cardPiles.sourceZone) || "";
  }

  setSourceZone(pileName, cards) {
    this[pileName] = [...cards];
    this.sourceZone = pileName;
    return this;
  }
}