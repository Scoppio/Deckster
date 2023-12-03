

export const Deck = ({gameState, player}) => (
    <div class="deck" tabindex={player.tabIndices.Battlefield} aria-aria-description={gameState.player.deck.ariaLabel}>
        <h3 id="deck-label">Deck</h3>
        <p id="deck-desc">40 cards</p>
    </div>
)
