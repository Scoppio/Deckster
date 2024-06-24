import emptyAvatar from "../resources/images/bubbly_cat.jpg";
import { Card } from "./Card";
import { Utils } from './Utils';

export const TabIndices = {
  playerStats: 1000,
  front_battlefield: 2000,
  back_battlefield: 3000,
  land_zone_battlefield: 4000,
  hand: 5000,
  library: 6000,
  graveyard: 7000,
  exile: 8000,
  faceDown: 9000,
  commander_zone: 9900,
  card_list_zone: 10000,
};

export class Player {
  constructor(user, library, health, tabIndices, isLocal = false) {
    this.id = user.id;
    this.name = user.name;
    this.health = health;
    this.counters = {};
    this.library = library.deck;
    this.library_size = library.deck.length;
    this.sideboard = [];
    this.hand = [];
    this.remote_hand_size = 0;
    this.front_battlefield = [];
    this.back_battlefield = [];
    this.land_zone_battlefield = [];
    this.graveyard = [];
    this.exile = [];
    this.faceDown = [];
    this.commander_zone = library.commanders;
    this.commander_extra_casting_cost = 0;
    this.selected_cards = [];
    this.tabIndices = { ...tabIndices };
    this.isLocal = isLocal;
    this.avatar = user.avatar || emptyAvatar;
    this._uid = Utils.random_id_str;
    this._is_empty = false;
  }

  static emptyPlayer() {
    const player = new Player(
      {"id": Utils.random_id_str, "name": ""},
      { deck: [], commanders: [] },
      0,
      {
        playerStats: -1,
        front_battlefield: -1,
        back_battlefield: -1,
        land_zone_battlefield: -1,
        hand: -1,
        library: -1,
        graveyard: -1,
        exile: -1,
        faceDown: -1,
        commander_zone: -1,
      },
      true,
    );
    player._is_empty = true;
    return player;
  }

  createCardInstances(cardArray) {
    return cardArray.map((card) => new Card(card));
  }

  updateFromPayload(payload) {
    this.hand = this.createCardInstances(payload.hand);
    this.front_battlefield = this.createCardInstances(
      payload.front_battlefield,
    );
    this.back_battlefield = this.createCardInstances(payload.back_battlefield);
    this.land_zone_battlefield = this.createCardInstances(
      payload.land_zone_battlefield,
    );
    this.graveyard = this.createCardInstances(payload.graveyard);
    this.exile = this.createCardInstances(payload.exile);
    this.faceDown = this.createCardInstances(payload.faceDown);
    this.commander_zone = this.createCardInstances(
      payload.commander_zone ?? [],
    );
    this.selected_cards = this.createCardInstances(
      payload.selected_cards ?? [],
    );
    this.library = this.createCardInstances(payload.library ?? []);
    this.sideboard = this.createCardInstances(payload.sideboard);
    this.library_size = payload.library_size;
    this.counters = payload.counters;
  }

  get cards_in_hand() {
    if (this.isLocal) {
      return this.hand.length;
    }
    return this.remote_hand_size;
  }
}


export const EMPTY_PLAYER = Player.emptyPlayer();