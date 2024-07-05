import PropTypes from "prop-types";
import { LogFrame, AnnouncementFrame } from "./LogFrame";
import emptyCard from "../resources/cards/empty_card.png";
// import { useState, useEffect } from "react";
import "./gameStateBoard.css";

export const GameStateBoard = ({ gameState, focusCard, playerRef }) => {

  // const [focusOnCard, setFocusCard] = useState(gameState.focus_card);
  // console.log("GameStateBoard:: Loading " + focusCard?.name + " card");
  // useEffect(() => {
  //   console.log("GameStateBoard:useEffect:: " + focusCard?.name + " card");
  //   setFocusCard(gameState.focus_card);
  // }, [gameState.focus_card]);

  const game_phase_name = {
    0: "Main Phase",
    1: "Combat Phase",
    2: "Second Main Phase",
    3: "End Phase",
  };

  return (
    <div className="game-state-board">
      <div className="inner" 
        role="region"
        style={{ height: '4vh', display: 'flex', flexWrap: 'wrap', alignContent: 'center' }} tabIndex={20000}
        aria-label={`Turn sequence: ${gameState.players_sequence.map((player, idx) => ((idx + 1) + "-" + player.name)).join(", ")}`} >
        {gameState.players_sequence.map((player, index) => (
            <div key={player.id} className="player-box">{`${index + 1} - ${player.name}`}</div>
        ))}
      </div>
      <div  style={{height: '2vh'}} tabIndex={20001}>
      <p><b>{gameState.active_player?.name} :: {game_phase_name[gameState.game_phase]}</b></p>
      </div>
      <div style={{height: '69vh'}} tabIndex={20001}>
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
        </>
      }
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
  focusCard: PropTypes.object.isRequired,
  playerRef: PropTypes.object.isRequired,
};
