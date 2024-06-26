import { useEffect, useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import style from "styled-components";
import PropTypes from "prop-types";

import { ImgCardHand } from "./FullCard";


const CardHolder = style.div`
  padding: 8px;
  display: flex;
`;


export function ZoneModal({gameState, sourceZone, closeModal, useCloseAndShuffle}) {
  const [openZone, setOpenZone] = useState(gameState.open_zone);
  const player = gameState.player;
  const usingCloseAndShuffle = useCloseAndShuffle;

  useEffect(() => {
    setOpenZone(gameState.open_zone);
  }, [gameState.open_zone]);
  

  const closeAndShuffle = () => {
    gameState.shuffleLibrary();
    closeModal();
  };

  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleHideBtn">
          { 
            usingCloseAndShuffle ?
              <button onClick={closeAndShuffle}>Close & Shuffle</button> :
              <button onClick={closeModal}>Close</button>
          }
          <label>Search</label>
          <input type="text" />
          <button>Search</button>
        </div>
        <div className="body">
          <Droppable
            droppableId={sourceZone}
            direction="horizontal"
            aria-label={sourceZone}
            role="region"
          >
            {(provided) => (
              <CardHolder
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{ height: "75px", padding: "2px", "background-color": "red" }}
                className="Droppable"
                aria-label={sourceZone}
              >
                {gameState.open_zone.cards.map((card, idx) => (
                  <ImgCardHand
                    idx={idx}
                    gameState={gameState}
                    size="small"
                    card={card}
                    tabIndex={idx + player.tabIndices.card_list_zone + 1}
                    cardHeight={100}
                    key={card._uid}
                  />
                ))}
                {provided.placeholder}
              </CardHolder>
            )}
          </Droppable>
        </div>
      </div>
    </div>
  );
}



ZoneModal.propTypes = {
  gameState: PropTypes.object.isRequired,
  sourceZone: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
  hideModal: PropTypes.func.isRequired,
  useCloseAndShuffle: PropTypes.bool.isRequired,
};
