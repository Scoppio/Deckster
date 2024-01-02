
export class Card {
    constructor(card) {
        this._uid = Math.floor(Math.random() * 1000000) + ""
        // id, name, type_line, oracle_text, power, toughness, mana_cost, cmc, colos, color_identity, image_uris, tset, flavor_text, produced_mana, loyalty, printed_text, printed_name, printed_type_line, lang, card_faces, rarity, artist
        this.id = card.id
        this.name = card.name
        this.type_line = card.type_line
        this.oracle_text = card.oracle_text
        this.power = card.power
        this.toughness = card.toughness
        this.mana_cost = card.mana_cost
        this.cmc = card.cmc
        this.colors = card.colors
        this.color_identity = card.color_identity
        this.image_uris = card.image_uris
        this.set = card.tset
        this.flavor_text = card.flavor_text
        this.rarity = card.rarity
        this.artist = card.artist
        this.loyalty = card.loyalty
        this.printed_text = card.printed_text
        this.printed_name = card.printed_name
        this.printed_type_line = card.printed_type_line
        this.lang = card.lang
        this.card_faces = card.card_faces
    }
}