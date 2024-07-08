# Deckster VTT Client

## Available Scripts

In the project directory, you can run:

### `yarn build`

### `yarn electron:build`

### `yarn electron:servelocal`


## UI Design

https://www.figma.com/file/kaHRgV2BM6XKDEMVm4CCej/Game-UI---2-to-6-players?type=design&node-id=0-1&mode=design&t=BfxKDup3KRG9rxFL-0

## TODO

- [x] Add empty seat
- [x] Implement pass_turn
- [x] Implement change_game_phase
- [x] Show initiative sequence on screen
- [x] Show current game phase on screen
- [x] Put the initiative change in the settings screen
- [x] Put a "Are you sure" dialog when quitting to desktop
- [x] Put a kick player available for players
- [x] Test disconnect + reconnect to game
- [x] Implement Opponent Zones
- [x] Implement Chat
- [x] Deck search mechanique
- [x] Token and card lookup mechanique
- [x] Test kick player
- [x] Play with top card revealed (on deck)
- [x] Implement card-view for library
- [x] Implement card-view for graveyard
- [x] Implement card-view for commander
- [x] Implement card-view for face_down 
- [x] Implement send cards from face_down to bottom shuffled
- [x] Implement send cards from face_down to top shuffled
- [x] Implement card-view for exile
- [x] Deploy server
- [x] Verify aria-label is present in all new settings
- [x] Implement action "Move all cards to the battlefield" from zommandzone
- [ ] Implement reveal cards in hand
- [ ] Implement peek cards
- [ ] Test two players
- [ ] Implement scry ???
- [ ] Test join game
- [ ] Login into game is not adding the player to the gamestate of other players
- [ ] changing the deck before rejoining the game has no effect
- [ ] There is no information on which is the game name for the current game