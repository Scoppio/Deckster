
export class Player {
    constructor(name, library, health, tabIndices, isRemote) {
        this.name = name
        this.health = health
        this.counter = 0
        this.library = library.deck
        this.sideboard = []
        this.hand = []
        this.battlefield = []
        this.graveyard = []
        this.exile = []
        this.faceDown = []
        this.commanderZone = library.commanders
        this.commanderExtraCastingCost = 0
        this.selectedCards = []
        this.tabIndices = {...tabIndices}
        this.isRemote = isRemote
    }
}