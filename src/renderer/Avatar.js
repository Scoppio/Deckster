import PropTypes from 'prop-types';

export const Avatar = ({ player, playerRef, playerNumber }) => (
  <div className="player-stats" role="complementary" 
    tabIndex={player.tabIndices.playerStats} 
    ref={playerRef.playerStats} 
    aria-labelledby={playerNumber + "-player-name-label"} 
    aria-describedby={playerNumber + "-health-desc " +  playerNumber + "-counter-desc"}>
    <h2 id={playerNumber + "-player-name-label"}>{player.name}</h2>
    <div><p id={playerNumber + "-health-desc"}>health {player.health},</p></div>
    <div><p id={playerNumber + "-counter-desc"}>counter {player.counter}</p></div>
  </div>
)

Avatar.propTypes = {
  player: PropTypes.object.isRequired,
  playerRef: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
}
