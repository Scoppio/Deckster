import emptyAvatar from '../resources/images/bubbly_cat.jpg';


export class Player {
    constructor(name, library, health, tabIndices, isRemote) {
        this.name = name
        this.health = health
        this.counter = 0
        this.library = library.deck
        this.sideboard = []
        this.hand = []
        this.front_battlefield = []
        this.back_battlefield = []
        this.land_zone_battlefield = []
        this.graveyard = []
        this.exile = []
        this.faceDown = []
        this.commanderZone = library.commanders
        this.commanderExtraCastingCost = 0
        this.selectedCards = []
        this.tabIndices = {...tabIndices}
        this.isRemote = isRemote
        this.avatar = emptyAvatar
    }
}