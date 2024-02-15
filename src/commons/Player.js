import emptyAvatar from '../resources/images/bubbly_cat.jpg'
import { Card } from './Card'

export class Player {
    constructor(id, name, library, life, tabIndices, isLocal = false) {
        this.id = id
        this.name = name
        this.life = life
        this.counters = {}
        this.library = library.deck
        this.library_size = library.deck.length
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

    createCardInstances(cardArray) {
        return cardArray.map(card => new Card(card));
    }

    updateFromPayload(payload)
    {
        this.hand = this.createCardInstances(payload.hand);
        this.front_battlefield = this.createCardInstances(payload.front_battlefield);
        this.back_battlefield = this.createCardInstances(payload.back_battlefield);
        this.land_zone_battlefield = this.createCardInstances(payload.land_zone_battlefield);
        this.graveyard = this.createCardInstances(payload.graveyard);
        this.exile = this.createCardInstances(payload.exile);
        this.faceDown = this.createCardInstances(payload.faceDown);
        this.commanderZone = this.createCardInstances(payload.commanderZone);
        this.selectedCards = this.createCardInstances(payload.selectedCards);
        this.library = this.createCardInstances(payload.library ?? []);
        this.sideboard = this.createCardInstances(payload.sideboard);
        this.library_size = payload.library_size;
    }

    get cards_in_hand() {
        if (this.isLocal) {
            return this.hand.length
        }
        return this.remote_hand_size
    }
    
}