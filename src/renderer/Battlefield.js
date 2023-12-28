import { Droppable } from "react-beautiful-dnd";
import { Card } from "./Card";
import styled from "styled-components";
import PropTypes from 'prop-types';

const BattlefieldContainer = styled.div``

export const Battlefield = ({ gameState, playerRef, playerNumber, player }) => (
  <Droppable droppableId={playerNumber} direction="horizontal">
    { (provided) => (
      <BattlefieldContainer {...provided.droppableProps} innerRef={provided.innerRef}
        ref={playerRef.battlefield} aria-label={player.name + " Battlefield"}
        aria-describedby={gameState.cardsOnTheTable(playerNumber)} tabIndex={player.tabIndices.battlefield}
        >
        {player.battlefield.map((card, index) => <Card key={index} index={index} data={card} tabIndex={index + player.tabIndices.battlefield} />)}
        {provided.placeholder}
      </BattlefieldContainer>
    )}
  </Droppable>
)


Battlefield.propTypes = {
  gameState: PropTypes.object.isRequired,
  playerRef: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
  player: PropTypes.object.isRequired,
}