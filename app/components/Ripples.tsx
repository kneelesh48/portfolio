"use client"

import React, { useRef, useEffect, useState } from 'react';

interface Ripple {
  x: number;
  y: number;
  radius: number;
  startTime: number;
  maxRadius: number;
}

export default function PsychedelicRippleEffect() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [isCreatingRipples, setIsCreatingRipples] = useState<boolean>(false);
  const animationFrameRef = useRef<number | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<string>('#000000');

  const MAX_ELAPSED_TIME = 5000;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const generateColor = (time: number, radius: number, maxRadius: number): string => {
      const hue = (time / 50 + radius) % 360;
      // const hue = 203
      const saturation = 100;
      const lightness = 50 + (radius / maxRadius) * 30;
      return `hsla(${hue}, ${saturation}%, ${lightness}%, ${1 - radius / maxRadius})`;
    };

    const animate = () => {
      ctx.fillStyle = backgroundColor + '1A'; // Add 10% opacity
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const currentTime = Date.now();

      setRipples(prevRipples =>
        prevRipples.map(ripple => {
          const { x, y, radius, startTime, maxRadius } = ripple;
          const elapsed = currentTime - startTime;
          const newRadius = Math.min(radius + 3, maxRadius);

          ctx.beginPath();
          ctx.arc(x, y, newRadius, 0, Math.PI * 2);
          ctx.strokeStyle = generateColor(elapsed, newRadius, maxRadius);
          ctx.lineWidth = 2;
          ctx.stroke();

          return elapsed < MAX_ELAPSED_TIME ? { ...ripple, radius: newRadius } : null;
        }).filter((ripple): ripple is Ripple => ripple !== null)
      );

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [backgroundColor]); // Add backgroundColor to the dependency array

  const createRipple = (x: number, y: number) => {
    y -= 36;
    const maxRadius = Math.max(window.innerWidth, window.innerHeight);
    setRipples(prevRipples => [
      ...prevRipples,
      { x, y, radius: 0, startTime: Date.now(), maxRadius }
    ]);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsCreatingRipples(true);
    const touch = e.touches[0];
    createRipple(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (isCreatingRipples) {
      const touch = e.touches[0];
      createRipple(touch.clientX, touch.clientY);
    }
  };

  const handleTouchEnd = () => {
    setIsCreatingRipples(false);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsCreatingRipples(true);
    createRipple(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isCreatingRipples) {
      createRipple(e.clientX, e.clientY);
    }
  };

  const handleMouseUp = () => {
    setIsCreatingRipples(false);
  };

  return (
    <>
      <div className="absolute top-24 left-4">
        <input
          type="color"
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)}
          className="w-8 h-8 cursor-pointer"
        />
      </div>
      <canvas
        ref={canvasRef}
        className="w-full h-[calc(100vh-72px)] touch-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </>
  );
}
