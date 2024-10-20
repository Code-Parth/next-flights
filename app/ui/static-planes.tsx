"use client"

import { CSSProperties, useEffect, useMemo, useState } from "react";
import { Flight } from "./get-flights";
import { geocode } from "./geocode";
import { getMapBounds, MapBounds } from "./get-map-bounds";
import { useParams } from "next/navigation";
import PlaneMarkerSrc from '@/app/assets/plane-marker.svg'
import Image from "next/image";


export function StaticPlanes({ flights }: { flights: Flight[] }) {

  const {airport} = useParams<{airport: string}>()

  const [containerWidth, setContainerWidth] = useState(0)

  const { latitude, longitude } = geocode(airport)
  const bounds = getMapBounds(latitude, longitude)

  useEffect(() => {
    const handleResize = () => {
      const width = document.body.clientWidth
      const height = document.body.clientHeight

      setContainerWidth(Math.max(width, height))
    }

    document.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      document.removeEventListener('resize', handleResize)
    }
  }, [])

  if(!containerWidth) return null


  return (
    <div className="absolute inset-0 w-full h-full overflow-clip">
      <div className="relative aspect-square left-1/2 -translate-x-1/2" style={{ width: `${containerWidth}px` }}>
        {flights.map((flight) => (
          <PlaneMarker key={flight.fr24_id} bounds={bounds} flight={flight} />
        ))}
      </div>
    </div>
  )
}

interface PlaneMarkerProps {
  bounds: MapBounds
  flight: Flight
}

function PlaneMarker({ bounds, flight }: PlaneMarkerProps) {

  const {x, y} = useMemo(() => {
    const {northEast, southWest} = bounds

    const x = (flight.lon - southWest.longitude) / (northEast.longitude - southWest.longitude)
    const y = (flight.lat - southWest.latitude) / (northEast.latitude - southWest.latitude)

    return {x, y}
  }, [bounds, flight])

  const rotation = flight.track

  return (
    <div style={{
      '--x': `${x * 100}%`,
      '--y': `${y * 100}%`,
      '--rotation': `${rotation}deg`,
    } as CSSProperties}
      className="absolute left-[var(--x)] top-[var(--y)] -rotate-[var(--rotation)] -translate-x-1/2 -translate-y-1/2"
    >
      <div  className="cursor-pointer">
        <Image width={40} height={40} className="object-contain" src={PlaneMarkerSrc} alt="Plane Marker" />
      </div>
    </div>
  )
}