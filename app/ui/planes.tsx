"use client"

import { Marker } from "mapbox-gl";
import { useMap } from "../hooks/use-map";
import { Flight } from "./get-flights";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";

import Image from 'next/image';

import PlaneMarker from '@/app/assets/plane-marker.svg'
import { PlaneTrack } from "./flight-track";

/** Based on https://gist.github.com/chriswhong/8977c0d4e869e9eaf06b4e9fda80f3ab */
class ClickableMarker extends Marker {

  _handleClick?: () => void;

  // new method onClick, sets _handleClick to a function you pass in
  onClick(handleClick: () => void) {
    this._handleClick = handleClick;
    return this;
  }

  // the existing _onMapClick was there to trigger a popup
  // but we are hijacking it to run a function we define
  _onMapClick(e: any) {
    const targetElement = e.originalEvent.target;
    const element = this._element;

    if (this._handleClick && (targetElement === element || element.contains((targetElement)))) {
      this._handleClick();
    }
  }
};

interface PlanesProps {
  planes: Flight[];
}

export function Planes({planes}: PlanesProps) {

  const {map} = useMap();

  const planeMarkerRef = useRef<HTMLDivElement | null>(null);

  const [selectedPlaneIndex, setSelectedPlaneIndex] = useState<number | null>(null);

  const selectedPlaneData = useMemo(() => {
    if(selectedPlaneIndex === null) return null;

    return planes[selectedPlaneIndex];
  }, [selectedPlaneIndex, planes])

  useEffect(() => {
    const planeMarkerEl = planeMarkerRef.current;

    if(!planeMarkerEl) return;

    const planeMarkers = planes.map((plane, index) => {
      const planeMarker = new ClickableMarker({
        element: planeMarkerEl.cloneNode(true) as HTMLElement,
        rotation: plane.track,
      }).setLngLat([plane.lon, plane.lat])
      planeMarker.addTo(map);

      planeMarker.onClick(() => {
        map.flyTo({
          center: [plane.lon, plane.lat],
          zoom: 10,
        })
        
        setSelectedPlaneIndex(index);
      })
      return planeMarker;
    });

    return () => {
      planeMarkers.forEach((marker) => marker.remove());
    }
  }, [planes, map]);

  return (
    <>
      <div className="hidden">
          <div id="plane-marker" ref={planeMarkerRef} className="cursor-pointer">
            <Image width={40} height={40} className="object-contain" src={PlaneMarker} alt="Plane Marker" />
          </div>
      </div>
      {selectedPlaneData && (
        <>
          <div className="fixed bottom-0 w-full left-0 p-2">
            <div className="relative w-full p-4 text-white bg-black rounded-md border border-gray-500">
              <div className="flex justify-between gap-4 items-end">
                <div className="flex flex-col gap-4">
                  <p className="leading-none text-lg">{selectedPlaneData.callsign}</p>
                  <p className="leading-none"><b className="opacity-50">Latitude</b> {selectedPlaneData.lat}</p>
                  <p className="leading-none"><b className="opacity-50">Longitude</b> {selectedPlaneData.lon}</p>
                </div>
                <a href={`/flights/${selectedPlaneData.callsign}`} className="p-2 bg-blue leading-none uppercase text-sm font-mono">
                  Flight details
                </a>
              </div>
            </div>
          </div>
          <PlaneTrack
            id={selectedPlaneData.fr24_id}
            timestamp={selectedPlaneData.timestamp}
            currentLat={selectedPlaneData.lat}
            currentLon={selectedPlaneData.lon}
          />
        </>
      )}
    </>
  )
}

