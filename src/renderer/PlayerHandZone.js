import Dropdown from 'react-bootstrap/Dropdown';
import PropTypes from 'prop-types';

const gameZones = ["library", "graveyard", "exile", "faceDown"]
const gameZoneNames = ["Library", "Graveyard", "Exile", "Face Down"]

const TheHandZone = ({ zoneName, player, playerRef, playerNumber, gameState }) => {
  
  const handleMulligan = () => {
    gameState.mulliganHand();
  }
  const handleRevealCardsInHand = () => {
    gameState.revealCardsInHand();
  }

  return (
    <div className={"hand row-flex"} 
      role="region"
      aria-describedby={`${player.hand.length} cards in hand.`}>
      <Dropdown autoClose="outside" >
        <Dropdown.Toggle 
          variant="secondary" 
          id="dropdown-autoclose-outside"
          ref={playerRef.hand} 
          tabIndex={player.tabIndices.hand} size="sm">
          <span id={playerNumber + "-hand-label"}>hand</span>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={handleRevealCardsInHand}>Reveal all cards in hand</Dropdown.Item>
          <Dropdown.Divider />
          {
            // for each zone that is not zoneName
            gameZones.map((gameZone, index) => {
              return (
                <Dropdown.Item href={"#/" + gameZone} key={index}>Move all cards to {gameZoneNames[index]}</Dropdown.Item>
              );
            }).filter(Boolean)
          }
          <Dropdown.Divider />
          <Dropdown.Item onClick={handleMulligan}>Mulligan hand</Dropdown.Item>
          
        </Dropdown.Menu>
      </Dropdown>
      <p id={playerNumber + "-commander-casting-cost"}>Extra casting cost: {player.commanderExtraCastingCost}</p>
    </div>
  )
}

export const PlayerHandZone = ({ player, playerRef, playerNumber, gameState }) => (
  <TheHandZone zoneName="hand" player={player} playerRef={playerRef} playerNumber={playerNumber} gameState={gameState} />
)

PlayerHandZone.propTypes = {
  player: PropTypes.object.isRequired,
  playerRef: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
}
