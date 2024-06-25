import AriaHelper from "./AriaHelper";
import { EventEmitter } from "events";
import Sounds from "./Sounds";
import { EMPTY_PLAYER } from "../commons/Player";
import { Card } from "../commons/Card";


class BaseGameStateController extends EventEmitter {
  constructor(state = null, updateState) {
    super();
    this.updateState = updateState;
    if (state) {
      this.fromPreviousState(state);
    } else {
      this.players = [];
      this.players_initiative = {};
      this.activePlayer = null;
      this.player_number = 0;
      this.webSocketClient = null;
      this.ariaHelper = new AriaHelper(this);
      this.online = false;
      this.game_log = [];
      this.announcement_message = "";
      this.focus_card = null;
      this.sounds = new Sounds();
      this.open_zone = { zone: null, cards: [] };
      this.authorization = null;
    }
  }

  fromPreviousState(previousState) {
    this.players = previousState.players;
    this.players_initiative = {};
    this.activePlayer = previousState.activePlayer;
    this.player_number = previousState.player_number;
    
    this.webSocketClient = previousState.webSocketClient;
    this.authorization = previousState.authorization;

    this.ariaHelper = previousState.ariaHelper;
    this.online = previousState.online;
    this.game_log = previousState.game_log;
    this.focus_card = previousState.focus_card;
    this.sounds = previousState.sounds;
    this.announcement_message = previousState.announcement_message;
    this.open_zone = previousState.open_zone;
  }

  get player() {
    return this.players[this.player_number];
  }

  get active_player() {
    return this.players[this.activePlayer];
  }

  get active_player_number() {
    return this.activePlayer;
  }

  get players_sequence() {
    return this.players;
  }

  get sender() {
    return { id: this.player.id, idx: this.player_number };
  }

  get log() {
    return this.game_log;
  }

