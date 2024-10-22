'use client';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useStateToRef } from '@/app/hooks/use-state-to-ref';
import { usePlanesStore } from '../hooks/use-planes';

interface DraggableStaticMapProps {
  children: React.ReactNode;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export function DraggableStaticMap({ children }: DraggableStaticMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useStateToRef(isDragging);
  const mapShift = useRef({ x: 0, y: 0 });
  const startingPosition = useRef({ x: 0, y: 0 });

  // ensure container is square covering the window
  const [containerSize, setContainerSize] = useState(0);
  const containerSizeRef = useStateToRef(containerSize);
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

  const router = useRouter();
  const pathname = usePathname();
  const pathnameRef = useStateToRef(pathname);

  const initialParams = useMemo(() => {
    if (typeof window === 'undefined') return null;

    const urlParams = new URLSearchParams(window.location.search);
    return {
      x: Number(urlParams.get('x')) ?? 0,
      y: Number(urlParams.get('y')) ?? 0,
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const width = document.body.clientWidth;
    const height = document.body.clientHeight;

    const size = Math.max(width, height);

    if (initialParams) {
      mapShift.current.x = initialParams.x * size;
      mapShift.current.y = initialParams.y * size;

      // update container
      container!.style.setProperty('--x', `${mapShift.current.x}px`);
      container!.style.setProperty('--y', `${mapShift.current.y}px`);
    }
  }, [initialParams]);

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
      if (!isDraggingRef.current) return;

      // calculate shift
      const dx = clientX - startingPosition.current.x;
      const dy = clientY - startingPosition.current.y;
      mapShift.current.x += dx;
      mapShift.current.y += dy;

      mapShift.current.x = clamp(
        mapShift.current.x,
        -containerSizeRef.current,
        containerSizeRef.current,
      );
      mapShift.current.y = clamp(
        mapShift.current.y,
        -containerSizeRef.current,
        containerSizeRef.current,
      );

      // update container
      container!.style.setProperty('--x', `${mapShift.current.x}px`);
      container!.style.setProperty('--y', `${mapShift.current.y}px`);

      startingPosition.current = { x: clientX, y: clientY };
    }

    function handleEnd() {
      setIsDragging(false);

      // update url
      const urlParams = new URLSearchParams(window.location.search);
      const x = mapShift.current.x / containerSizeRef.current;
      const y = mapShift.current.y / containerSizeRef.current;
      urlParams.set('x', x.toString());
      urlParams.set('y', y.toString());
      window.history.replaceState(
        null,
        '',
        `${pathnameRef.current}?${urlParams.toString()}`,
      );
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

    function handleClick(event: MouseEvent) {
      console.log('clicked', event.defaultPrevented);

      if (event.defaultPrevented) return;

      usePlanesStore.setState({ selectedFlight: null });
    }

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('click', handleClick);

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleEnd);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('click', handleClick);

      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDraggingRef, router, pathnameRef]);

  return (
    <div
      className="relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 aspect-square transition-opacity duration-100"
      style={{
        width: `${containerSize}px`,
        height: `${containerSize}px`,
        opacity: containerSize === 0 ? 0 : 1,
      }}
    >
      <div
        id="draggable-static-map"
        ref={containerRef}
        className="will-change-transform relative top-0 left-0 w-full h-full"
        style={{
          transform: 'translate3d(var(--x), var(--y), 0)',
        }}
      >
        {children}
      </div>
    </div>
  );
}
