import { GameStateBoard } from "./GameStateBoard";
import { NorthTable, SouthTable } from "./PlayerTable";

import "./gameTablePlacement.css";

import PropTypes from "prop-types";

// return (
//   <Row>
//     <Col>
//       {gameState.players.length === 1 || gameState.players.length === 2 ? (
//         <>
//           <Row>
//             <NorthTable
//               barSide="left"
//               gameState={gameState}
//               playerRef={player2References}
//               heightVh={100 / 2}
//               playerNumber={1}
//               player={gameState.players[1]}
//               isActivePlayer={gameState.activePlayer === 1}
//               landsOnNorth={true}
//             />
//           </Row>
//           <Row>
//             <SouthTable
//               gameState={gameState}
//               playerRef={player1References}
//               playerNumber={0}
//               heightVh={100 / 2}
//               player={gameState.players[0]}
//               isActivePlayer={gameState.activePlayer === 0}
//             />
//           </Row>
//         </>
//       ) : gameState.players.length === 3 || gameState.players.length === 4 ? (
//         <>
//           <Row>
//             <NorthTable
//               barSide="left"
//               gameState={gameState}
//               playerRef={player2References}
//               heightVh={100 / 2}
//               playerNumber={1}
//               player={gameState.players[1]}
//               isActivePlayer={gameState.activePlayer === 1}
//               landsOnNorth={true}
//             />
//           </Row>
//           <Row>
//             <SouthTable
//               gameState={gameState}
//               playerRef={player1References}
//               playerNumber={0}
//               heightVh={100 / 2}
//               player={gameState.players[0]}
//               isActivePlayer={gameState.activePlayer === 0}
//             />
//           </Row>
//         </>
//       ) : (
//         <>
//           <Row>
//             <NorthTable
//               barSide="left"
//               gameState={gameState}
//               playerRef={player2References}
//               heightVh={100 / 3}
//               playerNumber={1}
//               player={gameState.players[1]}
//               isActivePlayer={gameState.activePlayer === 1}
//               landsOnNorth={true}
//             />
//           </Row>
//           <Row>
//             <NorthTable
//               barSide="left"
//               gameState={gameState}
//               playerRef={player2References}
//               heightVh={100 / 3}
//               playerNumber={1}
//               player={gameState.players[1]}
//               isActivePlayer={gameState.activePlayer === 1}
//               landsOnNorth={true}
//             />
//           </Row>
//           <Row>
//             <SouthTable
//               gameState={gameState}
//               playerRef={player1References}
//               playerNumber={0}
//               heightVh={100 / 3}
//               player={gameState.players[0]}
//               isActivePlayer={gameState.activePlayer === 0}
//             />
//           </Row>
//         </>
//       )}
//     </Col>
//     {gameState.players.length === 3 || gameState.players.length === 4 ? (
//       <Col>
//         <Row>
//           <NorthTable
//             barSide="right"
//             gameState={gameState}
//             playerRef={player2References}
//             heightVh={100 / 2}
//             playerNumber={1}
//             player={gameState.players[1]}
//             isActivePlayer={gameState.activePlayer === 1}
//             landsOnNorth={true}
//           />
//         </Row>
//         <Row>
//           <NorthTable
//             barSide="right"
//             gameState={gameState}
//             playerRef={player2References}
//             heightVh={100 / 2}
//             playerNumber={1}
//             player={gameState.players[1]}
//             isActivePlayer={gameState.activePlayer === 1}
//             landsOnNorth={false}
//           />
//         </Row>
//       </Col>
//     ) : gameState.players.length === 5 || gameState.players.length === 6 ? (
//       <Col>
//         <Row>
//           <NorthTable
//             barSide="right"
//             gameState={gameState}
//             playerRef={player2References}
//             heightVh={100 / 3}
//             playerNumber={1}
//             player={gameState.players[1]}
//             isActivePlayer={gameState.activePlayer === 1}
//             landsOnNorth={true}
//           />
//         </Row>
//         <Row>
//           <NorthTable
//             barSide="right"
//             gameState={gameState}
//             playerRef={player2References}
//             heightVh={100 / 3}
//             playerNumber={1}
//             player={gameState.players[1]}
//             isActivePlayer={gameState.activePlayer === 1}
//             landsOnNorth={true}
//           />
//         </Row>
//         <Row>
//           <NorthTable
//             barSide="right"
//             gameState={gameState}
//             playerRef={player2References}
//             heightVh={100 / 3}
//             playerNumber={1}
//             player={gameState.players[1]}
//             isActivePlayer={gameState.activePlayer === 1}
//             landsOnNorth={false}
//           />
//         </Row>
//       </Col>
//     ) : null}
//     <Col md="auto" style={{ backgroundColor: "green" }}>
//       <GameStateBoard gameState={gameState} playerRef={player1References} />
//     </Col>
//   </Row>
// );
