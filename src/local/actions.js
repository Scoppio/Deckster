class action {
  constructor(gameSession, event, sendJson, broadcastJson, playSound) {
    this.gameSession = gameSession;
    this.event = event;
    this.sendJson = sendJson;
    this.broadcastJson = broadcastJson;
    this.playSound = playSound;
    this.SERVER = { name: "server", id: 9999, idx: 9999 };
  }

  execute() {}
}

class login_player extends action {
  execute() {
    this.gameSession.addPlayer(this.event.payload);
    const ret = {
      type: "log_event",
      payload: "Player " + this.event.payload["name"] + " logged in",
      sender: this.SERVER,
    };
    this.sendJson(ret);
  }
}

class update_player extends action {
  execute() {
    let payloadPlayer = this.event.payload;
    let sound = this.event.payload["sound"];
    let volume = this.event.payload["volume"] || 1.0;
    if (sound) {
      this.playSound(sound, volume, this.event.sender);
      delete payloadPlayer["sound"];
      delete payloadPlayer["volume"];
    }
    this.gameSession.players[this.event.payload["id"]] = payloadPlayer;
    const player = this.gameSession.players[this.event.payload["id"]];
    const ret = {
      type: "update_player",
      payload: player,
      sender: this.event.sender,
    };

    this.sendJson(ret);
    this.broadcastJson({ ...ret, type: "update_opp_table" });
  }
}

class move_card extends action {
  is_hidden(zone) {
    return (
      zone === "library" ||
      zone === "hand" ||
      zone === "faceDown" ||
      zone === "face_down"
    );
  }

  is_leaving_battlefield(zone) {
    return (zone !== "front_battlefield" &&
      zone !== "back_battlefield" &&
      zone !== "land_zone_battlefield"
    );
  }

  execute() {
    const player_id = this.event.sender["id"];
    const player = this.gameSession.players[player_id];
    const from_zone = this.event.payload["from_zone"];
    const to_zone = this.event.payload["to_zone"];
    const from_idx = this.event.payload["from_idx"];
    const to_idx = this.event.payload["to_idx"];
    const card_obj = player[from_zone][from_idx];

    if (!card_obj) {
      console.log("Card not found");
      this.sendJson({
        type: "update_player",
        payload: player,
        sender: this.SERVER,
      });
      return;
    }

    if (this.is_leaving_battlefield(to_zone)) {
      card_obj.tapped = false;
      card_obj.dont_untap = false;
      card_obj.counters = 0;
      card_obj.misc_counters = 0;
      card_obj.power_toughness_counters = 0;
      card_obj.power_modifier = 0;
      card_obj.toughness_modifier = 0;
    }
    
    player[from_zone].splice(from_idx, 1);
    player[to_zone].splice(to_idx, 0, card_obj);

    const playerName = player["name"];
    let cardName = card_obj["name"];

    if (this.is_hidden(from_zone) && this.is_hidden(to_zone)) {
      cardName = "a card";
    }

    const responseLog = {
      type: "log_event",
      payload: `Player ${playerName} moved ${cardName} from ${from_zone} to ${to_zone}`,
      sender: this.SERVER,
    };

    this.sendJson(responseLog);
    this.sendJson({
      type: "update_player",
      payload: player,
      sender: this.SERVER,
    });
    this.broadcastJson({
      type: "update_opp_table",
      payload: player,
      sender: this.event.sender,
    });
    this.playSound("PLAY_SOUND", 1.0, player);
  }
}

class draw_card extends action {
  execute() {
    const player_id = this.event.sender["id"];
    const player = this.gameSession.players[player_id];
    console.log(player_id, player.name);
    const num_cards = this.event.payload["number_of_cards"];
    const zone = this.event.payload["zone"];
    let cards_drawn = 0;
    for (let i = 0; i < num_cards; i++) {
      if (player[zone].length <= 0) {
        break;
      }
      player["hand"].push(player[zone].pop());
      cards_drawn += 1;
    }

    const responseLog = {
      type: "log_event",
      payload:
        "Player " +
        player["name"] +
        " drew " +
        cards_drawn +
        " cards from " +
        zone,
      sender: this.SERVER,
    };

    this.sendJson(responseLog);
    this.sendJson({
      type: "update_player",
      payload: player,
      sender: this.event.sender,
    });
    this.broadcastJson({
      type: "update_opp_table",
      payload: player,
      sender: this.event.sender,
    });
    this.playSound("DRAW_SOUND", 1.0, player);
  }
}

class shuffle_library extends action {
  execute() {
    const player_id = this.event.sender["id"];
    const player = this.gameSession.players[player_id];
    player["library"].sort(() => Math.random() - 0.5);
    const responseLog = {
      type: "log_event",
      payload: "Player " + player["name"] + " shuffled their library",
      sender: this.SERVER,
    };
    this.sendJson(responseLog);
    this.playSound("SHUFFLE_SOUND", 1.0, player);
  }
}

class pass_turn extends action {
  execute() {
    const activePlayer = this.gameSession.game.passTurn();
    this.broadcastJson({
      type: "pass_turn",
      payload: {
        active_player: { id: activePlayer.id, name: activePlayer.name },
      },
      sender: this.event.sender,
    });
  }
}

