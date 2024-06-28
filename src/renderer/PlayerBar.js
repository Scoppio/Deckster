import PropTypes from "prop-types";
import style from "styled-components";
import Row from "react-bootstrap/Row";
import { Library } from "./Library";
import { Graveyard, Exile, FaceDown, CommanderZone } from "./Zones";
import { PlayerHandZone } from "./PlayerHandZone";

import "./playerBar.css";

const PlayerContainer = style.div`
  min-width: 18c0px;
  background: #ddda;
  font-size: 12px;
`;

const PlayerAvatarImg = style.img`
  width: 30px;
  aspect-ratio: 1;
  object-fit: contain;
  border-radius: 50%;
  margin: 2px;
`;

const CounterSphere = style.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin: 2px;
  border: 5px;
  background: linear-gradient(white, ${(props) => props.color});
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
`;

const PlayerName = style.h2`
  font-size: 16px;
`;

const PlayerHealthBox = style.div`
  width: 100%;
  height: 20px;
  background: lightgray;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
`;

export const GenericCounter = ({ value, color, aria_description, onClick, onContextMenu }) => {
  return (
    <div>
      <CounterSphere color={color} aria-describedby={aria_description} onClick={onClick} onContextMenu={onContextMenu}>
        {value}
      </CounterSphere>
    </div>
  );
};

export const PlayerBar = ({
  player,
  playerRef,
  playerNumber,
  isActivePlayer,
  gameState,
  handleChangeGameState,
}) => {
  const poisonCounters = player.counters?.["poison"] ?? 0;
  const energyCounters = player.counters?.["energy"] ?? 0;
  const otherCounters = player.counters?.["other"] ?? 0;

  const handleChangeCounters = (counterName, value) => {
    if (player.id === gameState.player.id) {
      player.counters[counterName] += value;
      const selectedSound = value > 0 ? "ADD_COUNTER_SOUND" : "REMOVE_COUNTER_SOUND";
      gameState.updatePlayer(selectedSound);
    }
  };

  return (
    <PlayerContainer
      aria-label={`${player.name} ${isActivePlayer ? "active player" : ""} / ${
        player.health
      } life, 
        ${poisonCounters > 0 ? poisonCounters + " poison, " : ""}
        ${energyCounters > 0 ? energyCounters + " energy, " : ""}
        ${otherCounters > 0 ? otherCounters + " other counter, " : ""}
        ${player.hand.length} in hand,
        ${player.graveyard.length} in graveyard,
        ${player.library.length} in library,
        ${player.commander_zone.length} in command,
        ${player.exile.length} in exile,
        ${player.faceDown.length} face down.`}
      tabIndex={player.tabIndices.playerStats}
      ref={playerRef.playerStats}
    >
      <div className="player-bar">
        <div className="player-counters">
          <PlayerAvatarImg src={player.avatar} alt={player.name} />
          <Row>
            <GenericCounter
              value={poisonCounters}
              color={"green"}
              aria_description={`${poisonCounters} poison`}
              onContextMenu={() => {handleChangeCounters("poison", -1);}}
              onClick={() => {handleChangeCounters("poison", 1);}}
            />
          </Row>
          <Row>
            <GenericCounter
              value={energyCounters}
              color={"blue"}
              aria_description={`${energyCounters} energy`}
              onContextMenu={() => {handleChangeCounters("energy", -1);}}
              onClick={() => {handleChangeCounters("energy", 1);}}
            />
          </Row>
          <Row>
            <GenericCounter
              value={otherCounters}
              color={"grey"}
              aria_description={`${otherCounters} other`}
              onContextMenu={() => {handleChangeCounters("other", -1);}}
              onClick={() => {handleChangeCounters("other", 1);}}
            />
          </Row>
        </div>
        <div className="player-actions">
          <PlayerName>{player.name}</PlayerName>
          <PlayerHealthBox>{player.health}</PlayerHealthBox>
          <br />
          <PlayerHandZone {...{ player, playerRef, playerNumber, gameState }} />
          <Library {...{ player, playerRef, playerNumber, gameState, handleChangeGameState }} />
          <Graveyard {...{ player, playerRef, playerNumber, gameState, handleChangeGameState }} />
          <Exile {...{ player, playerRef, playerNumber, gameState, handleChangeGameState }} />
          <FaceDown {...{ player, playerRef, playerNumber, gameState, handleChangeGameState }} />
          <CommanderZone {...{ player, playerRef, playerNumber, gameState, handleChangeGameState }} />
          <p id={playerNumber + "-commander-casting-cost"}>
            Cmd Tax: {player.commander_extra_casting_cost}
          </p>
        </div>
      </div>
    </PlayerContainer>
  );
};

PlayerBar.propTypes = {
  player: PropTypes.object.isRequired,
  playerRef: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
  gameState: PropTypes.object.isRequired,
  handleChangeGameState: PropTypes.func.isRequired,
};

export const Avatar = ({ player, playerRef, playerNumber }) => (
  <div
    className="player-stats"
    role="region"
    tabIndex={player.tabIndices.playerStats}
    ref={playerRef.playerStats}
    aria-labelledby={playerNumber + "-player-name-label"}
    aria-describedby={
      playerNumber + "-health-desc " + playerNumber + "-counter-desc"
    }
  >
    <h2 id={playerNumber + "-player-name-label"}>{player.name}</h2>
    <div>
      <p id={playerNumber + "-health-desc"}>health {player.health},</p>
    </div>
    <div>
      <p id={playerNumber + "-counter-desc"}>counter {player.counter}</p>
    </div>
  </div>
);

Avatar.propTypes = {
  player: PropTypes.object.isRequired,
  playerRef: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
};
