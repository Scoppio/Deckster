import { useEffect, useRef, useMemo } from "react";
import { HotKeys } from "../../controllers/Hotkeys";
import Battlemap from "./Battlemap";

import "./main.css";

import PropTypes from "prop-types";

export function Main({ gameState }) {
  const player1HandRef = useRef(null);
  const player1BattlemapRef = useRef(null);
  const player1LogRef = useRef(null);

  const player1References = useMemo(
    () => ({
      battlemap: player1BattlemapRef,
      hand: player1HandRef,
      log: player1LogRef,
    }),
    []
  );

  const hotkeys = useMemo(
    () =>
      new HotKeys(gameState, [
        player1References,
      ]),
    [
      gameState,
      player1References,
    ]
  );

  hotkeys.registerKeyCommand("F1", () => gameState.listCommands(hotkeys), "List all commands.");
  hotkeys.registerCtrlKeyCommand("e", () => hotkeys.playerRefs[1].hand.current.focus(), "Your hand.");
  hotkeys.registerCtrlKeyCommand("s", () => hotkeys.playerRefs[1].battlemap.current.focus(), "Your battlemap.");
  hotkeys.registerCtrlKeyCommand("l", () => hotkeys.playerRefs[1].log.current.focus(), "Game log.");

  useEffect(() => {
    const handleKeyDown = (event) => {
      hotkeys.handleKeyDown(event);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [hotkeys]);
  // For now, only support 2 players
  return (
    <div className="main">
      <section className="main-left">
        <div className="main-arena">
          <Battlemap playerRef={player1References} />
        </div>
      </section>
    </div>
  );
}

Main.propTypes = {
  gameState: PropTypes.object.isRequired,
};
