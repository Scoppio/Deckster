// import { useState, useMemo } from 'react'

import { GameArena } from './renderer/GameArena'
import { loadDeck } from './commons/DeckLoader'
import { useState, useEffect } from 'react'
import { GameStateController } from './controllers/GameStateController'
import { Player } from './commons/Player'
import '@atlaskit/css-reset'
import 'mana-font/css/mana.css'


function App() {
  const tabIndices = {
    playerStats: 1000,
    battlefield: 2000,
    hand: 4000,
    library: 5000,
    graveyard: 6000,
    exile: 7000,
    faceDown: 8000,
    commanderZone: 9000,
  } 

  const [players, setPlayers] = useState([])
  const [gameStateController, setGameStateController] = useState(null)

  useEffect(() => {
    const fetchPlayers = async () => {
      const deckA = loadDeck(46) // await fetchDeck(46)
      const deckB = loadDeck(47) // await fetchDeck(47)

      const playerA = new Player("Anna", deckA, 40, tabIndices, false)
      const playerB = new Player("Bernard", deckB, 40, {
        ...tabIndices,
        battlefield: tabIndices.battlefield + 10000,
        playerStats: tabIndices.playerStats + 10000,
        hand: tabIndices.hand + 10000,
        library: tabIndices.library + 10000,
        graveyard: tabIndices.graveyard + 10000,
        exile: tabIndices.exile + 10000,
        faceDown: tabIndices.faceDown + 10000,
        commanderZone: tabIndices.commanderZone + 10000,
      }, true)

      setPlayers([playerA, playerB])
    }

    fetchPlayers()
  }, [])

  useEffect(() => {
    if (players.length > 0) {
      const gameState = new GameStateController(players)
      gameState.shuffleAllDecks()
      gameState.eachPlayerDrawSeven()
      gameState.putRandomCardIntoBattlefield(0)
      gameState.putRandomCardIntoBattlefield(0)
      gameState.putRandomCardIntoBattlefield(0)
      gameState.putRandomCardIntoBattlefield(1)
      gameState.putRandomCardIntoBattlefield(1)
      gameState.putRandomCardIntoBattlefield(1)
      gameState.putRandomCardIntoBattlefield(1)
      setGameStateController(gameState)
    }
  }, [players])

  if (!gameStateController) {
    return <div>Loading...</div>
  }

  return (
    <GameArena gameState={gameStateController}/>
  )

}

export default App
