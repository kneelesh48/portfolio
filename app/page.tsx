"use client"

import { useTheme } from './context/ThemeContext';
import { useEffect, useState } from 'react';

export default function Home() {
  const { darkMode } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className={`h-[calc(100vh-72px)] flex flex-col items-center justify-center ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <h1 className="text-4xl font-bold mb-4">Portfolio</h1>
    </div>
  );
}
