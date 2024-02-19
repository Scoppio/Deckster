import AriaHelper from './AriaHelper'
import tiny_push_button from '../resources/sounds/tiny_push_button.wav'
import { EventEmitter } from 'events'
import { Card } from '../commons/Card'


class BaseGameStateController extends EventEmitter {
  constructor(state = null, updateState) {
    super();
    this.updateState = updateState;
    if (state) {
      this.fromPreviousState(state)
    } else {
      this.players = []
      this.activePlayer = 0
      this.player_number = 0
      this.webSocketClient = null
      this.ariaHelper = new AriaHelper(this)
      this.online = false
      this.game_log = []
      this.focus_card = null
    }
  }
  
  fromPreviousState(previousState) {
    this.players = previousState.players
    this.activePlayer = previousState.activePlayer
    this.player_number = previousState.player_number
    this.webSocketClient = previousState.webSocketClient
    this.ariaHelper = previousState.ariaHelper
    this.online = previousState.online
    this.game_log = previousState.game_log
    this.focus_card = previousState.focus_card
  }

  get player () {
    return this.players[this.player_number]
  } 

  get active_player() {
    return this.players[this.activePlayer]
  }
  
  get active_player_number() {
    return this.activePlayer
  }

  get sender() {
    return { id: this.player.id, idx: this.player_number }
  }

  get log() {
    return this.game_log
  }

  registerWebSocketClient(webSocketClient) {
    this.webSocketClient = webSocketClient
    this.webSocketClient.addListener(this)
  }

  changed() {
    this.updateState(this);
    this.emit('stateChanged', this);
  }

  // Local actions
  focusOnCard(card) {
    this.focus_card = card
    this.changed()
  }

  getCardFrom(source) {
    const sourceZone = source.droppableId;
    const sourceIndex = source.index;
    const card = this.player[sourceZone][sourceIndex]
    this.focusOnCard(card)
    return card
  }

  cancelCardMove() {
    this.focusOnCard(null)
  }

}

class RequestGameActions extends BaseGameStateController {
  constructor(state = null, updateState) {
    super(state, updateState);
  }

  sendEvent(type, payload = {}) {
    const sender = this.sender
    try {
      this.webSocketClient?.sendEvent({ sender: sender, type: type, payload: payload })      
    } catch (error) {
      console.log(error)
    }
  }
  
  ////////////////////////////////////////////////////////
  // Request actions                //////////////////////
  ////////////////////////////////////////////////////////

  drawCard(number_of_cards = 1, zone = "library", destination = "hand") {
    this.sendEvent("draw_card", {zone: zone, number_of_cards: number_of_cards, destination: destination})
  }

  untapAll() {
    this.sendEvent("untap_all")
  }

  addPlayer(player) {
    this.players.push(player)
    const playerNumber = this.players.length - 1

    if (player.isLocal) {
      this.player_number = playerNumber
    }

    this.sendEvent('login_player', player)
  }

  updatePlayer() {
    this.sendEvent('update_player', this.player)
  }

  increaseLife() {
    this.player.life += 1
    this.sendEvent('update_player', this.player)
  }

  decreaseLife() {
    this.player.life -= 1
    this.sendEvent('update_player', this.player)
  }

  moveSelectedToHand() {
    console.log("TODO")
  }

  moveSelectedToGraveyard() {
    console.log("TODO")
  }

  moveSelectedToExile() {
    console.log("TODO")
  }

  moveSelectedToLibrary() {
    console.log("TODO")
  }

  moveSelectedToCommandZone() {
    console.log("TODO")
  }

  tapUntapSelected() {
    console.log("TODO")
  }

  declareAttacking() {
    console.log("TODO")
  }

  declareBlocking() {
    console.log("TODO")
  }

  scry() {
    console.log("TODO")
  }

  addCounterOnSelected() {
    console.log("TODO")
  }

  removeCounterOnSelected() {
    console.log("TODO")
  }

