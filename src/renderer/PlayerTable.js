import { Battlefield, StaticBattlefield } from './Battlefield'
import { PlayerBar } from './PlayerBar'
import { Hand, HiddenHand } from './Hand'
import { DragDropContext } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


export const SouthTable = ({gameState, playerRef, playerNumber, player, isActivePlayer }) => {
  const onDragStart = (start, provided) => {
    const { source } = start;
    const sourceZone = source.droppableId;
    const sourceIndex = source.index;
    let card = null
    switch (sourceZone) {
      case `${playerNumber}-hand`:
        card = player.hand[sourceIndex];
        break;
      case `${playerNumber}-library`:
        card = player.library[sourceIndex];
        break;
      case `${playerNumber}-graveyard`:
        card = player.graveyard[sourceIndex];
        break;
      case `${playerNumber}-exile`:
        card = player.exile[sourceIndex];
        break;
      case `${playerNumber}-battlefield`:
        card = player.battlefield[sourceIndex];
        break;
      case `${playerNumber}-face-down`:
        card = player.faceDown[sourceIndex];
        break;
      case `${playerNumber}-commander-zone`:
        card = player.commanderZone[sourceIndex];
        break;
      default:
        break;
    }
    
    player.selectedCards.push(card);
  }

  const onDragEnd = (result, provided) => {
    if (result.reason === 'DROP')
    {
      const { source, destination } = result;
      if (destination === null) return;

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

      player.selectedCards = player.selectedCards.filter(item => item._uid !== card._uid);
      
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

  const nPlayers = gameState.players.length

  const height = `${100 / nPlayers}%`
  const battlefieldHeight = `${100 / nPlayers * 0.7}%`
  const handHeight = `${100 / nPlayers * 0.3}%`
  const poisonCounters = player.counters?.["poison"] ?? 0;
  const energyCounters = player.counters?.["energy"] ?? 0;
  const otherCounters = player.counters?.["other"] ?? 0;

  return (
    <div className="col flex-fill d-flex flex-column" aria-describedby={`${player.name} ${isActivePlayer ? "active player" : "non-active player"} / 
    ${player.health} life, 
    ${poisonCounters} poison, 
    ${energyCounters} energy, 
    ${otherCounters} other counter,
    ${player.hand.length} in hand,
    ${player.graveyard.length} in graveyard,
    ${player.library.length} in library,
    ${player.exile.length} in exile,
    ${player.faceDown.length} face down,
    ${player.commanderZone.length} in command`}>
      <DragDropContext
        onDragEnd={onDragEnd}
        onDragStart={onDragStart}
      >   
        <Row>
          <Col md="auto">
            <PlayerBar { ...{ player, playerRef, playerNumber, isActivePlayer } } />
          </Col>
          <Col>
            <Row style={({height: '35vh'})}>
              <Battlefield gameState={gameState} playerRef={playerRef} playerNumber={playerNumber} player={player} />
            </Row>
            <Row style={({height: '15vh'})}>
              <Hand player={player} playerRef={playerRef} playerNumber={playerNumber} height={height}/>
            </Row>
          </Col>
        </Row>
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
  
  const poisonCounters = player.counters?.["poison"] ?? 0;
  const energyCounters = player.counters?.["energy"] ?? 0;
  const otherCounters = player.counters?.["other"] ?? 0;

  return (
    <Container fluid>
      <Row>
      <Col md="auto">
        <PlayerBar { ...{ player, playerRef, playerNumber, isActivePlayer } } />
      </Col>
      <Col>
        <Row style={({height: '10vh', background: 'grey'})}>
          <Col>
            <HiddenHand player={player} playerRef={playerRef} playerNumber={playerNumber} />
          </Col>
        </Row>
        <Row style={({height: '40vh', background: 'gold'})}>
          <StaticBattlefield gameState={gameState} playerRef={playerRef} playerNumber={playerNumber} player={player} />
        </Row>
      </Col>
    </Row>
    </Container>
  )
}

NorthTable.propTypes = {
  gameState: PropTypes.object.isRequired,
  playerRef: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
  player: PropTypes.object.isRequired,
  isActivePlayer: PropTypes.bool.isRequired
}