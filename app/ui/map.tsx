'use client';

import mapboxgl, { LngLatLike } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  PropsWithChildren,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { MapType } from './types';
import { MapContext } from '@/app/hooks/use-map';
import { AirportMarker } from './airport-marker';


const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

if (!mapboxToken) throw new Error('NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN is not set');

const INITIAL_CENTER = [-122.45218475296957, 37.66019807169039] as const satisfies LngLatLike;
const INITIAL_ZOOM = 9;

interface MapProviderProps {
  children?: ReactNode;
  mapContainerRef: React.RefObject<HTMLDivElement>;
}

export function MapProvider({ children, mapContainerRef }: MapProviderProps) {
  const mapRef = useRef<MapType | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    mapboxgl.accessToken = mapboxToken;
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
      attributionControl: false,
      logoPosition: 'top-right',
      style: 'mapbox://styles/mapbox/dark-v11',
    });

    mapRef.current = map;
    setIsMapReady(true);

    return () => {
      if (map) map.remove();
    };
  }, []);

  if (!isMapReady) return null;

  return (
    <MapContext.Provider value={{ map: mapRef.current! }}>
      {children}
    </MapContext.Provider>
  );
}

interface MapProps {
  params: Promise<{ airport: string }>;
}

export function Map({ children }: PropsWithChildren<MapProps>) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  return (
    <div className="relative w-full h-full">
      <div
        id="map-container"
        ref={mapContainerRef}
        className="absolute inset-0 h-full w-full"
      />
      <MapProvider mapContainerRef={mapContainerRef}>
        <AirportMarker />
        {children}
        </MapProvider>
    </div>
  );
}
