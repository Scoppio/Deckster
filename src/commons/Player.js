import emptyAvatar from '../resources/images/bubbly_cat.jpg';


export class Player {
    constructor(id, name, library, health, tabIndices, isLocal = false) {
        this.id = id
        this.name = name
        this.health = health
        this.counters = {}
        this.library = library.deck
        this.sideboard = []
        this.hand = []
        this.remote_hand_size = 0
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
        this.isLocal = isLocal
        this.avatar = emptyAvatar
        this._uid = Math.floor(Math.random() * 1000000) + ""
    }

    get cards_in_hand() {
        if (this.isLocal) {
            return this.hand.length
        }
        return this.remote_hand_size
    }
    
}