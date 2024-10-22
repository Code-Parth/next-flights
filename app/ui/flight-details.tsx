'use client';

import { usePlanesStore } from '../hooks/use-planes';

export function FlightDetails() {
  const flight = usePlanesStore((s) => s.selectedFlight);
  if (!flight) return null;

  return (
    <div className="fixed bottom-0 w-full left-0 p-2">
      <div className="relative w-full p-4 text-white bg-black rounded-md border border-gray-500">
        <div className="flex justify-between gap-4 items-end">
          <div className="flex flex-col gap-4">
            <p className="leading-none text-lg">{flight.callsign}</p>
            <p className="leading-none">
              <b className="opacity-50">Latitude</b> {flight.lat}
            </p>
            <p className="leading-none">
              <b className="opacity-50">Longitude</b> {flight.lon}
            </p>
          </div>
          <a
            href={`/flights/${flight.callsign}`}
            className="p-2 bg-blue leading-none uppercase text-sm font-mono"
          >
            Flight details
          </a>
        </div>
      </div>
    </div>
  );
}
