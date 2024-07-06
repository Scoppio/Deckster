const ListOfTokens = require("./tokens.js");


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

  broadcastLog(message) {
    this.broadcastJson({
      type: "log_event",
      payload: message,
      sender: this.event.sender,
    });
  }

  get player() {
    return this.gameSession.getPlayer(this.event);
  }
}

class login_player extends action {
  execute() {
    this.gameSession.addPlayer(this.event.payload);
    this.broadcastLog("Player " + this.event.payload["name"] + " logged in");
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
    const old_player_state = this.gameSession.players[this.event.payload["id"]];
    if (old_player_state) {
      payloadPlayer = { ...old_player_state, ...payloadPlayer };
    }

    this.gameSession.players[this.event.payload["id"]] = payloadPlayer;
    const player = this.gameSession.players[this.event.payload["id"]];
    player.library_size = player.library.length;
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
    if (from_zone === "library" && player.viewing_library === true) {
      this.sendJson({
        type: "view_library",
        payload: player.library.slice().reverse(),
        sender: this.event.sender,
      });
    }

    const playerName = player["name"];
    let cardName = card_obj["name"];

    if (this.is_hidden(from_zone) && this.is_hidden(to_zone)) {
      cardName = "a card";
    }


    if (this.is_leaving_battlefield(to_zone) && card_obj.is_token) {
      // card is a token, it stop existing when it leaves the battlefield
    } else {
      player[to_zone].splice(to_idx, 0, card_obj);
        
    }

    this.broadcastLog(`Player ${playerName} moved ${cardName} from ${from_zone} to ${to_zone}`);
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
    const destination = this.event.payload["destination"];
    let cards_drawn = 0;

    
    for (let i = 0; i < num_cards; i++) {
      if (player[zone].length <= 0) {
        break;
      }
      player[destination].push(player[zone].pop());
      cards_drawn += 1;
    }
    player.library_size = player.library.length;
    if (player.viewing_library === true) {
      this.sendJson({
        type: "view_library",
        payload: player.library.slice().reverse(),
        sender: this.event.sender,
      });
    }
    
    this.broadcastLog(`Player ${player["name"]} drew ${cards_drawn} cards to their ${destination}`);

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
    if (player.viewing_library === true) {
      this.sendJson({
        type: "view_library",
        payload: player.library.slice().reverse(),
        sender: this.event.sender,
      });
    }
    this.broadcastLog("Player " + player["name"] + " shuffled their library");
    this.playSound("SHUFFLE_SOUND", 1.0, player);
  }
}

class pass_turn extends action {
  execute() {
    const previousPlayer = this.gameSession.getPlayer(this.event)["name"];
    
    const activePlayer = this.gameSession.game.passTurn();
    this.broadcastJson({
      type: "pass_turn",
      payload: {
        active_player: { id: activePlayer.id, name: activePlayer.name },
      },
      sender: this.event.sender,
    });

    const current_player = this.gameSession.getPlayer(activePlayer);
    this.broadcastLog("Player " + previousPlayer + " passed the turn. Its now " + current_player["name"] + "'s turn.");
    this.playSound("PASS_TURN_SOUND", 1.0, activePlayer);
  }
}

class mulligan extends action {
  execute() {
    const player = this.gameSession.getPlayer(this.event);
    player["library"].push(...player["hand"]);

    const [newHand] = new this.gameSession.game.mulliganStrategy(
      player,
      "library",
    ).draw(7);

    player.hand = newHand;
    player.library_size = player.library.length;
    if (player.viewing_library === true) {
      this.sendJson({
        type: "view_library",
        payload: player.library.slice().reverse(),
        sender: this.event.sender,
      });
    }
    
    this.broadcastLog("Player " + player["name"] + " mulliganed to " + newHand.length + " cards");
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
    this.broadcastLog("Player " + player["name"] + " changed game phase to " + phase);
    this.broadcastJson({
      type: "change_game_phase",
      payload: phase,
      sender: this.event.sender,
    });
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
    this.playSound("UNTAP_SOUND", 1.0, player);
    this.broadcastLog("Player " + player["name"] + " untapped all permanents");
  }
}

class draw_hand extends action {
  execute() {
    const player = this.gameSession.getPlayer(this.event);
    const [hand] = new this.gameSession.game.openingHandDrawStrategy(
      player,
      "library",
    ).draw(7);

    player.hand.push(...hand);
    player.library_size = player.library.length;
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
    this.broadcastLog("Player " + player["name"] + " drew their starting hand of 7 cards.");
  }
}

