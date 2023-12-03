import { PlayerTable } from './PlayerTable'

export const GameArena = ({gameState}) => (
    <div className="container mt-2">
      <div className="row">
        <div className="col">
          <PlayerTable gameState={gameState} player={gameState.opponents} activePlayer={gameState.activePlayer} tabIndex="0" />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <PlayerTable gameState={gameState} player={gameState.player} activePlayer={gameState.activePlayer} tabIndex="1" />
        </div>
      </div>
    </div>
)
