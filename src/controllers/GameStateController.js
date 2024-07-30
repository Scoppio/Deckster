import AriaHelper from "./AriaHelper";
import { EventEmitter } from "events";
import Sounds from "./Sounds";
import { Card } from "../commons/Card";
import { Player } from "../commons/Player";

import { Utils } from "../commons/Utils";


const GamePhase = {
  MAIN: 0,
  COMBAT: 1,
  MAIN_2: 2,
  END: 3
};


class BaseGameStateController extends EventEmitter {
  constructor(state = null, updateState) {
    super();
    this.updateState = updateState;
    if (state) {
      this.fromPreviousState(state);
    } else {
      this.players = {};
      this.players_initiative = {};
      this.players_sequence = [];
      this.active_player_id = null;
      this.player_number = null;
      this.webSocketClient = null;
      this.game_phase = GamePhase["MAIN"];
      this.ariaHelper = new AriaHelper(this);
      this.online = false;
      this.game_log = [];
      this.announcement_message = "";
      this.focus_card = null;
      this.sounds = new Sounds();
      this.open_zone = { zone: null, cards: [] };
      this.authorization = null;
      this.gameStateHandler = null;
      this.searchZoneConfig = {};
      this.game_state_handler = [];
    }
  }

  fromPreviousState(previousState) {
    this.searchZoneConfig = previousState.searchZoneConfig;
    this.players = previousState.players;
    this.players_initiative = previousState.players_initiative;
    this.players_sequence = previousState.players_sequence;
    this.active_player_id = previousState.active_player_id;
    this.player_number = previousState.player_number;
    
    this.webSocketClient = previousState.webSocketClient;
    this.authorization = previousState.authorization;
    this.game_phase = previousState.game_phase;
    this.game_state_handler = previousState.game_state_handler;

    this.ariaHelper = previousState.ariaHelper;
    this.online = previousState.online;
    this.game_log = previousState.game_log;
    this.focus_card = previousState.focus_card;
    this.sounds = previousState.sounds;
    this.announcement_message = previousState.announcement_message;
    this.open_zone = previousState.open_zone;
    this.upkeep_reminder = previousState.upkeep_reminder;
  }

  get game_name () {
    return this.authorization?.gameName;
  }

  get game_phase_name () {
    return Object.keys(GamePhase).find(key => GamePhase[key] === this.game_phase);
  }

  get player() {
    return this.players[this.player_number];
  }

  get current_player() {
    return this.players[this.player_number];
  }

  get current_player_id() {
    return this.player_number;
  }

  get active_player() {
    return this.players[this.active_player_id];
  }

  get isActivePlayer() {
    return this.player_number === this.active_player_id;
  }

  get active_player_number() {
    return this.active_player_id;
  }

  get sender() {
    return { id: this.player.id, idx: this.player_number };
  }

  get log() {
    return this.game_log;
  }
  
  announce(message) {
    this.announcement_message = message;
    this.changed();
  }

  registerWebSocketClient(webSocketClient) {
    this.webSocketClient = webSocketClient;
    this.webSocketClient.addListener(this);
  }

  changed() {
    this.updateState(this);
    this.emit("stateChanged", this);
  }

  // Local actions
  focusOnCard(card) {
    if (!card) {
      console.log("Card cant be focused, it is null");
      card = {};
    }
    console.log("Focus on card " + card.name);
    this.focus_card = card;
    this.changed();
  }

  removeFocusOnCard(card) {
    if (this.focus_card !== null && card !== null) {
      console.log("Trying to remove focus on " + card.name + " card " + this.focus_card?.name);
      if (this.focus_card._uid === card._uid) {
        console.log("Card removed from focus");
        this.focus_card = {};
        this.changed();
      } else {
        console.log("Card not removed from focus");
      }
    } else {
      console.log("Focus card is already null");
    }
  }

  getPlayer(playerNumber) {
    return this.players[playerNumber];
  }

