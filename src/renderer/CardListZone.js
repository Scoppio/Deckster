
import PropTypes from 'prop-types';
import style from 'styled-components'


const CardList = style.div`
  width: 100%;
  height: 25vh;
  overflow-y: auto;
  line-height: 20px;
`

const CardEntry = style.p`
  margin: 0;
`

export const CardListZone = ({gameState, playerRef, tabIndex }) => {
  return (
    <CardList ref={playerRef.cardListZone} tabIndex={gameState.open_zone.zone && tabIndex.card_list_zone}>
      {gameState.open_zone.cards.map((card, idx) => <CardEntry key={idx} tabIndex={tabIndex.card_list_zone + 1 + idx}>{card.name}</CardEntry>)}
    </CardList>
  )
}

CardListZone.propTypes = {
  gameState: PropTypes.object.isRequired,
  tabIndex: PropTypes.object.isRequired,
  playerRef: PropTypes.object.isRequired,
}
