import { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

export default function GoGameOfLife() {
  // Step 1: Set up state
  const [boardSize, setBoardSize] = useState(0); // 0 means not chosen yet
  const [board, setBoard] = useState([]);
  const [turn, setTurn] = useState(1);
  const [maxTurns, setMaxTurns] = useState(40); // changed default from 10 to 40
  const [currentPlayer, setCurrentPlayer] = useState("black");
  const [blackScore, setBlackScore] = useState(0);
  const [whiteScore, setWhiteScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  // We'll track the dice roll each turn
  const [diceRollValue, setDiceRollValue] = useState(null);
  // Add state for number of dice faces
  const [diceFaces, setDiceFaces] = useState(6);
  // Add state for Game of Life notification
  const [gameOfLifeTriggered, setGameOfLifeTriggered] = useState(false);
  // Add state for game mode (dice-based or user-controlled)
  const [gameMode, setGameMode] = useState("dice"); // "dice" or "user"

  // Step 2: Initialize board after board size is chosen
  useEffect(() => {
    if (boardSize > 0) {
      // create empty board
      const newBoard = Array.from({ length: boardSize }, () =>
        Array.from({ length: boardSize }, () => "")
      );
      setBoard(newBoard);
    }
  }, [boardSize]);

  // Effect to clear Game of Life notification after 3 seconds
  useEffect(() => {
    if (gameOfLifeTriggered) {
      const timer = setTimeout(() => {
        setGameOfLifeTriggered(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [gameOfLifeTriggered]);

  // Helper: toggle players
  function nextPlayerColor(current) {
    return current === "black" ? "white" : "black";
  }

  // Restart game
  function handleRestart() {
    // Reset all states
    setBoardSize(0);
    setBoard([]);
    setTurn(1);
    setBlackScore(0);
    setWhiteScore(0);
    setGameOver(false);
    setDiceRollValue(null);
    setGameOfLifeTriggered(false);
    setGameMode("dice"); // Reset game mode to default
  }

  // Step 3: Handle cell click to place stone
  function handleCellClick(row, col) {
    if (gameOver) return;

    // If the cell is already taken, do nothing
    if (board[row][col] !== "") return;

    // Clear any previous Game of Life notification
    setGameOfLifeTriggered(false);

    // Place the stone
    const newBoard = board.map((r, rowIndex) =>
      r.map((cell, colIndex) => {
        if (rowIndex === row && colIndex === col) {
          return currentPlayer;
        } else {
          return cell;
        }
      })
    );
    
    // Apply Go capturing rules before checking for suicide
    const [boardAfterCapture, capturedStones] = applyCaptureRules(newBoard, row, col);
    
    // Check for suicide rule (only if no captures were made)
    if (capturedStones === 0) {
      const group = [];
      const visited = Array(boardSize).fill().map(() => Array(boardSize).fill(false));
      const hasLiberties = checkLiberties(boardAfterCapture, row, col, currentPlayer, visited, group);
      
      // If suicide move and not capturing any stones, don't allow
      if (!hasLiberties) {
        // Illegal move - cannot place stone here (suicide)
        return;
      }
    }
    
    // Update the board with captures applied
    setBoard(boardAfterCapture);
    
    // Update scores based on captured stones
    if (currentPlayer === "black") {
      setBlackScore(prev => prev + capturedStones);
    } else {
      setWhiteScore(prev => prev + capturedStones);
    }

    // Now handle end-of-turn logic
    endTurn(boardAfterCapture);
  }
  
  // Apply Go capturing rules
  function applyCaptureRules(boardState, placedRow, placedCol) {
    const opponentColor = currentPlayer === "black" ? "white" : "black";
    let capturedCount = 0;
    const boardCopy = boardState.map(row => [...row]);
    
    // Check adjacent positions for opponent groups to capture
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // Four directions: up, down, left, right
    
    for (const [dr, dc] of directions) {
      const adjRow = placedRow + dr;
      const adjCol = placedCol + dc;
      
      // Skip if out of bounds
      if (adjRow < 0 || adjRow >= boardSize || adjCol < 0 || adjCol >= boardSize) {
        continue;
      }
      
      // Skip if not an opponent stone
      if (boardCopy[adjRow][adjCol] !== opponentColor) {
        continue;
      }
      
      // Check if this group has liberties
      const group = [];
      const visited = Array(boardSize).fill().map(() => Array(boardSize).fill(false));
      const hasLiberties = checkLiberties(boardCopy, adjRow, adjCol, opponentColor, visited, group);
      
      // If no liberties, capture the group
      if (!hasLiberties) {
        for (const [r, c] of group) {
          boardCopy[r][c] = "";
          capturedCount++;
        }
      }
    }
    
    return [boardCopy, capturedCount];
  }
  
  // Check if a group has liberties (empty adjacent points)
  function checkLiberties(boardState, row, col, color, visited, group) {
    // Out of bounds
    if (row < 0 || row >= boardSize || col < 0 || col >= boardSize) {
      return false;
    }
    
    // Already visited
    if (visited[row][col]) {
      return false;
    }
    
    // Mark as visited
    visited[row][col] = true;
    
    // If empty, this group has a liberty
    if (boardState[row][col] === "") {
      return true;
    }
    
    // If not our color, not part of the group
    if (boardState[row][col] !== color) {
      return false;
    }
    
    // Add to group
    group.push([row, col]);
    
    // Check in all four directions
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    
    // If any direction has a liberty, the group has liberties
    return directions.some(([dr, dc]) => 
      checkLiberties(boardState, row + dr, col + dc, color, visited, group)
    );
  }

  // Step 4: End turn logic
  function endTurn(updatedBoard) {
    let conwayBoard = updatedBoard;
    
    // Only roll dice in dice mode
    if (gameMode === "dice") {
      // Roll dice
      const diceRoll = Math.floor(Math.random() * diceFaces) + 1;
      setDiceRollValue(diceRoll);

      // If we rolled a 1, run one iteration of Conway's Game of Life
      if (diceRoll === 1) {
        conwayBoard = runConway(updatedBoard);
        setBoard(conwayBoard);
        // Set the Game of Life notification
        setGameOfLifeTriggered(true);
      }
    } else {
      // In user-controlled mode, we don't roll dice
      setDiceRollValue(null);
    }

    // Increment turn count, switch player, check if game over
    const newTurn = turn + 1;
    if (newTurn > maxTurns) {
      // game over
      setGameOver(true);
      calculateFinalScores(conwayBoard);
      return;
    } else {
      setTurn(newTurn);
      setCurrentPlayer(nextPlayerColor(currentPlayer));
    }
  }

  // Handle manual Game of Life iteration
  function handleManualGameOfLife() {
    if (gameOver) return;
    
    const conwayBoard = runConway(board);
    setBoard(conwayBoard);
    setGameOfLifeTriggered(true);
  }

  // Step 5: Implement Conway's Game of Life logic
  function runConway(currentBoard) {
    // We'll create a copy of the board
    const newBoard = currentBoard.map((row) => [...row]);
    
    // First, determine all changes based on current state
    const removals = [];
    const additions = [];
    
    // Scan the board for changes (but don't apply them yet)
    for (let r = 0; r < boardSize; r++) {
      for (let c = 0; c < boardSize; c++) {
        const neighbors = getNeighbors(currentBoard, r, c);
        const cellColor = currentBoard[r][c];
        const stoneCount = neighbors.filter((x) => x !== "").length;

        if (cellColor !== "") {
          // Stone is present: standard life rules
          if (stoneCount < 2 || stoneCount > 3) {
            // Queue for removal
            removals.push({ r, c, color: cellColor });
          }
        } else {
          // Empty cell: a new stone is placed if exactly 3 neighbors
          if (stoneCount === 3) {
            const blackNeighbors = neighbors.filter((x) => x === "black").length;
            const whiteNeighbors = neighbors.filter((x) => x === "white").length;

            let newColor = "";
            if (blackNeighbors > whiteNeighbors) {
              newColor = "black";
            } else if (whiteNeighbors > blackNeighbors) {
              newColor = "white";
            } else {
              // tie => skip
            }

            if (newColor !== "") {
              // Queue for addition
              additions.push({ r, c, color: newColor });
            }
          }
        }
      }
    }
    
    // Now apply all the changes
    // First, remove stones
    for (const { r, c, color } of removals) {
      newBoard[r][c] = "";
      if (color === "black") {
        setBlackScore((prev) => prev - 1);
      } else {
        setWhiteScore((prev) => prev - 1);
      }
    }
    
    // Then, add new stones
    for (const { r, c, color } of additions) {
      newBoard[r][c] = color;
    }

    return newBoard;
  }

  // Helper function to get neighbors (8 directions)
  function getNeighbors(bd, r, c) {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];
    const result = [];

    directions.forEach(([dr, dc]) => {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < boardSize && nc >= 0 && nc < boardSize) {
        result.push(bd[nr][nc]);
      }
    });

    return result;
  }

  // Step 6: Calculate final scores at game end
  function calculateFinalScores(finalBoard) {
    let blackCount = 0;
    let whiteCount = 0;

    for (let r = 0; r < boardSize; r++) {
      for (let c = 0; c < boardSize; c++) {
        if (finalBoard[r][c] === "black") {
          blackCount++;
        } else if (finalBoard[r][c] === "white") {
          whiteCount++;
        }
      }
    }

    // add the final board's stones to the existing scores
    setBlackScore((prev) => prev + blackCount);
    setWhiteScore((prev) => prev + whiteCount);
  }

  // Step 7: Render board (Go-style intersections)
  function renderBoard() {
    // For a classic "Go" look, we draw the board lines and place stones on intersections.
    // We'll define a fixed pixel dimension for the board and calculate intersection positions.

    const boardDimension = 480; // total board width/height in pixels
    // If the user chooses 9x9, we have 9 lines horizontally & vertically.
    // We'll do (boardSize - 1) intervals between them.
    const cellSize = boardSize > 1 ? boardDimension / (boardSize - 1) : boardDimension;

    // 1) Render horizontal lines
    const horizontalLines = Array.from({ length: boardSize }, (_, i) => {
      const topOffset = i * cellSize;
      return (
        <div
          key={"h" + i}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: 1,
            backgroundColor: "black",
            top: topOffset,
          }}
        />
      );
    });

    // 2) Render vertical lines
    const verticalLines = Array.from({ length: boardSize }, (_, i) => {
      const leftOffset = i * cellSize;
      return (
        <div
          key={"v" + i}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: 1,
            backgroundColor: "black",
            left: leftOffset,
          }}
        />
      );
    });

    // 3) Render intersections
    const intersections = board.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        const topOffset = rowIndex * cellSize;
        const leftOffset = colIndex * cellSize;
        return (
          <div
            key={"i" + rowIndex + "," + colIndex}
            onClick={() => handleCellClick(rowIndex, colIndex)}
            style={{
              position: "absolute",
              top: topOffset - 12, // shift up half of stone's diameter
              left: leftOffset - 12, // shift left half of stone's diameter
              width: 24,
              height: 24,
              borderRadius: "50%",
              cursor: "pointer",
            }}
          >
            {/* If there's a stone, render it at the center of the intersection */}
            {cell !== "" && (
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  backgroundColor: cell === "black" ? "black" : "white",
                  border: cell === "white" ? "1px solid black" : "none",
                }}
              />
            )}
          </div>
        );
      })
    );

    return (
      <div
        className="relative"
        style={{
          width: boardDimension,
          height: boardDimension,
          backgroundColor: "#deb887", // wooden color
          margin: "0 auto",
        }}
      >
        {horizontalLines}
        {verticalLines}
        {intersections}
      </div>
    );
  }

  // Render UI
  return (
    <div className="p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Go Game of Life</h1>
      {boardSize === 0 && !gameOver && (
        <Card className="mb-4">
          <CardContent>
            <div className="mb-2">Choose Board Size:</div>
            <div className="flex gap-2">
              <Button onClick={() => setBoardSize(9)}>9x9</Button>
              <Button onClick={() => setBoardSize(13)}>13x13</Button>
              <Button onClick={() => setBoardSize(19)}>19x19</Button>
            </div>
            
            <div className="mt-4">Game Mode:</div>
            <div className="flex gap-2 mt-2">
              <Button 
                onClick={() => setGameMode("dice")} 
                className={gameMode === "dice" ? "bg-blue-700" : ""}
              >
                Dice-based Mode
              </Button>
              <Button 
                onClick={() => setGameMode("user")} 
                className={gameMode === "user" ? "bg-blue-700" : ""}
              >
                User-controlled Mode
              </Button>
            </div>
            
            {gameMode === "dice" && (
              <>
                <div className="mt-4">Select Number of Dice Faces:</div>
                <input
                  type="number"
                  min={2}
                  max={20}
                  className="border p-1 mt-2 w-20"
                  value={diceFaces}
                  onChange={(e) => setDiceFaces(parseInt(e.target.value) || 6)}
                />
              </>
            )}
            
            <div className="mt-4">Select Max Turns:</div>
            <input
              type="number"
              min={1}
              className="border p-1 mt-2 w-20"
              value={maxTurns}
              onChange={(e) => setMaxTurns(parseInt(e.target.value) || 40)}
            />
          </CardContent>
        </Card>
      )}

      {boardSize !== 0 && !gameOver && (
        <>
          <div className="mb-4 flex flex-col items-center">
            <div className="mb-2">Turn: {turn} / {maxTurns}</div>
            <div className="mb-2">Current Player: {currentPlayer.toUpperCase()}</div>
            
            {gameMode === "dice" ? (
              <div>Dice Roll: {diceRollValue !== null ? diceRollValue : "-"} (1 triggers Game of Life)</div>
            ) : (
              <Button 
                onClick={handleManualGameOfLife} 
                className="mt-2 bg-green-600 hover:bg-green-700"
              >
                Run Game of Life Iteration
              </Button>
            )}
          </div>
          {renderBoard()}
          
          {/* Game of Life notification - below the board */}
          <div className="h-12 flex items-center justify-center mt-2">
            {gameOfLifeTriggered && (
              <div className="p-2 bg-yellow-100 text-yellow-800 font-bold rounded-md animate-pulse">
                Conway's Game of Life iteration executed!
              </div>
            )}
          </div>
          
          <div className="mt-2 space-y-2">
            <div>Black Score: {blackScore}</div>
            <div>White Score: {whiteScore}</div>
          </div>
        </>
      )}

      {gameOver && (
        <div className="mt-4 text-center">
          <h2 className="text-2xl font-bold mb-2">Game Over!</h2>
          <p className="mb-2">Final Scores:</p>
          <p>Black: {blackScore}</p>
          <p>White: {whiteScore}</p>
          <p className="mb-4">
            Winner: {blackScore > whiteScore
              ? "Black"
              : blackScore < whiteScore
              ? "White"
              : "Tie"}
          </p>
          <Button onClick={handleRestart}>Restart Game</Button>
        </div>
      )}
    </div>
  );
} 