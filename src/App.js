import { GameArena } from "./renderer/GameArena";
import { loadDeck } from "./commons/DeckLoader";
import { useState, useEffect } from "react";
import GameStateController from "./controllers/GameStateController";
import { WebSocketClient } from "./controllers/WebSocketClient";
import { Player, TabIndices } from "./commons/Player";
import "mana-font/css/mana.css";
import "./App.css";

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
      const deckA = loadDeck(46); // await fetchDeck(46)

      // const deckB = loadDeck(47) // await fetchDeck(47)
      const playerA = new Player(1, "Lulu", deckA, 40, TabIndices, true);
      const playerB = Player.emptyPlayer();

      const gameState = new GameStateController(
        undefined,
        setGameStateController,
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
    <div className="app">
      <GameArena gameState={gameStateController} />
    </div>
  );
}

export default App;
