import { GameArena } from "./renderer/GameArena";
import { SettingsScreen } from "./renderer/SettingsScreen";
import { ApiKeyForm } from "./renderer/ApiKeyForm";
import { SelectDeck } from "./renderer/SelectDeck";
import { SearchZone } from "./renderer/SearchZone";
import { SearchCard } from "./renderer/SearchCard";
import { useState, useEffect } from "react";
import { Player, TabIndices } from "./commons/Player";
import { RemoveScrollBar } from "react-remove-scroll-bar";
import { useQuery } from '@tanstack/react-query';

import GameStateController from "./controllers/GameStateController";
import { WebSocketClient } from "./controllers/WebSocketClient";

import "./App.css";

class GameStateRef {

  constructor() {
    this.gameStateController = null;
  }

  setGameStateController(gameStateController) {
    this.gameStateController = gameStateController;
  }

  getGameStateController() {
    return this.gameStateController;
  }
}

const gameStateRef = new GameStateRef();

function App() {
  const [gameStateController, setGameStateController] = useState(null);
  const [gameState, setGameState] = useState("login"); //  login | selectDeck | loadGame | game | search_card | tokens
  const [authorization, setAuthorization] = useState(null);
  const [deck, setDeck] = useState(null);
  const [webSocket, setWebSocket] = useState(null);
  const [isSetupDone, setIsSetupDone] = useState(false);

  useEffect(() => {
    gameStateRef.setGameStateController(gameStateController);
  }, [gameStateController]);

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

  const setupIpcRendererActions = () => {
    if (isSetupDone) return;
    window.electron?.ipcRenderer?.on('search-cards', () => {
        setGameState("tokens");
      });
    window.electron?.ipcRenderer?.on('upkeep-reminder', () => {
        gameStateRef.getGameStateController()?.changeUpkeepReminder();
      });
      
    window.electron?.ipcRenderer?.on('roll-dice-2', () => {
        gameStateRef.getGameStateController()?.requestDiceRoll("d2");
      });
    window.electron?.ipcRenderer?.on('roll-dice-4', () => {
        gameStateRef.getGameStateController()?.requestDiceRoll("d4");
      });
    window.electron?.ipcRenderer?.on('roll-dice-6', () => {
        gameStateRef.getGameStateController()?.requestDiceRoll("d6");
      });
    window.electron?.ipcRenderer?.on('roll-dice-8', () => {
        gameStateRef.getGameStateController()?.requestDiceRoll("d8");
      });
    window.electron?.ipcRenderer?.on('roll-dice-10', () => {
        gameStateRef.getGameStateController()?.requestDiceRoll("d10");
      });
    window.electron?.ipcRenderer?.on('roll-dice-12', () => {
        gameStateRef.getGameStateController()?.requestDiceRoll("d12");
      });
    window.electron?.ipcRenderer?.on('roll-dice-20', () => {
        gameStateRef.getGameStateController()?.requestDiceRoll("d20");
      });

    window.electron?.ipcRenderer?.on('gain-1-health', () => {
        gameStateRef.getGameStateController()?.increaseLife(1);
      });
    window.electron?.ipcRenderer?.on('gain-5-health', () => {
        gameStateRef.getGameStateController()?.increaseLife(5);
      });
    window.electron?.ipcRenderer?.on('gain-10-health', () => {
        gameStateRef.getGameStateController()?.increaseLife(10);
      });
    window.electron?.ipcRenderer?.on('gain-20-health', () => {
        gameStateRef.getGameStateController()?.increaseLife(20);
      });

    window.electron?.ipcRenderer?.on('lose-1-health', () => {
        gameStateRef.getGameStateController()?.decreaseLife(1);
      });
    window.electron?.ipcRenderer?.on('lose-5-health', () => {
        gameStateRef.getGameStateController()?.decreaseLife(5);
      });
    window.electron?.ipcRenderer?.on('lose-10-health', () => {
        gameStateRef.getGameStateController()?.decreaseLife(10);
      });
    window.electron?.ipcRenderer?.on('lose-20-health', () => {
        gameStateRef.getGameStateController()?.decreaseLife(20);
      });

    window.electron?.ipcRenderer?.on('i-do-not-pay', () => {
        gameStateRef.getGameStateController()?.iDoNotPay();
      });
    window.electron?.ipcRenderer?.on('response', () => {
        gameStateRef.getGameStateController()?.response();
      });
    window.electron?.ipcRenderer?.on('no-response', () => {
        gameStateRef.getGameStateController()?.noResponse();
      });
    window.electron?.ipcRenderer?.on('quit-game', () => {
        const userConfirmed = window.confirm("Are you sure you want to quit the game?");
        if (userConfirmed) {
          gameStateRef.getGameStateController()?.exitGame();
          window.close();
        }
      });
    setIsSetupDone(true);
    return true;
  };
  
  const { data, isLoading, error } = useQuery({ queryKey: ['setupActions'], queryFn: setupIpcRendererActions }); // eslint-disable-line
      
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
      if (gameState === "loadGame" && webSocket && authorization && deck) {
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