  getCardFrom(source) {
    const sourceZone = source.droppableId;
    const sourceIndex = source.index;
    const card = this.player[sourceZone][sourceIndex];
    this.focusOnCard(card);
    return card;
  }

  cancelCardMove(card) {
    this.removeFocusOnCard(card);
  }

  playSound(sound_name, volume = 1.0) {
    this.sounds.playSound(sound_name, volume);
  }

  changeAppState(appState="view_zone") {
    if (Array.isArray(this.game_state_handler) && this.game_state_handler.length > 0) {
      // Grab the first element
      const firstElement = this.game_state_handler[0];
      
      // Check if the first element has a func method and call it if exists
      if (firstElement && typeof firstElement.func === 'function') {
          firstElement.func(appState);
      }
    }
  }
}

class RequestGameActions extends BaseGameStateController {
  constructor(state = null, updateState) {
    super(state, updateState);
  }

  sendEvent(type, payload = {}) {
    const sender = this.sender;
    try {
      this.webSocketClient?.sendEvent({
        sender: sender,
        type: type,
        payload: payload,
      });
    } catch (error) {
      console.log(error);
    }
  }

  addPlayer(player) {
    this.players[player.id] = player;
    const playerNumber = player.id;

    if (player.isLocal && !player._is_empty) {
      this.player_number = playerNumber;
    }
    this.players_sequence.push(player);
    this.sendEvent("login_player", player);
  }

  ////////////

  sendChatMessage(message) {
    this.sendEvent("chat_message", { message });
  }

  response() {
    this.sendEvent("response");
  }

  noResponse() {
    this.sendEvent("no_response");
  }

  iDoNotPay() {
    this.sendEvent("i_do_not_pay");
  }

  updateGameState() {
    this.sendEvent("update_game_state");
  }

  exitGame() {
    this.sendEvent("player_quit", {
      player_id: this.player.id,
      player_username: this.player.name,
    });
  }

  changePlayerInitiative(player, index_change) {
    this.sendEvent("change_player_initiative", { player_id: player.id, index_change });
  }

  kickPlayer(player) {
    this.sendEvent("kick_player", { 
      player_id: player.id, 
      player_username: player.name 
    });
  }

  drawCard(number_of_cards = 1, zone = "library", destination = "hand") {
    this.sendEvent("draw_card", {
      zone: zone,
      number_of_cards: number_of_cards,
      destination: destination,
    });
  }

  addCardsToBattlefield(cards) {
    this.sendEvent("add_cards_to_battlefield", { cards });
  }

  cardsFromZone(card_piles, shuffle = false, shuffle_card_pile = false, bottom_of_pile = false) {
    this.sendEvent("cards_from_zone", { card_piles , shuffle, shuffle_card_pile, bottom_of_pile });
  }

  untapAll() {
    this.sendEvent("untap_all");
  }

  cloneCard(card) {
    this.sendEvent("request_duplication_of_card", { cards: [card] });
  }

  revealTopOfLibrary(variation="once") { // can be: [once, always, hide]
    if (variation in ["once", "always", "hide"]) {
      this.sendEvent("reveal_top_card", { variation });
    }
  }

  callAttentionToCard(owner_id, region, position_idx) {
    this.sendEvent("call_attention_to_card", { owner_id, region, position_idx });
  }

  updatePlayer(sound, volume = 1.0) {
    this.sendEvent("update_player", { ...this.player, sound, volume });
    this.changed();
  }

  changeCommanderTax(value) {
    this.player.commander_extra_casting_cost += value;
    this.sendEvent("chat_message", { message: `changed commander tax to ${this.player.commander_extra_casting_cost}` });
    this.updatePlayer("CHANGE_COMMANDER_TAX");
  }

  increaseLife(health_points = 1) {
    this.player.health += health_points;
    this.sendEvent("chat_message", { message: `gained ${health_points} health, now my total is ${this.player.health}` });
    this.updatePlayer("ADD_COUNTER_SOUND");
    this.changed();
  }