class mulligan extends action {
  execute() {
    const player = this.gameSession.getPlayer(this.event);
    const [newHand] = new this.gameSession.game.mulliganStrategy(
      player,
      "hand",
    ).draw(7);
    player.hand = newHand;
    this.sendJson({
      type: "update_player",
      payload: player,
      sender: this.event.sender,
    });
    this.broadcastJson({
      type: "update_opp_table",
      payload: player,
      sender: this.event.sender,
    });
    this.playSound("MULLIGAN_SOUND", 1.0, player);
  }
}

class change_game_phase extends action {
  execute() {
    const player = this.gameSession.getPlayer(this.event);
    const phase = this.event.payload["phase"];
    const responseLog = {
      type: "log_event",
      payload: "Player " + player["name"] + " changed game phase to " + phase,
      sender: this.SERVER,
    };
    this.sendJson(responseLog);
  }
}

class untap_all extends action {
  execute() {
    const player = this.gameSession.getPlayer(this.event);
    const permanents = player.battlefield || [];
    if (permanents.length === 0) {
      return;
    }
    for (const permanent of permanents) {
      permanent.tapped = false;
    }
    this.sendJson({
      type: "update_player",
      payload: player,
      sender: this.event.sender,
    });
    this.broadcastJson({
      type: "update_opp_table",
      payload: player,
      sender: this.event.sender,
    });
  }
}

class draw_hand extends action {
  execute() {
    const player = this.gameSession.getPlayer(this.event);
    const [hand] = new this.gameSession.game.openingHandDrawStrategy(
      player,
      "library",
    ).draw(7);
    player.hand = hand;
    this.sendJson({
      type: "update_player",
      payload: player,
      sender: this.event.sender,
    });
    this.broadcastJson({
      type: "update_opp_table",
      payload: player,
      sender: this.event.sender,
    });
  }
}

class view_library extends action {
  execute() {
    const player = this.gameSession.getPlayer(this.event);
    this.sendJson({
      type: "view_library",
      payload: player.library.slice().reverse(),
      sender: this.event.sender,
    });
    this.playSound("PLAY_SOUND", 1.0, player);
    this.sendJson({
      type: "log_event",
      payload: "Player " + player["name"] + " viewed their library",
      sender: this.SERVER,
    });
  }
}

class view_top_x_cards extends action {
  execute() {
    const player = this.gameSession.getPlayer(this.event);
    const number_of_cards = this.event.payload["number_of_cards"];
    const cards = player.library.slice().reverse().slice(0, number_of_cards);
    this.sendJson({
      type: "view_top_x_cards",
      payload: cards,
      sender: this.event.sender,
    });
    this.playSound("PLAY_SOUND", 1.0, player);
    this.sendJson({
      type: "log_event",
      payload:
        "Player " +
        player["name"] +
        " viewed the top " +
        number_of_cards +
        " cards of their library",
      sender: this.SERVER,
    });
  }
}

class change_card_special_value extends action {
  execute() {
    const player = this.gameSession.getPlayer(this.event);

    const from_zone = this.event.payload["from_zone"];
    const from_idx = this.event.payload["from_idx"];

    const counter = this.event.payload["special_value"];
    const value = this.event.payload["value"];
    
    const permanent = player[from_zone][from_idx];
    
    if (!permanent) {
      console.log("Card not found");
      this.sendJson({
        type: "update_player",
        payload: player,
        sender: this.SERVER,
      });
      return;
    }

    const refTable = {
      "+1/+1": "power_toughness_counters",
      counter: "counters",
      counters: "counters",
      loyalty: "counters",
      charge: "counters",
      energy: "misc_counters",
      temp_power: "power_modifier",
      temp_toughness: "toughness_modifier",
    };

    const cardProperty = refTable[counter] || "counters";

    if (!permanent[cardProperty]) {
      permanent[cardProperty] = 0;
    }

    permanent[cardProperty] += value;

    const playerName = player["name"];
    let cardName = permanent.name;

    const responseLog = {
      type: "log_event",
      payload: `Player ${playerName} changed ${value} ${counter} on ${cardName}`,
      sender: this.SERVER,
    };

    this.sendJson(responseLog);
    this.sendJson({
      type: "update_player",
      payload: player,
      sender: this.SERVER,
    });
    this.broadcastJson({
      type: "update_opp_table",
      payload: player,
      sender: this.event.sender,
    });
    this.playSound("PLAY_SOUND", 1.0, player);
  }
}

const ACTION_CONFIG = {
  action,
  login_player,
  update_player,
  move_card,
  draw_card,
  shuffle_library,
  pass_turn,
  mulligan,
  change_game_phase,
  untap_all,
  draw_hand,
  view_library,
  view_top_x_cards,
  change_card_special_value,
};

class ActionFactory {
  static create(gameSession, event, sendJson, broadcastJson, playSound) {
    return new ACTION_CONFIG[event.type](
      gameSession,
      event,
      sendJson,
      broadcastJson,
      playSound,
    );
  }
}

module.exports = ActionFactory;
