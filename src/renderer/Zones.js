import Dropdown from "react-bootstrap/Dropdown";
import PropTypes from "prop-types";
import DropdownMenuPortal from "../commons/DropdownMenuPortal";

const gameZones = [
  "battlefield",
  "hand",
  "library",
  "graveyard",
  "exile",
  "faceDown",
  "commander_zone",
];
const gamezoneNames = [
  "Battlefield",
  "Hand",
  "Library",
  "Graveyard",
  "Exile",
  "Face Down",
  "Commander Zone",
];

const Zone = ({ gameState, zoneName, player, playerRef }) => {
  const zone_name = zoneName;
  const viewZone = () => {
    console.log("viewing commander zone");
    gameState.viewZone(zone_name);
  };

  return (
    <div
      className={zoneName}
      role="region"
      aria-label={player.name + "'s " + zoneName + ", " + player[zoneName].length + "cards"}
      style={{ display: 'flex', alignItems: 'center', marginTop: '3px' }}
    >
      <Dropdown autoClose="outside">
        <Dropdown.Toggle
          variant="secondary"
          id="dropdown-autoclose-outside"
          ref={playerRef[zoneName]}
          tabIndex={player.tabIndices[zoneName]}
          size="sm"
        >
          <span style={{fontSize: "12px"}}>{zoneName}</span>
        </Dropdown.Toggle>
        <DropdownMenuPortal>
          <Dropdown.Item onClick={viewZone}>View all cards</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Divider />
          {
            // for each zone that is not zoneName
            gameZones
              .map((gameZone, index) => {
                if (gameZone === zoneName) {
                  return null;
                }
                return (
                  <Dropdown.Item href={"#/" + gameZone} key={index}>
                    {gamezoneNames[index]}, Move all cards to{" "}
                  </Dropdown.Item>
                );
              })
              .filter(Boolean)
          }
        </DropdownMenuPortal>
      </Dropdown>
      <span>({player[zoneName].length})</span>
    </div>
  );
};

const TheCommanderZone = ({
  gameState,
  zoneName,
  player,
  playerRef,
  playerNumber,
}) => {
  const viewZone = () => {
    console.log("viewing commander zone");
    gameState.viewZone("commander_zone");
  };

  const changeCmdrTax = (value) => {
    console.log("changing commander tax by " + value);
    gameState.player.commander_extra_casting_cost += value;
    gameState.updatePlayer("CHANGE_COMMANDER_TAX");
  };

  return (
    <div
      className={zoneName}
      role="region"
      aria-labelledby={playerNumber + "-" + zoneName + "-label"}
      aria-describedby={playerNumber + "-" + zoneName + "-desc"}
      style={{ display: 'flex', alignItems: 'center', marginTop: '3px' }}
    >
      <Dropdown autoClose="outside">
        <Dropdown.Toggle
          variant="secondary"
          id="dropdown-autoclose-outside"
          ref={playerRef[zoneName]}
          tabIndex={player.tabIndices[zoneName]}
          size="sm"
        >
          <span id={playerNumber + "-" + zoneName + "-label"}>commander</span>
        </Dropdown.Toggle>
        <DropdownMenuPortal>
          <Dropdown.Item onClick={viewZone}>View all cards</Dropdown.Item>
          <Dropdown.Item>
            Commander casting cost: {player.commander_extra_casting_cost}
          </Dropdown.Item>
          <Dropdown.Item onClick={() => (changeCmdrTax(2))}>Increase commander casting cost by 2</Dropdown.Item>
          <Dropdown.Item onClick={() => (changeCmdrTax(-2))}>Decrease commander casting cost by 2</Dropdown.Item>
          <Dropdown.Divider />
          {
            // for each zone that is not zoneName
            gameZones
              .map((gameZone, index) => {
                if (gameZone === zoneName) {
                  return null;
                }
                return (
                  <Dropdown.Item href={"#/" + gameZone} key={index}>
                    Move all cards to {gamezoneNames[index]}
                  </Dropdown.Item>
                );
              })
              .filter(Boolean)
          }
        </DropdownMenuPortal> 
      </Dropdown>
      <span>({player[zoneName].length})</span>
    </div>
  );
};

export const Graveyard = ({ gameState, player, playerRef, playerNumber }) => (
  <Zone
    zoneName="graveyard"
    {...{ gameState, player, playerRef, playerNumber }}
  />
);

export const Exile = ({ gameState, player, playerRef, playerNumber }) => (
  <Zone zoneName="exile" {...{ gameState, player, playerRef, playerNumber }} />
);

export const FaceDown = ({ gameState, player, playerRef, playerNumber }) => (
  <Zone
    zoneName="faceDown"
    {...{ gameState, player, playerRef, playerNumber }}
  />
);

export const CommanderZone = ({
  gameState,
  player,
  playerRef,
  playerNumber,
  
}) => (
  <TheCommanderZone
    zoneName="commander_zone"
    {...{ gameState, player, playerRef, playerNumber }}
  />
);

export const PlayerHandZone = ({
  gameState,
  player,
  playerRef,
  playerNumber,
}) => (
  <Zone zoneName="hand" {...{ gameState, player, playerRef, playerNumber }} />
);

PlayerHandZone.propTypes = {
  gameState: PropTypes.object.isRequired,
  player: PropTypes.object.isRequired,
  playerRef: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
};

Zone.propTypes = {
  gameState: PropTypes.object.isRequired,
  zoneName: PropTypes.string.isRequired,
  player: PropTypes.object.isRequired,
  playerRef: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
};

Graveyard.propTypes = {
  gameState: PropTypes.object.isRequired,
  player: PropTypes.object.isRequired,
  playerRef: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
};

Exile.propTypes = {
  gameState: PropTypes.object.isRequired,
  player: PropTypes.object.isRequired,
  playerRef: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
};

FaceDown.propTypes = {
  gameState: PropTypes.object.isRequired,
  player: PropTypes.object.isRequired,
  playerRef: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
};

CommanderZone.propTypes = {
  gameState: PropTypes.object.isRequired,
  player: PropTypes.object.isRequired,
  playerRef: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
};
