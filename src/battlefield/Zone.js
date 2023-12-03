
export const Zone = ({gameState, player, zone}) => (
    <div class="zone" tabindex={player.tabIndex[zone]} gameState={gameState} aria-label={zone}>
    </div>
)
