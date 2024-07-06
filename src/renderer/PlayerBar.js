import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import style from "styled-components";
import Row from "react-bootstrap/Row";
import { Library } from "./Library";
import { Graveyard, Exile, FaceDown, CommanderZone } from "./Zones";
import { OppExile, OppFaceDown, OppGraveyard, OppLibrary, OppCommanderZone, OppPlayerHandZone } from "./OpponentZones";
import { PlayerHandZone } from "./PlayerHandZone";

import "./playerBar.css";

const PlayerContainer = style.div`
  max-width: 180px;
  background: #ddda;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  text-align: left;
  overflow: hidden;
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
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    setCounter(value);
  }, [value]);

  return (
    <div>
      <CounterSphere color={color} aria-describedby={aria_description} onClick={onClick} onContextMenu={onContextMenu}>
        {counter}
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
  const [poisonCounters, setPoisonCounter] = useState(player.counters?.["poison"] ?? 0);
  const [energyCounters, setEnergyCounter] = useState(player.counters?.["energy"] ?? 0);
  const [otherCounters, setOtherCounter] = useState(player.counters?.["other"] ?? 0);
  
  useEffect(() => {
    setPoisonCounter(player.counters?.["poison"] ?? 0);
    setEnergyCounter(player.counters?.["energy"] ?? 0);
    setOtherCounter(player.counters?.["other"] ?? 0);
  }, [player]);
  
  const handleChangeCounters = (counterName, value) => {
    if (player.id === gameState.player.id) {
      if (player.counters[counterName] === undefined) {
        player.counters[counterName] = 0;
      }
      
      player.counters[counterName] += value;

      if (counterName === "poison") {
        setPoisonCounter(player.counters[counterName]);
      }
      if (counterName === "energy") {
        setEnergyCounter(player.counters[counterName]);
      }
      if (counterName === "other") {
        setOtherCounter(player.counters[counterName]);
      }

      const selectedSound = value > 0 ? "ADD_COUNTER_SOUND" : "REMOVE_COUNTER_SOUND";
      gameState.updatePlayer(selectedSound);
    }
  };

  return (
    <PlayerContainer
      aria-label={
`${player.name} ${isActivePlayer ? "active player" : ""} / ${player.health} life, 
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
          <p>
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


export const OpponentBar = ({
  player,
  playerRef,
  isActivePlayer,
  playerNumber,
  gameState,
}) => {
  const [poisonCounters, setPoisonCounter] = useState(player.counters?.["poison"] ?? 0);
  const [energyCounters, setEnergyCounter] = useState(player.counters?.["energy"] ?? 0);
  const [otherCounters, setOtherCounter] = useState(player.counters?.["other"] ?? 0);
  
  useEffect(() => {
    setPoisonCounter(player.counters?.["poison"] ?? 0);
    setEnergyCounter(player.counters?.["energy"] ?? 0);
    setOtherCounter(player.counters?.["other"] ?? 0);
  }, [player]);

  return (
    <PlayerContainer
      role="region"
      aria-label={
`${player.name} ${isActivePlayer ? "active player" : ""}
${player.health} life, 
${poisonCounters > 0 ? poisonCounters + " poison,\n" : ""}${energyCounters > 0 ? energyCounters + " energy,\n" : ""}${otherCounters > 0 ? otherCounters + " other counter,\n" : ""}${player.hand.length} in hand,
${player.graveyard.length} in graveyard,
${player.library.length} in library,
${player.commander_zone.length} in command,
${player.exile.length} in exile,
${player.faceDown.length} face down.`}
      // tabIndex={100000 * playerNumber + 1}
      ref={playerRef.playerStats}
      tabIndex={player.tabIndices.playerStats}
      // ref={(el)=> playerRef.playerStats = el}
    >
      <div className="player-bar">
        <div className="player-counters">
          <PlayerAvatarImg src={player.avatar} alt={player.name} />
          <Row>
            <GenericCounter
              value={player.counters?.["poison"] ?? 0}
              color={"green"}
              aria_description={`${player.counters?.["poison"] ?? 0} poison`}
            />
          </Row>
          <Row>
            <GenericCounter
              value={player.counters?.["energy"] ?? 0}
              color={"blue"}
              aria_description={`${player.counters?.["energy"] ?? 0} energy`}
            />
          </Row>
          <Row>
            <GenericCounter
              value={player.counters?.["other"] ?? 0}
              color={"grey"}
              aria_description={`${player.counters?.["other"] ?? 0} other`}
            />
          </Row>
        </div>
        
        <div className="player-actions">
          <PlayerName>{player.name}</PlayerName>
          <PlayerHealthBox>{player.health}</PlayerHealthBox>
          <br />
          <OppPlayerHandZone {...{player, tabIndex: 100000 * playerNumber + 11, gameState}} />
          <OppLibrary {...{player, tabIndex: 100000 * playerNumber + 12, gameState}} />
          <OppGraveyard {...{player, tabIndex: 100000 * playerNumber + 13, gameState}} />
          <OppExile {...{player, tabIndex: 100000 * playerNumber + 14, gameState}} />
          <OppFaceDown {...{player, tabIndex: 100000 * playerNumber + 15, gameState}} />
          <OppCommanderZone {...{player, tabIndex: 100000 * playerNumber + 16, gameState}} />
        </div>
      </div>
    </PlayerContainer>
  );
};

OpponentBar.propTypes = {
  player: PropTypes.object.isRequired,
  playerRef: PropTypes.object.isRequired,
  isActivePlayer: PropTypes.bool.isRequired,
  playerNumber: PropTypes.number.isRequired,
  gameState: PropTypes.object.isRequired,
};