  drawHand(number_of_cards = 7) {
    this.sendEvent("draw_hand", {number_of_cards})
  }

  mulliganHand(number_of_cards = 7) {
    this.sendEvent("mulligan", {number_of_cards})
  }

  revealCardsInHand() {
    console.log("TODO")
  }

  drawCardToBattlefield() {
    console.log("TODO")
  }

  drawCardToGraveyard() {
    console.log("TODO")
  }

  drawCardToExile() {
    console.log("TODO")
  }

  drawCardToFaceDown() {
    console.log("TODO")
  }

  shuffleDeck() {
    this.sendEvent("shuffle_library")
  }

  moveCardTo(source, destination) {
    const sourceZone = source.droppableId;
    const sourceIndex = source.index;
    const card = this.player[sourceZone][sourceIndex]
    this.player[sourceZone].splice(sourceIndex, 1);

    const destinationZone = destination.droppableId;
    const destinationIndex = destination.index;
    this.player[destinationZone].splice(destinationIndex, 0, card);
    this.focusOnCard(null)

    this.sendEvent("move_card", 
      {
        "from_zone": sourceZone, 
        "to_zone": destinationZone,
        "from_idx": sourceIndex,
        "to_idx": destinationIndex
      })

    return card;
  }

  listCommands(hotkeys) {
    const keyCommandsList = hotkeys.keyCommands.map((cmd) => {
      return `${cmd.key} - ${cmd.description}`
    }).join("\n")
    const ctrlKeyCommandsList = hotkeys.ctrlKeyCommands.map((cmd) => {
      return `${hotkeys.ctrlKeyCommandModifier} ${cmd.key} - ${cmd.description}`
    }).join("\n")
    const ctrlShiftKeyCommandsList = hotkeys.ctrlShiftKeyCommands.map((cmd) => {
      return `${hotkeys.ctrlShiftKeyCommandModifier} ${cmd.key} - ${cmd.description}`
    }).join("\n")
    const altKeyCommandsList = hotkeys.altKeyCommands.map((cmd) => {
      return `${hotkeys.altKeyCommandModifier} ${cmd.key} - ${cmd.description}`
    }).join("\n")

    const msg = `Available commands:
    ${keyCommandsList}
    ${ctrlKeyCommandsList}
    ${ctrlShiftKeyCommandsList}
    ${altKeyCommandsList}
    `
    const reverse_log = msg.payload.split("\n").reverse()
    // remove the last entry
    reverse_log.pop()
    reverse_log.forEach((line) => {
      this.game_log.unshift(line.trim());
    })
    if (this.game_log.length > 100) {
      this.game_log = this.game_log.slice(0, 100);
    }
    this.changed()
  }
  
  pass_turn(event) {
    // TODO: pass turn
  }

  change_game_phase(event) {
    // TODO: change game phase
  }

  update_player(event) {
    this.player.updateFromPayload(event.payload)
  }
}

class ExecuteGameActions extends RequestGameActions {
  constructor(state = null, updateState) {
    super(state, updateState);
  }
  // Command actions

  handleEvent(event) {
    console.log(`GameStateController ${event}`)
    this[event.type](event)
    this.changed()
  }

  log_event(event) {
    if (!this.online) {
      this.online = true
    }
    console.log(event)
    const currentTime = new Date();
    const formattedTime = `${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`;
    this.game_log.unshift(`${event.payload} - ${formattedTime}`);
    if (this.game_log.length > 100) {
      this.game_log = this.game_log.slice(0, 100);
    }
  }
  
  pass_turn(event) {
    // TODO: pass turn
  }

  change_game_phase(event) {
    // TODO: change game phase
  }

  update_player(event) {
    this.player.updateFromPayload(event.payload)
  }

}

export default class GameStateController extends ExecuteGameActions {
  constructor(state = null, updateState) {
    super(state, updateState);
  }
}