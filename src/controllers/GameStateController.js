import AriaHelper from './AriaHelper'
import { EventEmitter } from 'events'
import Sounds from './Sounds'


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
      this.sounds = new Sounds()
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
    this.sounds = previousState.sounds
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

  playSound(sound_name, volume = 1.0) {
    this.sounds.playSound(sound_name, volume)
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

  addPlayer(player) {
    this.players.push(player)
    const playerNumber = this.players.length - 1

    if (player.isLocal) {
      this.player_number = playerNumber
    }

    this.sendEvent('login_player', player)
  }

  ////////////

  drawCard(number_of_cards = 1, zone = "library", destination = "hand") {
    this.sendEvent("draw_card", {zone: zone, number_of_cards: number_of_cards, destination: destination})
    
  }

  untapAll() {
    this.sendEvent("untap_all")
    
  }

  updatePlayer(sound, volume) {
    this.sendEvent('update_player', {...this.player, sound, volume})
  }

  increaseLife(health_points = 1) {
    this.player.life += health_points
    this.updatePlayer("ADD_COUNTER_SOUND", 1.0)
  }

  decreaseLife(health_points = 1) {
    this.player.life -= health_points
    this.updatePlayer("ADD_COUNTER_SOUND", 1.0)
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

  revealCardsInHand() {
    console.log("TODO")
  }

  drawHand(number_of_cards = 7) {
    this.sendEvent("draw_hand", {number_of_cards})
    
  }

  mulliganHand(number_of_cards = 7) {
    this.sendEvent("mulligan", {number_of_cards})
    
  }

  drawCardToBattlefield(number_of_cards = 1) {
    this.drawCard(number_of_cards, "library", "front_battlefield")
  }

  drawCardToGraveyard(number_of_cards = 1) {
    this.drawCard(number_of_cards, "library", "graveyard")
  }

  drawCardToExile(number_of_cards = 1) {
    this.drawCard(number_of_cards, "library", "exile")
  }

  drawCardToFaceDown(number_of_cards = 1) {
    this.drawCard(number_of_cards, "library", "faceDown")
  }

  shuffleDeck() {
    this.sendEvent("shuffle_library")
    
  }

  passTurn() {
    this.sendEvent("pass_turn")
    
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
${altKeyCommandsList}`

    let reverse_log = msg.split("\n").reverse()
    // remove all empty lines
    reverse_log = reverse_log.filter((line) => line.trim() !== "")
    reverse_log.forEach((line) => {
      this.game_log.unshift(line.trim());
    })
    if (this.game_log.length > 100) {
      this.game_log = this.game_log.slice(0, 100);
    }
    this.playSound("PLACEHOLDER_SOUND", 1.0)
    this.changed()
  }
}

class ExecuteGameActions extends RequestGameActions {
  constructor(state = null, updateState) {
    super(state, updateState);
  }

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

  update_opp_table(event) {
    if (this.player_number !== event.sender.idx) {
      this.players[event.sender.idx].updateFromPayload(event.payload)
    }
  }

  update_player(event) {
    this.player.updateFromPayload(event.payload)
  }

  play_sound(event) {
    this.playSound(event.payload?.name, event.payload?.volume ?? 1.0)
  }
}

export default class GameStateController extends ExecuteGameActions {
  constructor(state = null, updateState) {
    super(state, updateState)
  }
}