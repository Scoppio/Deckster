import PropTypes from 'prop-types';

export const Library = ({ player, playerRef, playerNumber }) => (
  <div className="row" 
    role="complementary"
    ref={playerRef.library}
    tabIndex={player.tabIndices.library} 
    aria-labelledby={playerNumber + "-library-label"} 
    aria-describedby={playerNumber + "-library-desc"}>
    <h3 id={playerNumber + "-library-label"}>Library</h3>
    <p id={playerNumber + "-library-desc"}>{player.library.length} cards</p>
  </div>
)

Library.propTypes = {
  player: PropTypes.object.isRequired,
  playerRef: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
}