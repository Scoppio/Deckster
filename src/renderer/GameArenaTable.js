import { useEffect, useState } from "react";
import { NorthTable, SouthTable } from "./PlayerTable";

import "./gameArenaTable.css";

import PropTypes from "prop-types";

export function GameArenaTable({ gameState, handleChangeGameState,  player1References, player2References, player3References, player4References, player5References, player6References}) {
  const playerReferences = [player2References, player3References, player4References, player5References, player6References];
  const [numberOfTables, setNumberOfTables] = useState(1);

  useEffect(() => {
    setNumberOfTables(gameState.players.length);
  }, [gameState]);
    
  const barSide = ( index ) => {
    if (numberOfTables >= 5) {
      if (index < 3) {
        return "left";
      }
      else {
        return "right";
      }
    }
    if (numberOfTables >= 3) {
      if (index < 2) {
        return "left";
      }
      else {
        return "right";
      }
    }
    return "left";
  };

  function determineLayoutClass(playerCount) {
    if (playerCount === 1) return "one-rows-one-column";
    if (playerCount === 2) return "two-rows-one-column";
    if (playerCount <= 4) return "two-rows-two-columns";
    return "three-rows-two-columns";
  }
  
  function getPlayerReference(playerId, index, playersSequence) {
    if (playerId === gameState.player.id) {
      return player1References;
    } else {
      // Calculate the correct index for playerReferences
      const adjustedIndex = playersSequence.slice(0, index).filter(p => p.id !== gameState.player.id).length;
      return playerReferences[adjustedIndex];
    }
  }

  return (
    <div className={`main-arena  ${determineLayoutClass(gameState.players_sequence.length)}`}>
      {gameState.players_sequence.map((player, index) => {
        const playerRef = getPlayerReference(player.id, index, gameState.players_sequence);
        
        if (player.id === gameState.player.id) {
          return (
            <SouthTable
              barSide={barSide(index + 1)}
              gameState={gameState}
              playerRef={playerRef}
              playerNumber={player.id}
              player={player}
              isActivePlayer={gameState.isActivePlayer}
              handleChangeGameState={handleChangeGameState}
              key={player.id}
            />
          );
        } else {
          return (
            <NorthTable
              barSide={barSide(index + 1)}
              gameState={gameState}
              playerRef={playerRef}
              playerNumber={player.id}
              player={player}
              isActivePlayer={player.id === gameState.active_player_id}
              key={player.id}
              reversed={true}
            />
          );
        }
    })}
    {/* Conditionally render an empty table if the number of tables is odd */}
    {((gameState.players_sequence.length) % 2 !== 0) && (
      <div/>
    )} 
    </div>
  );
}


GameArenaTable.propTypes = {
  gameState: PropTypes.object.isRequired,
  handleChangeGameState: PropTypes.func.isRequired,
  player1References: PropTypes.object.isRequired,
  player2References: PropTypes.object.isRequired,
  player3References: PropTypes.object.isRequired,
  player4References: PropTypes.object.isRequired,
  player5References: PropTypes.object.isRequired,
  player6References: PropTypes.object.isRequired,
};
