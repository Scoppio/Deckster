import PropTypes from "prop-types";
import style from "styled-components";

const CardList = style.div`
  width: 100%;
  height: 25vh;
  overflow-y: auto;
  line-height: 20px;
`;

const CardEntry = style.p`
  margin: 0;
`;

export const CardListZone = ({ gameState, playerRef, tabIndex }) => {
  const closeCardList = () => {
    gameState.closeViewZone();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      closeCardList();
    }
  };

  return (
    <CardList ref={playerRef.cardListZone}>
      {gameState.open_zone.zone && (
        <p
          onClick={closeCardList}
          onKeyDown={handleKeyDown}
          tabIndex={tabIndex.card_list_zone}
        >
          <u>Close List</u>
        </p>
      )}
      {gameState.open_zone.cards.map((card, idx) => (
        <CardEntry key={idx} tabIndex={tabIndex.card_list_zone + 2 + idx}>
          {card.name}
        </CardEntry>
      ))}
    </CardList>
  );
};

CardListZone.propTypes = {
  gameState: PropTypes.object.isRequired,
  tabIndex: PropTypes.object.isRequired,
  playerRef: PropTypes.object.isRequired,
};
