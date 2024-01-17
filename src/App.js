// import { useState, useMemo } from 'react'

import { GameArena } from './renderer/GameArena'
import { loadDeck } from './commons/DeckLoader'
import { useState, useEffect } from 'react'
import { GameStateController } from './controllers/GameStateController'
import { Player } from './commons/Player'
import '@atlaskit/css-reset'
import 'mana-font/css/mana.css'
import {RemoveScrollBar} from 'react-remove-scroll-bar';
import { WebSocketClient } from './controllers/WebSocketClient'

function App() {

  const [gameStateController, setGameStateController] = useState(null)

  useEffect(() => {
    if (gameStateController) {
      const handleStateChange = (newState) => {
        setGameStateController(new GameStateController(newState));
      };
  
      gameStateController.on('stateChanged', handleStateChange);
      return () => {
        // Clean up the listener when the component unmounts
        gameStateController.off('stateChanged', handleStateChange);
      };
    } else {
      const deckA = loadDeck(46) // await fetchDeck(46)
      const deckB = loadDeck(47) // await fetchDeck(47)

      const tabIndices = {
        playerStats: 1000,
        front_battlefield: 2000,
        back_battlefield: 3000,
        land_zone_battlefield: 4000,
        hand: 5000,
        library: 6000,
        graveyard: 7000,
        exile: 8000,
        faceDown: 9000,
        commanderZone: 9900,
      } 

      const playerA = new Player(1, "Anna", deckA, 40, tabIndices, true)
      const playerB = new Player(2, "Bernard", deckB, 40, 
        Object.entries(tabIndices).reduce((acc, [key, value]) => ({
          ...acc,
          [key]: value + 10000,
        }), {})
      )

      const gameState = new GameStateController()
      gameState.registerWebSocketClient(new WebSocketClient("test"))
      gameState.addPlayer(playerA, true)
      gameState.addPlayer(playerB, false)
      setGameStateController(gameState)
    }
  }, [gameStateController])

  if (!gameStateController) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <RemoveScrollBar />
      <GameArena gameState={gameStateController}/>
    </div>
  )

}

export default App
