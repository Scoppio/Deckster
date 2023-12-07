import { Card } from "./Card";

import PropTypes from 'prop-types';

export const Battlefield = ({ gameState, playerRef, playerNumber, player }) => (
  
  <div className="row" 
    ref={playerRef.battlefield} 
    tabIndex={player.tabIndices.battlefield}
    aria-label={player.name + " Battlefield"}
    aria-description={gameState.cardsOnTheTable(playerNumber)}>
      {
        player.battlefield.map((card, index) => {
          return (
            <div className="col" key={index}>
              <Card data={card} tabIndex={index + player.tabIndices.battlefield} />
            </div>
          )
        })
      }
  </div>
)

Battlefield.propTypes = {
  gameState: PropTypes.object.isRequired,
  playerRef: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
  player: PropTypes.object.isRequired,
};