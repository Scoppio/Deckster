import FuckedCardBack from "../resources/cards/mtgcardback.png";
import { Utils } from './Utils';


export class Card {
  constructor(card) {
    this._uid = card._uid || Utils.random_id_str;
    this.id = card.id;
    this.name = card.name;
    this.type_line = card.type_line;
    this.oracle_text = card.oracle_text;
    this.power = card.power;
    this.toughness = card.toughness;
    this.mana_cost = card.mana_cost;
    this.cmc = card.cmc;
    this.colors = card.colors;
    this.color_identity = card.color_identity;
    this.image_uris = card.image_uris;
    this.set = card.tset;
    this.flavor_text = card.flavor_text;
    this.rarity = card.rarity;
    this.artist = card.artist;
    this.loyalty = card.loyalty;
    this.printed_text = card.printed_text;
    this.printed_name = card.printed_name;
    this.printed_type_line = card.printed_type_line;
    this.lang = card.lang;
    this.card_faces = card.card_faces;
    this.card_face = card.card_face || 0;
    this.tapped = card.tapped || false;
    this.dont_untap = card.dont_untap || false;
    this._hidden = card._hidden || false;
    this.power_toughness_counters = card.power_toughness_counters || 0;
    this.counters = card.counters || 0;
    this.power_modifier = card.power_modifier || 0;
    this.toughness_modifier = card.toughness_modifier || 0;
    this.misc_counters = card.misc_counters || 0; 
    this.is_token = card.is_token || false;
    this.is_dragged = card.is_dragged || false;
    this.revealed = card.revealed || false;
    this.revealed_to = card.revealed_to || [];
  }

  changeFace() {
    this.card_face = this.card_face === 0 ? 1 : 0;
    if (!this.is_two_sided && this.card_face === 1) {
      this._hidden = true;
    } else if (!this.is_two_sided && this.card_face === 0) {
      this._hidden = false;
    }
  }

  get hidden() {
    return this._hidden;
  }

  get is_tapped() {
    return this.tapped;
  }

  get current_face() {
    if (this.is_two_sided) return this.card_faces[this.card_face];
    return this;
  }

  get produces_mana() {
    return this.card_produced_mana !== null;
  }

  get is_two_sided() {
    return this.card_faces?.length > 1;
  }

  get is_transformed() {
    return this.hidden;
  }

  get is_land() {
    if (this.hidden) return false;
    return this.card_type_line.includes("Land");
  }

  get is_creature() {
    if (this.hidden) return false;
    return this.card_type_line.includes("Creature");
  }

  get is_planeswalker() {
    if (this.hidden) return false;
    return this.card_type_line.includes("Planeswalker");
  }

  get is_artifact() {
    if (this.hidden) return false;
    return this.card_type_line.includes("Artifact");
  }

  get is_enchantment() {
    if (this.hidden) return false;
    return this.card_type_line.includes("Enchantment");
  }

  get is_aura() {
    if (this.hidden) return false;
    return this.card_type_line.includes("Aura");
  }

  get is_instant() {
    if (this.hidden) return false;
    return this.card_type_line.includes("Instant");
  }

  get is_sorcery() {
    if (this.hidden) return false;
    return this.card_type_line.includes("Sorcery");
  }

  get is_historic() {
    if (this.hidden) return false;
    return (
      this.card_type_line.includes("Legendary") ||
      this.card_type_line.includes("Saga") ||
      this.card_type_line.includes("Artifact")
    );
  }

  get card_keywords() {
    if (this.hidden) return null;
    if (!this.is_two_sided) {
      return this.keywords;
    }
    return this.current_face.keywords || [];
  }

  get card_cmc() {
    if (this.hidden) return null;
    if (!this.is_two_sided) {
      return this.cmc;
    }
    return this.current_face.cmc || 0;
  }

  get card_mana_cost() {
    if (this.hidden) return null;
    if (!this.is_two_sided) {
      return this.mana_cost;
    }
    return this.current_face.mana_cost;
  }

  get card_produced_mana() {
    if (this.hidden) return null;
    if (!this.is_two_sided) {
      return this.produced_mana;
    }
    return this.current_face.produced_mana;
  }

  get card_name() {
    if (this.hidden) return "Hidden Card";

    if (!this.is_two_sided) {
      return this.name;
    }
    return this.current_face.name;
  }

