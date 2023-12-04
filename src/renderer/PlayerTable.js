import { Card } from './Card'

export const PlayerTable = ({gameState, playerRef, playerNumber, player, activePlayer, tabindex }) => {

  return (
    <div className="col" role="complementary" 
      tabindex={tabindex} 
      ref={playerRef.playerTable} 
      aria-label={activePlayer ? `${player.name} table, active turn` : `${player.name} table, non-active turn`}>
      <div className="row" 
        ref={playerRef.battlefield} 
        tabindex={player.tabIndices.battlefield}
        aria-label={player.name + " Battlefield"}
        aria-description={gameState.cardsOnTheTable(playerNumber)}>
        {
          player.battlefield.map((card, index) => {
            return (
              <div className="col">
                <Card data={card} tabIndex={index + player.tabIndices.battlefield} />
              </div>
            )
          })
        }
      </div>

      <div className="row">
        <div className="col">
          <div className="player-stats" role="complementary" 
            tabindex={player.tabIndices.playerStats} 
            ref={playerRef.playerStats} 
            aria-labelledby={playerNumber + "-player-name-label"} 
            aria-describedby={playerNumber + "-health-desc " +  playerNumber + "-counter-desc"}>
            <h2 id={playerNumber + "-player-name-label"}>{player.name}</h2>
            <div><p id={playerNumber + "-health-desc"}>health {player.health},</p></div>
            <div><p id={playerNumber + "-counter-desc"}>counter {player.counter}</p></div>
          </div>
        </div>
        <div className="col">
          <div className="hand row" 
            role="complementary" 
            tabindex={player.tabIndices.hand} 
            ref={playerRef.hand} 
            aria-labelledby={playerNumber + "-player-hand-label"} 
            aria-describedby={playerNumber + "-hand-desc"}>
            <h2 id={playerNumber + "-player-hand-label"}>Hand</h2>
            <p id={playerNumber + "-hand-desc"}>{player.hand.length} cards</p>
            {
              // for each card on player[activePlayer.battlefield] create a card <Card data={card} />
              player.hand.map((card, index) => {
                return (
                  <div className="col">
                    <Card data={card} tabIndex={index + player.tabIndices.hand} />
                  </div>
                )
              })
            }
          </div>
        </div>
        <div className="col">
          <div className="deck" 
            role="complementary" 
            ref={playerRef.deck} 
            tabindex={player.tabIndices.deck} 
            aria-labelledby={playerNumber + "-deck-label"} 
            aria-describedby={playerNumber + "-deck-desc"}>
            <h3 id={playerNumber + "-deck-label"}>Deck</h3>
            <p id={playerNumber + "-deck-desc"}>{player.deck.length} cards</p>
          </div>
        </div>
        <div className="col">
          <div className="row">
            <div className="graveyard" 
              role="complementary" 
              ref={playerRef.graveyard} 
              tabindex={player.tabIndices.graveyard} 
              aria-labelledby={playerNumber + "-graveyard-label"} 
              aria-describedby={playerNumber + "-graveyard-desc"}>
              <h3 id={playerNumber + "-graveyard-label"}>graveyard</h3>
              <p id={playerNumber + "-graveyard-desc"}>{player.graveyard.length} cards</p>
            </div>
          </div>
          <div className="row">
            <div className="exile" 
              role="complementary" 
              ref={playerRef.exile} 
              tabindex={player.tabIndices.exile} 
              aria-labelledby={playerNumber + "-exile-label"} 
              aria-describedby={playerNumber + "-exile-desc"}>
              <h3 id={playerNumber + "-exile-label"}>exile</h3>
              <p id={playerNumber + "-exile-desc"}>{player.exile.length} cards</p>
            </div>
          </div>
          <div className="row">
            <div className="face-down" 
              role="complementary" 
              ref={playerRef.faceDown} 
              tabindex={player.tabIndices.faceDown} 
              aria-labelledby={playerNumber + "-face-down-label"} 
              aria-describedby={playerNumber + "-face-down-desc"}>
              <h3 id={playerNumber + "-face-down-label"}>face down</h3>
              <p id={playerNumber + "-face-down-desc"}>{player.faceDown.length} cards</p>
            </div>
          </div>
          <div className="row">
            <div className="commander" 
              role="complementary" 
              ref={playerRef.commanderZone} 
              tabindex={player.tabIndices.commanderZone} 
              aria-labelledby={playerNumber + "-commander-label"} 
              aria-describedby={playerNumber + "-commander-desc"}>
              <h3 id={playerNumber + "-commander-label"}>commander zone</h3>
              <p id={playerNumber + "-commander-desc"}>{player.commanderZone.length} cards</p>
              <p id={playerNumber + "-commander-casting-cost"}>Extra casting cost: {player.commanderExtraCastingCost}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}