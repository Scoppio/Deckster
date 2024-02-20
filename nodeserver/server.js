const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');


const server = new WebSocket.Server({ port: 8000 });

const SERVER = {"name": "server", "id": 9999, "idx": 9999}

////////////////////////////////////////////////////////

class DrawStrategy {
  constructor(player, zone) {
    this.player = player;
    this.zone = zone;
    this.drawPile = player[zone];
  }

  draw(numCards) {
    const resp = this._draw(numCards);
    this.player[this.zone] = this.drawPile;
    return resp;
  }

  _draw(numCards) {
    throw new Error('Not implemented');
  }
}

class DrawCards extends DrawStrategy {

  _draw(numCards) {
    let wasSuccessful = false;
    if (this.drawPile.length === 0) {
      return [[], wasSuccessful];
    } else if (this.drawPile.length < numCards) {
      numCards = this.drawPile.length;
    } else {
      wasSuccessful = true;
    }
    const cards = this.drawPile.slice(0, numCards);
    this.drawPile = this.drawPile.slice(numCards);
    return [cards, wasSuccessful];
  }
}

class FavoredStartingHand extends DrawStrategy {
  constructor(player, zone, desiredNumberOfLands = 3, numberOfHands = 3) {
    super(player, zone);
    this.desiredNumberOfLands = desiredNumberOfLands;
    this.numberOfHands = numberOfHands;
  }

  _drawHand(numberOfCards) {
    const hand = this.drawPile.slice(0, numberOfCards);
    this.drawPile = this.drawPile.slice(numberOfCards);
    return hand;
  }

  _numberOfLands(hand) {
    return hand.filter(card => card.typeLine === 'land').length;
  }

  _draw(numCards) {
    const hands = Array.from({length: this.numberOfHands}, () => this._drawHand(numCards));
    const selectedHand = hands.reduce((a, b) => Math.abs(this._numberOfLands(a) - this.desiredNumberOfLands) < Math.abs(this._numberOfLands(b) - this.desiredNumberOfLands) ? a : b);
    const otherHands = hands.filter(hand => hand !== selectedHand);
    for (const hand of otherHands) {
      this.drawPile.push(...hand);
    }
    this.drawPile.sort(() => Math.random() - 0.5);
    return [selectedHand, true];
  }
}

class StrategyChooser {
  static choose(strategyName) {
    switch (strategyName) {
      case 'random':
        return DrawCards;
      case 'favored':
        return FavoredStartingHand;
      default:
        return DrawCards;
    }
  }
}

///////////////////////////////////////////////////////

class Game {
  constructor(openingHandDrawStrategy = "random", mulliganStrategy = "favored") {
    this.players = {};
    this.playersSequence = [];
    this.activePlayer = null;
    this.openingHandDrawStrategy = StrategyChooser.choose(openingHandDrawStrategy);
    this.mulliganStrategy = StrategyChooser.choose(mulliganStrategy);
  }

  addPlayer(player) {
    this.players[player.id] = player;
    this.players[player.id].library.sort(() => Math.random() - 0.5);
    this.playersSequence.push(player);
  }

  removePlayer(player) {
    delete this.players[player.id];
    if (this.activePlayer === player) {
      this.passTurn();
    }
    this.playersSequence = this.playersSequence.filter(p => p !== player);
  }

  passTurn() {
    if (!this.playersSequence.length) {
      return null;
    }

    if (this.activePlayer === null) {
      this.activePlayer = this.playersSequence[0];
    } else {
      const idx = (this.playersSequence.indexOf(this.activePlayer) + 1) % this.playersSequence.length;
      this.activePlayer = this.playersSequence[idx];
    }
    return this.activePlayer;
  }

  getPlayer(event) {
    const playerId = event.sender ? event.sender.id : event.id;
    return this.players[playerId];
  }

  getActivePlayer() {
    return this.activePlayer;
  }
}

class GameSession {
  constructor(gameName, gameGroupName) {
    this.gameName = gameName;
    this.gameGroupName = gameGroupName;
    this.players = [];
    this.game = new Game();
  }

  addPlayer(player) {
    this.players.push(player);
    this.game.addPlayer(player);
  }