class view_library extends action {
  execute() {
    const player = this.gameSession.getPlayer(this.event);
    player.viewing_library = true;
    this.sendJson({
      type: "view_library",
      payload: player.library.slice().reverse(),
      sender: this.event.sender,
    });
    this.playSound("OPEN_DECK_SOUND", 1.0, player);
    this.broadcastLog("Player " + player["name"] + " is viewing their library");
  }
}

class view_top_x_cards extends action {
  execute() {
    const player = this.gameSession.getPlayer(this.event);
    player.viewing_library = true;
    const number_of_cards = this.event.payload["number_of_cards"];
    const cards = player.library.slice().reverse().slice(0, number_of_cards);
    this.sendJson({
      type: "view_top_x_cards",
      payload: cards,
      sender: this.event.sender,
    });
    this.playSound("OPEN_DECK_SOUND", 1.0, player);
    this.broadcastLog("Player " + player["name"] + " is viewing the top " + number_of_cards + " cards of their library");
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
    console.log("Permanent: ", permanent);
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
      "-1/-1": "power_toughness_counters",
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

    this.broadcastLog(`Player ${playerName} changed ${value} in ${counter} on ${cardName}, total of ${permanent[cardProperty]}`);

    this.playSound(value > 0 ? "ADD_COUNTER_SOUND" : "REMOVE_COUNTER_SOUND" , 1.0, player);

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
  }
}

class request_list_of_tokens extends action {
  execute() {
    const player = this.gameSession.getPlayer(this.event);
    this.sendJson({
      type: "list_of_tokens",
      payload: ListOfTokens,
      sender: this.event.sender,
    });
    this.playSound("OPEN_DECK_SOUND", 1.0, player);
    this.broadcastLog("Player " + player["name"] + " is viewing the list of tokens");
  }
}

class request_token extends action {
  execute() {
    const player = this.gameSession.getPlayer(this.event);

    const card_id = this.event.payload["id"];

    const token = ListOfTokens.find((token) => token.id === card_id);
    
    const newPermanent = { ...token, is_token: true, _uid: Math.floor(Math.random() * 1000000)};
    player["front_battlefield"].splice(0, 0, newPermanent);
    
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
    
    this.broadcastLog("Player " + player["name"] + " put " +  + token["name"] + " a token into the battlefield.");
    this.playSound("PLAY_SOUND", 1.0, player);
  }
}

class request_dice_roll extends action {
  execute() {
    const player = this.gameSession.getPlayer(this.event);
    const dice = this.event.payload["dice"]; // d4, d6, d8, d10, d12, d20, d100
    // dive come as a string in the format d4 or d6 or d12 or d100, we need to isolate the number part of the string and convert it to an integer
    const diceNumber = parseInt(dice.slice(1));
    const result = Math.floor(Math.random() * diceNumber) + 1;
    this.playSound("ROLL_DICE_SOUND", 1.0, player);
    this.broadcastLog("Player " + player["name"] + " rolled a " + result + " on a " + dice);
  }
}

class request_duplication_of_card extends action {
  execute() {
    const player = this.gameSession.getPlayer(this.event);
    const from_zone = this.event.payload["from_zone"];
    const from_idx = this.event.payload["from_idx"];
    const copies = this.event.payload["copies"];
    const permanent = player[from_zone][from_idx];

    for (let i = 0; i < copies; i++) {
      const newPermanent = { ...permanent, is_token: true, _uid: Math.floor(Math.random() * 1000000)};
      player[from_zone].splice(from_idx, 0, newPermanent);
    }

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
    
    this.broadcastLog("Player " + player["name"] + " copied " + permanent["name"] + " " + copies + " times");
  }
}

class no_response extends action {
  execute() {
    this.playSound("NO_RESPONSE_SOUND", 1.0, this.player);
    this.broadcastLog("Player " + this.player["name"] + " has no response.");
  }
}

class i_do_not_pay extends action {
  execute() {
    this.playSound("I_DO_NOT_PAY_SOUND", 1.0, this.player);
    this.broadcastLog("Player " + this.player["name"] + " says they do not pay.");
  }
}

class response extends action {
  execute() {
    this.playSound("ALERT_SOUND", 1.0, this.player);
    this.broadcastLog("Player " + this.player["name"] + " has a response!");
  }
}

class close_view_zone extends action {
  execute() {
    const player = this.gameSession.getPlayer(this.event);
    player.viewing_library = false;
    this.sendJson({
      type: "hide_hidden_card_zone",
      payload: player,
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
  close_view_zone,
  change_card_special_value,
  request_list_of_tokens,
  request_dice_roll,
  request_duplication_of_card,
  request_token,
  i_do_not_pay,
  no_response,
  response,
  
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
