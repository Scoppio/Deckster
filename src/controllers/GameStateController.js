import AriaHelper from './AriaHelper'
import tiny_push_button from '../resources/sounds/tiny_push_button.wav'
import { EventEmitter } from 'events'
import { Card } from '../commons/Card'


export class GameStateController extends EventEmitter {
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

  handleEvent(event) {
    console.log(`GameStateController ${event}`)
    this[event.type](event)
    this.changed()
  }
  
  sendEvent(type, payload = {}) {
    const sender = this.sender
    try {
      this.webSocketClient?.sendEvent({ sender: sender, type: type, payload: payload })      
    } catch (error) {
      console.log(error)
    }
  }

  changed() {
    this.updateState(this);
    this.emit('stateChanged', this);
  }

  ////////////////////////////////////////////////////////
  // Local actions                  //////////////////////
  ////////////////////////////////////////////////////////

  focusOnCard(card) {
    this.focus_card = card
    this.changed()
  }

  getPlayer(playerNumber) {
    if (playerNumber < 0 || playerNumber >= this.players.length) {
      return null
    }
    return this.players[playerNumber]
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

  drawHand() {
    this.sendEvent("draw_hand", {number_of_cards: 7})
  }

  mulliganHand() {
    this.sendEvent("mulligan", {number_of_cards: 7})
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

  ////////////////////////////////////////////////////////

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

  // Command actions

  log_event_0(event) {
    if (!this.online) {
      this.online = true
    }
    console.log(event)
    const currentTime = new Date();
    const formattedTime = `${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`;
    this.game_log.unshift(`${formattedTime} - ${event.payload}`);
    if (this.game_log.length > 100) {
      this.game_log = this.game_log.slice(0, 100);
    }
  }

  log_commands(event) {
    console.log(event)
    const reverse_log = event.payload.split("\n").reverse()
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

  listCommands() {
    this.log_commands({
      type: "log_event",
      payload: `Available commands: 
      - List commands: F1
      - Select player 1: Ctrl + 1 
      - Select player 2: Ctrl + 2 
      - Select player 3: Ctrl + 3 
      - Select player 4: Ctrl + 4 
      - Select player 5: Ctrl + 5 
      - Select player 6: Ctrl + 6
      - Select your hand: Ctrl + E
      - Select your battlefield: Ctrl + S
      - Select your library: Ctrl + D
      - Select your graveyard: Ctrl + F
      - Select your exile: Ctrl + Q
      - Select your face down cards: Ctrl + H
      - Select your commander zone: Ctrl + B
      - Untap all: Ctrl + X or <
      - Draw card: > or +
      - Increase life: +
      - Decrease life: -
      - Add counter on selected: Ctrl + Shift + P
      - Remove counter on selected: Ctrl + Shift + M
      - Move selected to hand: Ctrl + Shift + Z
      - Move selected to graveyard: Ctrl + Shift + X
      - Move selected to exile: Ctrl + Shift + C
      - Move selected to library: Ctrl + Shift + V
      - Move selected to command zone: Ctrl + Shift + B
      - Tap/Untap selected: Ctrl + Shift + J
      - Declare attacking: Ctrl + Shift + L
      - Declare blocking: Ctrl + Shift + U
      - Scry: Ctrl + Shift + I
      `
    })
  }
  
  pass_turn_0(event) {
    // TODO: pass turn
  }

  change_game_phase_0(event) {
    // TODO: change game phase
  }

  _updatePlayer(event) {
    this.player.updateFromPayload(event.payload)
  }

  _drawCard(event) {
    this.player.hand.push(new Card(this.player.library.pop()))
    var audio = new Audio(tiny_push_button);
    audio.play();
    this.changed()
  }

}