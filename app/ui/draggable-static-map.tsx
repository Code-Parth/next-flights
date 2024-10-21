'use client';

import { useEffect, useRef, useState } from 'react';

interface DraggableStaticMapProps {
  children: React.ReactNode;
}

export function DraggableStaticMap({ children }: DraggableStaticMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const mapShift = useRef({ x: 0, y: 0 });
  const startingPosition = useRef({ x: 0, y: 0 });

  // ensure container is square covering the window
  const [containerSize, setContainerSize] = useState(0);
  useEffect(() => {
    const handleResize = () => {
      const width = document.body.clientWidth;
      const height = document.body.clientHeight;

      setContainerSize(Math.max(width, height));
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    document.body.style.cursor = isDragging ? 'grabbing' : 'grab';
  }, [isDragging]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const container = containerRef.current;
    if (!container) return;

    function handleStart(clientX: number, clientY: number) {
      setIsDragging(true);
      startingPosition.current = {
        x: clientX,
        y: clientY,
      };
    }

    function handleMove(clientX: number, clientY: number) {
      if (!isDragging) return;
      const dx = clientX - startingPosition.current.x;
      const dy = clientY - startingPosition.current.y;

      mapShift.current.x += dx;
      mapShift.current.y += dy;

      container!.style.setProperty(
        '--x',
        `${Math.round(mapShift.current.x)}px`,
      );
      container!.style.setProperty(
        '--y',
        `${Math.round(mapShift.current.y)}px`,
      );

      startingPosition.current = { x: clientX, y: clientY };
    }

    function handleEnd() {
      setIsDragging(false);
    }

    // Mouse events
    function handleMouseDown(event: MouseEvent) {
      handleStart(event.clientX, event.clientY);
    }

    function handleMouseMove(event: MouseEvent) {
      handleMove(event.clientX, event.clientY);
    }

    // Touch events
    function handleTouchStart(event: TouchEvent) {
      const touch = event.touches[0];
      handleStart(touch.clientX, touch.clientY);
    }

    function handleTouchMove(event: TouchEvent) {
      const touch = event.touches[0];
      handleMove(touch.clientX, touch.clientY);
    }

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleEnd);

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleEnd);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);

      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]);

  return (
    <div
      className="relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 aspect-square"
      style={{ width: `${containerSize}px`, height: `${containerSize}px` }}
    >
      <div
        id="draggable-static-map"
        ref={containerRef}
        className="translate-x-[var(--x)] translate-y-[var(--y)] will-change-transform relative top-0 left-0 w-full h-full"
      >
        {children}
      </div>
    </div>
  );
}
