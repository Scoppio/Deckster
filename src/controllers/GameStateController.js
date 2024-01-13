import AriaHelper from './AriaHelper'
import { EventEmitter } from 'events';


export class GameStateController extends EventEmitter {
  constructor(state = null) {
    super();
    if (state) {
      this.fromPreviousState(state)
    } else {
      this.players = []
      this.activePlayer = 0
      this.player_number = 0
      this.webSocketClient = null
      this.ariaHelper = new AriaHelper(this)
      this.online = false
    }
  }
  
  fromPreviousState(previousState) {
    this.players = previousState.players
    this.activePlayer = previousState.activePlayer
    this.player_number = previousState.player_number
    this.webSocketClient = previousState.webSocketClient
    this.ariaHelper = previousState.ariaHelper
    this.online = previousState.online
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

  registerWebSocketClient(webSocketClient) {
    this.webSocketClient = webSocketClient
    this.webSocketClient.addListener(this)
  }

  handleEvent(event) {
    console.log(`GameStateController ${event}`)
    this[event.type](event)
    this.emit('stateChanged', this);
  }
  
  sendEvent(type, payload = {}) {
    const sender = this.sender
    try {
      this.webSocketClient?.sendEvent({ sender: sender, type: type, payload: payload })      
    } catch (error) {
      console.log(error)
    }
  }

  // Local actions
  drawCardLocal() {
    this.player.hand.push(this.player.library.pop())
    this.emit('stateChanged', this);
  }

  untapAllLocal() {
    this.player.hand.forEach(card => card.tapped = false)
    this.player.land_zone_battlefield.forEach(card => card.tapped = false)
    this.player.back_battlefield.forEach(card => card.tapped = false)
    this.player.front_battlefield.forEach(card => card.tapped = false)
    this.emit('stateChanged', this);
  }

  // Request actions
  drawCard() {
    this.sendEvent("draw_card", {zone: "library", number_of_cards: 1})
    if (!this.online) {
      this.drawCardLocal()
    }
  }

  untapAll() {
    this.sendEvent("untap_all")
    if (!this.online) {
      this.untapAllLocal()
    }
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
    this.player.selectedCard = card;
    return card
  }

  cancelCardMove() {
    const card = this.player.selectedCard;
    this.player.selectedCard = null;
    return card
  }

  moveCardTo(source, destination) {
    const sourceZone = source.droppableId;
    const sourceIndex = source.index;
    const card = this.player[sourceZone][sourceIndex]
    this.player.selectedCard = card;
    this.player[sourceZone].splice(sourceIndex, 1);

    const destinationZone = destination.droppableId;
    const destinationIndex = destination.index;
    this.player[destinationZone].splice(destinationIndex, 0, card);
    this.player.selectedCard = null;
    return card;
  }

  // Command actions

  _logEvent(event) {
    if (!this.online) {
      this.online = true
    }
    console.log(event)
  }

  _updatePlayer(event) {
    this.players[this.player_number] = { ...this.player, ...event.payload }
  }

}