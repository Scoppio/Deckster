import PropTypes from "prop-types";
import style from "styled-components";
import { Draggable } from "react-beautiful-dnd";
import emptyCard from "../resources/cards/empty_card.png";
import FuckedCardBack from "../resources/cards/mtgcardback.png";
import { useState, useRef, useEffect } from "react";

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

const overlayStyle = {
  content: '""',
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
   // Light blue color with 40% opacity
  backgroundColor: "rgba(173, 216, 230, 0.4)",
  borderRadius: "8px",
  pointerEvents: "none", // Ensure the overlay does not interfere with mouse events
};

const overlayAttentionStyle = {
  content: '""',
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  // Light yellow color with 40% opacity
  backgroundColor: "rgba(255, 255, 0, 0.4)",
  borderRadius: "8px",
  pointerEvents: "none", // Ensure the overlay does not interfere with mouse events
};

export const ImgCard = ({
  region,
  idx,
  gameState,
  card,
  size,
  tabIndex,
  cardHeight,
}) => {
  const [cardBeingDragged, setCardBeingDragged] = useState(card.is_dragged);
  useEffect(() => {
    setCardBeingDragged(card.is_dragged);
  }, [card.is_dragged]);

  const [isTapped, setIsTapped] = useState(card.is_tapped);
  const [cardFace, setCardFace] = useState(card.card_face);
  const cardCurrentRegion = region;
  const positionIdx = idx;
  const cardRef = useRef(null);
  const isRevealed = card.revealed_to.includes(gameState.current_player_id);
  isTapped !== card.is_tapped && setIsTapped(card.is_tapped);
  cardFace !== card.card_face && setCardFace(card.card_face);
  
  useEffect(() => {
    setIsTapped(!!card.tapped);
  }, [card.tapped]);

  const flipCard = () => {
    const current_face_name = card.card_name;
    card.changeFace();
    setCardFace(card.card_face);
    gameState.sendChatMessage("Flipping " +current_face_name + " to " + card.card_name);
    gameState.updatePlayer("FLIP_SOUND");
    gameState.focusOnCard(card);
  };

  const tapCard = () => {
    card.tapped = !card.is_tapped;
    gameState.sendChatMessage(card.tapped ? "Tapped " + card.card_name : "Untapped " + card.card_name);
    gameState.updatePlayer("TAP_SOUND");
    gameState.focusOnCard(card);
  };

  const onFocus = () => {
    gameState.focusOnCard(card);
  };

  const onBlur = () => {
  //   console.log("onBlur " + card.name);
  //   gameState.removeFocusOnCard(card);
  };

  const onMouseOver = (event) => {
    gameState.focusOnCard(card);
    cardRef.current.focus();
  };

  const onMouseLeave = () => {
  //   console.log("mouseLeave " + card.name);
  //   gameState.removeFocusOnCard(card);
  };

  const sendToGraveyard = () => {
    gameState.moveCardToZonePosition(cardCurrentRegion, positionIdx, "graveyard", card);
  };

  const sendToExile = () => {
    gameState.moveCardToZonePosition(cardCurrentRegion, positionIdx, "exile", card);
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
    gameState.moveCardToZonePosition(cardCurrentRegion, positionIdx, "library", card, n);
  };

  const sendToHand = () => {
    gameState.moveCardToZonePosition(cardCurrentRegion, positionIdx, "hand", card);
  };

  const cloneCard = () => {
    gameState.cloneCard(card);
  };

  const sendToCommandZone = () => {
    gameState.moveCardToZonePosition(cardCurrentRegion, positionIdx, "commander_zone", card);
  };

  const sendToFaceDown = () => {
    gameState.moveCardToZonePosition(cardCurrentRegion, positionIdx, "face_down", card);
  };

  const declareAttacker = () => {
    gameState.sendChatMessage("Attacking with " + card.card_name);
  };

  const declareBlocker = () => {
    gameState.sendChatMessage("Blocking with " + card.card_name);
  };

  const commands = {
    t: tapCard,
    a: declareAttacker,
    s: declareBlocker,
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
    y: cloneCard,
    z: sendToCommandZone,
    v: sendToFaceDown,
  };

  return (
    <Draggable draggableId={card._uid} index={idx} key={card._uid}>
      {(provided) => (
        <SlimContainer
          className={`${region} ImgCard`}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={(el) => {provided.innerRef(el); cardRef.current = el;} }
          tabIndex={tabIndex}
          onDoubleClick={tapCard}
          onMouseOver={onMouseOver}
          onMouseLeave={onMouseLeave}
          onContextMenu={flipCard}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={(event) => {
            if (
              commands[event.key.toLowerCase()] &&
              !event.ctrlKey &&
              !event.altKey &&
              !event.shiftKey
            ) {
              if (cardBeingDragged) return;
              event.preventDefault();
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
              (card.hidden && !isRevealed)
                ? FuckedCardBack
                : card.card_image_uris?.[size] ?? emptyCard
            }
            alt={card.card_face_name_with_mana_cost}
            style={{
              height: `${cardHeight}%`,
              maxHeight: "150px",
              display: "block",
              objectFit: 'contain',
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
          {
            card.hidden && <div style={overlayStyle}></div>
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
  ownerId,
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
  const positionIdx = idx;
  const isRevealed = card.revealed_to.includes(gameState.current_player_id) || ownerId === gameState.current_player_id || card.revealed;
  
  const [cardBeingDragged, setCardBeingDragged] = useState(card.is_dragged);
  useEffect(() => {
    setCardBeingDragged(card.is_dragged);
  }, [card.is_dragged]);


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
  //   gameState.removeFocusOnCard(card);
  };
  
  const sendToGraveyard = () => {
    gameState.moveCardToZonePosition("hand", positionIdx, "graveyard", card);
  };

  const sendToExile = () => {
    gameState.moveCardToZonePosition("hand", positionIdx, "exile", card);
  };

  const sendToFaceDown = () => {
    gameState.moveCardToZonePosition("hand", positionIdx, "face_down", card);
  };

  const sendToLibraryTop = () => {
    gameState.moveCardToZonePosition("hand", positionIdx, "library", card, 0);
  };

  const sendToLibraryBottom = () => {
    const lastIdx = gameState.player.library.length;
    gameState.moveCardToZonePosition("hand", positionIdx, "library", card, lastIdx);
  };

  const revealCardToAll = () => {
    gameState.switchRevealCardToAll(positionIdx);
  };

  const onFocus = () => {
    gameState.focusOnCard(card);
  };

  const onBlur = () => {
  //   gameState.removeFocusOnCard(card);
  //   console.log("onBlur " + card.name);
  };

  const commands = {
    l: flipCard,
    g: sendToGraveyard,
    e: sendToExile,
    t: sendToLibraryTop,
    b: sendToLibraryBottom,
    f: sendToFaceDown,
    r: revealCardToAll,
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
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={(event) => {
            if (
              commands[event.key.toLowerCase()] &&
              !event.ctrlKey &&
              !event.altKey &&
              !event.shiftKey
            ) {
              event.preventDefault();
              if (cardBeingDragged) return;
              commands[event.key.toLowerCase()]();
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
              isRevealed
              ? card.card_image_uris?.[size] ?? emptyCard
              : FuckedCardBack
            }
            alt={card.name}
            style={{
              maxHeight: `${cardHeight}%`,
              objectFit: 'contain',
              maxWidth: "100%",
              borderRadius: "8px",
            }}
          />
          {
            ((isRevealed && ownerId !== gameState.current_player_id) || card.revealed) && <div style={overlayStyle}></div>
          }
        </SlimContainer>
      )}
    </Draggable>
  );
};

ImgCardHand.propTypes = {
  ownerId: PropTypes.number.isRequired,
  idx: PropTypes.number.isRequired,
  card: PropTypes.object.isRequired,
  size: PropTypes.string.isRequired,
  tabIndex: PropTypes.number.isRequired,
  cardHeight: PropTypes.number.isRequired,
  gameState: PropTypes.object.isRequired,
};

export const ImgCardSearch = ({
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
  // const positionIdx = idx;

  const flipCard = () => {
    card.changeFace();
    setCardFace(card.card_face);
    gameState.updatePlayer();
    gameState.focusOnCard(card);
  };

  const onMouseOver = () => {
    if (gameState) {
      gameState?.focusOnCard(card);
    }
    cardRef.current.focus();
  };

  const onMouseLeave = () => {
    // gameState?.removeFocusOnCard(card);
  };
  
  const sendToGraveyard = () => {
    // gameState.moveCardToZonePosition("hand", positionIdx, "graveyard", card);
  };

  const sendToExile = () => {
    // gameState.moveCardToZonePosition("hand", positionIdx, "exile", card);
  };

  const sendToFaceDown = () => {
    // gameState.moveCardToZonePosition("hand", positionIdx, "face_down", card);
  };

  const sendToLibraryTop = () => {
    // gameState.moveCardToZonePosition("hand", positionIdx, "library", card, 0);
  };

  const sendToLibraryBottom = () => {
    // const lastIdx = gameState.player.library.length;
    // gameState.moveCardToZonePosition("hand", positionIdx, "library", card, lastIdx);
  };

  const commands = {
    l: flipCard,
    g: sendToGraveyard,
    e: sendToExile,
    t: sendToLibraryTop,
    b: sendToLibraryBottom,
    f: sendToFaceDown,
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
            if (
              commands[event.key.toLowerCase()] &&
              !event.ctrlKey &&
              !event.altKey &&
              !event.shiftKey
            ) {
              event.preventDefault();
              commands[event.key.toLowerCase()]();
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
              maxHeight: `${cardHeight}`,
              objectFit: 'contain',
              maxWidth: "100%",
              borderRadius: "4px",
            }}
          />
        </SlimContainer>
      )}
    </Draggable>
  );
};

ImgCardSearch.propTypes = {
  idx: PropTypes.number.isRequired,
  card: PropTypes.object.isRequired,
  size: PropTypes.string.isRequired,
  tabIndex: PropTypes.number.isRequired,
  cardHeight: PropTypes.string.isRequired,
  gameState: PropTypes.object.isRequired,
};

export const StaticImgCard = ({
  ownerId,
  card,
  gameState,
  size,
  tabIndex,
  cardHeight,
  positionIdx,
  region,
  inHand=false,
}) => {
  const cardRef = useRef(null);
  const isHidden = !!card.hidden;
  const isYours = ownerId === gameState.current_player_id;
  const isRevealedToYou = card.revealed_to.includes(gameState.current_player_id);
  const isRevealedToAll = !!card.revealed;
  const isInHand = !!inHand;
  const isRevealed = (isRevealedToYou || isRevealedToAll) && (!isInHand || !isHidden);
  const callAttentionTo = card.call_attention;
  
  const canBeSeen = () => {
    if (isYours) {
      return true;
    }
    if (isRevealedToYou || isRevealedToAll) {
      return true;
    }
    if (isInHand) {
      return false;
    }
    if (isHidden) {
      return false;
    }
    return true;
  };

  const onMouseOver = (event) => {
    if (canBeSeen()) {
      gameState?.focusOnCard(card);
      cardRef.current.focus();
    }
  };

  const onFocus = () => {
    if (canBeSeen()) {
      gameState?.focusOnCard(card);
    }
  };

  const onBlur = () => {
    // gameState?.removeFocusOnCard(card);
  };

  const onMouseLeave = () => {
    // gameState?.removeFocusOnCard(card);
  };

  const callAttentionToThisCard = () => {
    gameState.callAttentionToCard(ownerId, region, positionIdx);
  };

  const commands = {
    a: callAttentionToThisCard,
  };

  return (
    <SlimContainer
      tabIndex={tabIndex}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      ref={cardRef}
      onKeyDown={(event) => {
        if (
          commands[event.key.toLowerCase()] &&
          !event.ctrlKey &&
          !event.altKey &&
          !event.shiftKey
        ) {
          event.preventDefault();
          commands[event.key.toLowerCase()]();
        }
      }}
    >
      { 
      (canBeSeen()) ?
      <>
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
      </>
      : <>
      <HiddenText>
        <div>Hidden card</div>
      </HiddenText>
      </>
      }
      <img
        src={
          (canBeSeen())
            ? card.card_image_uris?.[size] ?? emptyCard 
            : FuckedCardBack
        }
        alt={card.card_name_with_mana_cost}
        style={{
          height: (inHand ? "100px" : `${cardHeight}%`),
          objectFit: 'contain',
          borderRadius: "8px",
          transform: card.is_tapped ? "rotate(90deg)" : "none",
          verticalAlign: "top",
        }}
      />
      {
        card.counters !== 0 &&
          <Counter>
            {card.counters}
          </Counter>
      }
      {
        card.is_power_and_thoughness_modified && 
        <BlackBelt>
          {card.power_toughness}
        </BlackBelt>
      }
      {
        isRevealed && <div style={overlayStyle}></div>
      }
      {
        callAttentionTo && <div style={overlayAttentionStyle}></div>
      }
    </SlimContainer>
  );
};

StaticImgCard.propTypes = {
  ownerId: PropTypes.number.isRequired,
  card: PropTypes.object.isRequired,
  size: PropTypes.string.isRequired,
  tabIndex: PropTypes.number.isRequired,
  scale: PropTypes.number.isRequired,
  gameState: PropTypes.object.isRequired,
  positionIdx: PropTypes.number.isRequired,
  region: PropTypes.string.isRequired,
};
