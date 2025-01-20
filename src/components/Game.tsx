import React, { useEffect, useState } from "react";
import "../styles/game.css";

// Types for the snake and direction
type Coordinate = { x: number; y: number };
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = { x: 5, y: 5 };

const Game: React.FC = () => {
  const [snake, setSnake] = useState<Coordinate[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Coordinate>(INITIAL_FOOD);
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [gameOver, setGameOver] = useState(false);

  // Update snake position based on direction
  useEffect(() => {
    if (gameOver) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
          if (direction !== "DOWN") setDirection("UP");
          break;
        case "ArrowDown":
          if (direction !== "UP") setDirection("DOWN");
          break;
        case "ArrowLeft":
          if (direction !== "RIGHT") setDirection("LEFT");
          break;
        case "ArrowRight":
          if (direction !== "LEFT") setDirection("RIGHT");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction, gameOver]);

  // Move snake at a set interval
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        const head = { ...newSnake[0] };

        // Update head based on direction
        switch (direction) {
          case "UP":
            head.y -= 1;
            break;
          case "DOWN":
            head.y += 1;
            break;
          case "LEFT":
            head.x -= 1;
            break;
          case "RIGHT":
            head.x += 1;
            break;
        }

        // Check for collision with food
        if (head.x === food.x && head.y === food.y) {
          newSnake.unshift(head); // Grow snake
          setFood({
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE),
          });
        } else {
          newSnake.pop(); // Move forward by removing tail
          newSnake.unshift(head);
        }

        // Check for collision with walls or itself
        if (
          head.x < 0 ||
          head.x >= GRID_SIZE ||
          head.y < 0 ||
          head.y >= GRID_SIZE ||
          newSnake
            .slice(1)
            .some((segment) => segment.x === head.x && segment.y === head.y)
        ) {
          setGameOver(true);
        }

        return newSnake;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [direction, food, gameOver]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection("RIGHT");
    setGameOver(false);
  };

  console.log("Snake => -> ", snake);

  console.log("Food => -> ", food);

  return (
    <div>
      <h1>Snake Game</h1>
      <div className="game-board">
        {Array.from({ length: GRID_SIZE }).map((_, y) => (
          <div key={y} className="game-row">
            {Array.from({ length: GRID_SIZE }).map((_, x) => {
              const isSnake = snake.some(
                (segment) => segment.x === x && segment.y === y
              );

              console.log("X => ", x, "Y => ", y, "is snake => ", isSnake);

              const isFood = food.x === x && food.y === y;
              return (
                <div
                  key={x}
                  className={`game-cell ${isSnake ? "snake" : ""} ${
                    isFood ? "food" : ""
                  }`}
                />
              );
            })}
          </div>
        ))}
      </div>
      {gameOver && (
        <div className="game-over">
          <p>Game Over</p>
          <button onClick={resetGame}>Restart</button>
        </div>
      )}
    </div>
  );
};

export default Game;
