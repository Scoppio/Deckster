import React, { useEffect } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import PropTypes from "prop-types";

import classNames from "classnames";

export function ZoneModal(onDragStart, onDragEnd, onDragUpdate, closeAndCommit, zones) {

  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleHideBtn">
          <button>Hide</button>
        </div>
        <div className="title">
          <h1>Zone Modal</h1>
        </div>
        <div className="body">
          <DragDropContext
            onDragEnd={onDragEnd}
            onDragUpdate={onDragUpdate}
            onDragStart={onDragStart}
          >
            <Droppable
              droppableId="front_battlefield"
              direction="horizontal"
              aria-label="front lane"
              role="region"
            >
              {(provided) => (
                <CardHolder
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{ height: "33.33%", padding: "2px", "background-color": "red" }}
                  className="Droppable"
                  aria-label="front lane"
                >
                  {player.front_battlefield.map((card, idx) => (
                    <ImgCard
                      region="front_battlefield"
                      key={card._uid}
                      gameState={gameState}
                      size={"small"}
                      idx={idx}
                      card={card}
                      tabIndex={idx + player.tabIndices.front_battlefield}
                      cardHeight={100}
                    />
                  ))}
                  {provided.placeholder}
                </CardHolder>
              )}
            </Droppable>
            
          </DragDropContext>
        </div>
        <div className="footer">
          <button onClick={closeAndCommit}>Finish</button>
        </div>
      </div>
    </div>
  );
}



ZoneModal.propTypes = {
  onDragStart: PropTypes.func,
  onDragEnd: PropTypes.func,
  onDragUpdate: PropTypes.func,
  zones: PropTypes.array,
};