  decreaseLife(health_points = 1) {
    this.player.health -= health_points;
    this.sendEvent("chat_message", { message: `lost ${health_points} health, now my total is ${this.player.health}` });
    this.updatePlayer("ADD_COUNTER_SOUND", 1.0);
    this.changed();
  }

  moveCardToZonePosition(sourceZone, sourceIndex, destinationZone, card = null, position = 0) {
    const source = { droppableId: sourceZone, index: sourceIndex };
    const destination = { droppableId: destinationZone, index: position };
    this.moveCardTo(source, destination, card);
  }

  requestListOfTokens() {
    this.changeAppState("tokens");
  }

  requestDiceRoll(dice) {
    this.sendEvent("request_dice_roll", { dice });
  }
  
  requestToken(tokenId) {
    this.sendEvent("request_token", { tokenId });
  }

  scry() {
    // FIXME: Implement scry
    console.log("TODO");
  }

  switchRevealCardToAll(postitionIdx) {
    this.sendEvent("reveal_card_in_hand", { position_idx: postitionIdx});
  }

  drawHand(number_of_cards = 7) {
    this.sendEvent("draw_hand", { number_of_cards });
  }

  mulliganHand(number_of_cards = 7) {
    this.sendEvent("mulligan", { number_of_cards });
  }

  drawCardToBattlefield(number_of_cards = 1) {
    this.drawCard(number_of_cards, "library", "front_battlefield");
  }

  drawCardToGraveyard(number_of_cards = 1) {
    this.drawCard(number_of_cards, "library", "graveyard");
  }

  drawCardToExile(number_of_cards = 1) {
    this.drawCard(number_of_cards, "library", "exile");
  }

  drawCardToFaceDown(number_of_cards = 1) {
    this.drawCard(number_of_cards, "library", "face_down");
  }

  shuffleDeck() {
    this.sendEvent("shuffle_library");
  }

  changeUpkeepReminder() {
    this.upkeep_reminder = !this.upkeep_reminder;
  }

  passTurn() {
    this.sendEvent("pass_turn");
  }

  changeGamePhase(phase=null) {
    this.sendEvent("change_game_phase", { phase });
  }

  viewLibrary() {
    this.searchZoneConfig["usingCloseAndShuffle"] = true;
    this.searchZoneConfig["sourceZone"] = "library";
    this.searchZoneConfig["targetZones"] = ["hand", "battlefield", "graveyard", "exile", "face_down"];
    
    this.sendEvent("view_library");
  }

  viewTopXCards(number_of_cards) {
    this.searchZoneConfig["usingCloseAndShuffle"] = false;
    this.searchZoneConfig["sourceZone"] = "library";
    this.searchZoneConfig["targetZones"] =  ["hand", "battlefield", "graveyard", "exile", "face_down", "bottom_of_library"];
    this.sendEvent("view_top_x_cards", { number_of_cards });
  }

  viewZone(player, zone, noTargetZone = false) {
    this.announce(`Viewing ${zone}`);
    this.searchZoneConfig["usingCloseAndShuffle"] = false;
    this.searchZoneConfig["sourceZone"] = zone;
    const targetZones = ["hand", "battlefield", "graveyard", "exile", "face_down"].filter((targetZone) => targetZone !== zone);
    this.searchZoneConfig["targetZones"] = noTargetZone ? [] : targetZones;
    this.open_zone = { zone: zone, cards: player[zone] };
    this.changeAppState("view_zone");
    this.changed();
  }

  closeViewZone() {
    this.open_zone = { zone: null, cards: [] };
    this.searchZoneConfig["usingCloseAndShuffle"] = false;
    this.searchZoneConfig["sourceZone"] = "exile";
    this.searchZoneConfig["targetZones"] = [];
    
    this.sendEvent("close_view_zone");
    this.gameStateHandler("game");
    this.changed();
  }


