import { Droppable } from "react-beautiful-dnd";
import { StaticImgCard, ImgCard } from "./FullCard";
import PropTypes from 'prop-types';

import style from 'styled-components'


const CardHolder = style.div`
  padding: 8px;
  display: flex;
  flex-direction: row;
`

export const StaticBattlefield = ({ gameState, playerRef, playerNumber, player, landsOnNorth }) => { 
  
  const topPosition = landsOnNorth ? "land_zone_battlefield" : "front_battlefield";
  const lowerPosition = landsOnNorth ? "front_battlefield" : "land_zone_battlefield";

  return (
  <div className="row" 
    ref={playerRef.battlefield} 
    tabIndex={player.tabIndices.battlefield}
    role="region"
    aria-label={player.name + " Battlefield"}
    aria-describedby={gameState.cardsOnTheTable(playerNumber)}>
      <CardHolder style={{height: "13vh", padding: "2px"}}>
      {
        player[landsOnNorth ? "land_zone_battlefield" : "front_battlefield"].map((card, index) => (<StaticImgCard card={card} key={index} size={"small"} tabIndex={index + player.tabIndices.battlefield} cardHeight={100} />))
      }
      </CardHolder>
      <CardHolder style={{height: "13vh", padding: "2px"}}>
      {
        player.back_battlefield.map((card, index) => (<StaticImgCard card={card} key={index} size={"small"} tabIndex={index + player.tabIndices.battlefield} cardHeight={100} />))
      }
      </CardHolder>
      <CardHolder style={{height: "13vh", padding: "2px"}}>
      {
        player[landsOnNorth ? "front_battlefield" : "land_zone_battlefield"].map((card, index) => (<StaticImgCard card={card} key={index} size={"small"} tabIndex={index + player.tabIndices.battlefield} cardHeight={100} />))
      }
      </CardHolder>
  </div>
)}

export const Battlefield = ({ gameState, playerRef, playerNumber, player }) => (
  <div className="row" 
    role="region"
    aria-label={player.name + " Battlefield"}
    ref={playerRef.battlefield} 
    tabIndex={player.tabIndices.battlefield}>
    <Droppable droppableId="front_battlefield" direction="horizontal">
      {(provided) => (
        <CardHolder {...provided.droppableProps} ref={provided.innerRef} style={{height: "11vh", padding: "2px"}}>
          {player.front_battlefield.map((card, idx) => <ImgCard key={card._uid} size={"small"} idx={idx} card={card} tabIndex={idx + player.tabIndices.battlefield} cardHeight={100} />)}
          {provided.placeholder}
        </CardHolder>
      )}
    </Droppable>
    <Droppable droppableId="back_battlefield" direction="horizontal">
      {(provided) => (
        <CardHolder {...provided.droppableProps} ref={provided.innerRef} style={{height: "11vh", padding: "2px"}}>
          {player.back_battlefield.map((card, idx) => <ImgCard key={card._uid} size={"small"} idx={idx} card={card} tabIndex={idx + player.tabIndices.battlefield} cardHeight={100} />)}
          {provided.placeholder}
        </CardHolder>
      )}
    </Droppable>
    <Droppable droppableId="land_zone_battlefield" direction="horizontal">
      {(provided) => (
        <CardHolder {...provided.droppableProps} ref={provided.innerRef} style={{height: "11vh", padding: "2px"}}>
          {player.land_zone_battlefield.map((card, idx) => <ImgCard key={card._uid} size={"small"} idx={idx} card={card} tabIndex={idx + player.tabIndices.battlefield} cardHeight={100} />)}
          {provided.placeholder}
        </CardHolder>
      )}
    </Droppable>
  </div>
)

Battlefield.propTypes = {
  gameState: PropTypes.object.isRequired,
  playerRef: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
  player: PropTypes.object.isRequired,
}