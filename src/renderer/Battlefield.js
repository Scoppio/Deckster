import { Card } from "./Card";

export const Battlefield = ({ gameState, playerRef, playerNumber, player }) => (
  
  <div className="row" 
    ref={playerRef.battlefield} 
    tabindex={player.tabIndices.battlefield}
    aria-label={player.name + " Battlefield"}
    aria-description={gameState.cardsOnTheTable(playerNumber)}>
      {
        player.battlefield.map((card, index) => {
          return (
            <div className="col">
              <Card data={card} tabIndex={index + player.tabIndices.battlefield} />
            </div>
          )
        })
      }
  </div>
)