  get card_type_line() {
    if (this.hidden) return "Hidden Card";

    if (!this.is_two_sided) {
      return this.type_line;
    }
    return this.current_face.type_line;
  }

  get card_loyalty() {
    if (this.hidden) return null;
    if (!this.is_two_sided) {
      return this.loyalty;
    }
    return this.current_face.loyalty;
  }

  get card_oracle_text() {
    if (this.hidden) return "";

    if (!this.is_two_sided) {
      return this.oracle_text;
    }
    return this.current_face.oracle_text;
  }

  read_text(txt) {
    if (txt === null || txt === undefined) {
      return null;
    }
    txt = txt.replace(/\{T\}/g, "tap ");
    txt = txt.replace(/\{Q\}/g, "untap ");
    return txt;
  }

  get card_read_mana_cost() {
    return this.read_text(this.card_mana_cost);
  }

  get card_read_oracle_text() {
    return this.read_text(this.card_oracle_text);
  }

  get is_power_and_thoughness_modified() {
    return (
      this.power_toughness_counters !== 0 ||
      this.power_toughness_counters !== 0
    );
  }

  get power_toughness() {

    if (!this.is_power_and_thoughness_modified) {
      if (
        this.current_face.power === null ||
        this.current_face.toughness === null ||
        this.current_face.power === undefined ||
        this.current_face.toughness === undefined
      ) {
        return null;
      }
    }

    let p = this.current_face.power === "*" ? "0" : this.current_face.power;
    let t = this.current_face.toughness === "*" ? "0" : this.current_face.toughness;

    if (this.hidden) {
      p = "0";
      t = "0";
    }
    
    const _power = String(Number(p || 0) + Number(this.power_modifier || 0) + Number(this.power_toughness_counters || 0));
    const _toughness = String(Number(t || 0) + Number(this.toughness_modifier || 0) + Number(this.power_toughness_counters || 0));

    if (_toughness === "0" && _power === "0") {
      return null;
    }

    return _power + "/" + _toughness;
  }

  get card_image_uris() {
    if (this.hidden) return { small: FuckedCardBack, normal: FuckedCardBack };
    if (!this.is_two_sided) {
      if (this.card_face === 1)
        return { small: FuckedCardBack, normal: FuckedCardBack };
    }
    return this.current_face.image_uris;
  }

  get card_flavor_text() {
    if (this.hidden) return "Hidden Card";
    return this.current_face.flavor_text;
  }

  get card_printed_text() {
    if (this.hidden) return "Hidden Card";
    return this.current_face.printed_text.replace(/\n+/g, " ");
  }

  get card_face_name_with_mana_cost() {
    if (this.hidden) return "Hidden Card";
    return (
      this.current_face.name +
      (this.card_mana_cost !== null ? ` (${this.card_mana_cost})` : "")
    );
  }

  get card_name_with_mana_cost() {
    if (this.hidden) return "Hidden Card";
    if (this.is_two_sided) {
      return (
        this.card_faces[0].name +
        " " +
        (this.card_faces[0].mana_cost === null ||
        this.card_faces[0].mana_cost === undefined
          ? ""
          : this.card_faces[0].mana_cost) +
        " // " +
        this.card_faces[1].name +
        " " +
        (this.card_faces[1].mana_cost === null ||
        this.card_faces[1].mana_cost === undefined
          ? ""
          : this.card_faces[1].mana_cost)
      );
    }
    return this.card_face_name_with_mana_cost;
  }

  get aria_description() {
    if (this.hidden) return "Hidden Card";
    return (
      this.card_name_with_mana_cost +
      (this.power_toughness !== null ? `, ${this.power_toughness}` : "") +
      (this.card_loyalty ? `, ${this.card_loyalty} starting loyalty` : "") +
      ", "
    );
  }

  get face_aria_description() {
    if (this.hidden) return "Hidden Card";
    return (
      this.card_face_name_with_mana_cost +
      (this.power_toughness !== null ? `, ${this.power_toughness}` : "") +
      (this.card_loyalty ? `, ${this.card_loyalty} starting loyalty` : "") +
      (this.is_two_sided
        ? ", other side is " +
          this.card_faces[this.card_face === 0 ? 1 : 0].name
        : "") +
      "."
    );
  }

  tap() {
    this.tapped = !this.tapped;
  }
}
