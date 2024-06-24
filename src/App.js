import { GameArena } from "./renderer/GameArena";
import { ApiKeyForm } from "./renderer/ApiKeyForm";
import { SelectDeck } from "./renderer/SelectDeck";
import { loadDeck } from "./commons/DeckLoader";
import { useState, useEffect } from "react";
import { EMPTY_PLAYER, Player, TabIndices } from "./commons/Player";
import { RemoveScrollBar } from "react-remove-scroll-bar";

import GameStateController from "./controllers/GameStateController";
import { WebSocketClient } from "./controllers/WebSocketClient";

import "./App.css";
import "mana-font/css/mana.css";


function App() {
  const [gameStateController, setGameStateController] = useState(null);
  const [gameState, setGameState] = useState("bypassLogin"); // bypassLogin | login | selectDeck | loadGame | game // login is the "first screen"
  const [authorization, setAuthorization] = useState(null);
  const [deck, setDeck] = useState(null);
  const [webSocket, setWebSocket] = useState(null);

  const handleAuthorizationChange = (auth) => {
    setAuthorization(auth);
    setWebSocket(new WebSocketClient(auth));
    setGameState("selectDeck");
  };

  const handleDeckSelectionChange = (deck) => {
    setDeck(deck);
    setGameState("loadGame");
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

      if (gameState === "bypassLogin") {
        
        const deckA = loadDeck(46); 
        const playerA = new Player({id: 2, username: "Luana"}, deckA, 40, TabIndices, true);
        const gameState = new GameStateController(
          undefined,
          setGameStateController
        );

        gameState.authorization = {gameName: 'mesa', token: 'token'};
        gameState.registerWebSocketClient(new WebSocketClient(gameState.authorization));
        gameState.addPlayer(playerA);
        gameState.addPlayer(Player.emptyPlayer("Ana"));
        gameState.addPlayer(Player.emptyPlayer("Barbara"));
        gameState.addPlayer(Player.emptyPlayer("Carla"));
        gameState.addPlayer(Player.emptyPlayer("Dani"));
        gameState.addPlayer(Player.emptyPlayer("Eva"));

        setGameStateController(gameState);
        setGameState("game");
        
      } else if (gameState === "loadGame" && webSocket && authorization && deck) {
        
        const deckA = deck;
        const user = authorization.user;
        const playerA = new Player(user, deckA, 40, TabIndices, true);
        const gameState = new GameStateController(
          undefined,
          setGameStateController
        );

        gameState.authorization = authorization;
        gameState.registerWebSocketClient(webSocket);
        gameState.addPlayer(playerA);
        gameState.addPlayer(Player.emptyPlayer("Ana"));
        gameState.addPlayer(Player.emptyPlayer("Barbara"));
        gameState.addPlayer(Player.emptyPlayer("Carla"));
        gameState.addPlayer(Player.emptyPlayer("Dani"));
        gameState.addPlayer(Player.emptyPlayer("Eva"));

        setGameStateController(gameState);
        setGameState("game");
      }
    }
  }, [gameStateController, authorization, deck, gameState, webSocket]);

  if (gameState === "login") {
    return (
      <div role="application" className="app">
      <ApiKeyForm onAuthorizationChange={handleAuthorizationChange} />
    </div>
    );
  }
  else if (gameState === "selectDeck") {
    return (
      <div role="application" className="app">
        <SelectDeck authorization={authorization} handleDeckSelectionChange={handleDeckSelectionChange} />
      </div>
    );
  }
  else if (gameState === "game") {
    return (
      <div role="application" className="app">
        <GameArena gameState={gameStateController} />
        <RemoveScrollBar />
      </div>
    );
  }
  else {
    return (
      <div role="application" className="app">
        <h1>Loading...</h1>
      </div>
    );
  }
}

export default App;
