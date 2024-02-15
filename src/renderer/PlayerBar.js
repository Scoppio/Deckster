import PropTypes from 'prop-types';
import style from 'styled-components'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Library } from './Library';
import { Graveyard, Exile, FaceDown, CommanderZone } from './Zones';
import { PlayerHandZone } from './PlayerHandZone';
import emptyAvatar from '../resources/images/bubbly_cat.jpg'

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

const PlayerLifeBox = style.div`
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

export const PlayerBar = ({ player, playerRef, playerNumber, heightVh, gameState }) => {
  function getCounterValue(player, counterType, defaultValue = 0) {
    return player?.counters?.[counterType] ?? defaultValue;
  }

  const poisonCounters = getCounterValue(player, "poison");
  const energyCounters = getCounterValue(player, "energy");
  const otherCounters = getCounterValue(player, "other");
  const ariaLabel = gameState.ariaHelper.playerQuickGlance(playerNumber);

  return (
      <PlayerContainer 
        width={10} 
        height={heightVh} 
        role="region"
        aria-label={ariaLabel}
        tabIndex={player && player.tabIndices.playerStats} 
        ref={playerRef.playerStats}
      >
      <Container fluid>
        <Row>
          <Col md="auto" >
            <PlayerAvatarImg src={player?.avatar ?? emptyAvatar} alt={player?.name ?? "Nothing to see"} />
            <Row><GenericCounter value={poisonCounters} color={"green"} aria_description={`${poisonCounters} poison`} /></Row>
            <Row><GenericCounter value={energyCounters} color={"blue"} aria_description={`${energyCounters} energy`} /></Row>
            <Row><GenericCounter value={otherCounters} color={"grey"} aria_description={`${otherCounters} other`} /></Row>
          </Col>
          <Col>
            <Row><PlayerName>{player?.name ?? "-"}</PlayerName></Row>
            <Row><PlayerLifeBox>{player?.life ?? 0}</PlayerLifeBox></Row>
            <br/>
            <Row><PlayerHandZone {...{player, playerRef, playerNumber, gameState}}></PlayerHandZone></Row>
            <Row><Library {...{player, playerRef, playerNumber, gameState}} /></Row>
            <Row><Graveyard {...{player, playerRef, playerNumber, gameState}} /></Row>
            <Row><Exile {...{player, playerRef, playerNumber, gameState}} /></Row>
            <Row><FaceDown {...{player, playerRef, playerNumber, gameState}} /></Row>
            <Row><CommanderZone {...{player, playerRef, playerNumber, gameState}} /></Row>
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
  gameState: PropTypes.object.isRequired,
}
