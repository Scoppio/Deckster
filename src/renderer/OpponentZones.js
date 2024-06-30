import { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import PropTypes from "prop-types";
import DropdownMenuPortal from "../commons/DropdownMenuPortal";

const Zone = ({ zoneName, player, playerNumber }) => (
  <div
    className={zoneName + " row"}
    role="region"
    aria-label={player.name + "'s " + zoneName + player[zoneName].length + " cards" + (zoneName === "commander_zone" ? ", commander tax currently is " + player.commander_extra_casting_cost + " mana." : "")}
  >
    <Dropdown autoClose="outside">
      <Dropdown.Toggle
        variant="secondary"
        id="dropdown-autoclose-outside"
        tabIndex={player.tabIndices[zoneName]}
        size="sm"
      >
        <span id>{zoneName}</span>
      </Dropdown.Toggle>
      <DropdownMenuPortal>
        {zoneName !== "faceDown" && (<Dropdown.Item href="#/action-1">View all cards</Dropdown.Item>)}
        <Dropdown.Item>{player.library_size} cards</Dropdown.Item>
      </DropdownMenuPortal>
    </Dropdown>
    <p>
      {player[zoneName].length} cards
    </p>
    {zoneName === "commander_zone" && (
      <p id={playerNumber + "-commander-casting-cost"}>
        Cmd Tax: {player.commander_extra_casting_cost}
      </p>
    )}
  </div>
);

export const OppLibrary = ({ player, playerNumber }) => {
  const [revealTopOfLibrary, setRevealTopOfLibrary] = useState(player.reveal_top_of_library);

  useEffect(() => { 
    setRevealTopOfLibrary(!!player.reveal_top_of_library);
  }, [player]);

  return (
  <div
    className={"library row"}
    aria-label={`${player.name}'s library with ${player.library_size} cards`} 
  >
    <Dropdown autoClose="outside">
      <Dropdown.Toggle
        variant="secondary"
        id="dropdown-autoclose-outside"
        tabIndex={player.tabIndices.library}
        size="sm"
      >
        <span style={{ fontSize: '12px'}}>{"Library"}</span>
      </Dropdown.Toggle>
      <DropdownMenuPortal>
        <Dropdown.Item>{player.library_size} cards</Dropdown.Item>
      </DropdownMenuPortal>
    </Dropdown>
    <span>({player.library_size})</span>
    {revealTopOfLibrary && (
         <p style={{ fontSize: '10px' ,overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>{player.library_size > 0 && player.library[0].name}</p>)}

  </div>
);
};

export const OppGraveyard = ({ player, playerNumber }) => (
  <Zone zoneName="graveyard" player={player} playerNumber={playerNumber} />
);

export const OppExile = ({ player, playerNumber }) => (
  <Zone zoneName="exile" player={player} playerNumber={playerNumber} />
);

export const OppFaceDown = ({ player, playerNumber }) => (
  <Zone zoneName="faceDown" player={player} playerNumber={playerNumber} />
);

export const Oppcommander_zone = ({ player, playerNumber }) => (
  <Zone zoneName="commander_zone" player={player} playerNumber={playerNumber} />
);

export const OppPlayerHandZone = ({ player, playerNumber }) => (
  <Zone zoneName="hand" player={player} playerNumber={playerNumber} />
);

OppLibrary.propTypes = {
  player: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
};

OppPlayerHandZone.propTypes = {
  player: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
};

Zone.propTypes = {
  zoneName: PropTypes.string.isRequired,
  player: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
};

OppGraveyard.propTypes = {
  player: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
};

OppExile.propTypes = {
  player: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
};

OppFaceDown.propTypes = {
  player: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
};

Oppcommander_zone.propTypes = {
  player: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
};
