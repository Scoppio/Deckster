
export const Library = ({ player, playerRef, playerNumber }) => (
  <div className="row" 
    role="complementary"
    ref={playerRef.library}
    tabindex={player.tabIndices.library} 
    aria-labelledby={playerNumber + "-library-label"} 
    aria-describedby={playerNumber + "-library-desc"}>
    <h3 id={playerNumber + "-library-label"}>Library</h3>
    <p id={playerNumber + "-library-desc"}>{player.library.length} cards</p>
  </div>
)