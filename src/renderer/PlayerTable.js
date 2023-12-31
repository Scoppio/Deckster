import { Battlefield, StaticBattlefield } from './Battlefield'
import { Avatar } from './Avatar'
import { Hand, HiddenHand } from './Hand'
import { Library } from './Library'
import { Graveyard, Exile, FaceDown, CommanderZone } from './Zones'
import { DragDropContext } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';

export const SouthTable = ({gameState, playerRef, playerNumber, player, isActivePlayer }) => {
  const onDragEnd = (result, provided) => {
    if (result.reason === 'DROP')
    {
      const { source, destination } = result;
      const sourceZone = source.droppableId;
      const destinationZone = destination.droppableId;
      const sourceIndex = source.index;
      const destinationIndex = destination.index;
      let card = null
      switch (sourceZone) {
        case `${playerNumber}-hand`:
          card = player.hand[sourceIndex];
          player.hand.splice(sourceIndex, 1);
          break;
        case `${playerNumber}-library`:
          card = player.library[sourceIndex];
          player.library.splice(sourceIndex, 1);
          break;
        case `${playerNumber}-graveyard`:
          card = player.graveyard[sourceIndex];
          player.graveyard.splice(sourceIndex, 1);

          break;
        case `${playerNumber}-exile`:
          card = player.exile[sourceIndex];
          player.exile.splice(sourceIndex, 1);
          break;
        case `${playerNumber}-battlefield`:
          card = player.battlefield[sourceIndex];
          player.battlefield.splice(sourceIndex, 1);
          break;
        case `${playerNumber}-face-down`:
          card = player.faceDown[sourceIndex];
          player.faceDown.splice(sourceIndex, 1);
          break;
        case `${playerNumber}-commander-zone`:
          card = player.commanderZone[sourceIndex];
          player.commanderZone.splice(sourceIndex, 1);
          break;
        default:
          break;
      }
      
      if (card === null) return

      switch (destinationZone) {
        case `${playerNumber}-hand`:
          player.hand.splice(destinationIndex, 0, card);
          break;
        case `${playerNumber}-library`:
          player.library.splice(destinationIndex, 0, card);
          break;
        case `${playerNumber}-graveyard`:
          player.graveyard.splice(destinationIndex, 0, card);
          break;
        case `${playerNumber}-exile`:
          player.exile.splice(destinationIndex, 0, card);
          break;
        case `${playerNumber}-battlefield`:
          player.battlefield.splice(destinationIndex, 0, card);
          break;
        case `${playerNumber}-face-down`:
          player.faceDown.splice(destinationIndex, 0, card);
          break;
        case `${playerNumber}-commander-zone`:
          player.commanderZone.splice(destinationIndex, 0, card);
          break;
        default:
          break;
      }
    }

    /*
    {
        "draggableId": "814071",
        "type": "DEFAULT",
        "source": {
            "index": 2,
            "droppableId": "0"
        },
        "reason": "DROP",
        "mode": "FLUID",
        "destination": {
            "droppableId": "0",
            "index": 1
        },
        "combine": null
    }

    */
  
  }

  return (
    <div className="col flex-fill d-flex flex-column" role="complementary" 
      aria-label={isActivePlayer ? `${player.name} table, active turn` : `${player.name} table, non-active turn`}>
      <DragDropContext
        onDragEnd={onDragEnd}
      >   
        <div className="row flex-fill" style={({height: '15vh'})}>
          <Battlefield gameState={gameState} playerRef={playerRef} playerNumber={playerNumber} player={player} />
        </div>
        <div className="row flex-fill" style={({height: '20vh'})}>
          <div className="col-1 flex-fill d-flex flex-column">
            <Avatar player={player} playerRef={playerRef} playerNumber={playerNumber} />
            <Library player={player} playerRef={playerRef} playerNumber={playerNumber} />
            <Graveyard player={player} playerRef={playerRef} playerNumber={playerNumber} />
          </div>
          <div className="col-1 flex-fill d-flex flex-column">
            <Exile player={player} playerRef={playerRef} playerNumber={playerNumber} />
            <FaceDown player={player} playerRef={playerRef} playerNumber={playerNumber} />
            <CommanderZone player={player} playerRef={playerRef} playerNumber={playerNumber} />
          </div>
          <div className='col-8'></div>
        </div>
        <div className="row" style={({height: '25vh'})}>
          <Hand player={player} playerRef={playerRef} playerNumber={playerNumber} />
        </div>
      </DragDropContext>
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
      <div className="row" style={({height: '20vh'})}>
        <div className="col-1 flex-fill d-flex flex-column">
          <Avatar player={player} playerRef={playerRef} playerNumber={playerNumber} />
          <Library player={player} playerRef={playerRef} playerNumber={playerNumber} />
          <Graveyard player={player} playerRef={playerRef} playerNumber={playerNumber} />
        </div>
        <div className="col-1 flex-fill d-flex flex-column">
          <Exile player={player} playerRef={playerRef} playerNumber={playerNumber} />          
          <FaceDown player={player} playerRef={playerRef} playerNumber={playerNumber} />
          <CommanderZone player={player} playerRef={playerRef} playerNumber={playerNumber} />
        </div>
        <div className='col-1'></div>
        <div className="col-6 flex-fill d-flex flex-column">
          <HiddenHand player={player} playerRef={playerRef} playerNumber={playerNumber} />
        </div>
      </div>
      <div className="row flex-fill" style={({height: '20vh'})}>
        <StaticBattlefield gameState={gameState} playerRef={playerRef} playerNumber={playerNumber} player={player} />
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