'use client';

import CircleMarker from '@/app/assets/circle-marker.svg';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { useMap } from '../hooks/use-map';
import { geocode } from '../utils/geocode';
import { Marker } from 'mapbox-gl';

export function AirportMarker() {
  const circleMarkerRef = useRef<HTMLDivElement | null>(null);

  const map = useMap();

  useEffect(() => {
    const circleMarkerEl = circleMarkerRef.current;
    if (!circleMarkerEl) return;

    const airportGeo = geocode('SFO');

    const marker = new Marker({
      element: circleMarkerEl.cloneNode(true) as HTMLElement,
    }).setLngLat([airportGeo.longitude, airportGeo.latitude]);

    marker.addTo(map.map);

    return () => {
      marker.remove();
    };
  }, []);

  return (
    <div className="hidden">
      <div ref={circleMarkerRef}>
        <Image src={CircleMarker} alt="Circle Marker" />
      </div>
    </div>
  );
}
