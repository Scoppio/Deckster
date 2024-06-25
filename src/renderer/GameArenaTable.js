import { useEffect, useState } from "react";
import { NorthTable, SouthTable } from "./PlayerTable";

import "./gameArenaTable.css";

import PropTypes from "prop-types";

export function GameArenaTable({ gameState, player1References, player2References, player3References, player4References, player5References, player6References}) {
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

  const landsNorth = ( index ) => {
    if ((numberOfTables === 4 && index === 3) || (numberOfTables === 6 && index === 5)) {
      return false;
    }
    return true;
  };

  function determineLayoutClass(playerCount) {
    if (playerCount === 1) return "single-row";
    if (playerCount <= 3) return "two-rows";
    return "three-rows";
  }

  if (numberOfTables === 1) {
    return (
      <div className="main-arena">
      <SouthTable
        barSide={barSide(0)}
        gameState={gameState}
        playerRef={player1References}
        playerNumber={0}
        player={gameState.players[0]}
        isActivePlayer={gameState.activePlayer === 0}
      />
    </div>
    );
  } else {
    return (
      <div className={`main-arena  ${determineLayoutClass(gameState.players_sequence.length - 1)}`}>
        
        {/* Conditionally render an empty table if the number of tables is odd */}
        {((gameState.players_sequence.length) % 2 !== 0) && (
          <div/>
        )}

        {gameState.players_sequence.slice(1).map((player, index) => (
          <NorthTable
            barSide={barSide(index+1)}
            gameState={gameState}
            playerRef={playerReferences[index]}
            playerNumber={index+1}
            player={player}
            isActivePlayer={false}
            landsOnNorth={landsNorth(index+1)}
            key={player.id}
          />
        ))}
              
        <SouthTable
          barSide="left"
          gameState={gameState}
          playerRef={player1References}
          playerNumber={0}
          player={gameState.player}
          isActivePlayer={true}
        />
      </div>
    );
  }
}


GameArenaTable.propTypes = {
  gameState: PropTypes.object.isRequired,
  player1References: PropTypes.object.isRequired,
  player2References: PropTypes.object.isRequired,
  player3References: PropTypes.object.isRequired,
  player4References: PropTypes.object.isRequired,
  player5References: PropTypes.object.isRequired,
  player6References: PropTypes.object.isRequired,
};
