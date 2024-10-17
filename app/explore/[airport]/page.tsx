import { getFlights } from "@/app/ui/get-flights"
import { Map } from "@/app/ui/map"
import Link from "next/link"

export default async function Page({ params }: { params: Params }) {
  const flights = await getFlights(params)

  return (
    <div>
      <Map flights={flights} params={params} />
      {flights.map((flight) => (
        <div key={flight.callsign}>
          <Link href={`/flights/${flight.callsign}`}>{flight.callsign}</Link>
        </div>
      ))}
    </div>
  )
}

type Params = Promise<{
  airport: string // e.g. SFO
}>
