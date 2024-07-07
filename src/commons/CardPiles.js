
export class CardPiles {
  constructor(cardPiles) {
    this.library = (cardPiles && [...cardPiles.library] )|| [];
    this.hand = (cardPiles && [...cardPiles.hand]) || [];
    this.exile = (cardPiles && [...cardPiles.exile]) || [];
    this.commander_zone = (cardPiles && [...cardPiles.commander_zone]) || [];
    this.face_down = (cardPiles && [...cardPiles.face_down]) || [];
    this.graveyard = (cardPiles && [...cardPiles.graveyard]) || [];
    this.libraryTop = (cardPiles && [...cardPiles.libraryTop]) || [];
    this.battlefield = (cardPiles && [...cardPiles.battlefield]) || [];
    this.library_bottom = (cardPiles && [...cardPiles.library_bottom]) || [];
    this.library_bottom_random = (cardPiles && [...cardPiles.library_bottom_random]) || [];
    this.sourceZone = (cardPiles && cardPiles.sourceZone) || "";
  }

  setSourceZone(pileName, cards) {
    this[pileName] = [...cards];
    this.sourceZone = pileName;
    return this;
  }
}