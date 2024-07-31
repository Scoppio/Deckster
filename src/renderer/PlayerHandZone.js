import Dropdown from "react-bootstrap/Dropdown";
import PropTypes from "prop-types";
import DropdownMenuPortal from "../commons/DropdownMenuPortal";
import { CardPiles } from "../commons/CardPiles";

const gameZones = ["graveyard", "exile", "face_down", "library"];
const gamezoneNames = ["Graveyard", "Exile", "Face Down", "Library"];

const TheHandZone = ({
  zoneName,
  player,
  playerRef,
  playerNumber,
  gameState,
}) => {
  
  const drawHand = () => {
    gameState.drawHand();
  };

  const handleMulligan = () => {
    gameState.mulliganHand();
  };

  const handleRevealCardsInHand = () => {
    gameState.revealCardsInHand();
  };

  const moveAllCardsFromTo = (fromZone, toZone, shuffle_pile = false, bottom_pile = false) => {
    let cardPiles = new CardPiles().setSourceZone(fromZone, []);
    cardPiles[toZone] = player[fromZone];
    gameState.cardsFromZone(cardPiles, false, shuffle_pile, bottom_pile);
  };

  return (
    <div
      className={"hand"}
      role="region"
      aria-describedby={`${player.hand.length} cards in hand.`}
      style={{ display: 'flex', alignItems: 'center', marginBottom: '3px' }}
    >
      <Dropdown autoClose="outside">
        <Dropdown.Toggle
          variant="secondary"
          id="dropdown-autoclose-outside"
          ref={playerRef.hand}
          tabIndex={player.tabIndices.hand}
          aria-label={`${player.hand.length} cards in hand.`}
          size="sm"
        >
          <span id={playerNumber + "-hand-label"}>hand</span>
        </Dropdown.Toggle>
        <DropdownMenuPortal>
          <Dropdown.Item onClick={handleRevealCardsInHand}>
            Reveal all cards in hand
          </Dropdown.Item>
          <Dropdown.Divider />
          {
            gameZones
              .map((gameZone, index) => {
                return (
                  <Dropdown.Item onClick={() => moveAllCardsFromTo("hand", gameZone)} key={index}>
                    Move all cards to {gamezoneNames[index]}
                  </Dropdown.Item>
                );
              })
              .filter(Boolean)
          }
          <Dropdown.Item onClick={() => moveAllCardsFromTo("hand", "library", true, false)}>
            Move all cards to bottom of library
          </Dropdown.Item>
          <Dropdown.Item onClick={() => moveAllCardsFromTo("hand", "library", true, true)}>
            Move all cards shuffled to bottom of library
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={drawHand}>Draw hand of 7 cards</Dropdown.Item>
          <Dropdown.Item onClick={handleMulligan}>Mulligan hand</Dropdown.Item>
        </DropdownMenuPortal>
      </Dropdown>
      <span>({player[zoneName].length})</span>
    </div>
  );
};

export const PlayerHandZone = ({
  player,
  playerRef,
  playerNumber,
  gameState,
}) => (
  <TheHandZone
    zoneName="hand"
    player={player}
    playerRef={playerRef}
    playerNumber={playerNumber}
    gameState={gameState}
  />
);

PlayerHandZone.propTypes = {
  player: PropTypes.object.isRequired,
  playerRef: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
};
