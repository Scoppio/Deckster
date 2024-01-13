
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
        this.tapped = false
    }

    changeFace() {
        this.card_face = this.card_face === 0 ? 1 : 0
    }

    get is_tapped() {
        return this.tapped
    }

    get current_face() {
        if (this.is_two_sided)
            return this.card_faces[this.card_face]
        return this
    }

    get produces_mana() {
        return this.card_produced_mana !== null
    }

    get is_two_sided() {
        return this.card_faces?.length > 1;
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
        if (!this.is_two_sided) {
            return this.keywords
        }
        return this.current_face.keywords || []
    }

    get card_cmc() {
        if (!this.is_two_sided) {
            return this.cmc
        }
        return this.current_face.cmc || 0
    }

    get card_mana_cost() {
        if (!this.is_two_sided) {
            return this.mana_cost
        }
        return this.current_face.mana_cost
    }

    get card_produced_mana() {
        if (!this.is_two_sided) {
            return this.produced_mana
        }
        return this.current_face.produced_mana
    }

    get card_name() {
        if (!this.is_two_sided) {
            return this.name
        }
        return this.current_face.name
    }

    get card_type_line() {
        if (!this.is_two_sided) {
            return this.type_line
        }
        return this.current_face.type_line
    }

    get card_loaylty() {
        if (!this.is_two_sided) {
            return this.loyalty
        }
        return this.current_face.loyalty
    }

    get card_oracle_text() {
        if (!this.is_two_sided) {
            return this.oracle_text
        }
        return this.current_face.oracle_text
    }
    
    read_text(txt) {
        if (txt === null) {
            return null
        }
        txt = txt.replace(/\{T\}/g, "tap ")
        txt = txt.replace(/\{Q\}/g, "untap ")        
        return txt
    }

    get card_read_mana_cost() {
        return this.read_text(this.card_mana_cost)
    }

    get card_read_oracle_text() {
        return this.read_text(this.card_oracle_text)
    }   

    get power_toughness() {
        if (this.current_face.power === null || this.current_face.toughness === null || this.current_face.power === undefined || this.current_face.toughness === undefined) {
            return null
        }
        return this.current_face.power + "/" + this.current_face.toughness
    }

    get card_image_uris() {
        return this.current_face.image_uris
    }

    get card_flavor_text() {
        return this.current_face.flavor_text
    }

    get card_printed_text() {
        return this.current_face.printed_text.replace(/\n+/g, ' ');
    }

    get card_name_with_mana_cost() {
        if (this.is_two_sided) {
            return this.card_faces[0].name + " " + (this.card_faces[0].mana_cost === null || this.card_faces[0].mana_cost === undefined ? "" : this.card_faces[0].mana_cost) + " // " + this.card_faces[1].name + " " + (this.card_faces[1].mana_cost === null || this.card_faces[1].mana_cost === undefined ? "" : this.card_faces[1].mana_cost)
        }
        return this.card_name + (this.card_mana_cost !== null ? ` (${this.card_mana_cost})` : "")
    }

    get aria_description() {
        return `${this.card_name_with_mana_cost}` + (this.power_toughness !== null ? `, ${this.power_toughness}` : "") + (this.card_loyalty ? `, ${this.card_loyalty} loyalty` : "") + ", "
    }

    tap(){
        this.tapped = !this.tapped
    }
    
}