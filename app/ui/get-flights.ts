import { fakeGeocode } from "@/app/ui/fake-geocode"
import { getBoundsOfDistance } from "geolib"

export async function getFlights(params: Promise<{ airport: string }>) {
  const { airport } = await params
  const { latitude, longitude } = fakeGeocode(airport)

  const baseUrl =
    "https://fr24api.flightradar24.com/api/live/flight-positions/full"

  const query = new URLSearchParams({
    bounds: getBounds(latitude, longitude), // show planes within 30km of airport
    altitude_ranges: "100-60000", // show flying planes only
    categories: "P,C", // show passenger and cargo planes only
  })

  const response = await fetch(`${baseUrl}?${query}`, {
    headers: {
      Accept: "application/json",
      "Accept-Version": "v1",
      Authorization: `Bearer ${process.env.FLIGHT_RADAR_TOKEN}`,
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  }

  const data = await response.json()

  console.log(JSON.stringify(data, null, 2))

  return data.data
}

// Utils

function getBounds(latitude: number, longitude: number) {
  const radius = 30_000

  const [southWest, northEast] = getBoundsOfDistance(
    { latitude, longitude },
    radius,
  )

  // Return bounding box format expected by FR24
  return `${northEast.latitude},${southWest.latitude},${southWest.longitude},${northEast.longitude}`
}
