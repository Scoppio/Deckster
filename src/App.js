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
    playerTable: 1,
    battlefield: 2,
    playerStats: 3,
    hand: 4,
    deck: 5,
    graveyard: 6,
    exile: 7,
    faceDown: 8,
    commanderZone: 9,
  }
  
  const playerA = new Player("Anna", convertTextToDeck(amalia_walker_text).deck, tabIndices)
  const playerB = new Player("Bernard", convertTextToDeck(uw_karn_control_text).deck, {
    ...tabIndices,
    playerTable: tabIndices.playerTable + 10,
    battlefield: tabIndices.battlefield + 10,
    playerStats: tabIndices.playerStats + 10,
    hand: tabIndices.hand + 10,
    deck: tabIndices.deck + 10,
    graveyard: tabIndices.graveyard + 10,
    exile: tabIndices.exile + 10,
    faceDown: tabIndices.faceDown + 10,
    commanderZone: tabIndices.commanderZone + 10,
  })

  const players = [playerA, playerB]
  const gameState = {
    players: players,
    activePlayer: 0
  }

  const gameStateController = new GameStateController(gameState)
  
  gameStateController.shuffleAllDecks()
  gameStateController.eachPlayerDrawSeven()

  return (
    <GameArena gameState={gameState}/>
  )

}

export default App;
