import { Droppable } from "react-beautiful-dnd";
import { ImgMini } from "./Minis";
import PropTypes from "prop-types";

import style from "styled-components";

const CardHolder = style.div`
  padding: 8px;
  display: flex;
`;

const BattlefieldDiv = style.div`
  flex-direction: column;
  width: 100%;
  display: flex;
  background-color: purple;
`;


export const Battlemap = ({ gameState, playerRef, columns, rows }) => {
  const cells = Array.from({ length: rows }, (_, rowIndex) =>
    Array.from({ length: columns }, (_, columnIndex) =>
      String.fromCharCode(65 + columnIndex) + (rowIndex + 1)
    )
  );

  return (
    <BattlefieldDiv
      ref={playerRef.battlemap}
      tabIndex={gameState.player.tabIndices.front_battlefield}
    >
      {cells.map((row, rowIndex) =>
        row.map((cell, columnIndex) => (
          <Droppable
            key={cell}
            droppableId={cell}
            direction="horizontal"
            aria-label={`cell ${cell}`}
            role="region"
          >
            {(provided) => (
              <CardHolder
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{ 
                  height: "75px", 
                  width: "75px",
                  padding: "2px", 
                  "background-color": "red" 
                }}
                className="Droppable"
                aria-label={`${cell}`}
              >
                {gameState.player.battlemap[columnIndex][rowIndex].map((mini, idx) => (
                  <ImgMini
                    key={mini._uid}
                    gameState={gameState}
                    idx={idx}
                    mini={mini}
                    tabIndex={idx + gameState.player.tabIndices.front_battlefield}
                  />
                ))}
                {provided.placeholder}
              </CardHolder>
            )}
          </Droppable>
        ))
      )}
    </BattlefieldDiv>
  );
};

Battlemap.propTypes = {
  gameState: PropTypes.object.isRequired,
  playerRef: PropTypes.object.isRequired,
};
