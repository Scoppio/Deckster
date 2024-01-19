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

  // Local actions
  focusOnCard(card) {
    this.focus_card = card
    this.changed()
  }

  ////////////////////////////////////////////////////////
  // Request actions                //////////////////////
  ////////////////////////////////////////////////////////
  drawCard() {
    this.sendEvent("draw_card", {zone: "library", number_of_cards: 1})
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

  _logEvent(event) {
    if (!this.online) {
      this.online = true
    }
    console.log(event)
    this.game_log.push(event.payload)
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