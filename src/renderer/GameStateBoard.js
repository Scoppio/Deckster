import PropTypes from "prop-types";
import { LogFrame, AnnouncementFrame } from "./LogFrame";
import { CardListZone } from "./CardListZone";
import { TabIndices } from "../commons/Player";
import emptyCard from "../resources/cards/empty_card.png";

import "./gameStateBoard.css";

export const GameStateBoard = ({ gameState, playerRef }) => {
  return (
    <div className="game-state-board">
      <div style={{height: '67vh'}}>
        {gameState.focus_card ? (
          <>
              <h2
                style={{
                  fontSize: "1.0vw",
                  textOverflow: "ellipsis",
                  overflowWrap: "break-word",
                  wordWrap: "break-word",
                }}
              >
                {gameState.focus_card.card_name}{" "}
                {gameState.focus_card.card_mana_cost}
              </h2>
              <img
                src={gameState.focus_card.card_image_uris?.normal ?? emptyCard}
                alt={gameState.focus_card.card_name}
                style={{maxWidth: "220px"}}
              />
              <p>{gameState.focus_card.card_type_line}</p>
              <p style={{fontSize: "0.75vw"}}>{gameState.focus_card.card_read_oracle_text}</p>
              <p>{gameState.focus_card.power_toughness}</p>
          </>
        ) : " "}
      </div>
      <div style={{height: '33vh'}}>
        <AnnouncementFrame gameState={gameState} />
        <LogFrame gameState={gameState} playerRef={playerRef.log} height={30}/>
      </div>
    </div>
  );
};

GameStateBoard.propTypes = {
  gameState: PropTypes.object.isRequired,
  playerRef: PropTypes.object.isRequired,
};
