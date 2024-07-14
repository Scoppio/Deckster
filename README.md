# Deckster VTT Client

## Available Scripts

In the project directory, you can run:

### `yarn build`

### `yarn electron:build`

### `yarn electron:servelocal`


## UI Design

https://www.figma.com/file/kaHRgV2BM6XKDEMVm4CCej/Game-UI---2-to-6-players?type=design&node-id=0-1&mode=design&t=BfxKDup3KRG9rxFL-0

## MANA FONT
http://mana.andrewgioia.com/index.html

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

Problemas:

F1 help:
 - precisa poder acessar linhas individualmente
 - faltando o ;
 - adicionar padding interno

Library:
 - Não ta permitingo navegar com botões pra cima e pra baixo se abrir com enter
 - view top x amount está tomando o foco

Selection:
 - espaço não deu feedback

Shortcuts:
 - ctrl+l: não funcionando para selecionar a area de log
 - ctrl+e: não funcionando, e sendo capturado e passando turno, e/ou mandando card pro exile
 
StaticBattlefield:
 - lane back battlefield não é focado

Lifebar:
 - Não aparece no log que minha vida mudou

Search Cards:
 - Não da pra selecionar card ou sair da tela!!! ✨ 

Library card search:
 - Faltando aria no search edit
 - colocar em ordem alfabética

Commander:
 - Commander casting cost não aparece 

Game phases:
 - Implementar todas as fases ✨ 
 - Upkeep reminder!  ✨ 

Rolagem de dados:
 - Não tem. ✨ 

Peek card in hand:
 - Não tem. ✨ 

 Chatbox:
 - Ta deslocado entre dois cards meus (back lane, card 1 e card 2)
  - teclas para navegar entre linhas do chat/log ✨ 