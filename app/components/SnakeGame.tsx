"use client"

import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

const CANVAS_SIZE = 400;
const GRID_SIZE = 20;
const CELL_SIZE = CANVAS_SIZE / GRID_SIZE;

const Direction = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

function getRandomPosition() {
  return {
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
  };
}

function wrapPosition(pos: { x: number; y: number }) {
  return {
    x: (pos.x + GRID_SIZE) % GRID_SIZE,
    y: (pos.y + GRID_SIZE) % GRID_SIZE,
  };
}

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState(getRandomPosition());
  const [direction, setDirection] = useState(Direction.RIGHT);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const { darkMode } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== Direction.DOWN) setDirection(Direction.UP);
          break;
        case 'ArrowDown':
          if (direction !== Direction.UP) setDirection(Direction.DOWN);
          break;
        case 'ArrowLeft':
          if (direction !== Direction.RIGHT) setDirection(Direction.LEFT);
          break;
        case 'ArrowRight':
          if (direction !== Direction.LEFT) setDirection(Direction.RIGHT);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    if (gameOver) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        const head = { ...newSnake[0] };

        head.x += direction.x;
        head.y += direction.y;

        // Wrap around logic
        const wrappedHead = wrapPosition(head);
        head.x = wrappedHead.x;
        head.y = wrappedHead.y;

        // Check collision with self
        if (newSnake.some((segment, index) => index !== 0 && segment.x === head.x && segment.y === head.y)) {
          setGameOver(true);
          return prevSnake;
        }

        newSnake.unshift(head);

        // Check if snake ate food
        if (head.x === food.x && head.y === food.y) {
          setFood(getRandomPosition());
          setScore((prevScore) => prevScore + 1);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const gameLoop = setInterval(moveSnake, 150);
    return () => clearInterval(gameLoop);
  }, [direction, food, gameOver]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw snake
    ctx.fillStyle = darkMode ? 'lightgreen' : 'darkgreen';
    snake.forEach((segment) => {
      ctx.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE - 1, CELL_SIZE - 1);
    });

    // Draw food
    ctx.fillStyle = darkMode ? 'pink' : 'red';
    ctx.beginPath();
    ctx.arc(
      (food.x * CELL_SIZE) + (CELL_SIZE / 2),
      (food.y * CELL_SIZE) + (CELL_SIZE / 2),
      CELL_SIZE / 2 - 1,
      0,
      2 * Math.PI
    );
    ctx.fill();

  }, [snake, food, darkMode]);

  const handleRestart = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(getRandomPosition());
    setDirection(Direction.RIGHT);
    setGameOver(false);
    setScore(0);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className={`h-[calc(100vh-72px)] relative flex flex-col items-center justify-center ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}>
      <h1 className="text-3xl font-bold mb-4">Snake Game</h1>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className={`border-2 ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
        />
        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="text-white text-center">
              <h2 className="text-2xl font-bold mb-2">Game Over</h2>
              <p className="mb-4">Your score: {score}</p>
              <button
                onClick={handleRestart}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Restart
              </button>
            </div>
          </div>
        )}
      </div>
      <p className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Use arrow keys to control the snake</p>
      <p className="text-xl font-bold mt-4">Score: {score}</p>
    </div>
  );
}
