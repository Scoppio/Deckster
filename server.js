const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8000 });

server.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('message', (message) => {
    const json = JSON.parse(message)
    if (json.type === 'draw_card') {
      const response = {
        type: '_logEvent',
        payload: "draw_card",
        sender: "server"
      };
    
      socket.send(JSON.stringify(response));

      const response_draw = {
        type: '_drawCard',
        payload: {
          "card": {
            "id": "179e6e1d-cc0e-4937-b0ce-6d03cbe576b7",
            "name": "Cinder Glade",
            "type_line": "Land — Mountain Forest",
            "oracle_text": "({T}: Add {R} or {G}.)\nCinder Glade enters the battlefield tapped unless you control two or more basic lands.",
            "power": null,
            "toughness": null,
            "mana_cost": "",
            "cmc": 0,
            "colors": [],
            "color_identity": [
              "G",
              "R"
            ],
            "image_uris": {
              "small": "https://cards.scryfall.io/small/front/1/7/179e6e1d-cc0e-4937-b0ce-6d03cbe576b7.jpg?1682210373",
              "normal": "https://cards.scryfall.io/normal/front/1/7/179e6e1d-cc0e-4937-b0ce-6d03cbe576b7.jpg?1682210373",
              "large": "https://cards.scryfall.io/large/front/1/7/179e6e1d-cc0e-4937-b0ce-6d03cbe576b7.jpg?1682210373",
              "png": "https://cards.scryfall.io/png/front/1/7/179e6e1d-cc0e-4937-b0ce-6d03cbe576b7.png?1682210373",
              "art_crop": "https://cards.scryfall.io/art_crop/front/1/7/179e6e1d-cc0e-4937-b0ce-6d03cbe576b7.jpg?1682210373",
              "border_crop": "https://cards.scryfall.io/border_crop/front/1/7/179e6e1d-cc0e-4937-b0ce-6d03cbe576b7.jpg?1682210373"
            },
            "tset": "moc",
            "flavor_text": "On the volcanic continent of Akoum, bizarre vegetation clusters around gas vents, and jagged mountain peaks rise high into the air.",
            "rarity": "rare",
            "artist": "Adam Paquette",
            "edhrec_rank": 100,
            "produced_mana": [
              "G",
              "R"
            ],
            "loyalty": null,
            "printed_text": null,
            "printed_name": null,
            "printed_type_line": null,
            "lang": "en",
            "card_faces": null
          },
          "quantity": 1
        },
        sender: "server"
      };

      socket.send(JSON.stringify(response_draw));
    }
  });

  socket.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server is running on port 8000');