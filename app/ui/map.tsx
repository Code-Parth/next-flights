import { fakeGeocode } from "@/app/ui/fake-geocode"
import { type Flight } from "@/app/ui/get-flights"
import { getBoundsOfDistance } from "geolib"
import Image from "next/image"

const MAP_WIDTH = 1000
const MAP_HEIGHT = 600

export async function Map({
  flights,
  params,
}: {
  flights: Flight[]
  params: Promise<{ airport: string }>
}) {
  const mapUrl = await createUrl({ flights, params })

  return (
    <Image
      src={mapUrl}
      alt="Map with flight markers"
      width={MAP_WIDTH}
      height={MAP_HEIGHT}
    />
  )
}

// Utils

async function createUrl({
  flights,
  params,
}: {
  flights: Flight[]
  params: Promise<{ airport: string }>
}) {
  const { airport } = await params
  const baseUrl = "https://api.mapbox.com/styles/v1/mapbox/streets-v12/static"

  const { latitude, longitude } = fakeGeocode(airport)
  const bounds = getBounds(latitude, longitude)

  const urlQuery = new URLSearchParams({
    access_token: process.env.MAPBOX_ACCESS_TOKEN!,
  })
  const urlParams = []
  const markers = []

  // Add airport marker
  markers.push(`pin-s+00ff00(${longitude},${latitude})`)

  if (flights && flights.length > 0) {
    // Add flight markers
    flights.forEach((flight) => {
      markers.push(`pin-s+ff0000(${flight.lon},${flight.lat})`)
    })
    urlParams.push(markers.join(","))

    // automatically determine map center and zoom using the same
    // bounds provided to flights
    urlParams.push(bounds)
  } else {
    // When no flights are provided, manually set the center
    // and zoom level using the airport coordinates
    urlParams.push(markers.join(","))
    urlParams.push(`${longitude},${latitude},9`)
  }

  urlParams.push(`${MAP_WIDTH}x${MAP_HEIGHT}@2x`)

  return `${baseUrl}/${urlParams.join("/")}?${urlQuery}`
}

function getBounds(latitude: number, longitude: number) {
  const radius = 30_000

  const [southWest, northEast] = getBoundsOfDistance(
    { latitude, longitude },
    radius,
  )

  // Return bounding box format expected by Mapbox
  return `[${southWest.longitude},${southWest.latitude},${northEast.longitude},${northEast.latitude}]`
}
