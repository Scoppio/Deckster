import PropTypes from "prop-types";
import { LogFrame, AnnouncementFrame } from "./LogFrame";
import emptyCard from "../resources/cards/empty_card.png";

import "./gameStateBoard.css";

export const GameStateBoard = ({ gameState, focusCard, playerRef }) => {

  const game_phase_name = {
    0: "Untap Step",
    1: "Upkeep Step",
    2: "Draw Step",
    3: "Main Phase",
    4: "Beggining of Combat Step",
    5: "Declare Attackers Step",
    6: "Declare Blockers Step",
    7: "Combat Damage Step",
    8: "End of Combat Step",
    9: "Second Main Phase",
    10: "End Step",
    11: "Cleanup Step",
  };

  return (
    <div className="game-state-board">
      <div className="inner" 
        role="region"
        style={{ height: '4vh', display: 'flex', flexWrap: 'wrap', alignContent: 'center' }} tabIndex={0}
        aria-label={`Turn sequence: ${gameState.players_sequence.map((player, idx) => ((idx + 1) + "-" + player.name)).join(", ")}`} >
        {gameState.players_sequence.map((player, index) => (
            <div key={player.id} className="player-box">{`${index + 1} - ${player.name}`}</div>
        ))}
      </div>
      <div  style={{height: '2vh'}} tabIndex={0}>
      <p><b>{gameState.active_player?.name} :: {game_phase_name[gameState.game_phase]}</b></p>
      </div>
      <div style={{height: '69vh'}} tabIndex={0}>
      { !!focusCard?.card_name && 
        <>
            <h2
              style={{
                fontSize: "16px",
                textOverflow: "ellipsis",
                overflowWrap: "break-word",
                wordWrap: "break-word",
              }}
            >
              {focusCard.card_name}{" "}
              {focusCard.card_mana_cost}
            </h2>
            { !!focusCard.card_image_uris && <img
              src={focusCard.card_image_uris?.normal ?? emptyCard}
              alt={focusCard.card_image_description || focusCard.card_name}
              style={{maxWidth: "220px"}}
            />}
            <p style={{fontSize: "12px"}}><b>{focusCard.card_type_line}</b></p>
            <p style={{fontSize: "12px"}}>{focusCard.card_read_oracle_text}</p>
            <p>{focusCard.power_toughness}</p>
            <hr/>
            <p style={{fontSize: "12px"}}>{focusCard.art_description}</p>
        </>
      }
      </div>
      <div style={{height: '25vh'}}>
        <AnnouncementFrame gameState={gameState} />
        <LogFrame gameState={gameState} playerRef={playerRef} />
      </div>
    </div>
  );
};

GameStateBoard.propTypes = {
  gameState: PropTypes.object.isRequired,
  focusCard: PropTypes.object,
  playerRef: PropTypes.object.isRequired,
};
