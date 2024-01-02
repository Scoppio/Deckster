
export class Card {
    constructor(card) {
        this._uid = Math.floor(Math.random() * 1000000) + ""
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
        this.card_face = 0
    }

    changeFace() {
        this.card_face = this.card_face === 0 ? 1 : 0
    }

    get produces_mana() {
        return this.card_produced_mana !== null
    }

    get is_land() {
        return this.card_type_line.includes("Land")
    }

    get is_creature() {
        return this.card_type_line.includes("Creature")
    }

    get is_planeswalker() {
        return this.card_type_line.includes("Planeswalker")
    }

    get is_artifact() {
        return this.card_type_line.includes("Artifact")
    }

    get is_enchantment() {
        return this.card_type_line.includes("Enchantment")
    }

    get is_aura() {
        return this.card_type_line.includes("Aura")
    }

    get is_instant() {
        return this.card_type_line.includes("Instant")
    }

    get is_sorcery() {
        return this.card_type_line.includes("Sorcery")
    }

    get is_historic() {
        return this.card_type_line.includes("Legendary") || this.card_type_line.includes("Saga") || this.card_type_line.includes("Artifact")
    }

    get card_keywords() {
        if (this.card_faces === undefined) {
            return this.keywords
        }
        return this.card_faces[this.card_face].keywords || []
    }

    get card_cmc() {
        if (this.card_faces === undefined) {
            return this.cmc
        }
        return this.card_faces[this.card_face].cmc || 0
    }

    get card_mana_cost() {
        if (this.card_faces === undefined) {
            return this.mana_cost
        }
        return this.card_faces[this.card_face].mana_cost
    }

    get card_produced_mana() {
        if (this.card_faces === undefined) {
            return this.produced_mana
        }
        return this.card_faces[this.card_face].produced_mana
    }

    get card_name() {
        if (this.card_faces === undefined) {
            return this.name
        }
        return this.card_faces[this.card_face].name
    }

    get card_type_line() {
        if (this.card_faces === undefined) {
            return this.type_line
        }
        return this.card_faces[this.card_face].type_line
    }

    get card_loaylty() {
        if (this.card_faces === undefined) {
            return this.loyalty
        }
        return this.card_faces[this.card_face].loyalty
    }

    get card_oracle_text() {
        if (this.card_faces === undefined) {
            return this.oracle_text
        }
        return this.card_faces[this.card_face].oracle_text
    }
    
    get power_toughness() {
        if (this.card_faces === undefined) {
            if (this.power === null || this.toughness === null) {
                return null
            }
            return this.power + "/" + this.toughness
        }
        return this.card_faces[this.card_face].power + "/" + this.card_faces[this.card_face].toughness
    }

    get card_image_uris() {
        if (this.card_faces === undefined) {
            return this.image_uris
        }
        return this.card_faces[this.card_face].image_uris
    }

    get card_flavor_text() {
        if (this.card_faces === undefined) {
            return this.flavor_text
        }
        return this.card_faces[this.card_face].flavor_text
    }

    get card_printed_text() {
        if (this.card_faces === undefined) {
            return this.printed_text
        }
        return this.card_faces[this.card_face].printed_text
    }

    get aria_description() {
        return `${this.card_name}, ${this.card_mana_cost}` + (this.power_toughness !== null ? `, ${this.power_toughness}` : "") + (this.card_loyalty !== null ? `, ${this.card_loyalty} loyalty` : "")
    }
    
}