const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8000 });

wss.on('connection', ws => {
  console.log('WebSocket connection established');

  ws.on('message', message => {
    console.log('received: %s', message);
    const event = JSON.parse(message);

    // Respond to the "draw_card" event
    if (event.type === 'draw_card') {
      const response = {
        type: '_logEvent',
        payload: "draw_card",
        sender: "server"
      };

      ws.send(JSON.stringify(response));
      
      console.log('sending: %s', response);
      ws.send(JSON.stringify({...response, type: '_drawCard'}));
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
      const response = {
        type: '_logEvent',
        payload: "login_player",
        sender: "server"
      };

      ws.send(JSON.stringify(response));
    }
  });
});