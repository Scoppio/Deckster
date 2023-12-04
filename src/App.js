// import { useState, useMemo } from 'react'
import { GameArena } from './renderer/GameArena'
import { amalia_walker_text, uw_karn_control_text, convertTextToDeck } from './commons/DeckLoader'
import { GameStateController } from './GameStateController'
import { Player } from './commons/Player'

// const fs = window.require('fs')
// const pathModule = window.require('path')

// const { app } = window.require('@electron/remote')

function App() {

  const tabIndices = {
    playerTable: 1000,
    battlefield: 2000,
    playerStats: 3000,
    hand: 4000,
    deck: 5000,
    graveyard: 6000,
    exile: 7000,
    faceDown: 8000,
    commanderZone: 9000,
  }
  
  const playerA = new Player("Anna", convertTextToDeck(amalia_walker_text).deck, tabIndices)
  const playerB = new Player("Bernard", convertTextToDeck(uw_karn_control_text).deck, {
    ...tabIndices,
    playerTable: tabIndices.playerTable + 10000,
    battlefield: tabIndices.battlefield + 10000,
    playerStats: tabIndices.playerStats + 10000,
    hand: tabIndices.hand + 10000,
    deck: tabIndices.deck + 10000,
    graveyard: tabIndices.graveyard + 10000,
    exile: tabIndices.exile + 10000,
    faceDown: tabIndices.faceDown + 10000,
    commanderZone: tabIndices.commanderZone + 10000,
  })

  const players = [playerA, playerB]
  
  const gameStateController = new GameStateController(players)
  
  gameStateController.shuffleAllDecks()
  gameStateController.eachPlayerDrawSeven()
  gameStateController.putRandomCardIntoBattlefield(0)
  gameStateController.putRandomCardIntoBattlefield(0)
  gameStateController.putRandomCardIntoBattlefield(0)

  gameStateController.putRandomCardIntoBattlefield(1)
  gameStateController.putRandomCardIntoBattlefield(1)
  gameStateController.putRandomCardIntoBattlefield(1)
  gameStateController.putRandomCardIntoBattlefield(1)

  return (
    <GameArena gameState={gameStateController}/>
  )

}

export default App;
