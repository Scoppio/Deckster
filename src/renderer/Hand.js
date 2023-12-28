// import { Card } from "./Card";
import { FullCard } from "./FullCard";

import { DragDropContext } from "react-beautiful-dnd";

import style from 'styled-components'
import PropTypes from 'prop-types';

const HandContainer = style.div`
  display: flex;
  height: ${prop => prop.scale * 750}px;
  width: ${prop => prop.scale * 550}px;
`

const cardScale = 0.5;

export const Hand = ({player, playerRef, playerNumber}) => {
  
  const onDragEnd = () => {
    // TODO: implement
  }

  return (
    <div className="hand col" 
      role="complementary" 
      tabIndex={player.tabIndices.hand} 
      ref={playerRef.hand} 
      aria-labelledby={playerNumber + "-player-hand-label"} 
      aria-describedby={playerNumber + "-hand-desc"}>
      <h2 id={playerNumber + "-player-hand-label"}>Hand</h2>
      <p id={playerNumber + "-hand-desc"}>{player.hand.length} cards</p>
      <DragDropContext
        onDragEnd={onDragEnd}
      >
        <div className="row" style={{height: cardScale * 750, width: cardScale * 550}}>
        {
          player.hand.map((card, index) => {
            if (player.isRemote) {
              return null;
            }
            return (
              <HandContainer key={index} scale={cardScale}>
                <FullCard data={card} tabIndex={index + player.tabIndices.hand} scale={cardScale} />
              </HandContainer>
            )
          })
        }
        </div>
      </DragDropContext>
    </div>
  )
}

Hand.propTypes = {
  player: PropTypes.object.isRequired,
  playerRef: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
}