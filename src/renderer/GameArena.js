import { useEffect, useRef, useMemo } from "react";
import { HotKeys } from "../controllers/Hotkeys";
import { GameStateBoard } from "./GameStateBoard";

import "./gameArena.css";

import PropTypes from "prop-types";
import { GameArenaTable } from "./GameArenaTable";

export function GameArena({ gameState, handleChangeGameState }) {
  const player1StatsRef = useRef(null);
  const player1HandRef = useRef(null);
  const player1GraveyardRef = useRef(null);
  const player1ExileRef = useRef(null);
  const player1BattlefieldRef = useRef(null);
  const player1LibraryRef = useRef(null);
  const player1FaceDownRef = useRef(null);
  const player1commanderZoneRef = useRef(null);
  const player1SideboardRef = useRef(null);
  const player1LogRef = useRef(null);
  const player1CardListZone = useRef(null);

  const player1References = useMemo(
    () => ({
      playerStats: player1StatsRef,
      hand: player1HandRef,
      graveyard: player1GraveyardRef,
      exile: player1ExileRef,
      battlefield: player1BattlefieldRef,
      library: player1LibraryRef,
      faceDown: player1FaceDownRef,
      commander_zone: player1commanderZoneRef,
      sideboard: player1SideboardRef,
      log: player1LogRef,
      card_list_zone: player1CardListZone,
    }),
    []
  );

  const player2StatsRef = useRef(null);
  const player2References = useMemo(
    () => ({ playerStats: player2StatsRef }),
    []
  );

  const player3StatsRef = useRef(null);
  const player3References = useMemo(
    () => ({ playerStats: player3StatsRef }),
    []
  );

  const player4StatsRef = useRef(null);
  const player4References = useMemo(
    () => ({ playerStats: player4StatsRef }),
    []
  );

  const player5StatsRef = useRef(null);
  const player5References = useMemo(
    () => ({ playerStats: player5StatsRef }),
    []
  );

  const player6StatsRef = useRef(null);
  const player6References = useMemo(
    () => ({ playerStats: player6StatsRef }),
    []
  );

  const hotkeys = useMemo(
    () =>
      new HotKeys(gameState, [
        player1References,
        player2References,
        player3References,
        player4References,
        player5References,
        player6References,
      ]),
    [
      gameState,
      player1References,
      player2References,
      player3References,
      player4References,
      player5References,
      player6References,
    ]
  );

  hotkeys.registerKeyCommand("F1", () => gameState.listCommands(hotkeys), "List all commands.");
  hotkeys.registerKeyCommand("F2", () => gameState.updateGameState(), "Force resync of game state.");
  hotkeys.registerCtrlKeyCommand("p", () => handleChangeGameState("settings"), "Opens Settings");
  hotkeys.registerCtrlKeyCommand("1", () => hotkeys.playerRefs[1].playerStats.current.focus(), "Player 1 (Your) stats.");
  hotkeys.registerCtrlKeyCommand("2", () => hotkeys.playerRefs[2]?.playerStats?.current?.focus(), "Player 2 stats.");
  hotkeys.registerCtrlKeyCommand("3", () => hotkeys.playerRefs[3]?.playerStats?.current?.focus(), "Player 3 stats.");
  hotkeys.registerCtrlKeyCommand("4", () => hotkeys.playerRefs[4]?.playerStats?.current?.focus(), "Player 4 stats.");
  hotkeys.registerCtrlKeyCommand("5", () => hotkeys.playerRefs[5]?.playerStats?.current?.focus(), "Player 5 stats.");
  hotkeys.registerCtrlKeyCommand("6", () => hotkeys.playerRefs[6]?.playerStats?.current?.focus(), "Player 6 stats.");

  hotkeys.registerCtrlKeyCommand("e", () => hotkeys.playerRefs[1].hand.current.focus(), "Your hand.");
  hotkeys.registerCtrlKeyCommand("s", () => hotkeys.playerRefs[1].battlefield.current.focus(), "Your battlefield.");
  hotkeys.registerCtrlKeyCommand("d", () => hotkeys.playerRefs[1].library.current.focus(), "Your library.");
  hotkeys.registerCtrlKeyCommand("f", () => hotkeys.playerRefs[1].graveyard.current.focus(), "Your graveyard.");
  hotkeys.registerCtrlKeyCommand("q", () => hotkeys.playerRefs[1].exile.current.focus(), "Your exile.");
  hotkeys.registerCtrlKeyCommand("h", () => hotkeys.playerRefs[1].faceDown.current.focus(), "Your face down cards.");
  hotkeys.registerCtrlKeyCommand("b", () => hotkeys.playerRefs[1].commander_zone.current.focus(), "Your commander zone.");
  hotkeys.registerCtrlKeyCommand("z", () => hotkeys.playerRefs[1].sideboard.current.focus(), "Your sideboard.");
  hotkeys.registerCtrlKeyCommand("l", () => hotkeys.playerRefs[1].log.current.focus(), "Game log.");
  hotkeys.registerCtrlKeyCommand("c", () => hotkeys.playerRefs[1].card_list_zone?.current?.focus(), "Card list zone.");

  hotkeys.registerCtrlShiftKeyCommand("J", () => gameState.tapUntapSelected(), "Tap/Untap selected cards.");
  hotkeys.registerCtrlShiftKeyCommand("L", () => gameState.declareAttacking(), "Declare attacking with selected cards.");
  hotkeys.registerCtrlShiftKeyCommand("U", () => gameState.declareBlocking(), "Declare blocking with selected cards.");

  hotkeys.registerKeyCommand("x", () => gameState.untapAll(), "Untap all your permanents.");
  hotkeys.registerKeyCommand("<", () => gameState.untapAll(), "Untap all your permanents.");
  hotkeys.registerKeyCommand(">", () => gameState.drawCard(), "Draw a card.");
  hotkeys.registerKeyCommand("c", () => gameState.drawCard(), "Draw a card.");
  hotkeys.registerKeyCommand("-", () => gameState.decreaseLife(), "Decrease your life total.");
  hotkeys.registerKeyCommand("=", () => gameState.increaseLife(), "Increase your life total.");
  hotkeys.registerKeyCommand("*", () => gameState.increaseLife(), "Increase your life total.");
  hotkeys.registerKeyCommand("e", () => gameState.passTurn(), "Pass the turn.");
  hotkeys.registerKeyCommand("n", () => gameState.changeGamePhase(), "Pass the phase.");


  hotkeys.registerKeyCommand("_", () => gameState.decreaseLife(), "Decrease your poison counters total.");
  hotkeys.registerKeyCommand("+", () => gameState.increaseLife(), "Increase your poiton counters total.");

  useEffect(() => {
    const handleKeyDown = (event) => {
      hotkeys.handleKeyDown(event);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [hotkeys]);
  
  return (
    <div className="main">
      <section className="main-left">
        <GameArenaTable {...{gameState, handleChangeGameState, player1References, player2References, player3References, player4References, player5References, player6References}} />
      </section>
      <section className="main-right">
        <GameStateBoard gameState={gameState} focusCard={gameState.focus_card} playerRef={player1References} />
      </section>
    </div>
  );
}

GameArena.propTypes = {
  gameState: PropTypes.object.isRequired,
  handleChangeGameState: PropTypes.func.isRequired,
};
