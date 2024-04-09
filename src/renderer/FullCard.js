import PropTypes from "prop-types";
import style from "styled-components";
import { Draggable } from "react-beautiful-dnd";
import emptyCard from "../resources/cards/empty_card.png";
import FuckedCardBack from "../resources/cards/mtgcardback.png";
import { useState } from "react";

const SlimContainer = style.div`
  position: relative;
  display: inline-block;
`;

const HiddenText = style.div`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
`;

const Counter = style.div`
  background-color: blue;
  border-radius: 25px;
  width: 25px;
  height: 25px;
  top: 10px;
  left: 10px;
  color: white;
  padding: 5px;
  border-radius: 5px;
  position: absolute;
`;

export const ImgCard = ({
  region,
  idx,
  gameState,
  card,
  size,
  tabIndex,
  cardHeight,
}) => {
  
  const [isTapped, setIsTapped] = useState(card.is_tapped);
  const [cardFace, setCardFace] = useState(card.card_face);
  const cardCurrentRegion = region;
  const positionIdx = idx;
  isTapped !== card.is_tapped && setIsTapped(card.is_tapped);
  cardFace !== card.card_face && setCardFace(card.card_face);

  const flipCard = () => {
    card.changeFace();
    setCardFace(card.card_face);
    gameState.updatePlayer("flip_card", 1.0);
    gameState.focusOnCard(card);
  };

  const tapCard = () => {
    card.tapped = !card.is_tapped;
    gameState.updatePlayer("tap_card", 1.0);
    setIsTapped(card.tapped);
    gameState.focusOnCard(card);
  };

  const onMouseOver = () => {
    gameState.focusOnCard(card);
  };

  const onMouseLeave = () => {
    gameState.focusOnCard(null);
  };

  const sendToGraveyard = () => {
    gameState.moveCardToZoneTop(cardCurrentRegion, positionIdx, "graveyard");
  };

  const sendToExile = () => {
    gameState.moveCardToZoneTop(cardCurrentRegion, positionIdx, "exile");
  };

  const addCounterPlusOnePlusOne = () => {
    gameState.changeCounter(cardCurrentRegion, positionIdx, 1, "+1/+1");
  };

  const addCounterMinusOneMinusOne = () => {
    gameState.changeCounter(cardCurrentRegion, positionIdx, -1, "-1/-1");
  };

  const addCounter = () => {
    gameState.changeCounter(cardCurrentRegion, positionIdx, 1);
  };

  const removeCounter = () => {
    gameState.changeCounter(cardCurrentRegion, positionIdx, -1);
  };

  const commands = {
    t: tapCard,
    l: flipCard,
    g: sendToGraveyard,
    e: sendToExile,
    o: addCounterPlusOnePlusOne,
    k: addCounterMinusOneMinusOne,
    i: addCounter,
    j: removeCounter,
  };

  return (
    <Draggable draggableId={card._uid} index={idx} key={card._uid}>
      {(provided) => (
        <SlimContainer
          className={`${region} ImgCard`}
          uniqueid={card._uid}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          tabIndex={tabIndex}
          onDoubleClick={tapCard}
          onMouseOver={onMouseOver}
          onMouseLeave={onMouseLeave}
          onContextMenu={flipCard}
          onKeyDown={(event) => {
            if (
              commands[event.key] &&
              !event.ctrlKey &&
              !event.altKey &&
              !event.shiftKey
            ) {
              commands[event.key]();
            }
          }}
        >
          <HiddenText>
            <div aria-live="polite" aria-atomic="true">
              {isTapped ? "tapped " : ""}
              {card.face_aria_description}
              {card.counters ? `, ${card.counters} counters` : ","}
              {card.misc_counters ? `, ${card.misc_counters} miscelaneous counters` : ""}
            </div>
          </HiddenText>
          <HiddenText>
            <div aria-live="off" aria-atomic="true">
              {card.card_type_line + ", "}
            </div>
            <div aria-live="off" aria-atomic="true">
              {card.card_read_oracle_text}
            </div>
          </HiddenText>
          <img
            src={
              card.hidden
                ? FuckedCardBack
                : card.card_image_uris?.[size] ?? emptyCard
            }
            alt={card.card_face_name_with_mana_cost}
            style={{
              height: `${cardHeight}%`,
              display: "block",
              borderRadius: "8px",
              transform: card.tapped ? "rotate(90deg)" : "none",
              width: "100%",
            }}
          />
          {
            card.counters > 0 ?
              <Counter>
                {card.counters}
              </Counter>
            : null
          }
        </SlimContainer>
      )}
    </Draggable>
  );
};

