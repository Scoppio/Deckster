import { Card } from "./Card";

import PropTypes from 'prop-types';

export const Hand = ({player, playerRef, playerNumber}) => {
  
  return (
    <div className="hand row" 
      role="complementary" 
      tabIndex={player.tabIndices.hand} 
      ref={playerRef.hand} 
      aria-labelledby={playerNumber + "-player-hand-label"} 
      aria-describedby={playerNumber + "-hand-desc"}>
      <h2 id={playerNumber + "-player-hand-label"}>Hand</h2>
      <p id={playerNumber + "-hand-desc"}>{player.hand.length} cards</p>
      {
        player.hand.map((card, index) => {
          if (player.isRemote) {
            return null;
          }
          
          return (
            <div className="col" key={index}>
              <Card data={card} tabIndex={index + player.tabIndices.hand} />
            </div>
          )
        })
      }
    </div>
  )
}

Hand.propTypes = {
  player: PropTypes.object.isRequired,
  playerRef: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
}