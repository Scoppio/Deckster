import { Battlefield } from './Battlefield'
import { Avatar } from './Avatar'
import { Hand } from './Hand'
import { Library } from './Library'
import { Graveyard, Exile, FaceDown, CommanderZone } from './Zones'

export const PlayerTable = ({gameState, playerRef, playerNumber, player, activePlayer, tabindex }) => {
  return (
    <div className="col flex-fill d-flex flex-column" role="complementary" 
      tabindex={tabindex} 
      ref={playerRef.playerTable} 
      aria-label={activePlayer ? `${player.name} table, active turn` : `${player.name} table, non-active turn`}>
      <div className="row flex-fill">
        <Battlefield gameState={gameState} playerRef={playerRef} playerNumber={playerNumber} player={player} />
      </div>
      <div className="row flex-fill">
        <div className="col">
          <Avatar player={player} playerRef={playerRef} playerNumber={playerNumber} />
        </div>
        <div className="col">
          <Hand player={player} playerRef={playerRef} playerNumber={playerNumber} />
        </div>
        <div className="col">
          <Library player={player} playerRef={playerRef} playerNumber={playerNumber} />
        </div>
        <div className="col">
          <Graveyard player={player} playerRef={playerRef} playerNumber={playerNumber} />
          <Exile player={player} playerRef={playerRef} playerNumber={playerNumber} />
          <FaceDown player={player} playerRef={playerRef} playerNumber={playerNumber} />
          <CommanderZone player={player} playerRef={playerRef} playerNumber={playerNumber} />
        </div>
      </div>
    </div>
  )
}

export const OpponentTable = ({gameState, playerRef, playerNumber, player, activePlayer, tabindex }) => {
  return (
    <div className="col flex-fill d-flex flex-column" role="complementary" 
      tabindex={tabindex} 
      ref={playerRef.playerTable} 
      aria-label={activePlayer ? `${player.name} table, active turn` : `${player.name} table, non-active turn`}>
      <div className="row flex-fill">
        <div className="col">
          <Avatar player={player} playerRef={playerRef} playerNumber={playerNumber} />
        </div>
        <div className="col">
          <Hand player={player} playerRef={playerRef} playerNumber={playerNumber} />
        </div>
        <div className="col">
          <Library player={player} playerRef={playerRef} playerNumber={playerNumber} />
        </div>
        <div className="col">
          <Graveyard player={player} playerRef={playerRef} playerNumber={playerNumber} />
          <Exile player={player} playerRef={playerRef} playerNumber={playerNumber} />
          <FaceDown player={player} playerRef={playerRef} playerNumber={playerNumber} />
          <CommanderZone player={player} playerRef={playerRef} playerNumber={playerNumber} />
        </div>
      </div>
      <div className="row flex-f ill">
        <Battlefield gameState={gameState} playerRef={playerRef} playerNumber={playerNumber} player={player} />
      </div>
    </div>
  )
}