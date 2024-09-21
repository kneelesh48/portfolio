"use client"

import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import Confetti from 'react-confetti';

type SquareValue = 'X' | 'O' | null;

interface SquareProps {
  value: SquareValue;
  onClick: () => void;
  isWinning?: boolean;
  darkMode: boolean;
}

const Square: React.FC<SquareProps> = ({ value, onClick, isWinning, darkMode }) => {
  return (
    <button
      className={`w-32 h-32 border text-2xl font-bold ${
        darkMode
          ? 'border-gray-600 bg-gray-700 hover:bg-gray-600 text-white'
          : 'border-gray-400 bg-white hover:bg-gray-100 text-black'
      } ${isWinning ? 'bg-green-500 hover:bg-green-500' : ''}`}
      onClick={onClick}
    >
      {value}
    </button>
  );
};

function calculateWinner(squares: SquareValue[]): { player: SquareValue; line: number[] } | null {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { player: squares[a], line: lines[i] };
      }
    }
    return null;
  }
  
export default function TicTacToe() {
  const [squares, setSquares] = useState<SquareValue[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState<boolean>(true);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const { darkMode } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClick = (i: number) => {
    if (winningLine || squares[i]) {
      return;
    }
    const newSquares = squares.slice();
    newSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(newSquares);
    setXIsNext(!xIsNext);

    const winner = calculateWinner(newSquares);
    if (winner) {
      setWinningLine(winner.line);
    }
  };

  const winner = calculateWinner(squares);
  let status: string;
  if (winner) {
    status = `Winner: ${winner.player}`;
  } else if (squares.every(square => square !== null)) {
    status = 'Draw!';
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  const renderSquare = (i: number) => {
    return (
      <Square
        value={squares[i]}
        onClick={() => handleClick(i)}
        isWinning={winningLine?.includes(i)}
        darkMode={darkMode}
      />
    );
  };

  const getLineStyle = () => {
    if (!winningLine) return {};
    const [a, b, c] = winningLine;
    const isHorizontal = Math.abs(a - b) === 1;
    const isVertical = Math.abs(a - b) === 3;
    const isDiagonal = (a === 0 && c === 8) || (a === 2 && c === 6);

    const baseStyle = {
      position: 'absolute',
      backgroundColor: darkMode ? 'white' : 'black',
    };

    if (isHorizontal) {
      return {
        ...baseStyle,
        width: '90%',
        height: '4px',
        top: `calc(${Math.floor(a / 3) * 33.33}% + 16.665%)`,
        left: '5%',
      };
    } else if (isVertical) {
      return {
        ...baseStyle,
        width: '4px',
        height: '90%',
        left: `calc(${a % 3 * 33.33}% + 16.665%)`,
        top: '5%',
      };
    } else if (isDiagonal) {
      return {
        ...baseStyle,
        width: '4px',
        height: '130%',
        top: '-15%',
        left: '50%',
        transform: a === 0 ? 'rotate(-45deg)' : 'rotate(45deg)',
        transformOrigin: 'center center',
      };
    }
  };

  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setWinningLine(null);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className={`h-[calc(100vh-72px)] flex flex-col items-center justify-center p-4 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <div className="flex flex-col items-center">
        {winner && <Confetti />}
        <div className="mb-4 text-3xl font-bold">Tic Tac Toe</div>
        <div className="grid grid-cols-3 gap-1 mb-4 relative">
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
          {winningLine && <div style={getLineStyle()} />}
        </div>
        <div className="mb-4 text-xl font-bold">{status}</div>
        <button
          className={`px-4 py-2 rounded ${
            darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
          onClick={resetGame}
        >
          Reset Game
        </button>
      </div>
    </div>
  );
};
