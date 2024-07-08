import tiny_push_button from "../resources/sounds/tiny_push_button.wav";
import placeholder_sound from "../resources/sounds/notification_sound.mp3";
import shuffle_sound from "../resources/sounds/riffle-shuffle-46706.mp3";
import card_untap_sound from "../resources/sounds/cardsound32562-37691.mp3";
import card_tap_sound from "../resources/sounds/card-sounds-35956.mp3";
import flip_card from "../resources/sounds/flipcard-91468.mp3";
import alert_sound from "../resources/sounds/wrong-answer-126515.mp3";
import card_drop_sound from "../resources/sounds/carddrop2-92718.mp3";
import no_response_sound from "../resources/sounds/marimba-bloop-3-188151.mp3";
import i_do_not_pay_sound from "../resources/sounds/error-3-125761.mp3";
import pass_turn_sound from "../resources/sounds/message-notification-103496.mp3";
import open_deck_sound from "../resources/sounds/jug-pop-3-186888.mp3";
import roll_dice_sound from "../resources/sounds/rolling-dice-2-102706.mp3";
import game_start_sound from "../resources/sounds/game-start-6104.mp3";
import remove_marker_sound from "../resources/sounds/mouse-click-104737.mp3";
import add_marker_sound from "../resources/sounds/rclick-13693.mp3";

const SoundTable = {
  PLACEHOLDER_SOUND: placeholder_sound,
  SHUFFLE_SOUND: shuffle_sound,
  DRAW_SOUND: tiny_push_button,
  FAIL_TO_DRAW_SOUND: alert_sound,
  ALERT_SOUND: alert_sound,
  FLIP_SOUND: flip_card,
  UNTAP_SOUND: card_untap_sound,
  TAP_SOUND: card_tap_sound,
  PLAY_SOUND: card_drop_sound,
  NO_RESPONSE_SOUND: no_response_sound,
  I_DO_NOT_PAY_SOUND: i_do_not_pay_sound,
  PASS_TURN_SOUND: pass_turn_sound,
  OPEN_DECK_SOUND: open_deck_sound,
  ROLL_DICE_SOUND: roll_dice_sound,
  GAME_START_SOUND: game_start_sound,
  ADD_COUNTER_SOUND: add_marker_sound,
  REMOVE_COUNTER_SOUND: remove_marker_sound,
};

export default class Sounds {
  constructor() {
    this.sounds = {};
  }

  playSound(sound_name, volume = 1.0) {
    const sound =
      this.sounds[sound_name] ||
      new Audio(SoundTable[sound_name] || placeholder_sound);
    sound.volume = volume;
    console.log("Playing sound: ", sound);
    const cloned_node = sound.cloneNode(true);
    cloned_node.volume = volume;
    cloned_node.play();
    this.sounds[sound_name] = sound;
  }
}
