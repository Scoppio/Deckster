import PropTypes from "prop-types";
import style from "styled-components";
import { Draggable } from "react-beautiful-dnd";
import emptyCard from "../resources/cards/empty_card.png";
import FuckedCardBack from "../resources/cards/mtgcardback.png";
import { useState, useRef } from "react";

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
  bottom: 20px;
  left: 5px;
  color: white;
  padding-left: 5px;
  position: absolute;
`;

const BlackBelt = style.div`
  background-color: black;
  width: 100%;
  height: 20px;
  bottom: 0px;
  position: absolute;
  color: white;
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
  const cardRef = useRef(null);
  isTapped !== card.is_tapped && setIsTapped(card.is_tapped);
  cardFace !== card.card_face && setCardFace(card.card_face);
  console.log("Counter: ", card.counters);
  const flipCard = () => {
    card.changeFace();
    setCardFace(card.card_face);
    gameState.updatePlayer("FLIP_SOUND");
    gameState.focusOnCard(card);
  };

  const tapCard = () => {
    card.tapped = !card.is_tapped;
    gameState.updatePlayer("TAP_SOUND");
    setIsTapped(card.tapped);
    gameState.focusOnCard(card);
  };

  const onMouseOver = (event) => {
    gameState.focusOnCard(card);
    cardRef.current.focus();
  };

  const onMouseLeave = () => {
    gameState.focusOnCard(null);
  };

  const sendToGraveyard = () => {
    gameState.moveCardToZonePosition(cardCurrentRegion, positionIdx, "graveyard");
  };

  const sendToExile = () => {
    gameState.moveCardToZonePosition(cardCurrentRegion, positionIdx, "exile");
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

  const sendToLibraryNthPosition = (n) => {
    gameState.moveCardToZonePosition(cardCurrentRegion, positionIdx, "library", n);
  };

  const sendToHand = () => {
    gameState.moveCardToZonePosition(cardCurrentRegion, positionIdx, "hand");
  };

  const commands = {
    t: tapCard,
    l: flipCard,
    g: sendToGraveyard,
    e: sendToExile,
    '1': () => sendToLibraryNthPosition(0),
    '2': () => sendToLibraryNthPosition(1),
    '3': () => sendToLibraryNthPosition(2),
    '4': () => sendToLibraryNthPosition(3),
    '5': () => sendToLibraryNthPosition(4),
    '6': () => sendToLibraryNthPosition(5),
    '7': () => sendToLibraryNthPosition(6),
    '0': () => sendToLibraryNthPosition(-1),
    h: sendToHand,
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
          ref={(el) => {provided.innerRef(el); cardRef.current = el;} }
          tabIndex={tabIndex}
          onDoubleClick={tapCard}
          onMouseOver={onMouseOver}
          onMouseLeave={onMouseLeave}
          onContextMenu={flipCard}
          onKeyDown={(event) => {
            if (
              commands[event.key.toLowerCase()] &&
              !event.ctrlKey &&
              !event.altKey &&
              !event.shiftKey
            ) {
              commands[event.key.toLowerCase()]();
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
            card.counters !== 0 ?
              <Counter>
                {card.counters}
              </Counter>
            : null
          }
          {
            card.is_power_and_thoughness_modified ? 
            <BlackBelt>
              {card.power_toughness}
            </BlackBelt>
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
  const cardRef = useRef(null);
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
    cardRef.current.focus();
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
          ref={(el) => {provided.innerRef(el); cardRef.current = el;}}
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
  const cardRef = useRef(null);
  const onMouseOver = (event) => {
    gameState.focusOnCard(card);
    cardRef.current.focus();
  };

  const onMouseLeave = () => {
    gameState.focusOnCard(null);
  };

  return (
    <SlimContainer
      tabIndex={tabIndex}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
      ref={cardRef}
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
