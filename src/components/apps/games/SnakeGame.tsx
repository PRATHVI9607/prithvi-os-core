import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };

export const SnakeGame = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [cellSize, setCellSize] = useState(20);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  const handleResize = useCallback(() => {
    if (gameContainerRef.current) {
      const width = gameContainerRef.current.offsetWidth;
      setCellSize(width / GRID_SIZE);
    }
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    return newFood;
  }, []);

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood());
    setGameOver(false);
    setScore(0);
    setIsPlaying(true);
  }, [generateFood]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      e.preventDefault();
      switch (e.key) {
        case "ArrowUp":
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case "ArrowDown":
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case "ArrowRight":
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [direction, isPlaying, gameOver]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const gameLoop = setInterval(() => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + direction.x,
          y: head.y + direction.y,
        };

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setFood(generateFood());
          setScore((s) => s + 10);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 150);

    return () => clearInterval(gameLoop);
  }, [direction, food, isPlaying, gameOver, generateFood]);

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
          className="border-2 border-border bg-card relative"
          style={{
            width: GRID_SIZE * cellSize,
            height: GRID_SIZE * cellSize,
          }}
        >
          {snake.map((segment, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: segment.x * cellSize,
                top: segment.y * cellSize,
                width: cellSize,
                height: cellSize,
                backgroundColor: i === 0 ? "hsl(var(--primary))" : "hsl(var(--accent))",
                borderRadius: "2px",
              }}
            />
          ))}
          <div
            style={{
              position: "absolute",
              left: food.x * cellSize,
              top: food.y * cellSize,
              width: cellSize,
              height: cellSize,
              backgroundColor: "hsl(var(--destructive))",
              borderRadius: "50%",
            }}
          />
        </div>

        {gameOver && (
          <div className="text-lg sm:text-xl font-bold text-destructive">Game Over!</div>
        )}

        <div className="text-xs sm:text-sm text-muted-foreground text-center">
          Use arrow keys to control the snake
        </div>
      </div>
    </Card>
  );
};
