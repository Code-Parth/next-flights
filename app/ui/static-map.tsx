import { geocode } from "@/app/ui/geocode"
import { type Flight } from "@/app/ui/get-flights"
import Image from "next/image"
import { getMapBounds } from "./get-map-bounds"

const MAP_WIDTH = 1000
const MAP_HEIGHT = 1000

export async function StaticMap({
  params,
}: {
  params: Promise<{ airport: string }>
}) {
  const mapUrl = await createUrl({ params })

  return (
    <Image
      src={mapUrl}
      alt="Map with flight markers"
      className="object-cover w-full h-full absolute inset-0 left-0 top-0"
      width={MAP_WIDTH}
      height={MAP_HEIGHT}
      priority
    />
  )
}

// Utils

async function createUrl({
  params,
}: {
  params: Promise<{ airport: string }>
}) {
  const { airport } = await params
  const baseUrl = "https://api.mapbox.com/styles/v1/mapbox/dark-v11/static"

  const { latitude, longitude } = geocode(airport)
  const { southWest, northEast } = getMapBounds(latitude, longitude)

  const urlQuery = new URLSearchParams({
    access_token: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!,
  })
  const urlParams = []
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
  const bounds = `[${southWest.longitude},${southWest.latitude},${northEast.longitude},${northEast.latitude}]`
  urlParams.push(bounds)

  urlParams.push(`${MAP_WIDTH}x${MAP_HEIGHT}@2x`)

  return `${baseUrl}/${urlParams.join("/")}?${urlQuery}`
}