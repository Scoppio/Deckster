
export class Player {
    constructor(name, library, tabIndices) {
        this.name = name
        this.health = 20
        this.counter = 0
        this.library = library
        this.hand = []
        this.battlefield = []
        this.graveyard = []
        this.exile = []
        this.faceDown = []
        this.commanderZone = []
        this.commanderExtraCastingCost = 0
        this.tabIndices = {...tabIndices}
    }
}