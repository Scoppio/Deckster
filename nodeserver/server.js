const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');


const server = new WebSocket.Server({ port: 8000 });

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



////////////////////////////////////////////////////////

const gameSession = new GameSession('test', 'test');

const SERVER = {"name": "server", "id": 9999, "idx": 9999}

server.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('message', (message) => {
    const json = JSON.parse(message)
    console.log('received: %s', message);
    if (json.type === 'login_player') {
      gameSession.addPlayer(json.payload)
      const response = {
        type: '_logEvent',
        payload: "Player " + json.payload['name'] + " logged in",
        sender: SERVER
      };

      socket.send(JSON.stringify(response));
    }

    if (json.type === 'update_player') {
      gameSession.players[json.payload['id']] = json.payload
      const player = gameSession.players[json.payload['id']]
      
      socket.send(JSON.stringify({type: '_updatePlayer', payload: player, sender: SERVER}));
    }

    if (json.type === 'move_card') {
      const player_id = json.sender['id']
      const player = gameSession.players[player_id]
      const from_zone = json.payload['from_zone']
      const to_zone = json.payload['to_zone']
      const from_idx = json.payload['from_idx']
      const to_idx = json.payload['to_idx']
      const card_obj = player[from_zone][from_idx]
      player[from_zone].splice(from_idx, 1)
      player[to_zone].splice(to_idx, 0, card_obj)

      const responseLog = {
        type: '_logEvent',
        payload: "Player " + player['name'] + " moved " + card_obj['name'] + " from " + from_zone + " to " + to_zone,
        sender: SERVER
      };

      socket.send(JSON.stringify(responseLog));
      socket.send(JSON.stringify({type: '_updatePlayer', payload: player, sender: SERVER}));
      
      console.log('sending: %s ' + player['name'] + ' moved ' + card_obj['name'] + ' from ' + from_zone + ' to ' + to_zone, responseLog);
    }

    if (json.type === 'draw_card') {
      const player_id = json.sender['id']
      const player = gameSession.players[player_id]
      const num_cards = json.payload['number_of_cards']
      const zone = json.payload['zone']
      let cards_drawn = 0
      for (let i = 0; i < num_cards; i++) {
        if (player[zone].length <= 0) {
          break
        }
        player['hand'].push(player[zone].pop())
        cards_drawn += 1
      }

      const responseLog = {
        type: '_logEvent',
        payload: "Player " + player['name'] + " drew " + cards_drawn + " cards from " + zone,
        sender: SERVER
      };

      socket.send(JSON.stringify(responseLog));
      socket.send(JSON.stringify({type: '_updatePlayer', payload: player, sender: SERVER}));
      
      console.log('sending: %s ' + player['name'] + ' drew ' + cards_drawn + ' cards from ' + zone, responseLog);

    }
  });

  socket.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server is running on port 8000');