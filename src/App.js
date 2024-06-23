import { GameArena } from "./renderer/GameArena";
import { ApiKeyForm } from "./renderer/ApiKeyForm";
import { loadDeck } from "./commons/DeckLoader";
import { useState, useEffect } from "react";
import GameStateController from "./controllers/GameStateController";
import { WebSocketClient } from "./controllers/WebSocketClient";

import "./App.css";
import "mana-font/css/mana.css";

import { Player, TabIndices } from "./commons/Player";
import { RemoveScrollBar } from "react-remove-scroll-bar";

function App() {
  const [gameStateController, setGameStateController] = useState(null);

  const [authorization, setAuthorization] = useState(null);

  const handleAuthorizationChange = (auth) => {
    setAuthorization(auth);
    console.log('Authorization object updated:', auth);
  };

  useEffect(() => {
    if (gameStateController) {
      const handleStateChange = (newState) => {
        setGameStateController(
          new GameStateController(newState, setGameStateController)
        );
      };

      gameStateController.on("stateChanged", handleStateChange);
      return () => {
        // Clean up the listener when the component unmounts
        gameStateController.off("stateChanged", handleStateChange);
      };
    } else {
      if (authorization) {
        
        const deckA = loadDeck(46); // await fetchDeck(46)
        // const deckB = loadDeck(47) // await fetchDeck(47)
        const playerA = new Player(2, "Lulu", deckA, 40, TabIndices, true);
        const playerB = Player.emptyPlayer();

        const gameState = new GameStateController(
          undefined,
          setGameStateController
        );

        gameState.registerWebSocketClient(new WebSocketClient(authorization));
        gameState.addPlayer(playerA);
        gameState.addPlayer(playerB);
        setGameStateController(gameState);
        
      }
    }
  }, [gameStateController, authorization]);

  if (!gameStateController || !authorization) {
    return (
      <div role="application" className="app">
      <ApiKeyForm onAuthorizationChange={handleAuthorizationChange} />
    </div>
    );
  }

  return (
    <div role="application" className="app">
      <GameArena gameState={gameStateController} />
      <RemoveScrollBar />
    </div>
  );
}

export default App;
