import Dropdown from 'react-bootstrap/Dropdown';
import PropTypes from 'prop-types';

const gameZones = ["battlefield", "hand", "library", "graveyard", "exile", "faceDown", "commanderZone"]
const gameZoneNames = ["Battlefield", "Hand", "Library", "Graveyard", "Exile", "Face Down", "Commander Zone"]

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
        <Dropdown.Item href="#/action-1">View all cards</Dropdown.Item>
        {
          zoneName === "commanderZone" && 
          <Dropdown.Item>Commander casting cost: {player.commanderExtraCastingCost}</Dropdown.Item> &&
          <Dropdown.Item>Increase commander casting cost by 2</Dropdown.Item> &&
          <Dropdown.Item>Decrease commander casting cost by 2</Dropdown.Item>
        }
        <Dropdown.Divider />
        {
          // for each zone that is not zoneName
          gameZones.map((gameZone, index) => {
            if (gameZone === zoneName) {
              return null;
            }
            return (
              <Dropdown.Item href={"#/" + gameZone}>Move all cards to {gameZoneNames[index]}</Dropdown.Item>
            );
          }).filter(Boolean)
        }

        
      </Dropdown.Menu>
    </Dropdown>
    <p id={playerNumber  + "-" + zoneName + "-desc"}>{player[zoneName].length} cards</p>
    {
      zoneName === "commanderZone" && 
        <p id={playerNumber + "-commander-casting-cost"}>Extra casting cost: {player.commanderExtraCastingCost}</p>
    }
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
  <Zone zoneName="commanderZone" player={player} playerRef={playerRef} playerNumber={playerNumber} />
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

