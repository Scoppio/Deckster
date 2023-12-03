import { Hand } from './Hand'

// PlayerTable gameState={gameState} player={gameState.player} activePlayer={gameState.activePlayer} tabindex={gameState.player.tabIndices.PlayerTable}
export const PlayerTable = ({gameState, player, activePlayer, tabindex }) => (
<div className="col">
  <div className='row'>
    <div className='col'>
      <div className="player-stats" role="complementary" tabindex={tabindex} aria-describedby="player-name health-desc counter-desc">
        <h2 id="player-name">{player.name}</h2>
        <div><p id="health-desc">health {player.health},</p></div>
        <div><p id="counter-desc">counter {player.counter}</p></div>
      </div>
    </div>
    <div className='col'>
      <div className="hand" tabindex={player.tabIndices.Hand} aria-label={player.hand.ariaLabel}>
        <h2 id="player-hand">Your hand</h2>
        <p id="hand-desc">{player.hand.length} cards</p>
      </div>
    </div>
    <div className='col'>
      <div className="deck" tabindex={player.tabIndices.Deck} aria-describedby="deck-label deck-desc">
        <h3 id="deck-label">Deck</h3>
        <p id="deck-desc">{player.deck.length} cards</p>
      </div>
    </div>
    <div className='col'>
    <div class="small-container">
      <h3 id="graveyard-label">graveyard</h3>
      <div class="graveyard" role="complementary" tabindex="40" aria-describedby="graveyard-label graveyard-desc">
        <p id="graveyard-desc">3 cards</p>
      </div>
    </div>
    <div class="small-container">
      <h3 id="exile-label">exile</h3>
      <div class="exile" role="complementary" tabindex="50" aria-describedby="exile-label exile-desc">
        <p id="exile-desc">empty</p>
      </div>
    </div>
        <div class="small-container">
          <h3 id="face-down-label">face down</h3>
          <div class="face-down" role="complementary" tabindex="60" aria-describedby="face-down-label face-down-desc">
            <p id="face-down-desc">empty</p>
          </div>
        </div>
        <div class="small-container">
          <h3 id="commander-label">commander zone</h3>
          <div class="commander" role="complementary" tabindex="70" aria-describedby="commander-label commander-desc">
            <p id="commander-desc">empty</p>
          </div>
        <div>
      </div>
  </div>
</div>
)