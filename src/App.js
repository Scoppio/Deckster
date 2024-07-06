import { GameArena } from "./renderer/GameArena";
import { SettingsScreen } from "./renderer/SettingsScreen";
import { ApiKeyForm } from "./renderer/ApiKeyForm";
import { SelectDeck } from "./renderer/SelectDeck";
import { SearchZone } from "./renderer/SearchZone";
import { SearchCard } from "./renderer/SearchCard";
import { loadDeck } from "./commons/DeckLoader";
import { useState, useEffect } from "react";
import { Player, TabIndices } from "./commons/Player";
import { RemoveScrollBar } from "react-remove-scroll-bar";

import GameStateController from "./controllers/GameStateController";
import { WebSocketClient } from "./controllers/WebSocketClient";

import "./App.css";
import "mana-font/css/mana.css";


function App() {
  const [gameStateController, setGameStateController] = useState(null);
  const [gameState, setGameState] = useState("login"); // bypassLogin | login | selectDeck | loadGame | game | search_card | tokens // login is the "first screen"
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

  const handleChangeGameState = (newGameState) => {
    setGameState(newGameState);
  };

  const handleCloseCardOpenZone = () => {
    setGameState("game");
  };

  useEffect(() => {
    window.electron?.ipcRenderer?.on('search-cards', () => {
      setGameState("tokens");
    });
  }, []);

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
        gameState.game_state_handler.push({ func: handleChangeGameState });
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
        gameState.game_state_handler.push({ func: handleChangeGameState });
        setGameStateController(gameState);
        gameState.updateGameState();
        setGameState("game");
      }
    }
  }, [gameStateController, authorization, deck, gameState, webSocket]);

  if (gameState === "login") {
    return (
      <div role="application" className="app">
      <ApiKeyForm onAuthorizationChange={handleAuthorizationChange} />
      <RemoveScrollBar />
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
        <GameArena gameState={gameStateController} handleChangeGameState={handleChangeGameState}/>
        <RemoveScrollBar />
      </div>
    );
  }
  else if (gameState === "settings") {
    return (
      <div role="application" className="app">
        <SettingsScreen gameState={gameStateController} handleChangeGameState={handleChangeGameState}/>
        <RemoveScrollBar />
      </div>
    );
  }
  else if (gameState === "tokens") {
    return (
      <div role="application" className="app">
        <SearchCard gameState={gameStateController} handleChangeGameState={handleChangeGameState}/>
        <RemoveScrollBar />
      </div>
    );
  }
  else if (gameState === "view_zone") {
    return (
      <div role="application" className="app">
        <SearchZone gameState={gameStateController} handleCloseCardOpenZone={handleCloseCardOpenZone} />
        {/* <RemoveScrollBar /> */}
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