ImgCard.propTypes = {
  region: PropTypes.string.isRequired,
  idx: PropTypes.number.isRequired,
  card: PropTypes.object.isRequired,
  size: PropTypes.string.isRequired,
  tabIndex: PropTypes.number.isRequired,
  cardHeight: PropTypes.number.isRequired,
  gameState: PropTypes.object.isRequired,
};

export const ImgCardHand = ({
  idx,
  gameState,
  card,
  size,
  tabIndex,
  cardHeight,
}) => {
  const [cardFace, setCardFace] = useState(card.card_face);

  cardFace !== card.card_face && setCardFace(card.card_face);

  const flipCard = () => {
    card.changeFace();
    setCardFace(card.card_face);
    gameState.updatePlayer();
    gameState.focusOnCard(card);
  };

  const onMouseOver = () => {
    if (gameState) {
      gameState.focusOnCard(card);
    }
  };

  const onMouseLeave = () => {
    gameState.focusOnCard(null);
  };

  return (
    <Draggable draggableId={card._uid} index={idx} key={card._uid}>
      {(provided) => (
        <SlimContainer
          className="hand_zone ImgCardHand"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          tabIndex={tabIndex}
          onMouseOver={onMouseOver}
          onMouseLeave={onMouseLeave}
          onContextMenu={flipCard}
          onKeyDown={(event) => {
            if (event.key === "l") {
              flipCard();
            }
          }}
        >
          <HiddenText>
            <div aria-live="polite" aria-atomic="true">
              {card.aria_description}
            </div>
          </HiddenText>
          <HiddenText>
            <div aria-live="polite" aria-atomic="true">
              {card.type_line + ", "}
            </div>
            <div aria-live="polite" aria-atomic="true">
              {card.card_read_oracle_text}
            </div>
          </HiddenText>
          <img
            src={
              card.hidden
                ? FuckedCardBack
                : card.card_image_uris?.[size] ?? emptyCard
            }
            alt={card.name}
            style={{
              height: `${cardHeight}%`,
              maxWidth: "100%",
              borderRadius: "8px",
            }}
          />
        </SlimContainer>
      )}
    </Draggable>
  );
};

ImgCardHand.propTypes = {
  idx: PropTypes.number.isRequired,
  card: PropTypes.object.isRequired,
  size: PropTypes.string.isRequired,
  tabIndex: PropTypes.number.isRequired,
  cardHeight: PropTypes.number.isRequired,
  gameState: PropTypes.object.isRequired,
};

export const StaticImgCard = ({
  card,
  gameState,
  size,
  tabIndex,
  cardHeight,
}) => {
  const onMouseOver = () => {
    gameState.focusOnCard(card);
  };

  const onMouseLeave = () => {
    gameState.focusOnCard(null);
  };

  return (
    <SlimContainer
      tabIndex={tabIndex}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
    >
      <HiddenText>
        <div>
          {card.is_tapped ? "tapped " : ""}
          {card.aria_description}
        </div>
      </HiddenText>
      <HiddenText>
        <div>{card.card_type_line + ", "}</div>
        <div>{card.card_read_oracle_text}</div>
      </HiddenText>
      <img
        src={
          card.hidden
            ? FuckedCardBack
            : card.card_image_uris?.[size] ?? emptyCard
        }
        alt={card.card_name_with_mana_cost}
        style={{
          height: `${cardHeight}%`,
          borderRadius: "8px",
          transform: card.is_tapped ? "rotate(90deg)" : "none",
        }}
      />
    </SlimContainer>
  );
};

StaticImgCard.propTypes = {
  card: PropTypes.object.isRequired,
  size: PropTypes.string.isRequired,
  tabIndex: PropTypes.number.isRequired,
  scale: PropTypes.number.isRequired,
  gameState: PropTypes.object.isRequired,
};
