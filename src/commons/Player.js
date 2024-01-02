
export class Player {
    constructor(name, library, tabIndices, isRemote) {
        this.name = name
        this.health = 20
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
        this.tabIndices = {...tabIndices}
        this.isRemote = isRemote
    }
}