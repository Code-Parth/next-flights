"use client"

import { Marker } from "mapbox-gl";
import { useMap } from "../hooks/use-map";
import { Flight } from "./get-flights";
import { useEffect, useRef } from "react";

import Image from 'next/image';

import PlaneMarker from '@/app/assets/plane-marker.svg'


interface PlanesProps {
  planes: Flight[];
}

export function Planes({planes}: PlanesProps) {

  const map = useMap();

  const planeMarkerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const planeMarkerEl = planeMarkerRef.current;

    if(!planeMarkerEl) return;

    const planeMarkers = planes.map((plane) => {
      const planeMarker = new Marker({
        element: planeMarkerEl.cloneNode(true) as HTMLElement,
      }).setLngLat([plane.lon, plane.lat])
      planeMarker.setRotation(plane.track);
      planeMarker.addTo(map.map);
      return planeMarker;
    });

    return () => {
      planeMarkers.forEach((marker) => marker.remove());
    }
  }, [planes, map]);

  return (
    <div className="hidden">
        <div id="plane-marker" ref={planeMarkerRef}>
          <Image width={40} height={40} className="object-contain" src={PlaneMarker} alt="Plane Marker" />
        </div>
    </div>
  )
}