import PropTypes from 'prop-types';
import style from 'styled-components'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Library } from './Library';
import { Graveyard, Exile, FaceDown, CommanderZone, PlayerHandZone } from './Zones';

const PlayerContainer = style.div`
  border: 1px;
  width: ${props => props.width}vw;
  height: ${props => props.height}vh;
  margin: 0 auto;
  background: #grey;
`

const PlayerAvatarImg = style.img`
  width: 30px;
  height: 30px;
  object-fit: contain;
  border-radius: 50%;
  margin: 2px;
`

const CounterSphere = style.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin: 2px;
  border: 5px;
  background: linear-gradient(white, ${props => props.color});
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
`

const PlayerName = style.h2`
  font-size: 16px;
`

const PlayerHealthBox = style.div`
  width: 100%;
  height: 20px;
  background: grey;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
`

export const GenericCounter = ({ value, color, aria_description }) =>{
  return (
    <div>
      <CounterSphere color={color} aria-describedby={aria_description}>{value}</CounterSphere>
    </div>
  )
}

export const PlayerBar = ({ player, playerRef, playerNumber, isActivePlayer, heightVh }) => {
  const poisonCounters = player.counters?.["poison"] ?? 0;
  const energyCounters = player.counters?.["energy"] ?? 0;
  const otherCounters = player.counters?.["other"] ?? 0;

  return (
      <PlayerContainer width={10} height={heightVh} role="region"
        aria-label={`${player.name} ${isActivePlayer ? "[A-P]" : ""} ${player.health} life, 
        ${(poisonCounters > 0) ? poisonCounters + " poison, " : ""}
        ${(energyCounters > 0) ? energyCounters + " energy, " : ""}
        ${(otherCounters > 0) ? otherCounters + " other counter, " : ""}
        ${player.hand.length} in hand,
        ${player.graveyard.length} in graveyard,
        ${player.library.length} in library,
        ${player.commanderZone.length} in command,
        ${player.exile.length} in exile,
        ${player.faceDown.length} face down.`}
        tabIndex={player.tabIndices.playerStats} 
      ref={playerRef.playerStats}>
      <Container fluid>
        <Row>
          <Col md="auto" >
            <PlayerAvatarImg src={player.avatar} alt={player.name} />
            <Row><GenericCounter value={poisonCounters} color={"green"} aria_description={`${poisonCounters} poison`} /></Row>
            <Row><GenericCounter value={energyCounters} color={"blue"} aria_description={`${energyCounters} energy`} /></Row>
            <Row><GenericCounter value={otherCounters} color={"grey"} aria_description={`${otherCounters} other`} /></Row>
          </Col>
          <Col>
            <Row><PlayerName>{player.name}</PlayerName></Row>
            <Row><PlayerHealthBox>{player.health}</PlayerHealthBox></Row>
            <br/>
            <Row><PlayerHandZone {...{player, playerRef, playerNumber}}></PlayerHandZone></Row>
            <Row><Library {...{player, playerRef, playerNumber}} /></Row>
            <Row><Graveyard {...{player, playerRef, playerNumber}} /></Row>
            <Row><Exile {...{player, playerRef, playerNumber}} /></Row>
            <Row><FaceDown {...{player, playerRef, playerNumber}} /></Row>
            <Row><CommanderZone {...{player, playerRef, playerNumber}} /></Row>
          </Col>
        </Row>
      </Container>
    </PlayerContainer>
  )
}

PlayerBar.propTypes = {
  player: PropTypes.object.isRequired,
  playerRef: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
}



export const Avatar = ({ player, playerRef, playerNumber }) => (
  <div className="player-stats" role="region" 
    tabIndex={player.tabIndices.playerStats} 
    ref={playerRef.playerStats} 
    aria-labelledby={playerNumber + "-player-name-label"} 
    aria-describedby={playerNumber + "-health-desc " +  playerNumber + "-counter-desc"}>
    <h2 id={playerNumber + "-player-name-label"}>{player.name}</h2>
    <div><p id={playerNumber + "-health-desc"}>health {player.health},</p></div>
    <div><p id={playerNumber + "-counter-desc"}>counter {player.counter}</p></div>
  </div>
)

Avatar.propTypes = {
  player: PropTypes.object.isRequired,
  playerRef: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
}