  _hideHiddenCardZone() {}
  _showHiddenCardZone() {}

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
    this.focus_card = card;
    this.changed();
  }

  getPlayer(playerNumber) {
    if (playerNumber < 0 || playerNumber >= this.players.length) {
      return EMPTY_PLAYER;
    }
    return this.players[playerNumber];
  }


  getCardFrom(source) {
    const sourceZone = source.droppableId;
    const sourceIndex = source.index;
    const card = this.player[sourceZone][sourceIndex];
    this.focusOnCard(card);
    return card;
  }

  cancelCardMove() {
    this.focusOnCard(null);
  }

  playSound(sound_name, volume = 1.0) {
    this.sounds.playSound(sound_name, volume);
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
    this.players.push(player);
    const playerNumber = this.players.length - 1;

    if (player.isLocal && !player._is_empty) {
      this.player_number = playerNumber;
    }

    this.sendEvent("login_player", player);
  }

  ////////////

  response() {
    this.sendEvent("response");
  }

  noResponse() {
    this.sendEvent("no_response");
  }

  iDoNotPay() {
    this.sendEvent("i_do_not_pay");
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

  untapAll() {
    this.sendEvent("untap_all");
  }

  updatePlayer(sound, volume = 1.0) {
    this.sendEvent("update_player", { ...this.player, sound, volume });
  }

  increaseLife(health_points = 1) {
    this.player.health += health_points;
    this.updatePlayer("ADD_COUNTER_SOUND");
  }

  decreaseLife(health_points = 1) {
    this.player.health -= health_points;
    this.updatePlayer("ADD_COUNTER_SOUND", 1.0);
  }

  moveCardToZonePosition(sourceZone, sourceIndex, destinationZone, card = null, position = 0) {
    const source = { droppableId: sourceZone, index: sourceIndex };
    const destination = { droppableId: destinationZone, index: position };
    this.moveCardTo(source, destination, card);
  }

  requestListOfTokens() {
    this.sendEvent("request_list_of_tokens");
  }

  requestDiceRoll(dice) {
    this.sendEvent("request_dice_roll", { dice });
  }
  
  requestToken(tokenId) {
    this.sendEvent("request_token", { tokenId });
  }

  requestDuplicationOfCard(sourceZone, sourceIndex, copies) {
    this.sendEvent("request_duplication_of_card", {
      from_zone: sourceZone,
      from_idx: sourceIndex,
      copies
    });
  }

  scry() {
    // FIXME: Implement scry
    console.log("TODO");
  }

  revealCardsInHand() {
    // FIXME: Implement reveal cards in hand
    console.log("TODO");
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
    this.drawCard(number_of_cards, "library", "faceDown");
  }

  shuffleDeck() {
    this.sendEvent("shuffle_library");
  }

  passTurn() {
    this.sendEvent("pass_turn");
  }

  viewLibrary() {
    this.sendEvent("view_library");
  }

  viewTopXCards(number_of_cards) {
    this.sendEvent("view_top_x_cards", { number_of_cards });
  }

  viewZone(zone) {
    this.announce(`Viewing ${zone}`);
    this.open_zone = { zone: zone, cards: this.player[zone] };
    this._showHiddenCardZone();
    this.changed();
  }

  closeViewZone() {
    this.open_zone = { zone: null, cards: [] };
    this.sendEvent("close_view_zone");
    this._hideHiddenCardZone();
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
    this.focusOnCard(null);

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

  listCommands(hotkeys) {
    const keyCommandsList = hotkeys.keyCommands
      .map((cmd) => {
        return `${cmd.key} - ${cmd.description}`;
      })
      .join("\n");
    const ctrlKeyCommandsList = hotkeys.ctrlKeyCommands
      .map((cmd) => {
        return `${hotkeys.ctrlKeyCommandModifier} ${cmd.key} - ${cmd.description}`;
      })
      .join("\n");
    const ctrlShiftKeyCommandsList = hotkeys.ctrlShiftKeyCommands
      .map((cmd) => {
        return `${hotkeys.ctrlShiftKeyCommandModifier} ${cmd.key} - ${cmd.description}`;
      })
      .join("\n");
    const altKeyCommandsList = hotkeys.altKeyCommands
      .map((cmd) => {
        return `${hotkeys.altKeyCommandModifier} ${cmd.key} - ${cmd.description}`;
      })
      .join("\n");

    const msg = `Available commands:
${keyCommandsList}
${ctrlKeyCommandsList}
${ctrlShiftKeyCommandsList}
${altKeyCommandsList}`;

    let reverse_log = msg.split("\n").reverse();
    // remove all empty lines
    reverse_log = reverse_log.filter((line) => line.trim() !== "");
    reverse_log.forEach((line) => {
      this.game_log.unshift(line.trim());
    });
    if (this.game_log.length > 100) {
      this.game_log = this.game_log.slice(0, 100);
    }
    this.playSound("PLACEHOLDER_SOUND", 1.0);
    this.changed();
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
    const formattedTime = `${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`;
    this.game_log.unshift(`${event.payload} - ${formattedTime}`);
    if (this.game_log.length > 100) {
      this.game_log = this.game_log.slice(0, 100);
    }
  }

  pass_turn(event) {
    // FIXME: IMPLEMENT pass turn
  }

  change_game_phase(event) {
    // TODO: IMPLEMENT change game phase
  }
  update_player_sequence(event) {
    this.player_sequence = event.payload;
    this.changed();
  }

  update_opp_table(event) {
    if (this.player_number !== event.sender.idx) {
      this.players[event.sender.idx].updateFromPayload(event.payload);
      this.changed();
    }
  }

  createCardInstances(cardArray) {
    return cardArray.map((card) => new Card(card));
  }

  view_library(event) {
    this.announce(`Viewing library`);
    this.open_zone = { zone: "library", cards: this.createCardInstances(event.payload) };
    this.changed();
    this._showHiddenCardZone();
  }

  view_top_x_cards(event) {
    this.announce(`Viewing top ${event.payload.number_of_cards} cards`);
    this.open_zone = { zone: "library", cards: this.createCardInstances(event.payload) };
    this.changed();
    this._showHiddenCardZone();
  }

  update_player(event) {
    this.player.updateFromPayload(event.payload);
  }

  hide_hidden_card_zone(event) {
    this.player.updateFromPayload(event.payload);
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
