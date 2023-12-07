import Dropdown from 'react-bootstrap/Dropdown';
import PropTypes from 'prop-types';

const Zone = ({ zoneName, player, playerRef, playerNumber }) => (
  <div className={zoneName + " row"} 
    role="complementary"
    aria-labelledby={playerNumber + "-" + zoneName + "-label"}
    aria-describedby={playerNumber + "-" + zoneName + "-desc"}>
    <Dropdown>
      <Dropdown.Toggle variant="secondary" id="dropdown-basic" ref={playerRef[zoneName]} tabIndex={player.tabIndices[zoneName]}>
        <span id={playerNumber + "-" + zoneName + "-label"}>{zoneName}</span>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
        <Dropdown.Item href="#/action-3">Something else here</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
    {/* <h3 id={playerNumber + "-" + zoneName + "-label"}>{zoneName}</h3> */}
    <p id={playerNumber  + "-" + zoneName + "-desc"}>{player[zoneName].length} cards</p>
  </div>
)

export const Graveyard = ({ player, playerRef, playerNumber }) => (
  <Zone zoneName="graveyard" player={player} playerRef={playerRef} playerNumber={playerNumber} />
)

export const Exile = ({ player, playerRef, playerNumber }) => (
  <Zone zoneName="exile" player={player} playerRef={playerRef} playerNumber={playerNumber} />
)

export const FaceDown = ({ player, playerRef, playerNumber }) => (
  <Zone zoneName="faceDown" player={player} playerRef={playerRef} playerNumber={playerNumber} />
)

export const CommanderZone = ({ player, playerRef, playerNumber }) => (
  <div className="commander row" 
    role="complementary" 
    aria-labelledby={playerNumber + "-commander-label"} 
    aria-describedby={playerNumber + "-commander-desc " + playerNumber + "-commander-casting-cost"}>
    <Dropdown>
      <Dropdown.Toggle variant="secondary" id="dropdown-basic" 
      ref={playerRef.commanderZone} tabIndex={player.tabIndices.commanderZone}>
        <span id={playerNumber + "-commander-label"}>Commander Zone</span>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
        <Dropdown.Item href="#/action-3">Something else here</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
    <p id={playerNumber + "-commander-desc"}>{player.commanderZone.length} cards</p>
    <p id={playerNumber + "-commander-casting-cost"}>Extra casting cost: {player.commanderExtraCastingCost}</p>
  </div>
)

Zone.propTypes = {
  zoneName: PropTypes.string.isRequired,
  player: PropTypes.object.isRequired,
  playerRef: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
}

Graveyard.propTypes = {
  player: PropTypes.object.isRequired,
  playerRef: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
}

Exile.propTypes = {
  player: PropTypes.object.isRequired,
  playerRef: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
}

FaceDown.propTypes = {
  player: PropTypes.object.isRequired,
  playerRef: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
}

CommanderZone.propTypes = {
  player: PropTypes.object.isRequired,
  playerRef: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
}

