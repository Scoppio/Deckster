import { Droppable } from "react-beautiful-dnd";
import { Card } from "./Card";
import { MiniCard } from "./FullCard";
import PropTypes from 'prop-types';

import style from 'styled-components'


const CardHolder = style.div`
  padding: 8px;
  display: flex;
  flex-direction: row;
`

export const StaticBattlefield = ({ gameState, playerRef, playerNumber, player }) => (
  <div className="row" 
    ref={playerRef.battlefield} 
    tabIndex={player.tabIndices.battlefield}
    role="complementary"
    aria-label={player.name + " Battlefield"}
    aria-describedby={gameState.cardsOnTheTable(playerNumber)}>
      {
        player.battlefield.map((card, index) => {
          return (
            <div className="col" key={index}>
              <Card data={card} index={index} tabIndex={index + player.tabIndices.battlefield} />
            </div>
          )
        })
      }
  </div>
)

export const Battlefield = ({ gameState, playerRef, playerNumber, player }) => (
  <div className="row" 
    ref={playerRef.battlefield} 
    tabIndex={player.tabIndices.battlefield}
    role="complementary"
    aria-label={player.name + " Battlefield"}
    aria-describedby={gameState.cardsOnTheTable(playerNumber)}>
    <Droppable droppableId={`${playerNumber}-battlefield`} direction="horizontal">
      {(provided) => (
        <CardHolder {...provided.droppableProps} ref={provided.innerRef}>
          {player.battlefield.map((card, idx) => <MiniCard key={card._uid} idx={idx} data={card} tabIndex={idx + player.tabIndices.battlefield} scale={1.0} />)}
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