  moveCardTo(source, destination, card = null) {
    const sourceZone = source.droppableId;
    const sourceIndex = source.index;
    if (card === null) {
      card = this.player[sourceZone][sourceIndex];
    }
    this.player[sourceZone].splice(sourceIndex, 1);

    const destinationZone = destination.droppableId;
    const destinationIndex = destination.index;
    this.player[destinationZone].splice(destinationIndex, 0, card);

    this.sendEvent("move_card", {
      from_zone: sourceZone,
      to_zone: destinationZone,
      from_idx: sourceIndex,
      to_idx: destinationIndex,
      card_uid: card._uid,
    });

    return card;
  }

  changeCounter(sourceZone, sourceIndex, value, counterType = "charge") {
    console.log(`Changing counter ${counterType} by ${value}`);
    this.sendEvent("change_card_special_value", {
      from_zone: sourceZone,
      from_idx: sourceIndex,
      special_value: counterType,
      value: value,
    });
  }

}


class ExecuteGameActions extends RequestGameActions {
  constructor(state = null, updateState) {
    super(state, updateState);
  }

  handleEvent(event) {
    console.log(`GameStateController ${event.type}`);
    this[event.type](event);
    this.changed();
  }

  log_event(event) {
    console.log(event);
    const currentTime = new Date();
    const formattedTime = Utils.strftime("%H:%M:%S", currentTime);
    
    this.game_log.unshift(`${event.payload} - ${formattedTime}`);
    if (this.game_log.length > 100) {
      this.game_log = this.game_log.slice(0, 100);
    }
  }

  pass_turn(event) {
    const new_active_player = event.payload.active_player;
    this.active_player_id = new_active_player.id;
  }

  change_game_phase(event) {
    console.log("Changing game phase to " + event.payload.phase);
    if (this.upkeep_reminder && this.player.id === this.active_player_id) {
      this.announce("This is your upkeep reminder");
      this.playSound("UPKEEP_REMINDER");
    }
    this.game_phase = event.payload.phase;
    this.changed();
  }

  update_game_state(event) {
    const players = event.payload.players;
    Object.keys(players).forEach((key) => {
      const player = players[key];

      if (!(player.id in this.players)) {
        this.players[player.id] = Player.remote(player);
      } else {
        this.players[player.id].updateFromPayload(player);
      }
    });

    this.internalUpdatePlayerSequence(event.payload.player_sequence);
  }

  update_opp_table(event) {
    const opp_player = event.payload;
    if (this.player_number !== opp_player.id) {
      if (!(opp_player.id in this.players)) {
        this.players[opp_player.id] = Player.remote(opp_player);
      } else {
        this.players[opp_player.id].updateFromPayload(opp_player);
      }
      this.changed();
    }
  }

  createCardInstances(cardArray) {
    return cardArray.map((card) => new Card(card));
  }

  view_library(event) {
    this.announce(`Viewing library`);
    this.open_zone = { zone: "library", cards: this.createCardInstances(event.payload) };
    this.changeAppState("view_zone");
    this.changed();
  }

  view_top_x_cards(event) {
    this.announce(`Viewing top ${event.payload.number_of_cards} cards`);
    this.open_zone = { zone: "library", cards: this.createCardInstances(event.payload) };
    this.changeAppState("view_zone");
    this.changed();
  }

  update_player(event) {
    this.player.updateFromPayload(event.payload);
  }

  hide_hidden_card_zone(event) {
    this.player.updateFromPayload(event.payload);
  }

  internalUpdatePlayerSequence(playerSequence) {
    const players_sequence_ids = playerSequence.players_sequence_ids;
    this.active_player_id = playerSequence.active_player_id;
    
    this.players_sequence = players_sequence_ids
      .map(player_id => this.players[player_id])
      .filter(player => player !== null && player !== undefined);
    this.changed();
  }

  update_player_sequence(event) {
    this.internalUpdatePlayerSequence(event.payload);
    this.changed();
  }

  play_sound(event) {
    console.log("Playing sound", event.payload?.name, event.payload?.volume ?? 1.0);
    this.playSound(event.payload?.name, event.payload?.volume ?? 1.0);
  }
}

export default class GameStateController extends ExecuteGameActions {
  constructor(state = null, updateState) {
    super(state, updateState);
  }
}
