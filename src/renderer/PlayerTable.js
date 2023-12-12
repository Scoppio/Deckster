import { Battlefield } from './Battlefield'
import { Avatar } from './Avatar'
import { Hand } from './Hand'
import { Library } from './Library'
import { Graveyard, Exile, FaceDown, CommanderZone } from './Zones'
import PropTypes from 'prop-types';

export const SouthTable = ({gameState, playerRef, playerNumber, player, isActivePlayer }) => {
  return (
    <div className="col flex-fill d-flex flex-column" role="complementary" 
      aria-label={isActivePlayer ? `${player.name} table, active turn` : `${player.name} table, non-active turn`}>
      <div className="row flex-fill" style={({height: '20vh'})}>
        <Battlefield gameState={gameState} playerRef={playerRef} playerNumber={playerNumber} player={player} />
      </div>
      <div className="row flex-fill" style={({height: '30vh'})}>
        <div className="col-2 flex-fill d-flex flex-column">
          <Avatar player={player} playerRef={playerRef} playerNumber={playerNumber} />
          <Library player={player} playerRef={playerRef} playerNumber={playerNumber} />
          <Graveyard player={player} playerRef={playerRef} playerNumber={playerNumber} />
        </div>
        <div className="col-3 flex-fill d-flex flex-column">
          <Exile player={player} playerRef={playerRef} playerNumber={playerNumber} />
          <FaceDown player={player} playerRef={playerRef} playerNumber={playerNumber} />
          <CommanderZone player={player} playerRef={playerRef} playerNumber={playerNumber} />
        </div>
        <div className="col-5 flex-fill d-flex flex-column">
          <Hand player={player} playerRef={playerRef} playerNumber={playerNumber} />
        </div>
      </div>
    </div>
  )
}

SouthTable.propTypes = {
  gameState: PropTypes.object.isRequired,
  playerRef: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
  player: PropTypes.object.isRequired,
  isActivePlayer: PropTypes.bool.isRequired,
}

export const NorthTable = ({gameState, playerRef, playerNumber, player, isActivePlayer }) => {
  return (
    <div className="col flex-fill d-flex flex-column" role="complementary" 
      aria-label={isActivePlayer ? `${player.name} table, active turn` : `${player.name} table, non-active turn`}>
      <div className="row" style={({height: '30vh'})}>
        <div className="col-2 flex-fill d-flex flex-column">
          <Avatar player={player} playerRef={playerRef} playerNumber={playerNumber} />
          <Library player={player} playerRef={playerRef} playerNumber={playerNumber} />
          <Graveyard player={player} playerRef={playerRef} playerNumber={playerNumber} />
        </div>
        <div className="col-3 flex-fill d-flex flex-column">
          <Exile player={player} playerRef={playerRef} playerNumber={playerNumber} />          
          <FaceDown player={player} playerRef={playerRef} playerNumber={playerNumber} />
          <CommanderZone player={player} playerRef={playerRef} playerNumber={playerNumber} />
        </div>
        <div className="col-5 flex-fill d-flex flex-column">
          <Hand player={player} playerRef={playerRef} playerNumber={playerNumber} />
        </div>
      </div>
      <div className="row flex-fill" style={({height: '20vh'})}>
        <Battlefield gameState={gameState} playerRef={playerRef} playerNumber={playerNumber} player={player} />
      </div>
    </div>
  )
}

NorthTable.propTypes = {
  gameState: PropTypes.object.isRequired,
  playerRef: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
  player: PropTypes.object.isRequired,
  isActivePlayer: PropTypes.bool.isRequired
}