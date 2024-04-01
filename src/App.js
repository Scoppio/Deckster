import { GameArenaMini } from "./renderer/battlemap/GameArenaMini";
import { HandOfMinis } from "./commons/Minis";
import { Miniature } from "./commons/Miniature";
import { useState, useEffect } from "react";
import GameStateController from "./controllers/GameStateController";

import "mana-font/css/mana.css";
import { WebSocketClient } from "./controllers/WebSocketClient";

import "./App.css";

import { Player, TabIndices } from "./commons/Player";
import { RemoveScrollBar } from "react-remove-scroll-bar";

function App() {
  const [gameStateController, setGameStateController] = useState(null);

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
      
      const playerA = new Player(1, "Lulu", [], 0, TabIndices, true);
      playerA.hand = HandOfMinis.map((i) => new Miniature(i));
      
      const playerB = Player.emptyPlayer();

      const gameState = new GameStateController(
        undefined,
        setGameStateController
      );
      gameState.registerWebSocketClient(new WebSocketClient("test"));
      gameState.addPlayer(playerA);
      gameState.addPlayer(playerB);
      setGameStateController(gameState);
    }
  }, [gameStateController]);

  if (!gameStateController) {
    return <div>Loading...</div>;
  }

  return (
    <div role="application" className="app">
      <GameArenaMini gameState={gameStateController} />
      <RemoveScrollBar />
    </div>
  );
}

export default App;
