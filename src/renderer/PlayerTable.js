import React, { useEffect } from "react";
import { Battlefield, StaticBattlefield } from "./Battlefield";
import { PlayerBar } from "./PlayerBar";
import { Hand, HiddenHand } from "./Hand";
import { DragDropContext } from "react-beautiful-dnd";
import PropTypes from "prop-types";
import Container from "react-bootstrap/Container";
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
}) => {
  const onDragStart = (start, provided) => {
    const { source } = start;
    const card = gameState.getCardFrom(source);
    const sourceZone = source.droppableId;
    let sourceName = sourceZone.split("-")[1] || sourceZone;
    card &&
      provided.announce(
        "You lifted " +
          card.name +
          " in " +
          sourceName +
          "at position " +
          source.index
      );
  };

  const onDragEnd = (result, provided) => {
    const { source, destination } = result;
    const sourceZone = source.droppableId;
    let sourceName = sourceZone.split("-")[1] || sourceZone;

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
        "Moved " +
          card.name +
          " from " +
          sourceName +
          " to " +
          destinationZone +
          " at position " +
          destination.index
      );
    }
  };

  const onDragUpdate = (update, provided) => {
    console.log(update);
    const { destination } = update;
    if (destination !== null) {
      const destinationZone = destination.droppableId;
      provided.announce(destinationZone + " at position " + destination.index);
    }
  };

  useEffect(() => {
    function findNextNonEmptyZoneIndex(
      zones,
      cardPerZone,
      currentZoneIndex,
      direction
    ) {
      const nextZoneIndex = currentZoneIndex + direction;
      if (nextZoneIndex < 0 || nextZoneIndex >= zones.length) {
        return -1;
      }
      if (cardPerZone[zones[nextZoneIndex]].length > 0) {
        return nextZoneIndex;
      }
      return findNextNonEmptyZoneIndex(
        zones,
        cardPerZone,
        nextZoneIndex,
        direction
      );
    }

    const handleKeyDown = (event) => {
      const focusedElement = document.activeElement;
      if (!focusedElement || !focusedElement.className.includes("ImgCard")) {
        return;
      }

      const zones = [
        "front_battlefield",
        "back_battlefield",
        "land_zone_battlefield",
        "hand_zone",
      ];
      const battlefieldZones = [
        "front_battlefield",
        "back_battlefield",
        "land_zone_battlefield",
      ];
      const zonesByName = {
        front_battlefield: "front",
        back_battlefield: "back",
        land_zone_battlefield: "land",
        hand_zone: "hand",
      };

      const cardPerZone = {};
      const reverseCardIndexZoneMap = {};
      let accumulator = 0;
      zones.forEach((zone) => {
        const selector = zone === "hand_zone" ? `.${zone}` : `.${zone}.ImgCard`;
        cardPerZone[zone] = Array.from(document.querySelectorAll(selector));
        for (let i = 0; i < cardPerZone[zone].length; i++) {
          reverseCardIndexZoneMap[accumulator++] = zone;
        }
      });

      const cards = Array.from(document.querySelectorAll(".ImgCard"));
      const handCards = Array.from(
        document.querySelectorAll(".hand_zone.ImgCardHand")
      );
      cards.push(...handCards);

      const currentZone = zones.find((zone) =>
        focusedElement.className.includes(zone)
      );
      let currentZoneIndex = zones.findIndex((zone) => zone === currentZone);
      let currentCardIndex = cards.findIndex((card) => card === focusedElement);

      if (["ArrowLeft", "ArrowRight"].includes(event.key)) {
        if (currentCardIndex === -1) {
          return;
        }
        let cardIndex = currentCardIndex;
        if (event.key === "ArrowLeft" && currentCardIndex > 0) {
          cardIndex -= 1;
        } else if (
          event.key === "ArrowRight" &&
          currentCardIndex < cards.length - 1
        ) {
          cardIndex += 1;
        } else {
          return;
        }

        const nextZone = reverseCardIndexZoneMap[cardIndex];
        if (
          (nextZone === "hand_zone" && currentZone !== "hand_zone") ||
          (nextZone !== "hand_zone" && currentZone === "hand_zone")
        ) {
          return;
        }
        cards[cardIndex].focus();

        const f = document.activeElement;
        const cardIdx = cardPerZone[nextZone].findIndex(
          (card) => card.attributes.uniqueid === f.attributes.uniqueid
        );
        gameState.focusOnCard(gameState.player[nextZone][cardIdx]);
        if (currentZone !== nextZone) {
          gameState.announce(`${zonesByName[nextZone]} lane`);
        }
      } else if (["ArrowUp", "ArrowDown"].includes(event.key)) {
        if (currentZoneIndex === -1 || currentZone === "hand_zone") {
          return;
        }
        const direction = event.key === "ArrowUp" ? -1 : 1;

        const nextZoneIndex = findNextNonEmptyZoneIndex(
          battlefieldZones,
          cardPerZone,
          currentZoneIndex,
          direction
        );
        if (nextZoneIndex !== -1) {
          const nextZone = zones[nextZoneIndex];
          const cardsInNextZone = cards.filter((card) =>
            card.closest(`.${nextZone}.ImgCard`)
          );
          const firstCardInNextZone = cardsInNextZone[0];
          const currentIndexOnZone = cardPerZone[currentZone].findIndex(
            (card) => card === focusedElement
          );
          firstCardInNextZone && firstCardInNextZone.focus();
          gameState.focusOnCard(gameState.player[nextZone][0]);
          if (currentIndexOnZone !== nextZoneIndex) {
            gameState.announce(`${zonesByName[nextZone]} lane`);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameState]);

  // return (
  //   <div
  //     className={classNames("player-table", {
  //       "player-table-right": barSide === "right",
  //     })}
  //   >
  //     {barSide === "left" ? PlayerBarRenderer : null}
  //     <Col>
  //       {landsOnNorth ? (
  //         <Row style={{ background: "grey" }}>
  //           <HiddenHand player={player} playerNumber={playerNumber} />
  //         </Row>
  //       ) : null}
  //       <Row style={{ background: "gold" }}>
  //         <StaticBattlefield
  //           gameState={gameState}
  //           playerRef={playerRef}
  //           playerNumber={playerNumber}
  //           player={player}
  //           landsOnNorth={landsOnNorth}
  //         />
  //       </Row>
  //       {!landsOnNorth ? (
  //         <Row style={{ background: "grey" }}>
  //           <HiddenHand player={player} playerNumber={playerNumber} />
  //         </Row>
  //       ) : null}
  //     </Col>
  //     {barSide === "right" ? PlayerBarRenderer : null}
  //   </div>
  // );

  return (
    <div className={classNames("player-table")}>
      <PlayerBar
        {...{
          player,
          playerRef,
          playerNumber,
          isActivePlayer,
          gameState,
        }}
      />
      <DragDropContext
        onDragEnd={onDragEnd}
        onDragUpdate={onDragUpdate}
        onDragStart={onDragStart}
      >
        <div className="player-table-arena-south">
          <Battlefield
            gameState={gameState}
            playerRef={playerRef}
            playerNumber={playerNumber}
            player={player}
          />

          <Hand
            gameState={gameState}
            player={player}
            playerRef={playerRef}
            playerNumber={playerNumber}
          />
        </div>
      </DragDropContext>
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
}) => {
  return (
    <div
      className={classNames("player-table", {
        "player-table-right": barSide === "right",
      })}
    >
      <PlayerBar
        player={player}
        playerRef={playerRef}
        playerNumber={playerNumber}
        isActivePlayer={isActivePlayer}
        gameState={gameState}
      />
      <div className="player-table-arena-north">
        <HiddenHand player={player} playerNumber={playerNumber} />
        <StaticBattlefield
          gameState={gameState}
          playerRef={playerRef}
          playerNumber={playerNumber}
          player={player}
          landsOnNorth={landsOnNorth}
        />
      </div>
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
