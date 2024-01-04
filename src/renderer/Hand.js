import { ImgCard } from "./FullCard";
import { Droppable } from "react-beautiful-dnd";
import FuckedCardBack from "../resources/cards/mtgcardback.png"
import style from 'styled-components'
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';

const CardHolder = style.div`
  padding: 8px;
  display: flex;
  flex-direction: row;
`

const CardBackImg = ({scale}) => {
  return (
    <img src={FuckedCardBack} //"https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=0&type=card" 
      alt="card back" 
      style={{height: `${scale}%`}} />
  )
}

export const HiddenHand = ({player, playerRef, playerNumber}) => {
  return (
    <div className="hand col" 
      role="region" 
      tabIndex={player.tabIndices.hand} 
      ref={playerRef.hand} 
      aria-labelledby={playerNumber + "-player-hand-label"} 
      aria-describedby={playerNumber + "-hand-desc"}>
      <div className="col" style={{height: "300px"}}>
        {player.hand.map((card, idx) => <CardBackImg key={card._uid} scale={30} />)}
      </div>
    </div>
  )
}

export const Hand = ({player, playerRef, playerNumber}) => {

  return (
    <div
      role="region" 
      tabIndex={player.tabIndices.hand} 
      ref={playerRef.hand} 
      aria-describedby={`${player.hand.length} cards`}>
      <Row>
        <ShownHand cards={player.hand} tabIndex={player.tabIndices.hand} />
      </Row>
    </div>
  )
}

Hand.propTypes = {
  player: PropTypes.object.isRequired,
  playerRef: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
}

export const ShownHand = ({cards, tabIndex}) => {
  return (
   <div style={{background: "grey"}}>
    <Droppable droppableId="hand" direction="horizontal">
      {(provided) => (
        <CardHolder {...provided.droppableProps} ref={provided.innerRef} style={{height: "15vh"}}>
          {cards.map((card, idx) => <ImgCard key={card._uid} idx={idx} size="small" card={card} tabIndex={idx + tabIndex} cardHeight={100} />)}
          {provided.placeholder}
        </CardHolder>
      )}
    </Droppable>
   </div>
  )
}

ShownHand.propTypes = {
  cards: PropTypes.array.isRequired,
  tabIndex: PropTypes.number.isRequired,
}