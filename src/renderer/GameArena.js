import { useEffect, useRef, useState, useMemo } from "react";
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
  const dialogRef = useRef(null);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogText, setDialogText] = useState("");
  const [formattedDialogText, setFormattedDialogText] = useState([]);

  useEffect(() => {
    setFormattedDialogText(dialogText.split("\n"));
    dialogRef?.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setDialogOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };

  }, [dialogText, dialogRef]);

  const player1References = useMemo(
    () => ({
      playerStats: player1StatsRef,
      hand: player1HandRef,
      graveyard: player1GraveyardRef,
      exile: player1ExileRef,
      battlefield: player1BattlefieldRef,
      library: player1LibraryRef,
      face_down: player1FaceDownRef,
      commander_zone: player1commanderZoneRef,
      sideboard: player1SideboardRef,
      log: player1LogRef,
      dialog: dialogRef,
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

  const handleRequestCommandList = () => {
    setDialogText(`Available Commands:
All commands are case sensitive!
--------------
Card on the Battlefield Commands:
\tt - Tap or untap card.
\ta - Declare card attacker.
\ts - Declare card blocker.
\tl - Flip card to the backside.
\tg - Send to graveyard.
\te - Send to exile.
\t1-7 - Put card at specified position on library.
\t0 - Put card on bottom of library.
\th - Put card on hand.
\to - Add +1/+1 counter.
\tk - Add -1/-1 counter.
\ti - Add counter.
\tj - Remove counter.
\ty - Clone card.
\tz - Put on the command zone.
\tv - Place card on face down zone.
--------------
Card in Hand Commands:
\tl - Flip card.
\tg - Put card on graveyard.
\te - Put card on exile.
\tt - Put card on top of library.
\tb - Put card on bottom of library.
\tf - Put card on face down zone.
--------------
Other Commands:
\tF1 - List all commands.
\tF2 - Force resync of game state.
\tF3 - Open card search.
\t; - Focus on chatbox.
\tx/< - Untap all permanents.
\t>/c - Draw a card.
\t(-) - Decrease life total.
\t=/* - Increase life total.
\te - Pass turn.
\tn - Pass phase.
\t_ - Decrease poison counters.
\t+ - Increase poison counters.
\tctrl p - Open Settings.
\tctrl 1 - View your stats.
\tctrl 2-6 - View other players stats in turn order.
\tctrl e - View your hand.
\tctrl s - View your battlefield.
\tctrl d - View your library.
\tctrl f - View your graveyard.
\tctrl q - View your exile.
\tctrl h - View your face down cards.
\tctrl b - View your commander zone.
\tctrl l - View game log.`);
    setDialogOpen(true);
    gameState.announce("Opened help dialog, press ctrl+o to focus on it, or press esc to close it.");
  };
  
  hotkeys.registerKeyCommand("F1", () => handleRequestCommandList(), "List all commands.");
  hotkeys.registerKeyCommand("F2", () => gameState.updateGameState(), "Force resync of game state.");
  hotkeys.registerKeyCommand("F3", () => gameState.requestListOfTokens(), "Open card search.");

  hotkeys.registerCtrlKeyCommand("p", () => handleChangeGameState("settings"), "Opens Settings");

  hotkeys.registerCtrlKeyCommand("1", () => hotkeys.playerRefs[1].playerStats.current.focus(), "Player 1 (Your) stats.");
  hotkeys.registerCtrlKeyCommand("2", () => hotkeys.playerRefs[2]?.playerStats?.current?.focus(), "Player 2 stats.");
  hotkeys.registerCtrlKeyCommand("3", () => hotkeys.playerRefs[3]?.playerStats?.current?.focus(), "Player 3 stats.");
  hotkeys.registerCtrlKeyCommand("4", () => hotkeys.playerRefs[4]?.playerStats?.current?.focus(), "Player 4 stats.");
  hotkeys.registerCtrlKeyCommand("5", () => hotkeys.playerRefs[5]?.playerStats?.current?.focus(), "Player 5 stats.");
  hotkeys.registerCtrlKeyCommand("6", () => hotkeys.playerRefs[6]?.playerStats?.current?.focus(), "Player 6 stats.");

  hotkeys.registerCtrlKeyCommand("e", () => hotkeys.playerRefs[1].hand?.current.focus(), "Your hand.");
  hotkeys.registerCtrlKeyCommand("s", () => hotkeys.playerRefs[1].battlefield?.current.focus(), "Your battlefield.");
  hotkeys.registerCtrlKeyCommand("d", () => hotkeys.playerRefs[1].library?.current.focus(), "Your library.");
  hotkeys.registerCtrlKeyCommand("f", () => hotkeys.playerRefs[1].graveyard?.current.focus(), "Your graveyard.");
  hotkeys.registerCtrlKeyCommand("q", () => hotkeys.playerRefs[1].exile?.current.focus(), "Your exile.");
  hotkeys.registerCtrlKeyCommand("h", () => hotkeys.playerRefs[1].face_down?.current.focus(), "Your face down cards.");
  hotkeys.registerCtrlKeyCommand("b", () => hotkeys.playerRefs[1].commander_zone?.current.focus(), "Your commander zone.");
  hotkeys.registerCtrlKeyCommand("l", () => hotkeys.playerRefs[1].log?.current.focus(), "Game log.");
  hotkeys.registerCtrlKeyCommand("o", () => hotkeys.playerRefs[1].dialog?.current.focus(), "Focus on open dialog.");
  
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
  hotkeys.lock();

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
      <dialog open={dialogOpen} onClose={() => setDialogOpen(false)} style={{fontSize: "10px", zIndex: 100, width: "30vw"}}>  
        <div tabIndex="0" ref={dialogRef}>
          {formattedDialogText.map((line, index) => (
            <p key={index} style={{margin: 2}} tabIndex={0}>{line}</p>
          ))}
        </div>
        <form method="dialog">
          <button>OK</button>
        </form>
      </dialog>

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
