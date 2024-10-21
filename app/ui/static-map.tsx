import { geocode } from '@/app/ui/geocode';
import Image from 'next/image';
import { getMapBounds } from './get-map-bounds';
import { DraggableStaticMap } from './draggable-static-map';
import { CSSProperties } from 'react';

const MAP_WIDTH = 1000;
const MAP_HEIGHT = 1000;

interface StaticMapProps {
  params: Promise<{ airport: string }>;
  children: React.ReactNode;
}

const shifts: [number, number][] = [];

for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    shifts.push([i - 1, j - 1]);
  }
}

export async function StaticMap({ params, children }: StaticMapProps) {
  const mapsUrls = await Promise.all(
    shifts.map((shift) => createUrl({ params, shift })),
  );

  return (
    <DraggableStaticMap>
      {mapsUrls.map(({ url, shift }) => (
        <Image
          key={shift.join(',')}
          src={url}
          alt="Map with flight markers"
          className="object-cover w-full h-full absolute inset-0 left-0 top-0 select-none translate-x-[var(--x)] translate-y-[var(--y)]"
          style={
            {
              '--x': `${shift[0] * 100}%`,
              '--y': `${-shift[1] * 100}%`,
            } as CSSProperties
          }
          width={MAP_WIDTH}
          height={MAP_HEIGHT}
          draggable={false}
          priority
        />
      ))}
      {children}
    </DraggableStaticMap>
  );
}

// Utils

async function createUrl({
  params,
  shift,
}: {
  params: Promise<{ airport: string }>;
  shift: [number, number];
}) {
  const { airport } = await params;
  const baseUrl = 'https://api.mapbox.com/styles/v1/mapbox/dark-v11/static';

  const { latitude, longitude } = geocode(airport);
  const { southWest, northEast } = getMapBounds(latitude, longitude, shift);

  const urlQuery = new URLSearchParams({
    access_token: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!,
  });
  const urlParams = [];
  // const markers = []

  // // Add airport marker
  // markers.push(`pin-s+00ff00(${longitude},${latitude})`)

  // if (flights && flights.length > 0) {
  //   // Add flight markers
  //   flights.forEach((flight) => {
  //     markers.push(`pin-s+ff0000(${flight.lon},${flight.lat})`)
  //   })
  //   urlParams.push(markers.join(","))

  //   // automatically determine map center and zoom using the same
  //   // bounds provided to flights
  //
  // } else {
  //   // When no flights are provided, manually set the center
  //   // and zoom level using the airport coordinates
  //   urlParams.push(markers.join(","))
  // }

  // urlParams.push(`${longitude},${latitude},9`)

  // Bounding box format expected by Mapbox
  const bounds = `[${southWest.longitude},${southWest.latitude},${northEast.longitude},${northEast.latitude}]`;
  urlParams.push(bounds);

  urlParams.push(`${MAP_WIDTH}x${MAP_HEIGHT}@2x`);

  return { url: `${baseUrl}/${urlParams.join('/')}?${urlQuery}`, shift };
}
