import { getBoundsOfDistance } from "geolib"

export function getMapBounds(latitude: number, longitude: number) {
  const radius = 20_000

  const [southWest, northEast] = getBoundsOfDistance(
    { latitude, longitude },
    radius,
  )

  return { southWest, northEast }
}

export type MapBounds = ReturnType<typeof getMapBounds>