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
    gameState.getCardFrom(source)
  }

  const onDragEnd = (result, provided) => {
    const { source, destination } = result;
    const sourceZone = source.droppableId;
    let sourceName = sourceZone.split('-')[1]

    if (result.reason === 'CANCEL') {
      provided.announce(`Cancelling card movement, returning card to ${sourceName}`);
      gameState.cancelCardMove()
      return;
    }
    if (result.reason === 'DROP')
    {
      if (destination === null) {
        provided.announce(`Dropped in an invalid location, returning card to ${sourceName}`);
        gameState.cancelCardMove()
        return
      }

      const destinationZone = destination.droppableId;
      const card = gameState.moveCardTo(source, destination)
      provided.announce('Moved ' + card.name + ' from ' + sourceName + ' to ' + destinationZone);
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
  // const battlefieldHeight = `${100 / nPlayers * 0.7}%`
  // const handHeight = `${100 / nPlayers * 0.3}%`
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

export const NorthTable = ({gameState, playerRef, playerNumber, player, isActivePlayer, barSide, landsOnNorth }) => {

  return (
    <Container fluid>
      <Row>
        {
          barSide === 'left' ? (
            <Col md="auto">
              <PlayerBar { ...{ player, playerRef, playerNumber, isActivePlayer } } />
            </Col>
          ) : null
        }
      <Col>
        {
          landsOnNorth ?
          (<Row style={({height: '10vh', background: 'grey'})}>
            <Col>
              <HiddenHand player={player} playerRef={playerRef} playerNumber={playerNumber} />
            </Col>
          </Row>) : null
        }
        <Row style={({height: '40vh', background: 'gold'})}>
          <StaticBattlefield gameState={gameState} playerRef={playerRef} playerNumber={playerNumber} player={player} landsOnNorth={landsOnNorth} />
        </Row>
        {
          !landsOnNorth ?
          (<Row style={({height: '10vh', background: 'grey'})}>
            <Col>
              <HiddenHand player={player} playerRef={playerRef} playerNumber={playerNumber} />
            </Col>
          </Row>) : null
        }
      </Col>
      {
        barSide === 'right' ? (
          <Col md="auto">
            <PlayerBar { ...{ player, playerRef, playerNumber, isActivePlayer } } />
          </Col>
        ) : null
      }
    </Row>
    </Container>
  )
}

NorthTable.propTypes = {
  gameState: PropTypes.object.isRequired,
  playerRef: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
  player: PropTypes.object.isRequired,
  isActivePlayer: PropTypes.bool.isRequired,
  barSide: PropTypes.string.isRequired,
  landsOnNorth: PropTypes.bool.isRequired
}
