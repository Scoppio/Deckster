import { FullCard, ImgCard } from "./FullCard";
import { Droppable } from "react-beautiful-dnd";

import style from 'styled-components'
import PropTypes from 'prop-types';


const CardHolder = style.div`
  padding: 8px;
  display: flex;
  flex-direction: row;
`

const cardScale = 0.5;


export const HiddenHand = ({player, playerRef, playerNumber}) => {
  return (
    <div className="hand col" 
      role="complementary" 
      tabIndex={player.tabIndices.hand} 
      ref={playerRef.hand} 
      aria-labelledby={playerNumber + "-player-hand-label"} 
      aria-describedby={playerNumber + "-hand-desc"}>
      <h2 id={playerNumber + "-player-hand-label"}>Hand</h2>
      <p id={playerNumber + "-hand-desc"}>{player.hand.length} cards</p>
    </div>
  )
}

export const Hand = ({player, playerRef, playerNumber}) => {

  return (
    <div
      role="complementary" 
      tabIndex={player.tabIndices.hand} 
      ref={playerRef.hand} 
      aria-labelledby={playerNumber + "-player-hand-label"} 
      aria-describedby={playerNumber + "-hand-desc"}>
      <h2 id={playerNumber + "-player-hand-label"}>Hand</h2>
      <p id={playerNumber + "-hand-desc"}>{player.hand.length} cards</p>
      <div className="row" style={{height: cardScale * 750}}>
        
        <ShownHand cards={player.hand} tabIndex={player.tabIndices.hand} playerNumber={playerNumber} />
      </div>
    </div>
  )
}

Hand.propTypes = {
  player: PropTypes.object.isRequired,
  playerRef: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
}

export const ShownHand = ({playerNumber, cards, tabIndex}) => {
  return (
   <div style={{height: cardScale * 750, width: "100%"}}>
    <Droppable droppableId={`${playerNumber}-hand`} direction="horizontal">
      {(provided) => (
        <CardHolder {...provided.droppableProps} ref={provided.innerRef}>
          {cards.map((card, idx) => <ImgCard key={card._uid} idx={idx} size="small" card={card} tabIndex={idx + tabIndex} scale={cardScale} />)}
          {provided.placeholder}
        </CardHolder>
      )}
    </Droppable>
   </div>
  )
}
