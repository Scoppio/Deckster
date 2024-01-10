import AriaHelper from './AriaHelper'


export class GameStateController {
  constructor() {
    this.players = []
    this.player = null
    this.activePlayer = 0
    this.player_number = 0
    this.webSocketClient = null
    this.ariaHelper = new AriaHelper(this)
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
  }
  
  sendEvent(type, payload = {}) {
    const sender = this.sender
    this.webSocketClient?.sendEvent({ sender: sender, type: type, payload: payload })
  }

  // Request actions

  loginToGame(player) {
    this.sendEvent('login_to_game')
  }

  drawCard() {
    this.sendEvent("draw_card", {zone: "library", number_of_cards: 1})
  }

  addPlayer(player) {
    this.players.push(player)
    const playerNumber = this.players.length - 1

    if (player.isLocal) {
      this.player_number = playerNumber
      this.player = player
    }

    this.sendEvent('login_player', player)
  }

  // Command actions

  _logEvent(event) {
    console.log(event)
  }

  _updatePlayer(event) {
    const remote_player = event.payload
    this.player = { ...this.player, ...remote_player }
    this.players[this.player_number] = this.player
  }

}