'use client';

import { CSSProperties, useEffect, useMemo } from 'react';
import { Flight } from './get-flights';
import { geocode } from './geocode';
import { getMapBounds, MapBounds } from './get-map-bounds';
import { useParams } from 'next/navigation';
import PlaneMarkerSrc from '@/app/assets/plane-marker.svg';
import Image from 'next/image';
import { usePlanesStore } from '@/app/hooks/use-planes';
import { clx } from './clx';
import { subscribableSetMap } from './draggable-static-map';

export function Planes({ flights }: { flights: Flight[] }) {
  const { airport } = useParams<{ airport: string }>();

  const { latitude, longitude } = geocode(airport);
  const bounds = getMapBounds(latitude, longitude);

  return (
    <div className="abosolute top-0 left-0 w-full h-full">
      {flights.map((flight) => (
        <PlaneMarker key={flight.fr24_id} bounds={bounds} flight={flight} />
      ))}
    </div>
  );
}

interface PlaneMarkerProps {
  bounds: MapBounds;
  flight: Flight;
}

function PlaneMarker({ bounds, flight }: PlaneMarkerProps) {
  const selectedFlight = usePlanesStore((s) => s.selectedFlight);

  const isSelected = selectedFlight?.fr24_id === flight.fr24_id;

  const { x, y } = useMemo(() => {
    const { northEast, southWest } = bounds;

    const x =
      (flight.lon - southWest.longitude) /
      (northEast.longitude - southWest.longitude);
    const y =
      (flight.lat - southWest.latitude) /
      (northEast.latitude - southWest.latitude);

    return { x, y };
  }, [bounds, flight]);

  const rotation = flight.track;

  const mapReady = usePlanesStore((s) => s.mapReady);

  /** Set pre-selected flight from url */
  useEffect(() => {
    if (!mapReady) return;

    const urlParams = new URLSearchParams(window.location.search);
    const flightId = urlParams.get('flight');
    if (flightId === flight.fr24_id) {
      subscribableSetMap.runCallbacks(flight.lat, flight.lon, true);
      usePlanesStore.setState({ selectedFlight: flight });
    }
  }, [mapReady]);

  return (
    <div
      style={
        {
          '--x': `${x * 100}%`,
          '--y': `${y * 100}%`,
          '--rotation': `${rotation}deg`,
        } as CSSProperties
      }
      className="absolute left-[var(--x)] top-[var(--y)] -rotate-[var(--rotation)] -translate-x-1/2 -translate-y-1/2"
      onClick={(e) => {
        e.preventDefault();
        usePlanesStore.setState({ selectedFlight: flight });
        const currentUrlParams = new URLSearchParams(window.location.search);
        currentUrlParams.set('flight', flight.fr24_id);
        window.history.replaceState(
          null,
          '',
          `${window.location.pathname}?${currentUrlParams.toString()}`,
        );
        subscribableSetMap.runCallbacks(flight.lat, flight.lon);
      }}
    >
      <div
        className={clx(
          'relative cursor-pointer opacity-100 transition-all scale-100 origin-center',
          {
            'opacity-60': !isSelected && selectedFlight?.fr24_id,
            'scale-125': isSelected,
          },
        )}
      >
        <Image
          width={40}
          height={48}
          className="object-contain rotate-180 w-[40px] h-[48px] block select-none"
          src={PlaneMarkerSrc}
          alt="Plane Marker"
          draggable={false}
        />
      </div>
    </div>
  );
}
