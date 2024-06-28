import PropTypes from "prop-types";
import { LogFrame, AnnouncementFrame } from "./LogFrame";
import emptyCard from "../resources/cards/empty_card.png";

import "./gameStateBoard.css";

export const GameStateBoard = ({ gameState, playerRef }) => {

  const game_phase_name = {
    0: "Main Phase",
    1: "Combat Phase",
    2: "Second Main Phase",
    3: "End Phase",
  };

  return (
    <div className="game-state-board">
      <div className="inner" style={{ height: '4vh', display: 'flex', flexWrap: 'wrap', alignContent: 'center' }} tabIndex={20000}>
        {gameState.players_sequence.map((player, index) => (
            <div key={player.id} className="player-box">{`${index + 1} - ${player.name}`}</div>
        ))}
      </div>
      <div style={{height: '71vh'}} tabIndex={20001}>
        <p >{gameState.active_player?.name}: {game_phase_name[gameState.game_phase]}</p>
        {gameState.focus_card ? (
          <>
              <h2
                style={{
                  fontSize: "16px",
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
                alt={gameState.focus_card.card_image_description || gameState.focus_card.card_name}
                style={{maxWidth: "220px"}}
              />
              <p style={{fontSize: "12px"}}><b>{gameState.focus_card.card_type_line}</b></p>
              <p style={{fontSize: "12px"}}>{gameState.focus_card.card_read_oracle_text}</p>
              <p>{gameState.focus_card.power_toughness}</p>
          </>
        ) : " "}
      </div>
      <div style={{height: '25vh'}} tabIndex={20002}>
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
