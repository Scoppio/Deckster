import { Battlefield, StaticBattlefield } from "./Battlefield";
import { PlayerBar } from "./PlayerBar";
import { Hand, HiddenHand } from "./Hand";
import { DragDropContext } from "react-beautiful-dnd";
import PropTypes from "prop-types";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import "./playerTable.css";
import classNames from "classnames";

export const SouthTable = ({
  gameState,
  playerRef,
  playerNumber,
  player,
  isActivePlayer,
  heightVh,
}) => {
  const onDragStart = (start, provided) => {
    const { source } = start;
    gameState.getCardFrom(source);
  };

  const onDragEnd = (result, provided) => {
    const { source, destination } = result;
    const sourceZone = source.droppableId;
    let sourceName = sourceZone.split("-")[1];

    if (result.reason === "CANCEL") {
      provided.announce(
        `Cancelling card movement, returning card to ${sourceName}`
      );
      gameState.cancelCardMove();
      return;
    }
    if (result.reason === "DROP") {
      if (destination === null) {
        provided.announce(
          `Dropped in an invalid location, returning card to ${sourceName}`
        );
        gameState.cancelCardMove();
        return;
      }

      const destinationZone = destination.droppableId;
      const card = gameState.moveCardTo(source, destination);
      provided.announce(
        "Moved " + card.name + " from " + sourceName + " to " + destinationZone
      );
    }
  };

  const handHeightVh = heightVh * 0.17;
  const battlefieldHeight = heightVh * 0.8;

  return (
    <div className="col flex-fill d-flex flex-column">
      <Row>
        <Col md="auto">
          <PlayerBar
            {...{
              player,
              playerRef,
              playerNumber,
              isActivePlayer,
              heightVh,
              gameState,
            }}
          />
        </Col>
        <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
          <Col style={{ overflowX: "auto" }}>
            <Row style={{ height: `${battlefieldHeight}vh` }}>
              <Battlefield
                gameState={gameState}
                playerRef={playerRef}
                playerNumber={playerNumber}
                player={player}
                heightVh={battlefieldHeight}
              />
            </Row>
            <Row style={{ height: `${handHeightVh}vh` }}>
              <Hand
                gameState={gameState}
                player={player}
                playerRef={playerRef}
                playerNumber={playerNumber}
                handVh={handHeightVh}
              />
            </Row>
          </Col>
        </DragDropContext>
      </Row>
    </div>
  );
};

SouthTable.propTypes = {
  gameState: PropTypes.object.isRequired,
  playerRef: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
  player: PropTypes.object.isRequired,
  isActivePlayer: PropTypes.bool.isRequired,
  heightVh: PropTypes.number.isRequired,
};

export const NorthTable = ({
  gameState,
  playerRef,
  playerNumber,
  player,
  isActivePlayer,
  barSide,
  landsOnNorth,
  heightVh,
}) => {
  const handVh = heightVh * 0.2;
  const battlefieldVh = heightVh * 0.8;

  const PlayerBarRenderer = (
    <PlayerBar
      player={player}
      playerRef={playerRef}
      playerNumber={playerNumber}
      isActivePlayer={isActivePlayer}
      gameState={gameState}
    />
  );

  return (
    <div
      className={classNames("player-table", {
        "player-table-right": barSide === "right",
      })}
    >
      {barSide === "left" ? PlayerBarRenderer : null}
      <Col>
        {landsOnNorth ? (
          <Row style={{ background: "grey" }}>
            <Col>
              <HiddenHand
                player={player}
                playerNumber={playerNumber}
                handVh={handVh}
              />
            </Col>
          </Row>
        ) : null}
        <Row style={{ background: "gold" }}>
          <StaticBattlefield
            gameState={gameState}
            playerRef={playerRef}
            playerNumber={playerNumber}
            player={player}
            landsOnNorth={landsOnNorth}
            heightVh={battlefieldVh}
          />
        </Row>
        {!landsOnNorth ? (
          <Row style={{ background: "grey" }}>
            <Col>
              <HiddenHand
                player={player}
                playerNumber={playerNumber}
                handVh={handVh}
              />
            </Col>
          </Row>
        ) : null}
      </Col>
      {barSide === "right" ? PlayerBarRenderer : null}
    </div>
  );
};

NorthTable.propTypes = {
  gameState: PropTypes.object.isRequired,
  playerRef: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
  player: PropTypes.object.isRequired,
  isActivePlayer: PropTypes.bool.isRequired,
  barSide: PropTypes.string.isRequired,
  landsOnNorth: PropTypes.bool.isRequired,
  heightVh: PropTypes.number.isRequired,
};
