import { useEffect, useRef } from "react";
import { getFlightTracks } from "./get-flight-tracks";
import { useMap } from "@/app/hooks/use-map";

export function PlaneTrack({ id, timestamp, currentLat, currentLon }: { id: string, timestamp: string, currentLat: number, currentLon: number }) {
  const { map } = useMap();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    let sourceId: string | null = null
    let layerId: string | null = null

    getFlightTracks(id).then(response => {
      if (signal.aborted) return

      const filteredTracks = response.filter(track => new Date(track.timestamp) <= new Date(timestamp));

      sourceId = `route-${id}`
      layerId = `route-layer-${id}`

      map.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: filteredTracks.map(track => [track.lon, track.lat]).concat([[currentLon, currentLat]])
          }
        }
      })

      map.addLayer({
        id: layerId,
        type: 'line',
        source: sourceId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#5a91ff',
          'line-width': 3
        }
      });
    })

    return () => {
      if (layerId && sourceId) {
        map.removeLayer(layerId);
        map.removeSource(sourceId);
      }
      controller.abort();
    }

  }, [map, id, timestamp, currentLat, currentLon]);

  return null;
}
