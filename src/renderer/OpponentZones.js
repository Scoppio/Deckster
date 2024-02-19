import Dropdown from 'react-bootstrap/Dropdown';
import PropTypes from 'prop-types';

const Zone = ({ zoneName, player, playerNumber }) => (
  <div className={zoneName + " row"} 
    role="region"
    aria-labelledby={playerNumber + "-" + zoneName + "-label"}
    aria-describedby={playerNumber + "-" + zoneName + "-desc"}>
    <Dropdown autoClose="outside" >
      <Dropdown.Toggle 
        variant="secondary" 
        id="dropdown-autoclose-outside"
        tabIndex={player.tabIndices[zoneName]} size="sm">
        <span id={playerNumber + "-" + zoneName + "-label"}>{zoneName}</span>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item href="#/action-1">View all cards</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
    <p id={playerNumber  + "-" + zoneName + "-desc"}>{player[zoneName].length} cards</p>
    {
      zoneName === "commanderZone" && 
        <p id={playerNumber + "-commander-casting-cost"}>Extra casting cost: {player.commanderExtraCastingCost}</p>
    }
  </div>
)

export const OppLibrary = ({ player, playerNumber }) => (
  <div className={"library row"} 
    role="region"
    aria-labelledby={playerNumber + "-library-label"}
    aria-describedby={playerNumber + "-library-desc"}>
    <Dropdown autoClose="outside" >
      <Dropdown.Toggle 
        variant="secondary" 
        id="dropdown-autoclose-outside"
        tabIndex={player.tabIndices.library} size="sm">
        <span id={playerNumber + "-library-label"}>{"library"}</span>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item>{player.library_size} cards</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  </div>
)

export const OppGraveyard = ({ player, playerNumber }) => (
  <Zone zoneName="graveyard" player={player} playerNumber={playerNumber} />
)

export const OppExile = ({ player, playerNumber }) => (
  <Zone zoneName="exile" player={player} playerNumber={playerNumber} />
)

export const OppFaceDown = ({ player, playerNumber }) => (
  <Zone zoneName="faceDown" player={player} playerNumber={playerNumber} />
)

export const OppCommanderZone = ({ player, playerNumber }) => (
  <Zone zoneName="commanderZone" player={player} playerNumber={playerNumber} />
)

export const OppPlayerHandZone = ({ player, playerNumber }) => (
  <Zone zoneName="hand" player={player} playerNumber={playerNumber} />
)

OppLibrary.propTypes = {
  player: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
}

OppPlayerHandZone.propTypes = {
  player: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
}

Zone.propTypes = {
  zoneName: PropTypes.string.isRequired,
  player: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
}

OppGraveyard.propTypes = {
  player: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
}

OppExile.propTypes = {
  player: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
}

OppFaceDown.propTypes = {
  player: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
}

OppCommanderZone.propTypes = {
  player: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
}

