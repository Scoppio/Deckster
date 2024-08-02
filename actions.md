# Actions

## Card on the battlefield actions

```js

  const flipCard = () => {
    const current_face_name = card.card_name;
    card.changeFace();
    setCardFace(card.card_face);
    gameState.sendChatMessage("Flipping " +current_face_name + " to " + card.card_name);
    gameState.updatePlayer("FLIP_SOUND");
    gameState.focusOnCard(card);
  };

  const tapCard = () => {
    card.tapped = !card.is_tapped;
    gameState.sendChatMessage(card.tapped ? "Tapped " + card.card_name : "Untapped " + card.card_name);
    gameState.updatePlayer("TAP_SOUND");
    gameState.focusOnCard(card);
  };

  const onFocus = () => {
    gameState.focusOnCard(card);
  };

  const onMouseOver = (event) => {
    gameState.focusOnCard(card);
    cardRef.current.focus();
  };

  const sendToGraveyard = () => {
    gameState.moveCardToZonePosition(cardCurrentRegion, positionIdx, "graveyard", card);
  };

  const sendToExile = () => {
    gameState.moveCardToZonePosition(cardCurrentRegion, positionIdx, "exile", card);
  };

  const addCounterPlusOnePlusOne = () => {
    gameState.changeCounter(cardCurrentRegion, positionIdx, 1, "+1/+1");
  };

  const addCounterMinusOneMinusOne = () => {
    gameState.changeCounter(cardCurrentRegion, positionIdx, -1, "-1/-1");
  };

  const addCounter = () => {
    gameState.changeCounter(cardCurrentRegion, positionIdx, 1);
  };

  const removeCounter = () => {
    gameState.changeCounter(cardCurrentRegion, positionIdx, -1);
  };

  const sendToLibraryNthPosition = (n) => {
    gameState.moveCardToZonePosition(cardCurrentRegion, positionIdx, "library", card, n);
  };

  const sendToHand = () => {
    gameState.moveCardToZonePosition(cardCurrentRegion, positionIdx, "hand", card);
  };

  const cloneCard = () => {
    gameState.cloneCard(card);
  };

  const sendToCommandZone = () => {
    gameState.moveCardToZonePosition(cardCurrentRegion, positionIdx, "commander_zone", card);
  };

  const sendToFaceDown = () => {
    gameState.moveCardToZonePosition(cardCurrentRegion, positionIdx, "face_down", card);
  };

  const declareAttacker = () => {
    gameState.sendChatMessage("Attacking with " + card.card_name);
  };

  const declareBlocker = () => {
    gameState.sendChatMessage("Blocking with " + card.card_name);
  };
```


## Card on the hand actions

```js

  const flipCard = () => {
    card.changeFace();
    setCardFace(card.card_face);
    gameState.updatePlayer();
    gameState.focusOnCard(card);
  };

  const sendToGraveyard = () => {
    gameState.moveCardToZonePosition("hand", positionIdx, "graveyard", card);
  };

  const sendToExile = () => {
    gameState.moveCardToZonePosition("hand", positionIdx, "exile", card);
  };

  const sendToFaceDown = () => {
    gameState.moveCardToZonePosition("hand", positionIdx, "face_down", card);
  };

  const sendToLibraryTop = () => {
    gameState.moveCardToZonePosition("hand", positionIdx, "library", card, 0);
  };

  const sendToLibraryBottom = () => {
    const lastIdx = gameState.player.library.length;
    gameState.moveCardToZonePosition("hand", positionIdx, "library", card, lastIdx);
  };

  const revealCardToAll = () => {
    gameState.switchRevealCardToAll(positionIdx);
  };

```

## Card on opponent table actions

```js
  
  const callAttentionToThisCard = () => {
    gameState.callAttentionToCard(ownerId, region, positionIdx);
  };

```

## Game actions

```
shuffle_library
draw_card
reveal_top_card (once, always, hide)
reveal_card_in_hand (reveal one card)
view_top_x_cards  (kind of scry)
view_library (open entire library)
untap_all
response (call out for a response)
i_do_not_pay (call out for i do not pay)

request_token (add card pr token to the game)
add_cards_to_battlefield (add cards or tokens to the battlefield, same thing as the previous one, but for multiple cards)

request_duplication_of_card (copy a card)

request_dice_roll (1D4, 1D6, 1D8, etc, its just a string with the number of dice and the type of dice is declared)
pass_turn
no_response
mulligan
draw_hand
change_game_phase

game_settings

update_player (most changes to the game are pushed using this action)
 
```