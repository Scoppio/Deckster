# Deckster VTT Client

## Available Scripts

In the project directory, you can run:

### `yarn build`

### `yarn electron:build`

### `yarn electron:serve`


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
- [x] Test two players
- [x] Test join game
- [x] Login into game is not adding the player to the gamestate of other players
- [x] changing the deck before rejoining the game to play as other deck
- [x] There is no information on which is the game name for the current game
- [x] Implement a way to close the dialog box
- [x] navigate through the chatbox
- [x] navigate the help dialog
- [x] add the ; command to the help dialog
- [x] add internal padding to the help dialog
- [x] can access and navigate the library button
- [x] implement scry
- [x] fix ctrl+l shortcurt
- [x] fix ctrl+e shortcut
- [x] fixed all ctrl/shift shortcuts (no modifier shortcut was ignoraing the modifiers)
- [x] lane back battlefield doest not take focus
- [x] anounce life change
- [x] select card
- [x] sort cards in search zone by name
- [x] implement all game phases
- [x] add upkeep reminder
- [x] implement dice roll
- [x] Implement reveal cards in hand
- [x] Implement peek cards
- [x] Target card in the opponent table
- [x] reveal top card in library
- [x] battlefield not selectable
- [x] cards sem descrição
- [x] Vida dos oponentes não atualizam
- [x] cleanup step pode ser removida
- [x] Shift + n (voltar a fase)
- [x] go to end step
- [ ] alguma ação não captura o evento de apertar o botão?
- [ ] hidden-card aparecendo do lado do nome da carta no aria!!!
- [ ] call attention to card not working
- [ ] falta botão pra adicionar ou remover poison, energy, etc.
- [ ] Search card FALTA MAIS INFORMAÇÃO DO CARD
- [ ] Não da pra passar o turno por ação no menu
- [ ] aumentar tamanho dos cards no search zone para tamanho normal ao invés de small
- [ ] repetir ações entre botões diferentes é foda... C pra comprar e mandar pra command zone?
- [ ] atalho pra shuffle library
- [ ] deu bug colocar 0/0 ou negativo no card (changed the special value of {} to {}) - linguagem ta horrivel
- [ ] power and toughness until the end of the turn -> precisa
- [ ] ações que afetam a carta em foco/selecionada
- [ ] hidden-card ta hidden pra mim tb
- [ ] player bar is too thick!

- npx @sentry/wizard@latest -i sourcemaps
https://docs.sentry.io/platforms/javascript/sourcemaps/troubleshooting_js/artifact-bundles/

It looks like the original source code for this stack frame couldn't be determined when this error was captured. To get the original code for this stack frame, Sentry needs source maps to be configured.

The easiest way to get started with source maps is by running the Sentry Source Map Wizard in the terminal inside your project:

npx @sentry/wizard@latest -i sourcemaps

There are multiple ways to configure source maps. The checklists below will help you set them up correctly. Choose one of the following processes:

Debug IDs (recommended)

    Releases

Debug IDs

are a way of matching your source files to source maps. Follow all of the steps below to get a readable stack trace:

Installed SDK supports Debug IDs

Stack frame doesn't have Debug IDs
No Debug ID Tooling Used

This event doesn't contain any Debug IDs. Read the Sentry Source Maps Documentation

to learn how to inject Debug IDs into your build artifacts and how to upload them to Sentry.

Source file with a matching Debug ID was uploaded

    Uploaded source map with a matching Debug ID

Once you changed your configuration, redeploy your app and capture a new event to verify your changes!