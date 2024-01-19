const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8000 });

const game = {
  players: {}
}


server.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('message', (message) => {
    const json = JSON.parse(message)
    if (json.type === 'login_player') {
      game.players[json.payload['id']] = json.payload
      const response = {
        type: '_logEvent',
        payload: "Player " + json.payload['name'] + " logged in",
        sender: "server"
      };

      socket.send(JSON.stringify(response));
    }
    
    if (json.type === 'move_card') {
      const player_id = json.sender['id']
      const player = game.players[player_id]
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
        sender: "server"
      };

      socket.send(JSON.stringify(responseLog));
      socket.send(JSON.stringify({type: '_updatePlayer', payload: player, sender: "server"}));
      
      console.log('sending: %s ' + player['name'] + ' moved ' + card_obj['name'] + ' from ' + from_zone + ' to ' + to_zone, responseLog);
    }

    if (json.type === 'draw_card') {
      const player_id = json.sender['id']
      const player = game.players[player_id]
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
        sender: "server"
      };

      socket.send(JSON.stringify(responseLog));
      socket.send(JSON.stringify({type: '_updatePlayer', payload: player, sender: "server"}));
      
      console.log('sending: %s ' + player['name'] + ' drew ' + cards_drawn + ' cards from ' + zone, responseLog);

    }
  });




  socket.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server is running on port 8000');