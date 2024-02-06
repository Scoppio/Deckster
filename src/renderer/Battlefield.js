import { Droppable } from "react-beautiful-dnd";
import { StaticImgCard, ImgCard } from "./FullCard";
import PropTypes from 'prop-types';

import style from 'styled-components'


const CardHolder = style.div`
  padding: 8px;
  display: flex;
`

const BattlefieldDiv = style.div`
padding: 8px;
flex-direction: row;
width: 75vw;
display: flex;
`

// padding: 8px;
// display: flex;
// flex-direction: row;
// overflow-x: auto;
// flex-wrap: nowrap;
// width: 75vw;


export const StaticBattlefield = ({ gameState, playerRef, playerNumber, player, landsOnNorth, heightVh }) => { 
  
  const lineVh = heightVh / 3 

  return (
  <BattlefieldDiv className="row" 
    ref={playerRef.battlefield} 
    tabIndex={player.tabIndices.battlefield}
    role="region"
    aria-label={player.name + " Battlefield"}
    aria-describedby={gameState.ariaHelper.cardsOnTheTable(playerNumber)}>
      <CardHolder style={{height: `${lineVh}vh`, padding: "2px"}}>
      {
        player[landsOnNorth ? "land_zone_battlefield" : "front_battlefield"].map((card, index) => (<StaticImgCard gameState={gameState}  card={card} key={index} size={"small"} tabIndex={index + player.tabIndices.front_battlefield} cardHeight={100} />))
      }
      </CardHolder>
      <CardHolder style={{height: `${lineVh}vh`, padding: "2px"}}>
      {
        player.back_battlefield.map((card, index) => (<StaticImgCard card={card} key={index} size={"small"} tabIndex={index + player.tabIndices.back_battlefield} cardHeight={100} />))
      }
      </CardHolder>
      <CardHolder style={{height: `${lineVh}vh`, padding: "2px"}}>
      {
        player[landsOnNorth ? "front_battlefield" : "land_zone_battlefield"].map((card, index) => (<StaticImgCard gameState={gameState} card={card} key={index} size={"small"} tabIndex={index + player.tabIndices.land_zone_battlefield} cardHeight={100} />))
      }
      </CardHolder>
  </BattlefieldDiv>
)}

export const Battlefield = ({ gameState, playerRef, playerNumber, player , heightVh}) => {
  const lineVh = heightVh / 3 - 1
  return (
    <BattlefieldDiv className="row" 
      role="region"
      aria-label={player.name + " Battlefield"}
      ref={playerRef.battlefield} 
      tabIndex={player.tabIndices.front_battlefield}>
      <Droppable droppableId="front_battlefield" direction="horizontal">
        {(provided) => (
          <CardHolder {...provided.droppableProps} ref={provided.innerRef} style={{height: `${lineVh}vh`, padding: "2px"}}>
            {player.front_battlefield.map((card, idx) => <ImgCard key={card._uid} gameState={gameState} size={"small"} idx={idx} card={card} tabIndex={idx + player.tabIndices.front_battlefield} cardHeight={100} />)}
            {provided.placeholder}
          </CardHolder>
        )}
      </Droppable>
      <Droppable droppableId="back_battlefield" direction="horizontal">
        {(provided) => (
          <CardHolder {...provided.droppableProps} ref={provided.innerRef} style={{height: `${lineVh}vh`, padding: "2px"}}>
            {player.back_battlefield.map((card, idx) => <ImgCard key={card._uid} gameState={gameState} size={"small"} idx={idx} card={card} tabIndex={idx + player.tabIndices.back_battlefield} cardHeight={100} />)}
            {provided.placeholder}
          </CardHolder>
        )}
      </Droppable>
      <Droppable droppableId="land_zone_battlefield" direction="horizontal">
        {(provided) => (
          <CardHolder {...provided.droppableProps} ref={provided.innerRef} style={{height: `${lineVh}vh`, padding: "2px"}}>
            {player.land_zone_battlefield.map((card, idx) => <ImgCard key={card._uid} gameState={gameState} size={"small"} idx={idx} card={card} tabIndex={idx + player.tabIndices.land_zone_battlefield} cardHeight={100} />)}
            {provided.placeholder}
          </CardHolder>
        )}
      </Droppable>
    </BattlefieldDiv>
  )
}

Battlefield.propTypes = {
  gameState: PropTypes.object.isRequired,
  playerRef: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
  player: PropTypes.object.isRequired,
  heightVh: PropTypes.number.isRequired,
}