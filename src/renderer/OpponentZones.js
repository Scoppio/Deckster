import Dropdown from "react-bootstrap/Dropdown";
import PropTypes from "prop-types";
import DropdownMenuPortal from "../commons/DropdownMenuPortal";

const Zone = ({ zoneName, player, tabIndex, ariaLabel, gameState }) =>{ 
  
  const openZone = () => {
    gameState.viewZone(player, zoneName, true);
  };

  return (
    <>
      <div
        aria-label={ariaLabel}
        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '3px' }}
      >
        <Dropdown autoClose="outside" tabIndex={tabIndex}>
          <Dropdown.Toggle
            variant="secondary"
            id="dropdown-autoclose-outside"
            size="sm"
          >
            <span>{zoneName === 'commander_zone' ? 'commander' : zoneName}</span>
          </Dropdown.Toggle>
          <DropdownMenuPortal>
            {(zoneName !== "face_down" || zoneName !== "library") && (<Dropdown.Item onClick={openZone}>View all cards</Dropdown.Item>)}
            <Dropdown.Item>({player.library_size})</Dropdown.Item>
          </DropdownMenuPortal>
        </Dropdown>
        <span>({player[zoneName].length})</span>
      </div>
      {zoneName === "commander_zone" && (
        <p>
          Cmd Tax: {player.commander_extra_casting_cost}
        </p>
      )}
      {zoneName === "library" && player.reveal_top_of_library && (
            <p style={{ fontSize: '10px' ,overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>{player.library_size > 0 && player.library[0].name}</p>)}
    </>
  );
};

export const OppLibrary = ({ player, tabIndex, gameState }) => (
  <Zone zoneName="library" player={player} tabIndex={tabIndex} gameState={gameState} ariaLabel={player.name + "'s library has " + player["library"].length + " cards" + (player.reveal_top_of_library ? ", the top card is " + player["library"][0].name : "")} />
);

export const OppGraveyard = ({ player, tabIndex, gameState }) => (
  <Zone zoneName="graveyard" player={player} tabIndex={tabIndex} gameState={gameState} ariaLabel={player.name + "'s graveyard has " + player["graveyard"].length + " cards"} />
);

export const OppExile = ({ player, tabIndex, gameState }) => (
  <Zone zoneName="exile" player={player} tabIndex={tabIndex} gameState={gameState} ariaLabel={player.name + "'s exile zone has " + player["exile"].length + " cards"} />
);

export const OppFaceDown = ({ player, tabIndex, gameState }) => (
  <Zone zoneName="face_down" player={player} tabIndex={tabIndex} gameState={gameState} ariaLabel={player.name + "'s face down zone has " + player["face_down"].length + " cards"} />
);

export const OppCommanderZone = ({ player, tabIndex, gameState }) => (
  <Zone zoneName="commander_zone" player={player} tabIndex={tabIndex} gameState={gameState} ariaLabel={player.name + "'s commander zone has " + player["commander_zone"].length + " cards, commander tax is " + player.commander_extra_casting_cost + " mana."} />
);

export const OppPlayerHandZone = ({ player, tabIndex, gameState }) => (
  <Zone zoneName="hand" player={player} tabIndex={tabIndex} gameState={gameState} ariaLabel={player.name + "'s hand has " + player["hand"].length + " cards"} />
);

OppLibrary.propTypes = {
  player: PropTypes.object.isRequired,
  tabIndex: PropTypes.number.isRequired,
  gameState: PropTypes.object.isRequired,
};

OppPlayerHandZone.propTypes = {
  player: PropTypes.object.isRequired,
  tabIndex: PropTypes.number.isRequired,
  gameState: PropTypes.object.isRequired,
};

Zone.propTypes = {
  zoneName: PropTypes.string.isRequired,
  player: PropTypes.object.isRequired,
  ariaLabel: PropTypes.string.isRequired,
  tabIndex: PropTypes.number.isRequired,
  gameState: PropTypes.object.isRequired,
};

OppGraveyard.propTypes = {
  player: PropTypes.object.isRequired,
  tabIndex: PropTypes.number.isRequired,
  gameState: PropTypes.object.isRequired,
};

OppExile.propTypes = {
  player: PropTypes.object.isRequired,
  tabIndex: PropTypes.number.isRequired,
  gameState: PropTypes.object.isRequired,
};

OppFaceDown.propTypes = {
  player: PropTypes.object.isRequired,
  tabIndex: PropTypes.number.isRequired,
  gameState: PropTypes.object.isRequired,
};

OppCommanderZone.propTypes = {
  player: PropTypes.object.isRequired,
  tabIndex: PropTypes.number.isRequired,
  gameState: PropTypes.object.isRequired,
};
