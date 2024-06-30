import Dropdown from "react-bootstrap/Dropdown";
import PropTypes from "prop-types";
import DropdownMenuPortal from "../commons/DropdownMenuPortal";

const Zone = ({ zoneName, player, ariaLabel, tabIndex }) => (
  <>
  <div
    aria-label={ariaLabel}
    style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '3px' }}
  >
    <Dropdown autoClose="outside">
      <Dropdown.Toggle
        variant="secondary"
        id="dropdown-autoclose-outside"
        tabIndex={tabIndex}
        size="sm"
      >
        <span id>{zoneName === 'commander_zone' ? 'commander' : zoneName}</span>
      </Dropdown.Toggle>
      <DropdownMenuPortal>
        {(zoneName !== "faceDown" || zoneName !== "library") && (<Dropdown.Item href="#/action-1">View all cards</Dropdown.Item>)}
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

export const OppLibrary = ({ player, tabIndex }) => (
  <Zone zoneName="library" player={player} tabIndex={tabIndex} ariaLabel={player.name + "'s library has " + player["library"].length + " cards" + (player.reveal_top_of_library ? ", the top card is " + player["library"][0].name : "")} />
);

export const OppGraveyard = ({ player, tabIndex }) => (
  <Zone zoneName="graveyard" player={player} tabIndex={tabIndex} ariaLabel={player.name + "'s graveyard has " + player["graveyard"].length + " cards"} />
);

export const OppExile = ({ player, tabIndex }) => (
  <Zone zoneName="exile" player={player} tabIndex={tabIndex} ariaLabel={player.name + "'s exile zone has " + player["exile"].length + " cards"} />
);

export const OppFaceDown = ({ player, tabIndex }) => (
  <Zone zoneName="faceDown" player={player} tabIndex={tabIndex} ariaLabel={player.name + "'s face down zone has " + player["faceDown"].length + " cards"} />
);

export const OppCommanderZone = ({ player, tabIndex }) => (
  <Zone zoneName="commander_zone" player={player} tabIndex={tabIndex} ariaLabel={player.name + "'s commander zone has " + player["commander_zone"].length + " cards, commander tax is " + player.commander_extra_casting_cost + " mana."} />
);

export const OppPlayerHandZone = ({ player, tabIndex }) => (
  <Zone zoneName="hand" player={player} tabIndex={tabIndex} ariaLabel={player.name + "'s hand has " + player["hand"].length + " cards"} />
);

OppLibrary.propTypes = {
  player: PropTypes.object.isRequired,
};

OppPlayerHandZone.propTypes = {
  player: PropTypes.object.isRequired,
};

Zone.propTypes = {
  zoneName: PropTypes.string.isRequired,
  player: PropTypes.object.isRequired,
};

OppGraveyard.propTypes = {
  player: PropTypes.object.isRequired,
};

OppExile.propTypes = {
  player: PropTypes.object.isRequired,
};

OppFaceDown.propTypes = {
  player: PropTypes.object.isRequired,
};

OppCommanderZone.propTypes = {
  player: PropTypes.object.isRequired,
};