  removePlayer(player) {
    this.players = this.players.filter(p => p !== player);
    this.game.removePlayer(player);
  }

  getPlayer(event) {
    const playerId = event.sender ? event.sender.id : event.id;
    return this.game.players[playerId];
  }
}

const gameSession = new GameSession('test', 'test');

class login_player {
  constructor(gameSession, event) {
    this.gameSession = gameSession;
    this.event = event;
  }

  execute() {
    this.gameSession.addPlayer(this.event.payload)
    return {
      type: 'log_event',
      payload: "Player " + this.event.payload['name'] + " logged in",
      sender: SERVER
    };
  }
}

class update_player {
  constructor(gameSession, event) {
    this.gameSession = gameSession;
    this.event = event;
  }

  execute() {
    this.gameSession.players[this.event.payload['id']] = this.event.payload
    const player = this.gameSession.players[this.event.payload['id']]
    return {type: 'update_player', payload: player, sender: this.event.sender}
  }
}

class move_card {
  constructor(gameSession, event) {
    this.gameSession = gameSession;
    this.event = event;
  }

  execute() {

    const player_id = this.event.sender['id']
    const player = this.gameSession.players[player_id]
    const from_zone = this.event.payload['from_zone']
    const to_zone = this.event.payload['to_zone']
    const from_idx = this.event.payload['from_idx']
    const to_idx = this.event.payload['to_idx']
    const card_obj = player[from_zone][from_idx]
    player[from_zone].splice(from_idx, 1)
    player[to_zone].splice(to_idx, 0, card_obj)

    const responseLog = {
      type: 'log_event',
      payload: "Player " + player['name'] + " moved " + card_obj['name'] + " from " + from_zone + " to " + to_zone,
      sender: SERVER
    };
    return responseLog
  }

}

class draw_card {
  constructor(gameSession, event) {
    this.gameSession = gameSession;
    this.event = event;
  }

  execute() {
    const player_id = this.event.sender['id']
    const player = gameSession.players[player_id]
    const num_cards = this.event.payload['number_of_cards']
    const zone = this.event.payload['zone']
    let cards_drawn = 0
    for (let i = 0; i < num_cards; i++) {
      if (player[zone].length <= 0) {
        break
      }
      player['hand'].push(player[zone].pop())
      cards_drawn += 1
    }

    const responseLog = {
      type: 'log_event',
      payload: "Player " + player['name'] + " drew " + cards_drawn + " cards from " + zone,
      sender: SERVER
    };

    return responseLog
  }
}

server.on('connection', (socket) => {
  console.log('Client connected');

  const playSound = (sound_name, volume = 1.0, sender = SERVER) => {
    server.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({type: 'play_sound', payload: {name: sound_name, volume}, sender: sender}));
      }
    });
  }

  const broadcastJson = (message) => {
    server.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }

  const sendJson = (message) => {
    socket.send(JSON.stringify(message));
  }

  socket.on('message', (message) => {
    const json = JSON.parse(message)
    console.log('received: %s', message);
    
    if (json.type === 'login_player') {
      const ret = new login_player(gameSession, json).execute();
      sendJson(ret);
    }

    if (json.type === 'update_player') {
      const ret = new update_player(gameSession, json).execute();
      sendJson(ret);
      broadcastJson({...ret, type: 'update_opp_table'});
    }

    if (json.type === 'move_card') {
      const responseLog = new move_card(gameSession, json).execute();
      const player = gameSession.players[json.sender['id']]
      sendJson(responseLog);
      sendJson({type: 'update_player', payload: player, sender: SERVER});
      broadcastJson({type: 'update_opp_table', payload: player, sender: json.sender});
      playSound('PLAY_SOUND', 1.0, player)
    }

    if (json.type === 'draw_card') {
      const responseLog = new draw_card(gameSession, json).execute();
      const player = gameSession.players[json.sender['id']]
      sendJson(responseLog);
      sendJson({type: 'update_player', payload: player, sender: SERVER});
      broadcastJson({type: 'update_opp_table', payload: player, sender: json.sender});
      playSound('DRAW_SOUND', 1.0, player)
    }
  });

  socket.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server is running on port 8000');