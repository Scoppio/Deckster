import PropTypes from "prop-types";
import style from "styled-components";
import { Draggable } from "react-beautiful-dnd";
import { useState } from "react";

const SlimContainer = style.div`
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

export const ImgMini = ({
  idx,
  gameState,
  mini,
  tabIndex,
}) => {
  
  // const onMouseOver = () => {
  //   if (gameState) {
  //     gameState.focusOnCard(card);
  //   }
  // };

  // const onMouseLeave = () => {
  //   gameState.focusOnCard(null);
  // };

  return (
    <Draggable draggableId={mini._uid} index={idx} key={mini._uid}>
      {(provided) => (
        <SlimContainer
          className="hand_zone ImgMinisHand"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          tabIndex={tabIndex}
          // onMouseOver={onMouseOver}
          // onMouseLeave={onMouseLeave}
          // onKeyDown={(event) => {
          //   if (event.key === "l") {
          //     flipCard();
          //   }
          // }}
        >
          <HiddenText>
            <div aria-live="polite" aria-atomic="true">
              {mini.name}
            </div>
          </HiddenText>
          <img
            src={mini.image_uri}
            alt={mini.name}
            style={{
              maxHeight: "75px",
              maxWidth: "75px"
            }}
          />
        </SlimContainer>
      )}
    </Draggable>
  );
};

ImgMini.propTypes = {
  idx: PropTypes.number.isRequired,
  gameState: PropTypes.object.isRequired,
  mini: PropTypes.object.isRequired,
  tabIndex: PropTypes.number.isRequired,
};
