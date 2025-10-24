import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const ROWS = 20;
const COLS = 10;

const SHAPES = [
  [[1, 1, 1, 1]], // I
  [[1, 1], [1, 1]], // O
  [[1, 1, 1], [0, 1, 0]], // T
  [[1, 1, 1], [1, 0, 0]], // L
  [[1, 1, 1], [0, 0, 1]], // J
  [[1, 1, 0], [0, 1, 1]], // S
  [[0, 1, 1], [1, 1, 0]], // Z
];

const COLORS = [
  "hsl(180, 100%, 50%)", // cyan
  "hsl(60, 100%, 50%)", // yellow
  "hsl(300, 100%, 50%)", // magenta
  "hsl(30, 100%, 50%)", // orange
  "hsl(240, 100%, 50%)", // blue
  "hsl(120, 100%, 50%)", // green
  "hsl(0, 100%, 50%)", // red
];

export const TetrisGame = () => {
  const [board, setBoard] = useState(() =>
    Array.from({ length: ROWS }, () => Array(COLS).fill(0))
  );
  const [currentPiece, setCurrentPiece] = useState<any>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [cellSize, setCellSize] = useState(25);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  const handleResize = useCallback(() => {
    if (gameContainerRef.current) {
      const width = gameContainerRef.current.offsetWidth;
      const height = gameContainerRef.current.offsetHeight;
      const newCellSize = Math.min(width / COLS, height / ROWS);
      setCellSize(newCellSize > 0 ? newCellSize : 25);
    }
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  const createPiece = useCallback(() => {
    const shapeIndex = Math.floor(Math.random() * SHAPES.length);
    return {
      shape: SHAPES[shapeIndex],
      color: COLORS[shapeIndex],
      x: Math.floor(COLS / 2) - 1,
      y: 0,
    };
  }, []);

  const checkCollision = useCallback(
    (piece: any, board: number[][], offsetX = 0, offsetY = 0) => {
      for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
          if (piece.shape[y][x]) {
            const newX = piece.x + x + offsetX;
            const newY = piece.y + y + offsetY;
            if (
              newX < 0 ||
              newX >= COLS ||
              newY >= ROWS ||
              (newY >= 0 && board[newY][newX])
            ) {
              return true;
            }
          }
        }
      }
      return false;
    },
    []
  );

  const mergePiece = useCallback((piece: any, board: number[][]) => {
    const newBoard = board.map((row) => [...row]);
    piece.shape.forEach((row: number[], y: number) => {
      row.forEach((cell: number, x: number) => {
        if (cell && piece.y + y >= 0) {
          newBoard[piece.y + y][piece.x + x] = piece.color;
        }
      });
    });
    return newBoard;
  }, []);

  const clearLines = useCallback((board: number[][]) => {
    let newBoard = board.filter((row) => row.some((cell) => !cell));
    const linesCleared = ROWS - newBoard.length;
    const emptyRows = Array.from({ length: linesCleared }, () =>
      Array(COLS).fill(0)
    );
    return {
      board: [...emptyRows, ...newBoard],
      linesCleared,
    };
  }, []);

  const resetGame = useCallback(() => {
    setBoard(Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
    setCurrentPiece(createPiece());
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
  }, [createPiece]);

  useEffect(() => {
    if (!isPlaying || gameOver || !currentPiece) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.key === "ArrowLeft" && !checkCollision(currentPiece, board, -1, 0)) {
        setCurrentPiece({ ...currentPiece, x: currentPiece.x - 1 });
      } else if (e.key === "ArrowRight" && !checkCollision(currentPiece, board, 1, 0)) {
        setCurrentPiece({ ...currentPiece, x: currentPiece.x + 1 });
      } else if (e.key === "ArrowDown" && !checkCollision(currentPiece, board, 0, 1)) {
        setCurrentPiece({ ...currentPiece, y: currentPiece.y + 1 });
      } else if (e.key === "ArrowUp") {
        // Rotate
        const rotated = currentPiece.shape[0].map((_: any, i: number) =>
          currentPiece.shape.map((row: any[]) => row[i]).reverse()
        );
        const rotatedPiece = { ...currentPiece, shape: rotated };
        if (!checkCollision(rotatedPiece, board)) {
          setCurrentPiece(rotatedPiece);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentPiece, board, checkCollision, isPlaying, gameOver]);

  useEffect(() => {
    if (!isPlaying || gameOver || !currentPiece) return;

    const gameLoop = setInterval(() => {
      if (!checkCollision(currentPiece, board, 0, 1)) {
        setCurrentPiece({ ...currentPiece, y: currentPiece.y + 1 });
      } else {
        const newBoard = mergePiece(currentPiece, board);
        const { board: clearedBoard, linesCleared } = clearLines(newBoard);
        setBoard(clearedBoard);
        setScore((s) => s + linesCleared * 100);

        const newPiece = createPiece();
        if (checkCollision(newPiece, clearedBoard)) {
          setGameOver(true);
          setIsPlaying(false);
        } else {
          setCurrentPiece(newPiece);
        }
      }
    }, 500);

    return () => clearInterval(gameLoop);
  }, [currentPiece, board, checkCollision, mergePiece, clearLines, createPiece, isPlaying, gameOver]);

  const renderBoard = () => {
    const displayBoard = board.map((row) => [...row]);
    if (currentPiece) {
      currentPiece.shape.forEach((row: number[], y: number) => {
        row.forEach((cell: number, x: number) => {
          if (cell && currentPiece.y + y >= 0 && currentPiece.y + y < ROWS) {
            displayBoard[currentPiece.y + y][currentPiece.x + x] = currentPiece.color;
          }
        });
      });
    }
    return displayBoard;
  };

  return (
    <Card className="p-2 sm:p-6" ref={gameContainerRef}>
      <div className="flex flex-col items-center gap-2 sm:gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-8">
          <div className="text-lg sm:text-xl font-bold">Score: {score}</div>
          {!isPlaying && !gameOver && (
            <Button onClick={resetGame} size="sm">Start Game</Button>
          )}
          {gameOver && (
            <Button onClick={resetGame} size="sm">Play Again</Button>
          )}
        </div>

        <div
          className="border-2 border-border bg-card"
          style={{
            width: COLS * cellSize,
            height: ROWS * cellSize,
            display: "grid",
            gridTemplateRows: `repeat(${ROWS}, ${cellSize}px)`,
            gridTemplateColumns: `repeat(${COLS}, ${cellSize}px)`,
          }}
        >
          {renderBoard().map((row, y) =>
            row.map((cell, x) => (
              <div
                key={`${y}-${x}`}
                style={{
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: cell || "hsl(var(--muted))",
                  border: "1px solid hsl(var(--border))",
                }}
              />
            ))
          )}
        </div>

        {gameOver && (
          <div className="text-lg sm:text-xl font-bold text-destructive">Game Over!</div>
        )}

        <div className="text-xs sm:text-sm text-muted-foreground text-center">
          Use arrow keys: ← → to move, ↓ to drop, ↑ to rotate
        </div>
      </div>
    </Card>
  );
};
