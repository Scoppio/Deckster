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

  exec(method_call, ...args) {
    if (this.gameStateController) {
      this.gameStateController[method_call](...args);
    }
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
    
    window.electron?.ipcRenderer?.on('untap-all', () => {
      gameStateRef.exec('untapAll');
    });
    window.electron?.ipcRenderer?.on('draw-card', () => {
      gameStateRef.exec('drawCard');
    });
    window.electron?.ipcRenderer?.on('draw-hand', () => {
      gameStateRef.exec('drawHand');
    });
    window.electron?.ipcRenderer?.on('mulligan', () => {
      gameStateRef.exec('mulliganHand');
    });
    window.electron?.ipcRenderer?.on('pass-turn', () => {
      gameStateRef.exec('passTurn');
    });
    window.electron?.ipcRenderer?.on('next-step', () => {
      gameStateRef.exec('changeGamePhase');
    });
    window.electron?.ipcRenderer?.on('previous-step', () => {
      gameStateRef.exec('changeGamePhase', "previous");
    });
    window.electron?.ipcRenderer?.on('main-phase', () => {
      gameStateRef.exec('changeGamePhase' , 'first-main');
    });
    window.electron?.ipcRenderer?.on('combat-phase', () => {
      gameStateRef.exec('changeGamePhase' , 'combat');
    });
    window.electron?.ipcRenderer?.on('second-main-phase', () => {
      gameStateRef.exec('changeGamePhase' , 'second-main');
    });
    window.electron?.ipcRenderer?.on('end-phase', () => {
      gameStateRef.exec('changeGamePhase' , 'end');
    });

    window.electron?.ipcRenderer?.on('force-sync', () => {
      gameStateRef.exec('updateGameState');
    });

    window.electron?.ipcRenderer?.on('search-cards', () => {
      if (gameStateRef.getGameStateController()) {
        setGameState("tokens");
      }
    });
    window.electron?.ipcRenderer?.on('upkeep-reminder', () => {
      gameStateRef.exec('changeUpkeepReminder');
    });
    window.electron?.ipcRenderer?.on('roll-dice-2', () => {
      gameStateRef.exec('requestDiceRoll', "d2");
    });
    window.electron?.ipcRenderer?.on('roll-dice-4', () => {
      gameStateRef.exec('requestDiceRoll', "d4");
    });
    window.electron?.ipcRenderer?.on('roll-dice-6', () => {
      gameStateRef.exec('requestDiceRoll', "d6");
    });
    window.electron?.ipcRenderer?.on('roll-dice-8', () => {
      gameStateRef.exec('requestDiceRoll', "d8");
    });
    window.electron?.ipcRenderer?.on('roll-dice-10', () => {
      gameStateRef.exec('requestDiceRoll', "d10");
    });
    window.electron?.ipcRenderer?.on('roll-dice-12', () => {
      gameStateRef.exec('requestDiceRoll', "d12");
    });
    window.electron?.ipcRenderer?.on('roll-dice-20', () => {
      gameStateRef.exec('requestDiceRoll', "d20");
    });
    window.electron?.ipcRenderer?.on('roll-dice-100', () => {
      gameStateRef.exec('requestDiceRoll', "d100");
    });
    window.electron?.ipcRenderer?.on('change-deck', () => {
      if (gameStateRef.getGameStateController()) {
        setGameState("selectDeck");
      }
    });
    window.electron?.ipcRenderer?.on('gain-1-health', () => {
      gameStateRef.exec('increaseLife', 1);
    });
    window.electron?.ipcRenderer?.on('gain-5-health', () => {
      gameStateRef.exec('increaseLife', 5);
    });
    window.electron?.ipcRenderer?.on('gain-10-health', () => {
      gameStateRef.exec('increaseLife', 10);
    });
    window.electron?.ipcRenderer?.on('gain-20-health', () => {
      gameStateRef.exec('increaseLife', 20);
    });
    window.electron?.ipcRenderer?.on('lose-1-health', () => {
      gameStateRef.exec('decreaseLife', 1);
    });
    window.electron?.ipcRenderer?.on('lose-5-health', () => {
      gameStateRef.exec('decreaseLife', 5);
    });
    window.electron?.ipcRenderer?.on('lose-10-health', () => {
      gameStateRef.exec('decreaseLife', 10);
    });
    window.electron?.ipcRenderer?.on('lose-20-health', () => {
      gameStateRef.exec('decreaseLife', 20);
    });
    window.electron?.ipcRenderer?.on('gain-1-energy-counter', () => {
      gameStateRef.exec('changePlayerCounters', "energy", 1);
    });
    window.electron?.ipcRenderer?.on('gain-3-energy-counter', () => {
      gameStateRef.exec('changePlayerCounters', "energy", 3);
    });
    window.electron?.ipcRenderer?.on('gain-5-energy-counter', () => {
      gameStateRef.exec('changePlayerCounters', "energy", 5);
    });
    window.electron?.ipcRenderer?.on('remove-1-energy-counter', () => {
      gameStateRef.exec('changePlayerCounters', "energy", -1);
    });
    window.electron?.ipcRenderer?.on('remove-3-energy-counter', () => {
      gameStateRef.exec('changePlayerCounters', "energy", -3);
    });
    window.electron?.ipcRenderer?.on('remove-5-energy-counter', () => {
      gameStateRef.exec('changePlayerCounters', "energy", -5);
    });
    window.electron?.ipcRenderer?.on('remove-all-energy-counter', () => {
      gameStateRef.exec('changePlayerCounters', "energy", -10000000);
    });
    window.electron?.ipcRenderer?.on('gain-1-poison-counter', () => {
      gameStateRef.exec('changePlayerCounters', "poison", 1);
    });
    window.electron?.ipcRenderer?.on('gain-3-poison-counter', () => {
      gameStateRef.exec('changePlayerCounters', "poison", 3);
    });
    window.electron?.ipcRenderer?.on('gain-5-poison-counter', () => {
      gameStateRef.exec('changePlayerCounters', "poison", 5);
    });
    window.electron?.ipcRenderer?.on('remove-1-poison-counter', () => {
      gameStateRef.exec('changePlayerCounters', "poison", -1);
    });
    window.electron?.ipcRenderer?.on('remove-3-poison-counter', () => {
      gameStateRef.exec('changePlayerCounters', "poison", -3);
    });
    window.electron?.ipcRenderer?.on('remove-5-poison-counter', () => {
      gameStateRef.exec('changePlayerCounters', "poison", -5);
    });
    window.electron?.ipcRenderer?.on('remove-all-poison-counter', () => {
      gameStateRef.exec('changePlayerCounters', "poison", -10000000);
    });
    window.electron?.ipcRenderer?.on('add-1-counter', () => {
      gameStateRef.exec('changePlayerCounters', "other", 1);
    });
    window.electron?.ipcRenderer?.on('add-5-counter', () => {
      gameStateRef.exec('changePlayerCounters', "other", 5);
    });
    window.electron?.ipcRenderer?.on('add-10-counter', () => {
      gameStateRef.exec('changePlayerCounters', "other", 10);
    });
    window.electron?.ipcRenderer?.on('remove-1-counter', () => {
      gameStateRef.exec('changePlayerCounters', "other", -1);
    });
    window.electron?.ipcRenderer?.on('remove-5-counter', () => {
      gameStateRef.exec('changePlayerCounters', "other", -5);
    });
    window.electron?.ipcRenderer?.on('remove-10-counter', () => {
      gameStateRef.exec('changePlayerCounters', "other", -10);
    });
    window.electron?.ipcRenderer?.on('remove-all-counter', () => {
      gameStateRef.exec('changePlayerCounters', "other", -10000000);
    });


    window.electron?.ipcRenderer?.on('i-do-not-pay', () => {
      gameStateRef.exec('iDoNotPay');
    });
    window.electron?.ipcRenderer?.on('response', () => {
      gameStateRef.exec('response');
    });
    window.electron?.ipcRenderer?.on('no-response', () => {
      gameStateRef.exec('noResponse');
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
      if (gameState === "loadGame" && deck) {
        const user = authorization.user;
        const player = new Player(user, deck, 40, TabIndices, true);
        gameStateController.addPlayer(player);
        gameStateController.updateGameState();
        setGameState("game");
      }
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
        const gameStateC = new GameStateController(
          undefined,
          setGameStateController
        );

        gameStateC.authorization = authorization;
        gameStateC.registerWebSocketClient(webSocket);
        gameStateC.addPlayer(playerA);
        gameStateC.game_state_handler.push({ func: handleChangeGameState });
        setGameStateController(gameStateC);
        gameStateC.updateGameState();
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
      </div>
    );
  }
  else if (gameState === "view_zone") {
    return (
      <div role="application" className="app">
        <SearchZone gameState={gameStateController} handleCloseCardOpenZone={handleCloseCardOpenZone} />
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
