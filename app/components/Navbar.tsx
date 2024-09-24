'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { darkMode, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
}

  return (
    <nav className={`p-4 sticky top-0 ${darkMode ? 'bg-gray-900' : 'bg-gray-200'}`}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="space-x-4">
          <Link href="/" className={`${darkMode ? 'text-white hover:text-gray-300' : 'text-gray-800 hover:text-gray-600'}`}>Home</Link>
          <Link href="/paypalfeecalculator" className={`${darkMode ? 'text-white hover:text-gray-300' : 'text-gray-800 hover:text-gray-600'}`}>PayPal Fee Calculator</Link>
          <Link href="/passwordgenerator" className={`${darkMode ? 'text-white hover:text-gray-300' : 'text-gray-800 hover:text-gray-600'}`}>Password Generator</Link>
          <Link href="/randomusergenerator" className={`${darkMode ? 'text-white hover:text-gray-300' : 'text-gray-800 hover:text-gray-600'}`}>Random User Generator</Link>
          <Link href="/ripples" className={`${darkMode ? 'text-white hover:text-gray-300' : 'text-gray-800 hover:text-gray-600'}`}>Ripples</Link>
          <Link href="/snake" className={`${darkMode ? 'text-white hover:text-gray-300' : 'text-gray-800 hover:text-gray-600'}`}>Snake Game</Link>
          <Link href="/tictactoe" className={`${darkMode ? 'text-white hover:text-gray-300' : 'text-gray-800 hover:text-gray-600'}`}>Tic Tac Toe</Link>
        </div>
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full ${darkMode ? 'bg-yellow-400 text-black' : 'bg-gray-800 text-white'}`}
          aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>
    </nav>
  );
}
