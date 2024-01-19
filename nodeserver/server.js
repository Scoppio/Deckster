const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8000 });

const game = {
  players: {}
}

wss.on('connection', ws => {
  console.log('WebSocket connection established');

  ws.on('message', message => {
    console.log('received: %s', message);
    const event = JSON.parse(message);

    // Respond to the "draw_card" event
    if (event.type === 'draw_card') {
      const player_id = event.sender['id']
      const player = game.players[player_id]
      const num_cards = event.payload['number_of_cards']
      const zone = event.payload['zone']
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

      ws.send(JSON.stringify(responseLog));
      ws.send(JSON.stringify({type: '_drawCard', payload: player, sender: "server"}));
      
      console.log('sending: %s', responseLog);
    }

    // Respond to the "untap_all" event
    if (event.type === 'untap_all') {
      const response = {
        type: '_logEvent',
        payload: "untap_all",
        sender: "server"
      };

      ws.send(JSON.stringify(response));
    }

    // Respond to the "login_player" event
    if (event.type === 'login_player') {
      game.players[event.payload['id']] = event.payload
      const response = {
        type: '_logEvent',
        payload: "Player " + event.payload['name'] + " logged in",
        sender: "server"
      };

      ws.send(JSON.stringify(response));
    }
  });
});