import PropTypes from "prop-types";
import Row from "react-bootstrap/Row";
import { LogFrame, AnnouncementFrame } from "./LogFrame";
import { CardListZone } from "./CardListZone";
import { TabIndices } from "../commons/Player";

import "./gameStateBoard.css";

export const GameStateBoard = ({ gameState, playerRef }) => {
  return (
    <div className="game-state-board">
      <div>
        {gameState.focus_card ? (
          <>
            <Row>
              <h2
                style={{
                  fontSize: "1.5vw",
                  whiteSpace: "nowrap",
                  overflow: "visible",
                  textOverflow: "ellipsis",
                }}
              >
                {gameState.focus_card.card_name}{" "}
                {gameState.focus_card.card_mana_cost}
              </h2>
            </Row>
            <Row>
              <img
                src={gameState.focus_card.card_image_uris.normal}
                alt={gameState.focus_card.card_name}
                style={{ width: "100%" }}
              />
            </Row>
            <Row>
              <p>{gameState.focus_card.card_type_line}</p>
            </Row>
            <Row>
              <p>{gameState.focus_card.card_read_oracle_text}</p>
            </Row>
            <Row>
              <p>{gameState.focus_card.power_toughness}</p>
            </Row>
          </>
        ) : null}
      </div>
      <CardListZone
        gameState={gameState}
        playerRef={playerRef}
        tabIndex={TabIndices}
      />
      <AnnouncementFrame gameState={gameState} />
      <LogFrame gameState={gameState} playerRef={playerRef.log} />
    </div>
  );
};

GameStateBoard.propTypes = {
  gameState: PropTypes.object.isRequired,
  playerRef: PropTypes.object.isRequired,
};

const CardDetail = ({ gameState }) => {
  return (
    <div>
      {gameState.focus_card ? (
        <>
          <Row>
            <h2
              style={{
                fontSize: "1.5vw",
                whiteSpace: "nowrap",
                overflow: "visible",
                textOverflow: "ellipsis",
              }}
            >
              {gameState.focus_card.card_name}{" "}
              {gameState.focus_card.card_mana_cost}
            </h2>
          </Row>
          <Row>
            <img
              src={gameState.focus_card.card_image_uris.normal}
              alt={gameState.focus_card.card_name}
              style={{ width: "100%" }}
            />
          </Row>
          <Row>
            <p>{gameState.focus_card.card_type_line}</p>
          </Row>
          <Row>
            <p>{gameState.focus_card.card_read_oracle_text}</p>
          </Row>
          <Row>
            <p>{gameState.focus_card.power_toughness}</p>
          </Row>
        </>
      ) : null}
    </div>
  );
};

CardDetail.propTypes = {
  gameState: PropTypes.object.isRequired,
};